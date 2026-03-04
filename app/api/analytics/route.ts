import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedClient, isErrorResponse } from '@/lib/supabase/route-handler'
import { createAdminClient } from '@/lib/supabase/admin'

function getPeriodStart(period: string): string {
  const now = new Date()
  switch (period) {
    case '30d':
      now.setDate(now.getDate() - 30)
      break
    case '90d':
      now.setDate(now.getDate() - 90)
      break
    default: // 7d
      now.setDate(now.getDate() - 7)
  }
  return now.toISOString()
}

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthenticatedClient()
    if (isErrorResponse(auth)) return auth

    const { profile } = auth

    if (profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '7d'
    const periodStart = getPeriodStart(period)

    const supabase = createAdminClient()

    // Run queries in parallel
    const [
      totalViewsResult,
      uniqueSessionsResult,
      topPagesResult,
      viewsByDayResult,
      topReferrersResult,
    ] = await Promise.all([
      // Total views in period
      supabase
        .from('page_views')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', periodStart),

      // Unique sessions in period
      supabase
        .from('page_views')
        .select('session_id')
        .gte('created_at', periodStart)
        .not('session_id', 'is', null),

      // Top pages — get all views in period, aggregate in JS
      supabase
        .from('page_views')
        .select('path')
        .gte('created_at', periodStart),

      // Views by day — get all views, aggregate in JS
      supabase
        .from('page_views')
        .select('created_at')
        .gte('created_at', periodStart)
        .order('created_at', { ascending: true }),

      // Top referrers
      supabase
        .from('page_views')
        .select('referrer')
        .gte('created_at', periodStart)
        .not('referrer', 'is', null)
        .neq('referrer', ''),
    ])

    const totalViews = totalViewsResult.count || 0

    // Unique sessions — count distinct
    const sessionSet = new Set(
      (uniqueSessionsResult.data || []).map((r) => r.session_id)
    )
    const uniqueSessions = sessionSet.size

    // Aggregate top pages
    const pageCounts: Record<string, number> = {}
    for (const row of topPagesResult.data || []) {
      pageCounts[row.path] = (pageCounts[row.path] || 0) + 1
    }
    const topPages = Object.entries(pageCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([path, views]) => ({ path, views }))

    // Aggregate views by day
    const dayCounts: Record<string, number> = {}
    for (const row of viewsByDayResult.data || []) {
      const day = new Date(row.created_at).toISOString().split('T')[0]
      dayCounts[day] = (dayCounts[day] || 0) + 1
    }
    const viewsByDay = Object.entries(dayCounts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, views]) => ({ date, views }))

    // Aggregate top referrers
    const refCounts: Record<string, number> = {}
    for (const row of topReferrersResult.data || []) {
      try {
        const domain = new URL(row.referrer).hostname
        refCounts[domain] = (refCounts[domain] || 0) + 1
      } catch {
        // skip malformed URLs
      }
    }
    const topReferrers = Object.entries(refCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([domain, views]) => ({ domain, views }))

    // Days in period for average
    const days = period === '90d' ? 90 : period === '30d' ? 30 : 7
    const avgPerDay = Math.round((totalViews / days) * 10) / 10

    return NextResponse.json({
      totalViews,
      uniqueSessions,
      avgPerDay,
      topPages,
      viewsByDay,
      topReferrers,
      period,
    })
  } catch (err) {
    console.error('[api/analytics] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
