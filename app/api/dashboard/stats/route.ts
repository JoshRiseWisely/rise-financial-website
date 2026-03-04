import { NextResponse } from 'next/server'
import { getAuthenticatedClient, isErrorResponse } from '@/lib/supabase/route-handler'

export async function GET() {
  try {
    const auth = await getAuthenticatedClient()
    if (isErrorResponse(auth)) return auth

    const { supabase } = auth

    // Run parallel count queries
    const [blogResult, pendingResult, pagesResult, recentActivity] = await Promise.all([
      supabase.from('blog_posts').select('id', { count: 'exact', head: true }).eq('status', 'published'),
      supabase.from('compliance_queue').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('pages').select('id', { count: 'exact', head: true }),
      supabase
        .from('compliance_queue')
        .select(`
          id, content_type, status, submitted_at, reviewed_at,
          content_snapshot,
          submitter:profiles!compliance_queue_submitted_by_fkey(full_name)
        `)
        .order('submitted_at', { ascending: false })
        .limit(5),
    ])

    return NextResponse.json({
      publishedBlogPosts: blogResult.count || 0,
      pendingApprovals: pendingResult.count || 0,
      totalPages: pagesResult.count || 0,
      recentActivity: recentActivity.data || [],
    })
  } catch (err) {
    console.error('[api/dashboard/stats] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
