import Link from 'next/link'
import { ArrowRight, Linkedin, Mail } from 'lucide-react'

const team = [
  {
    name: 'Thomas Hlohinec',
    role: 'Partner & Wealth Advisor',
    slug: 'thomas-hlohinec',
    bio: 'Thomas brings extensive experience in wealth management and is passionate about helping clients achieve their financial goals through personalized strategies.',
    image: '/team/thomas.jpg', // Placeholder - you'll add actual images
  },
  {
    name: 'Josh Elmore',
    role: 'Partner & Wealth Advisor',
    slug: 'josh-elmore',
    bio: 'Josh specializes in comprehensive financial planning and investment management, with a focus on helping families build and preserve wealth across generations.',
    image: '/team/josh.jpg',
  },
  {
    name: 'Josiah Robison',
    role: 'Wealth Advisor',
    slug: 'josiah-robison',
    bio: 'Josiah is dedicated to providing exceptional client service and helping individuals navigate their financial journey with confidence and clarity.',
    image: '/team/josiah.jpg',
  },
  {
    name: 'Jeff Speers',
    role: 'Wealth Advisor',
    slug: 'jeff-speers',
    bio: 'Jeff brings a detail-oriented approach to financial planning, ensuring clients receive thorough analysis and thoughtful recommendations.',
    image: '/team/jeff.jpg',
  },
]

export default function TeamPage() {
  return (
    <div className="pt-20 bg-rise-cream">
      {/* Hero */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rise-blue/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rise-gold/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-rise-navy/5 rounded-full mb-6">
              <span className="w-2 h-2 bg-rise-gold rounded-full"></span>
              <span className="text-sm font-medium text-rise-navy">Our People</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-rise-navy mb-6">
              Meet the Team
            </h1>
            <p className="text-lg text-rise-slate leading-relaxed">
              Our team of dedicated advisors brings diverse expertise and a shared commitment to helping you achieve financial success. Get to know the people who will be your partners in building wealth.
            </p>
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {team.map((member, i) => (
              <Link
                key={i}
                href={`/team/${member.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg shadow-rise-navy/5 hover:shadow-2xl hover:shadow-rise-navy/10 transition-all duration-500"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Image placeholder */}
                  <div className="sm:w-48 h-48 sm:h-auto bg-gradient-to-br from-rise-navy to-rise-blue flex-shrink-0 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-display text-6xl text-white/20">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    {/* Uncomment when you have actual images:
                    <Image 
                      src={member.image} 
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                    */}
                  </div>
                  
                  <div className="p-6 flex flex-col justify-between flex-grow">
                    <div>
                      <h2 className="font-display text-2xl font-semibold text-rise-navy mb-1 group-hover:text-rise-blue transition-colors">
                        {member.name}
                      </h2>
                      <p className="text-rise-gold font-medium mb-4">{member.role}</p>
                      <p className="text-rise-slate text-sm leading-relaxed line-clamp-3">
                        {member.bio}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-4 text-rise-navy group-hover:text-rise-blue transition-colors">
                      <span className="text-sm font-medium">View Profile</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="bg-rise-navy rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rise-blue/20 rounded-full blur-3xl"></div>
            <div className="relative">
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-white mb-4">
                Interested in Joining Our Team?
              </h2>
              <p className="text-rise-sky mb-8 max-w-xl mx-auto">
                We're always looking for talented individuals who share our values and commitment to exceptional client service.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 text-rise-navy bg-white rounded-full hover:bg-rise-cream transition-colors font-medium"
              >
                Get in Touch
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
