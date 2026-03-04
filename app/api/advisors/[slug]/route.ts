import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAuthenticatedClient, isErrorResponse } from '@/lib/supabase/route-handler'

const updateAdvisorSchema = z.object({
  display_name: z.string().min(1).optional(),
  title: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  short_bio: z.string().max(200).optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  certifications: z.array(z.string()).optional().nullable(),
  specialties: z.array(z.string()).optional().nullable(),
  profile_image_url: z.string().url().optional().nullable(),
  headshot_url: z.string().url().optional().nullable(),
  social_links: z
    .object({
      linkedin: z.string().url().optional(),
      twitter: z.string().url().optional(),
    })
    .optional()
    .nullable(),
})

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const auth = await getAuthenticatedClient()
    if (isErrorResponse(auth)) return auth

    const { supabase } = auth

    const { data: advisor, error } = await supabase
      .from('advisor_profiles')
      .select('*, profiles!advisor_profiles_user_id_fkey(full_name, email, role)')
      .eq('slug', slug)
      .single()

    if (error || !advisor) {
      return NextResponse.json({ error: 'Advisor profile not found' }, { status: 404 })
    }

    return NextResponse.json(advisor)
  } catch (err) {
    console.error('[api/advisors/[slug]] GET error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const auth = await getAuthenticatedClient()
    if (isErrorResponse(auth)) return auth

    const { supabase, profile } = auth

    // Fetch existing advisor profile
    const { data: advisor, error: fetchError } = await supabase
      .from('advisor_profiles')
      .select('*')
      .eq('slug', slug)
      .single()

    if (fetchError || !advisor) {
      return NextResponse.json({ error: 'Advisor profile not found' }, { status: 404 })
    }

    // Must be own profile or admin
    if (advisor.user_id !== profile.id && profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const parsed = updateAdvisorSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { data: updated, error } = await supabase
      .from('advisor_profiles')
      .update(parsed.data)
      .eq('slug', slug)
      .select()
      .single()

    if (error) {
      console.error('[api/advisors/[slug]] Update error:', error)
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }

    return NextResponse.json(updated)
  } catch (err) {
    console.error('[api/advisors/[slug]] PATCH error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
