import Link from 'next/link'
import { ArrowRight, Shield, BarChart3, Users, Heart, CheckCircle } from 'lucide-react'

const services = [
  {
    title: 'Advisory Management',
    description: 'We partner with your organization to understand your short, medium, and long-term goals, then build and manage a portfolio aligned with your mission.',
    icon: BarChart3,
  },
  {
    title: 'Risk Assessment',
    description: 'Comprehensive analysis of your endowment\'s risk profile with clear reporting and recommendations tailored to your organization\'s objectives.',
    icon: Shield,
  },
  {
    title: 'Non-Cash Gifting',
    description: 'Receive securities directly into your accounts and liquidate at the lowest cost possible to maximize every gift to your organization.',
    icon: Heart,
  },
  {
    title: 'Dedicated Service',
    description: 'A personal advisor and service team committed to your organization\'s success, not a call center or rotating contacts.',
    icon: Users,
  },
]

const benefits = [
  'Dedicated Service Team & Advisor',
  'Biblically Responsible Investment (BRI) portfolios available',
  'Monthly Performance Reporting',
  'Custody of Assets at Charles Schwab Institutional',
  'Access to Institutional Mutual Funds',
  'Enhanced Yield Money Market Funds',
  'Competitive Management Fees (0.25% - 1.00%)',
  'Independent firm with pricing flexibility',
]

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-rise-cream pt-20">
      {/* Hero */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rise-gold/10 rounded-full blur-3xl -translate-y-1/2"></div>
        <div className="max-w-5xl mx-auto px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <p className="text-rise-gold font-medium mb-4">Foundations & Endowments</p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-rise-navy mb-6">
              Stewarding Generosity
            </h1>
            <p className="text-xl text-rise-slate leading-relaxed mb-8">
              Investment advisory and OCIO services designed to help foundations and nonprofits maximize their endowments—so you can focus on your mission.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-rise-navy text-white rounded-full hover:bg-rise-blue transition-colors font-medium"
            >
              Start a Conversation
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-rise-navy mb-4">
              How We Serve
            </h2>
            <p className="text-rise-slate max-w-2xl mx-auto">
              Personal, professional service for your organization with a focus on what matters most—advancing your mission.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, i) => (
              <div 
                key={i}
                className="p-8 rounded-2xl bg-rise-cream/50 border border-rise-navy/5"
              >
                <div className="w-12 h-12 rounded-xl bg-rise-navy/5 flex items-center justify-center mb-6">
                  <service.icon className="w-6 h-6 text-rise-navy" />
                </div>
                <h3 className="font-display text-xl font-semibold text-rise-navy mb-3">
                  {service.title}
                </h3>
                <p className="text-rise-slate leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-rise-navy mb-6">
                What You Get
              </h2>
              <p className="text-rise-slate leading-relaxed mb-8">
                We believe nonprofits deserve the same caliber of investment management as major institutions—without the complexity or excessive fees.
              </p>
              <div className="grid gap-4">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-rise-gold flex-shrink-0 mt-0.5" />
                    <span className="text-rise-navy">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-rise-navy rounded-2xl p-8 md:p-10 text-white">
              <h3 className="font-display text-2xl font-semibold mb-4">
                Free Endowment Risk Analysis
              </h3>
              <p className="text-rise-sky mb-6 leading-relaxed">
                Wondering if your current investment strategy aligns with your organization's goals and risk tolerance? We'll provide a complimentary analysis of your portfolio.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-rise-navy rounded-full hover:bg-rise-cream transition-colors font-medium text-sm"
              >
                Request Analysis
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-rise-navy mb-6">
            Helping Communities Thrive
          </h2>
          <p className="text-lg text-rise-slate leading-relaxed mb-8">
            We believe in the power of foundations and nonprofits to create lasting change. It's a privilege to partner with organizations making a difference in their communities, helping them steward their resources for maximum impact.
          </p>
          <div className="inline-block p-6 bg-rise-cream rounded-2xl">
            <p className="text-rise-navy italic">
              "Our goal is to help your organization be the best possible steward of the resources entrusted to you."
            </p>
          </div>
        </div>
      </section>

      {/* Inquiry Form CTA */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="bg-gradient-to-br from-rise-navy to-rise-blue rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
              Let's Talk About Your Endowment
            </h2>
            <p className="text-rise-sky mb-8 max-w-xl mx-auto">
              Whether you're managing $500K or $50M, we'd love to learn about your organization and explore how we can help.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-rise-navy rounded-full hover:bg-rise-cream transition-colors font-medium"
            >
              Schedule a Consultation
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
