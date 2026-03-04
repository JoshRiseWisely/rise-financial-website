import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  category: string | null
  tags: string[] | null
  featured_image_url: string | null
  seo_title: string | null
  seo_description: string | null
  published_at: string
  profiles: { full_name: string } | null
}

const CATEGORY_LABELS: Record<string, string> = {
  retirement: 'Retirement',
  investing: 'Investing',
  tax: 'Tax Planning',
  estate: 'Estate Planning',
  lifestyle: 'Lifestyle',
  'faith-based-investing': 'Faith-Based Investing',
  business: 'Business',
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, seo_title, seo_description, excerpt, slug, featured_image_url, published_at')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!post) {
    return { title: 'Post Not Found' }
  }

  const title = post.seo_title || post.title
  const description = post.seo_description || post.excerpt || undefined

  return {
    title,
    description,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.published_at,
      ...(post.featured_image_url && {
        images: [{ url: post.featured_image_url, alt: post.title }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(post.featured_image_url && {
        images: [post.featured_image_url],
      }),
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('blog_posts')
    .select('id, title, slug, content, excerpt, category, tags, featured_image_url, seo_title, seo_description, published_at, profiles!blog_posts_author_id_fkey(full_name)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!post) {
    notFound()
  }

  const blogPost = post as unknown as BlogPost

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rise-financial-website-production-bfa8.up.railway.app'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blogPost.title,
    description: blogPost.excerpt || undefined,
    image: blogPost.featured_image_url || undefined,
    datePublished: blogPost.published_at,
    author: {
      '@type': 'Person',
      name: blogPost.profiles?.full_name || 'Rise Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Rise Financial Partners',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/images/logo.png`,
      },
    },
    url: `${siteUrl}/blog/${blogPost.slug}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${blogPost.slug}`,
    },
  }

  return (
    <div className="pt-20 bg-rise-cream min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Featured Image */}
      {blogPost.featured_image_url && (
        <div className="max-w-5xl mx-auto px-6 pt-8">
          <img
            src={blogPost.featured_image_url}
            alt={blogPost.title}
            className="w-full max-h-96 object-cover rounded-2xl"
          />
        </div>
      )}

      {/* Article */}
      <article className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-rise-slate hover:text-rise-navy transition-colors mb-8">
          <ArrowLeft size={16} />
          Back to Blog
        </Link>

        {blogPost.category && (
          <span className="inline-block px-3 py-1 bg-rise-navy/5 text-rise-navy text-xs font-medium rounded-full mb-4">
            {CATEGORY_LABELS[blogPost.category] || blogPost.category}
          </span>
        )}

        <h1 className="font-display text-4xl md:text-5xl font-semibold text-rise-navy mb-4">
          {blogPost.title}
        </h1>

        <div className="flex items-center gap-4 text-sm text-rise-slate mb-10 pb-10 border-b border-rise-navy/10">
          <span className="font-medium">{blogPost.profiles?.full_name || 'Rise Team'}</span>
          <span className="w-1 h-1 bg-rise-slate/40 rounded-full" />
          <time>
            {new Date(blogPost.published_at).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </time>
        </div>

        {/* Content */}
        <div
          className="blog-prose"
          dangerouslySetInnerHTML={{ __html: blogPost.content }}
        />

        {/* Tags */}
        {blogPost.tags && blogPost.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-rise-navy/10">
            <div className="flex flex-wrap gap-2">
              {blogPost.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-rise-navy/5 text-rise-navy text-xs font-medium rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg text-center">
          <h2 className="font-display text-2xl font-semibold text-rise-navy mb-2">
            Ready to take the next step?
          </h2>
          <p className="text-rise-slate mb-6">
            Schedule a consultation with our team to discuss your financial goals.
          </p>
          <Link
            href="/contact"
            className="inline-flex px-8 py-3 bg-rise-navy text-white rounded-full font-medium hover:bg-rise-blue transition-colors hover:-translate-y-0.5 hover:shadow-lg"
          >
            Book a Consultation
          </Link>
        </div>
      </article>
    </div>
  )
}
