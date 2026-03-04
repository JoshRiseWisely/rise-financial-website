import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAuthenticatedClient, isErrorResponse } from '@/lib/supabase/route-handler'
import { Permissions } from '@/lib/auth/permissions'

const updatePageSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).optional(),
  template: z.enum(['standard', 'landing', 'guide', 'case-study']).optional(),
  meta_title: z.string().max(70).optional().nullable(),
  meta_description: z.string().max(160).optional().nullable(),
  featured_image_url: z.string().url().optional().nullable(),
})

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const auth = await getAuthenticatedClient()
    if (isErrorResponse(auth)) return auth

    const { supabase, profile } = auth

    const { data: page, error } = await supabase
      .from('pages')
      .select('*, profiles!pages_author_id_fkey(full_name, avatar_url)')
      .eq('id', id)
      .single()

    if (error || !page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    const isOwner = page.author_id === profile.id
    const isAdminOrCompliance = profile.role === 'admin' || profile.role === 'compliance'
    if (!isOwner && !isAdminOrCompliance && page.status !== 'published') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(page)
  } catch (err) {
    console.error('[api/pages/[id]] GET error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const auth = await getAuthenticatedClient()
    if (isErrorResponse(auth)) return auth

    const { supabase, profile } = auth

    const { data: existing, error: fetchError } = await supabase
      .from('pages')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    const isOwner = existing.author_id === profile.id
    if (!isOwner && !Permissions.canEditAllContent(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const parsed = updatePageSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const updates: Record<string, unknown> = { ...parsed.data }

    // Reset status to draft if editing approved/published content
    const contentFields = ['title', 'content']
    const hasContentChanges = contentFields.some((f) => f in updates)
    if (hasContentChanges && (existing.status === 'approved' || existing.status === 'published')) {
      updates.status = 'draft'
    }

    const { data: page, error } = await supabase
      .from('pages')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[api/pages/[id]] Update error:', error)
      return NextResponse.json({ error: 'Failed to update page' }, { status: 500 })
    }

    return NextResponse.json(page)
  } catch (err) {
    console.error('[api/pages/[id]] PATCH error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const auth = await getAuthenticatedClient()
    if (isErrorResponse(auth)) return auth

    const { supabase, profile } = auth

    const { data: existing, error: fetchError } = await supabase
      .from('pages')
      .select('author_id')
      .eq('id', id)
      .single()

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    const isOwner = existing.author_id === profile.id
    if (!isOwner && !Permissions.canEditAllContent(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { error } = await supabase.from('pages').delete().eq('id', id)
    if (error) {
      console.error('[api/pages/[id]] Delete error:', error)
      return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[api/pages/[id]] DELETE error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
