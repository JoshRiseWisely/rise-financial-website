import { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Blog | Rise Financial Partners',
  description: 'Insights on retirement planning, investing, tax strategies, and financial wellness from the Rise Financial Partners team.',
}

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  category: string | null
  tags: string[] | null
  featured_image_url: string | null
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

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageParam } = await searchParams
  const page = parseInt(pageParam || '1')
  const limit = 9
  const offset = (page - 1) * limit

  const supabase = await createClient()
  const { data: posts, count } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, category, tags, featured_image_url, published_at, profiles!blog_posts_author_id_fkey(full_name)', { count: 'exact' })
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1)

  const blogPosts = (posts || []) as unknown as BlogPost[]
  const totalPages = Math.ceil((count || 0) / limit)

  return (
    <div className="pt-20 bg-rise-cream min-h-screen">
      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-rise-navy/5 rounded-full mb-6">
              <div className="w-2 h-2 bg-rise-gold rounded-full" />
              <span className="text-sm text-rise-navy font-medium">Insights & Resources</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-semibold text-rise-navy mb-4">
              Our Blog
            </h1>
            <p className="text-lg text-rise-slate leading-relaxed">
              Expert perspectives on retirement planning, investing strategies, and building lasting financial wellness.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6">
          {blogPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-rise-slate">No articles published yet. Check back soon!</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden"
                  >
                    {post.featured_image_url ? (
                      <div className="aspect-[16/10] overflow-hidden">
                        <img
                          src={post.featured_image_url}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[16/10] bg-gradient-to-br from-rise-navy/10 to-rise-blue/10 flex items-center justify-center">
                        <span className="text-rise-navy/30 text-4xl font-display">R</span>
                      </div>
                    )}
                    <div className="p-6">
                      {post.category && (
                        <span className="inline-block px-3 py-1 bg-rise-navy/5 text-rise-navy text-xs font-medium rounded-full mb-3">
                          {CATEGORY_LABELS[post.category] || post.category}
                        </span>
                      )}
                      <h2 className="font-display text-xl font-semibold text-rise-navy mb-2 group-hover:text-rise-blue transition-colors">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-sm text-rise-slate leading-relaxed mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-rise-slate">
                        <span>{post.profiles?.full_name || 'Rise Team'}</span>
                        <span>{new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-12">
                  {page > 1 && (
                    <Link
                      href={`/blog?page=${page - 1}`}
                      className="px-4 py-2 text-sm font-medium text-rise-navy bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                    >
                      Previous
                    </Link>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={`/blog?page=${p}`}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-shadow ${
                        p === page
                          ? 'bg-rise-navy text-white shadow'
                          : 'bg-white text-rise-navy shadow hover:shadow-md'
                      }`}
                    >
                      {p}
                    </Link>
                  ))}
                  {page < totalPages && (
                    <Link
                      href={`/blog?page=${page + 1}`}
                      className="px-4 py-2 text-sm font-medium text-rise-navy bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                    >
                      Next
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
