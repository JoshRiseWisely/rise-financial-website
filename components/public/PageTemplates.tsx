import Link from 'next/link'

interface PageData {
  title: string
  content: string
  featured_image_url: string | null
  meta_title: string | null
  meta_description: string | null
  template: string
}

export function StandardTemplate({ page }: { page: PageData }) {
  return (
    <div className="pt-20 bg-rise-cream min-h-screen">
      {page.featured_image_url && (
        <div className="max-w-4xl mx-auto px-6 pt-8">
          <img
            src={page.featured_image_url}
            alt={page.title}
            className="w-full max-h-80 object-cover rounded-2xl"
          />
        </div>
      )}
      <article className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-rise-navy mb-8">
          {page.title}
        </h1>
        <div className="blog-prose" dangerouslySetInnerHTML={{ __html: page.content }} />
      </article>
    </div>
  )
}

export function LandingTemplate({ page }: { page: PageData }) {
  return (
    <div className="pt-20 bg-rise-cream min-h-screen">
      {/* Hero */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rise-navy via-rise-blue to-rise-navy" />
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-rise-gold/10 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-display text-5xl md:text-6xl font-semibold text-white mb-6">
            {page.title}
          </h1>
          {page.meta_description && (
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              {page.meta_description}
            </p>
          )}
        </div>
      </section>

      {/* Content */}
      {page.featured_image_url && (
        <div className="max-w-5xl mx-auto px-6 -mt-12 relative z-10">
          <img
            src={page.featured_image_url}
            alt={page.title}
            className="w-full max-h-96 object-cover rounded-2xl shadow-xl"
          />
        </div>
      )}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <div className="blog-prose" dangerouslySetInnerHTML={{ __html: page.content }} />
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl font-semibold text-rise-navy mb-4">
            Ready to get started?
          </h2>
          <Link
            href="/contact"
            className="inline-flex px-8 py-4 bg-rise-navy text-white rounded-full font-medium hover:bg-rise-blue transition-colors hover:-translate-y-0.5 hover:shadow-lg"
          >
            Book a Consultation
          </Link>
        </div>
      </section>
    </div>
  )
}

export function GuideTemplate({ page }: { page: PageData }) {
  return (
    <div className="pt-20 bg-rise-cream min-h-screen">
      <section className="py-12 md:py-16 border-b border-rise-navy/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-rise-navy/5 rounded-full mb-6">
            <div className="w-2 h-2 bg-rise-gold rounded-full" />
            <span className="text-sm text-rise-navy font-medium">Guide</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-rise-navy mb-4">
            {page.title}
          </h1>
          {page.meta_description && (
            <p className="text-lg text-rise-slate max-w-3xl">{page.meta_description}</p>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-12">
          {/* Sidebar placeholder — TOC could be extracted from content headings */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-display text-lg font-semibold text-rise-navy mb-3">In this guide</h3>
              <p className="text-sm text-rise-slate">Navigate through the sections of this guide for a comprehensive overview.</p>
            </div>
          </aside>

          {/* Content */}
          <article>
            {page.featured_image_url && (
              <img
                src={page.featured_image_url}
                alt={page.title}
                className="w-full max-h-80 object-cover rounded-2xl mb-10"
              />
            )}
            <div className="blog-prose" dangerouslySetInnerHTML={{ __html: page.content }} />
          </article>
        </div>
      </div>
    </div>
  )
}

export function CaseStudyTemplate({ page }: { page: PageData }) {
  return (
    <div className="pt-20 bg-rise-cream min-h-screen">
      {/* Header */}
      <section className="py-16 bg-rise-navy">
        <div className="max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
            <div className="w-2 h-2 bg-rise-gold rounded-full" />
            <span className="text-sm text-white/80 font-medium">Case Study</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-white mb-4">
            {page.title}
          </h1>
          {page.meta_description && (
            <p className="text-lg text-white/70 max-w-3xl">{page.meta_description}</p>
          )}
        </div>
      </section>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-6 py-16">
        {page.featured_image_url && (
          <img
            src={page.featured_image_url}
            alt={page.title}
            className="w-full max-h-80 object-cover rounded-2xl mb-10 -mt-8 shadow-xl"
          />
        )}
        <div className="blog-prose" dangerouslySetInnerHTML={{ __html: page.content }} />
      </article>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl font-semibold text-rise-navy mb-4">
            See how we can help you
          </h2>
          <p className="text-rise-slate mb-6">
            Every client&apos;s situation is unique. Let&apos;s discuss yours.
          </p>
          <Link
            href="/contact"
            className="inline-flex px-8 py-4 bg-rise-navy text-white rounded-full font-medium hover:bg-rise-blue transition-colors hover:-translate-y-0.5 hover:shadow-lg"
          >
            Schedule a Conversation
          </Link>
        </div>
      </section>
    </div>
  )
}
