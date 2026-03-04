import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedClient, isErrorResponse } from '@/lib/supabase/route-handler'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const auth = await getAuthenticatedClient()
    if (isErrorResponse(auth)) return auth

    const { supabase, profile } = auth

    const { data: page, error: fetchError } = await supabase
      .from('pages')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    if (page.author_id !== profile.id && profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (page.status !== 'draft' && page.status !== 'rejected') {
      return NextResponse.json(
        { error: `Cannot submit a page with status "${page.status}"` },
        { status: 400 }
      )
    }

    const { error: updateError } = await supabase
      .from('pages')
      .update({ status: 'pending_review' })
      .eq('id', id)

    if (updateError) {
      console.error('[api/pages/submit-review] Update error:', updateError)
      return NextResponse.json({ error: 'Failed to submit for review' }, { status: 500 })
    }

    const { error: queueError } = await supabase
      .from('compliance_queue')
      .insert({
        content_type: 'page',
        content_id: page.id,
        submitted_by: profile.id,
        status: 'pending',
        content_snapshot: {
          title: page.title,
          content: page.content,
          template: page.template,
          meta_title: page.meta_title,
          meta_description: page.meta_description,
        },
      })

    if (queueError) {
      console.error('[api/pages/submit-review] Queue error:', queueError)
    }

    return NextResponse.json({ success: true, status: 'pending_review' })
  } catch (err) {
    console.error('[api/pages/submit-review] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
