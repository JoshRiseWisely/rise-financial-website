import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

const team = [
  {
    name: 'Thomas Hlohinec',
    role: 'CEO & Wealth Advisor',
    slug: 'thomas-hlohinec',
    image: '/images/team/thomas-hlohinec.png',
  },
  {
    name: 'Josh Elmore, CFP®',
    role: 'Director of Wealth Management',
    slug: 'josh-elmore',
    image: '/images/team/josh-elmore.jpg',
  },
  {
    name: 'Josiah Robison',
    role: 'CCO | CTO & Wealth Advisor',
    slug: 'josiah-robison',
    image: '/images/team/josiah-robison.jpg',
  },
  {
    name: 'Jeff Speers, RICP®',
    role: 'Business Consultant & Wealth Advisor',
    slug: 'jeff-speers',
    image: '/images/team/jeff-speers.png',
  },
]

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-rise-cream pt-20">
      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-rise-navy mb-6">
            Our Team
          </h1>
          <p className="text-lg text-rise-slate max-w-2xl leading-relaxed">
            Dedicated professionals committed to helping you achieve your financial goals with clarity, confidence, and integrity.
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="pb-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 gap-8 md:gap-12">
            {team.map((member) => (
              <Link
                key={member.slug}
                href={`/team/${member.slug}`}
                className="group"
              >
                {/* Photo */}
                <div className="aspect-[4/5] relative rounded-2xl overflow-hidden bg-rise-navy/5 mb-6">
                  <Image 
                    src={member.image} 
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                
                {/* Info */}
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-display text-xl font-semibold text-rise-navy group-hover:text-rise-blue transition-colors">
                      {member.name}
                    </h2>
                    <p className="text-rise-slate text-sm mt-1">
                      {member.role}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-rise-navy/30 group-hover:text-rise-blue group-hover:translate-x-1 transition-all mt-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-rise-navy mb-4">
            Ready to get started?
          </h2>
          <p className="text-rise-slate mb-8 max-w-md mx-auto">
            Schedule a conversation with one of our advisors today.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 bg-rise-navy text-white rounded-full hover:bg-rise-blue transition-colors font-medium"
          >
            Book a Consultation
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
