import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'

const trackSchema = z.object({
  path: z.string().min(1).max(500),
  referrer: z.string().max(2000).optional(),
  sessionId: z.string().max(100).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = trackSchema.safeParse(body)
    if (!parsed.success) {
      return new NextResponse(null, { status: 400 })
    }

    const { path, referrer, sessionId } = parsed.data

    // Skip tracking for admin pages and API routes
    if (path.startsWith('/admin') || path.startsWith('/api')) {
      return new NextResponse(null, { status: 204 })
    }

    const supabase = createAdminClient()

    await supabase.from('page_views').insert({
      path,
      referrer: referrer || null,
      session_id: sessionId || null,
    })

    return new NextResponse(null, { status: 204 })
  } catch {
    return new NextResponse(null, { status: 500 })
  }
}
