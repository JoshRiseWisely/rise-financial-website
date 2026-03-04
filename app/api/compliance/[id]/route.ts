import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAuthenticatedClient, isErrorResponse } from '@/lib/supabase/route-handler'
import { Permissions } from '@/lib/auth/permissions'

const reviewSchema = z.object({
  action: z.enum(['approve', 'reject']),
  reviewer_notes: z.string().max(1000).optional(),
})

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const auth = await getAuthenticatedClient()
    if (isErrorResponse(auth)) return auth

    const { supabase, profile } = auth

    if (!Permissions.canViewComplianceQueue(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data, error } = await supabase
      .from('compliance_queue')
      .select(`
        *,
        submitter:profiles!compliance_queue_submitted_by_fkey(id, full_name, email),
        reviewer:profiles!compliance_queue_reviewer_id_fkey(id, full_name)
      `)
      .eq('id', id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error('[api/compliance/[id]] GET error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const auth = await getAuthenticatedClient()
    if (isErrorResponse(auth)) return auth

    const { supabase, profile } = auth

    if (!Permissions.canApproveContent(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const parsed = reviewSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 })
    }

    const { action, reviewer_notes } = parsed.data

    // Fetch the compliance queue item
    const { data: item, error: fetchError } = await supabase
      .from('compliance_queue')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    if (item.status !== 'pending') {
      return NextResponse.json(
        { error: `Cannot review an item with status "${item.status}"` },
        { status: 400 }
      )
    }

    const newStatus = action === 'approve' ? 'approved' : 'rejected'

    // Update compliance queue
    const { error: updateError } = await supabase
      .from('compliance_queue')
      .update({
        status: newStatus,
        reviewer_id: profile.id,
        reviewed_at: new Date().toISOString(),
        reviewer_notes: reviewer_notes || null,
      })
      .eq('id', id)

    if (updateError) {
      console.error('[api/compliance/[id]] Queue update error:', updateError)
      return NextResponse.json({ error: 'Failed to update review' }, { status: 500 })
    }

    // Update the underlying content table
    const contentTable = item.content_type === 'blog_post' ? 'blog_posts' : 'pages'
    const { error: contentError } = await supabase
      .from(contentTable)
      .update({ status: newStatus })
      .eq('id', item.content_id)

    if (contentError) {
      console.error(`[api/compliance/[id]] Content update error (${contentTable}):`, contentError)
      // Don't fail — the queue was already updated
    }

    return NextResponse.json({ success: true, status: newStatus })
  } catch (err) {
    console.error('[api/compliance/[id]] POST error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
