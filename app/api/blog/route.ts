import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAuthenticatedClient, isErrorResponse } from '@/lib/supabase/route-handler'
import { Permissions } from '@/lib/auth/permissions'
import { generateSlug, ensureUniqueSlug } from '@/lib/utils/slug'
import { createClient } from '@/lib/supabase/server'

const createBlogSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().max(300).optional().nullable(),
  category: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
  featured_image_url: z.string().url().optional().nullable(),
  seo_title: z.string().max(70).optional().nullable(),
  seo_description: z.string().max(160).optional().nullable(),
})

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50)
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const offset = (page - 1) * limit

    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()

    let query = supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, status, category, tags, featured_image_url, published_at, created_at, updated_at, author_id, profiles!blog_posts_author_id_fkey(full_name)', { count: 'exact' })

    if (!user) {
      // Public: only published
      query = query.eq('status', 'published')
    } else {
      // Get profile for role check
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role === 'admin' || profile?.role === 'compliance') {
        // Admin/compliance see all
        if (status) query = query.eq('status', status)
      } else {
        // Advisors see own posts only
        query = query.eq('author_id', user.id)
        if (status) query = query.eq('status', status)
      }
    }

    if (category) query = query.eq('category', category)

    const { data: posts, count, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('[api/blog] List error:', error)
      return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
    }

    return NextResponse.json({
      posts: posts || [],
      total: count || 0,
      page,
      limit,
    })
  } catch (err) {
    console.error('[api/blog] Unexpected error:', err)
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
    const parsed = createBlogSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { title, content, excerpt, category, tags, featured_image_url, seo_title, seo_description } = parsed.data

    const baseSlug = generateSlug(title)
    const slug = await ensureUniqueSlug(baseSlug, async (s) => {
      const { data } = await supabase.from('blog_posts').select('id').eq('slug', s).single()
      return !!data
    })

    const { data: post, error } = await supabase
      .from('blog_posts')
      .insert({
        author_id: profile.id,
        title,
        slug,
        content,
        excerpt: excerpt || null,
        category: category || null,
        tags: tags || [],
        featured_image_url: featured_image_url || null,
        seo_title: seo_title || null,
        seo_description: seo_description || null,
        status: 'draft',
      })
      .select()
      .single()

    if (error) {
      console.error('[api/blog] Create error:', error)
      return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
    }

    return NextResponse.json(post, { status: 201 })
  } catch (err) {
    console.error('[api/blog] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
