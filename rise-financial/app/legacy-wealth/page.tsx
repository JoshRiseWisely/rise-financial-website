import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Download, Calendar, Shield, Landmark, Heart, TrendingUp, Users, BookOpen, Quote, ChevronRight, Award, CheckCircle } from 'lucide-react'

export const metadata = {
  title: 'Legacy Wealth Management | Rise Financial Partners',
  description: 'For legacy-minded Christian families with $5M+ in assets. Comprehensive, faith-aligned wealth strategy for multi-generational stewardship.',
}

export default function LegacyWealth() {
  return (
    <div className="pt-20">

      {/* ═══════════════════════════════════════════════
          HERO SECTION — Premium / Elevated
      ═══════════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-rise-navy">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-rise-navy via-[#1e3557] to-rise-navy"></div>
        <div className="absolute top-10 right-0 w-[800px] h-[800px] bg-rise-blue/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-rise-gold/[0.06] rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-white/[0.02] rounded-full blur-3xl"></div>

        {/* Decorative elements */}
        <div className="absolute left-1/2 top-0 w-px h-48 bg-gradient-to-b from-transparent via-rise-gold/20 to-transparent"></div>
        <div className="absolute right-16 bottom-32 w-px h-32 bg-gradient-to-b from-rise-gold/15 to-transparent hidden lg:block"></div>
        <div className="absolute left-16 top-40 w-24 h-px bg-gradient-to-r from-rise-gold/15 to-transparent hidden lg:block"></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/[0.08] backdrop-blur-sm rounded-full mb-8 border border-white/10">
              <span className="w-2 h-2 bg-rise-gold rounded-full"></span>
              <span className="text-sm font-medium text-rise-sky">For Families Managing $5M+</span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold text-white leading-[1.1] mb-6">
              Your wealth has a purpose.
              <br />
              <span className="text-rise-gold">Let&apos;s make sure it lasts.</span>
            </h1>

            <p className="text-lg md:text-xl text-rise-sky leading-relaxed mb-12 max-w-2xl mx-auto">
              Rise Financial Partners serves legacy-minded Christian families with comprehensive, faith-aligned wealth strategy designed to span generations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#checklist"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-rise-navy bg-white rounded-full hover:bg-rise-cream transition-all duration-300 shadow-2xl shadow-black/20 hover:-translate-y-0.5 group"
              >
                <Download className="w-4 h-4" />
                Download the Retirement Checklist
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-white border-2 border-white/20 rounded-full hover:bg-white/10 hover:border-white/40 transition-all duration-300"
              >
                <Calendar className="w-4 h-4" />
                Schedule a Conversation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          PROBLEM SECTION — $5M+ Version
      ═══════════════════════════════════════════════ */}
      <section className="py-28 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-rise-navy mb-4">
              The Complexity Grows with the Wealth
            </h2>
            <p className="text-lg text-rise-slate max-w-2xl mx-auto">
              At this level, the stakes are higher and the questions are more nuanced. You need more than a financial plan — you need a comprehensive strategy.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                number: '01',
                question: 'You\'ve built significant wealth — but does your plan account for everything?',
                description: 'At $5M+, retirement planning involves more complexity: tax efficiency across multiple accounts, diverse income streams, estate implications, and risk management that accounts for the full picture — not just the portfolio.',
                icon: TrendingUp,
              },
              {
                number: '02',
                question: 'You want your legacy to span generations — not just one.',
                description: 'Multi-generational wealth transfer requires more than a basic estate plan. It requires intentional structuring — trusts, tax strategies, and a framework that protects and empowers your children and grandchildren.',
                icon: Landmark,
              },
              {
                number: '03',
                question: 'You want to give generously and strategically — not just write checks.',
                description: 'At this level, charitable giving can be structured for maximum Kingdom impact and tax efficiency. Donor-advised funds, charitable remainder trusts, and family foundations become powerful tools — if deployed wisely.',
                icon: Heart,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group relative"
              >
                <div className="absolute -top-3 -left-3 font-display text-7xl font-bold text-rise-navy/[0.04] select-none">
                  {item.number}
                </div>
                <div className="relative p-8 lg:p-10">
                  <div className="w-14 h-14 rounded-xl bg-rise-navy flex items-center justify-center mb-6">
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-rise-navy mb-4 leading-snug">{item.question}</h3>
                  <p className="text-rise-slate leading-relaxed">{item.description}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-5 w-10 h-px bg-rise-navy/10"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SOLUTION SECTION — Sophisticated Services
      ═══════════════════════════════════════════════ */}
      <section className="py-28 bg-rise-cream relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rise-blue/[0.04] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-rise-gold/[0.06] rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-rise-navy mb-4">
              Sophisticated Strategy. Faithful Stewardship.
            </h2>
            <p className="text-lg text-rise-slate max-w-2xl mx-auto">
              Solutions built for the complexity of significant wealth — grounded in the values that matter most to you.
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                icon: TrendingUp,
                title: 'Comprehensive Wealth Strategy',
                description: 'We build a retirement and income plan that accounts for the full complexity of significant wealth — tax optimization, risk management, and long-term sustainability.',
                features: ['Multi-account tax optimization', 'Diversified income streams', 'Risk-adjusted portfolio management', 'Long-term sustainability modeling'],
              },
              {
                icon: Shield,
                title: 'Multi-Generational Legacy Planning',
                description: 'We create a multi-generational plan so your legacy outlives you — structuring wealth transfer to protect and empower your children and grandchildren.',
                features: ['Trust & estate structuring', 'Wealth transfer strategies', 'Next-generation preparation', 'Values-based inheritance planning'],
              },
              {
                icon: Heart,
                title: 'Strategic Charitable Giving',
                description: 'We design giving structures — donor-advised funds, charitable remainder trusts, and more — so your generosity creates maximum Kingdom impact with tax-efficient precision.',
                features: ['Donor-Advised Funds (DAFs)', 'Charitable Remainder Trusts (CRTs)', 'Family foundation guidance', 'Tax-efficient giving strategies'],
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl border border-rise-navy/5 overflow-hidden hover:shadow-2xl hover:shadow-rise-navy/10 transition-all duration-500"
              >
                <div className="grid md:grid-cols-5 gap-0">
                  <div className="md:col-span-3 p-8 lg:p-10">
                    <div className="flex items-start gap-5">
                      <div className="w-14 h-14 rounded-xl bg-rise-navy flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="font-display text-2xl md:text-3xl font-semibold text-rise-navy mb-3">{item.title}</h3>
                        <p className="text-rise-slate leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2 bg-rise-cream/50 p-8 lg:p-10 flex items-center">
                    <ul className="space-y-3 w-full">
                      {item.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-3 text-rise-slate">
                          <CheckCircle className="w-5 h-5 text-rise-gold flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SUCCESS SECTION — Elevated Transformation
      ═══════════════════════════════════════════════ */}
      <section className="py-28 bg-rise-navy text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-rise-blue/15 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-rise-gold/[0.08] rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/[0.08] backdrop-blur-sm rounded-full mb-8 border border-white/10">
            <span className="w-2 h-2 bg-rise-gold rounded-full"></span>
            <span className="text-sm font-medium text-rise-sky">The Transformation</span>
          </div>

          <h2 className="font-display text-4xl md:text-5xl font-semibold mb-8">
            From Complexity to Clarity
          </h2>

          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-rise-gold via-rise-gold/50 to-transparent hidden md:block rounded-full"></div>
            <blockquote className="md:pl-10">
              <p className="text-xl md:text-2xl text-rise-sky leading-relaxed font-display italic">
                Families who work with Rise stop managing complexity and start living with clarity — confident that their wealth, their family, and their giving are all aligned with their deepest values.
              </p>
            </blockquote>
          </div>

          <p className="text-lg text-rise-sky/80 leading-relaxed mt-10 max-w-2xl mx-auto">
            Imagine knowing that every dollar is working toward something eternal. That your children are prepared — not just financially, but with the values and wisdom to carry your legacy forward. That your generosity is creating maximum impact for the Kingdom. That&apos;s what comprehensive stewardship looks like.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          TRUST & CREDIBILITY
      ═══════════════════════════════════════════════ */}
      <section className="py-28 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          {/* Who This Is For */}
          <div className="max-w-3xl mx-auto text-center mb-20 p-10 bg-rise-cream/50 rounded-2xl border border-rise-navy/5">
            <h3 className="font-display text-2xl font-semibold text-rise-navy mb-4">Who This Is For</h3>
            <p className="text-rise-slate leading-relaxed">
              This page is for Christian families managing <span className="font-medium text-rise-navy">$5M+ in investable assets</span> who want a comprehensive, faith-aligned wealth strategy — one that addresses retirement, legacy, and generosity with the sophistication their situation demands.
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              { stat: '$65M+', label: 'Assets Under Management' },
              { stat: 'Fee-Only', label: 'Fiduciary — No Commissions' },
              { stat: '4 Advisors', label: 'Collaborative Team Approach' },
            ].map((item, i) => (
              <div key={i} className="text-center p-8">
                <p className="font-display text-4xl md:text-5xl font-semibold text-rise-navy mb-2">{item.stat}</p>
                <p className="text-rise-slate">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="max-w-3xl mx-auto mb-20">
            <div className="p-10 bg-rise-cream/50 rounded-2xl border border-rise-navy/5 text-center">
              <Quote className="w-10 h-10 text-rise-gold/30 mx-auto mb-6" />
              <p className="text-xl text-rise-slate leading-relaxed italic mb-6">
                &ldquo;We came to Rise with a complex financial picture — multiple businesses, real estate, and a deep desire to structure our giving. They brought clarity to all of it. For the first time, our wealth feels aligned with our calling.&rdquo;
              </p>
              <div className="border-t border-rise-navy/10 pt-4 inline-block">
                <p className="font-medium text-rise-navy">Robert & Catherine W.</p>
                <p className="text-sm text-rise-slate">Business owners & philanthropists</p>
              </div>
            </div>
          </div>

          {/* Partners & Credentials */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-12">
            <div className="text-center">
              <p className="text-sm font-medium text-rise-slate mb-4 uppercase tracking-wider">Our Custodial Partners</p>
              <div className="flex items-center gap-8">
                <Image
                  src="/images/logos/schwab.png"
                  alt="Charles Schwab"
                  width={140}
                  height={40}
                  className="opacity-60 hover:opacity-100 transition-opacity"
                />
                <Image
                  src="/images/logos/altruist.png"
                  alt="Altruist"
                  width={120}
                  height={40}
                  className="opacity-60 hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
            <div className="hidden md:block w-px h-16 bg-rise-navy/10"></div>
            <div className="text-center">
              <p className="text-sm font-medium text-rise-slate mb-4 uppercase tracking-wider">Credentials</p>
              <div className="flex flex-wrap justify-center gap-3">
                {['CERTIFIED FINANCIAL PLANNER\u2122', 'CERTIFIED KINGDOM ADVISOR\u00AE', 'RICP\u00AE', 'ASBC\u00AE'].map((cred, i) => (
                  <span key={i} className="px-4 py-2 bg-rise-navy/5 rounded-full text-sm text-rise-navy font-medium">
                    {cred}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          BRIEF TEAM INTRODUCTION
      ═══════════════════════════════════════════════ */}
      <section className="py-24 bg-rise-cream relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-rise-navy mb-4">
              Your Advisory Team
            </h2>
            <p className="text-lg text-rise-slate max-w-2xl mx-auto">
              Experienced advisors collaborating to serve the full complexity of your financial picture.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: 'Thomas Hlohinec',
                role: 'CEO & Founder',
                image: '/images/team/thomas-hlohinec.png',
                slug: 'thomas-hlohinec',
              },
              {
                name: 'Josh Elmore, CFP\u00AE CKA\u00AE',
                role: 'Director of Wealth Management',
                image: '/images/team/josh-elmore.jpg',
                slug: 'josh-elmore',
              },
              {
                name: 'Josiah Robison',
                role: 'CCO | CTO & Wealth Advisor',
                image: '/images/team/josiah-robison.jpg',
                slug: 'josiah-robison',
              },
              {
                name: 'Jeff Speers, RICP\u00AE ASBC\u00AE',
                role: 'Business Consultant & Wealth Advisor',
                image: '/images/team/jeff-speers.png',
                slug: 'jeff-speers',
              },
            ].map((member, i) => (
              <Link
                key={i}
                href={`/team/${member.slug}`}
                className="group block"
              >
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 shadow-lg shadow-rise-navy/10 group-hover:shadow-xl group-hover:shadow-rise-navy/15 transition-all duration-500">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-rise-navy/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-display text-xl font-semibold text-white mb-1">{member.name}</h3>
                    <p className="text-white/80 text-sm">{member.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm font-medium text-rise-navy group-hover:text-rise-blue transition-colors">
                  View profile
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FAITH ELEMENT
      ═══════════════════════════════════════════════ */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-rise-gold/5 rounded-full blur-3xl -translate-y-1/2"></div>

        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-rise-gold/10 rounded-full mb-8">
            <BookOpen className="w-4 h-4 text-rise-gold" />
            <span className="text-sm font-medium text-rise-navy">A Shared Foundation</span>
          </div>

          <h2 className="font-display text-4xl md:text-5xl font-semibold text-rise-navy mb-8">
            Wealth Managed for What Matters Most
          </h2>

          <p className="text-lg text-rise-slate leading-relaxed mb-10 max-w-2xl mx-auto">
            We serve families who see their wealth as a tool for Kingdom impact. Our biblical worldview isn&apos;t a niche offering — it&apos;s the lens through which every strategy, every recommendation, and every relationship is shaped. If you share that conviction, you&apos;ll feel it from the very first conversation.
          </p>

          <div className="relative inline-block">
            <div className="absolute -left-6 top-0 w-1 h-full bg-rise-gold/40 rounded-full hidden md:block"></div>
            <blockquote className="md:pl-8 text-left md:text-center">
              <p className="font-display text-2xl md:text-3xl text-rise-navy italic leading-snug">
                &ldquo;For where your treasure is, there your heart will be also.&rdquo;
              </p>
              <cite className="block mt-4 text-rise-slate not-italic">— Matthew 6:21</cite>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════════ */}
      <section id="checklist" className="py-28 bg-gradient-to-br from-rise-navy via-[#1e3557] to-rise-navy relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-rise-gold/[0.04] rounded-full blur-3xl"></div>
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-rise-blue/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-white mb-6">
            Your family&apos;s legacy starts with a conversation.
          </h2>
          <p className="text-xl text-rise-sky mb-12 max-w-2xl mx-auto">
            Download our free Retirement Readiness Checklist for Christians with $1M+ — or skip ahead and schedule a conversation with our team.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 text-lg font-medium text-rise-navy bg-white rounded-full hover:bg-rise-cream transition-all duration-300 shadow-2xl shadow-black/20 hover:-translate-y-1 group"
            >
              <Download className="w-5 h-5" />
              Download the Free Checklist
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 text-lg font-medium text-white border-2 border-white/20 rounded-full hover:bg-white/10 hover:border-white/40 transition-all duration-300"
            >
              Schedule a Conversation
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
