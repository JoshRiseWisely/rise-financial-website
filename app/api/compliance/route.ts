import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedClient, isErrorResponse } from '@/lib/supabase/route-handler'
import { Permissions } from '@/lib/auth/permissions'

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthenticatedClient()
    if (isErrorResponse(auth)) return auth

    const { supabase, profile } = auth

    if (!Permissions.canViewComplianceQueue(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const contentType = searchParams.get('content_type')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    let query = supabase
      .from('compliance_queue')
      .select(`
        *,
        submitter:profiles!compliance_queue_submitted_by_fkey(id, full_name, email),
        reviewer:profiles!compliance_queue_reviewer_id_fkey(id, full_name)
      `, { count: 'exact' })

    if (status) {
      query = query.eq('status', status)
    }
    if (contentType) {
      query = query.eq('content_type', contentType)
    }

    query = query.order('submitted_at', { ascending: false }).range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('[api/compliance] Query error:', error)
      return NextResponse.json({ error: 'Failed to fetch compliance queue' }, { status: 500 })
    }

    return NextResponse.json({
      items: data || [],
      total: count || 0,
      page,
      limit,
    })
  } catch (err) {
    console.error('[api/compliance] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
