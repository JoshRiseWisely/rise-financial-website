import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedClient, isErrorResponse } from '@/lib/supabase/route-handler'
import { Permissions } from '@/lib/auth/permissions'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const auth = await getAuthenticatedClient()
    if (isErrorResponse(auth)) return auth

    const { supabase, profile } = auth

    if (!Permissions.canPublishContent(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data: post, error: fetchError } = await supabase
      .from('blog_posts')
      .select('id, status')
      .eq('id', id)
      .single()

    if (fetchError || !post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    if (post.status !== 'approved') {
      return NextResponse.json(
        { error: `Cannot publish a post with status "${post.status}". Must be approved first.` },
        { status: 400 }
      )
    }

    const { error: updateError } = await supabase
      .from('blog_posts')
      .update({
        status: 'published',
        published_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (updateError) {
      console.error('[api/blog/publish] Update error:', updateError)
      return NextResponse.json({ error: 'Failed to publish' }, { status: 500 })
    }

    return NextResponse.json({ success: true, status: 'published' })
  } catch (err) {
    console.error('[api/blog/publish] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
