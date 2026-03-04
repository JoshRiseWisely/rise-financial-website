import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAuthenticatedClient, isErrorResponse } from '@/lib/supabase/route-handler'
import { Permissions } from '@/lib/auth/permissions'
import { generateSlug, ensureUniqueSlug } from '@/lib/utils/slug'

const createPageSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  content: z.string().min(1, 'Content is required'),
  template: z.enum(['standard', 'landing', 'guide', 'case-study']).default('standard'),
  slug: z.string().optional(),
  meta_title: z.string().max(70).optional().nullable(),
  meta_description: z.string().max(160).optional().nullable(),
  featured_image_url: z.string().url().optional().nullable(),
})

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthenticatedClient()
    if (isErrorResponse(auth)) return auth

    const { supabase, profile } = auth
    const { searchParams } = new URL(request.url)

    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50)
    const status = searchParams.get('status')
    const template = searchParams.get('template')
    const offset = (page - 1) * limit

    let query = supabase
      .from('pages')
      .select('id, title, slug, template, status, featured_image_url, published_at, created_at, updated_at, author_id, profiles!pages_author_id_fkey(full_name)', { count: 'exact' })

    if (profile.role === 'admin' || profile.role === 'compliance') {
      if (status) query = query.eq('status', status)
    } else {
      query = query.eq('author_id', profile.id)
      if (status) query = query.eq('status', status)
    }

    if (template) query = query.eq('template', template)

    const { data: pages, count, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('[api/pages] List error:', error)
      return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 })
    }

    return NextResponse.json({ pages: pages || [], total: count || 0, page, limit })
  } catch (err) {
    console.error('[api/pages] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthenticatedClient()
    if (isErrorResponse(auth)) return auth

    const { supabase, profile } = auth

    if (!Permissions.canCreateContent(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const parsed = createPageSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { title, content, template, meta_title, meta_description, featured_image_url } = parsed.data

    const baseSlug = parsed.data.slug ? generateSlug(parsed.data.slug) : generateSlug(title)
    const slug = await ensureUniqueSlug(baseSlug, async (s) => {
      const { data } = await supabase.from('pages').select('id').eq('slug', s).single()
      return !!data
    })

    const { data: page, error } = await supabase
      .from('pages')
      .insert({
        author_id: profile.id,
        title,
        slug,
        content,
        template,
        status: 'draft',
        meta_title: meta_title || null,
        meta_description: meta_description || null,
        featured_image_url: featured_image_url || null,
      })
      .select()
      .single()

    if (error) {
      console.error('[api/pages] Create error:', error)
      return NextResponse.json({ error: 'Failed to create page' }, { status: 500 })
    }

    return NextResponse.json(page, { status: 201 })
  } catch (err) {
    console.error('[api/pages] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
