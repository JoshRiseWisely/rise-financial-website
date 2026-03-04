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

    // Fetch the post
    const { data: post, error: fetchError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Must be own post or admin
    if (post.author_id !== profile.id && profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Only draft or rejected posts can be submitted
    if (post.status !== 'draft' && post.status !== 'rejected') {
      return NextResponse.json(
        { error: `Cannot submit a post with status "${post.status}"` },
        { status: 400 }
      )
    }

    // Update post status
    const { error: updateError } = await supabase
      .from('blog_posts')
      .update({ status: 'pending_review' })
      .eq('id', id)

    if (updateError) {
      console.error('[api/blog/submit-review] Update error:', updateError)
      return NextResponse.json({ error: 'Failed to submit for review' }, { status: 500 })
    }

    // Create compliance queue entry with content snapshot
    const { error: queueError } = await supabase
      .from('compliance_queue')
      .insert({
        content_type: 'blog_post',
        content_id: post.id,
        submitted_by: profile.id,
        status: 'pending',
        content_snapshot: {
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          category: post.category,
          tags: post.tags,
        },
      })

    if (queueError) {
      console.error('[api/blog/submit-review] Queue error:', queueError)
      // Don't fail the request — the status was already updated
    }

    return NextResponse.json({ success: true, status: 'pending_review' })
  } catch (err) {
    console.error('[api/blog/submit-review] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
