import { NextResponse } from 'next/server'
import { getAuthenticatedClient, isErrorResponse } from '@/lib/supabase/route-handler'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const auth = await getAuthenticatedClient()
    if (isErrorResponse(auth)) return auth

    const { supabase } = auth

    const adminSupabase = createAdminClient()
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const todayStart = new Date(new Date().setHours(0, 0, 0, 0)).toISOString()

    // Run parallel count queries
    const [blogResult, pendingResult, pagesResult, recentActivity, viewsWeekResult, viewsTodayResult] = await Promise.all([
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
      adminSupabase.from('page_views').select('id', { count: 'exact', head: true }).gte('created_at', sevenDaysAgo),
      adminSupabase.from('page_views').select('id', { count: 'exact', head: true }).gte('created_at', todayStart),
    ])

    return NextResponse.json({
      publishedBlogPosts: blogResult.count || 0,
      pendingApprovals: pendingResult.count || 0,
      totalPages: pagesResult.count || 0,
      recentActivity: recentActivity.data || [],
      pageViewsWeek: viewsWeekResult.count || 0,
      pageViewsToday: viewsTodayResult.count || 0,
    })
  } catch (err) {
    console.error('[api/dashboard/stats] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
