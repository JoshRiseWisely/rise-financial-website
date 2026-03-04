import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  StandardTemplate,
  LandingTemplate,
  GuideTemplate,
  CaseStudyTemplate,
} from '@/components/public/PageTemplates'

interface PageData {
  id: string
  title: string
  slug: string
  content: string
  template: string
  featured_image_url: string | null
  meta_title: string | null
  meta_description: string | null
  published_at: string
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: page } = await supabase
    .from('pages')
    .select('title, meta_title, meta_description')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!page) {
    return { title: 'Page Not Found | Rise Financial Partners' }
  }

  return {
    title: page.meta_title || `${page.title} | Rise Financial Partners`,
    description: page.meta_description || undefined,
  }
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: page } = await supabase
    .from('pages')
    .select('id, title, slug, content, template, featured_image_url, meta_title, meta_description, published_at')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!page) {
    notFound()
  }

  const pageData = page as PageData

  switch (pageData.template) {
    case 'landing':
      return <LandingTemplate page={pageData} />
    case 'guide':
      return <GuideTemplate page={pageData} />
    case 'case-study':
      return <CaseStudyTemplate page={pageData} />
    default:
      return <StandardTemplate page={pageData} />
  }
}
