import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Download, Calendar, HelpCircle, Landmark, Heart, TrendingUp, Shield, Users, BookOpen, Quote, Award, ChevronRight } from 'lucide-react'

export const metadata = {
  title: 'Rise Financial Partners | Faith-Aligned Wealth Management for Christian Families',
  description: 'Retire with confidence. Leave a legacy that lasts. Rise Financial Partners helps Christian families with $1M+ plan for retirement, legacy, and generosity.',
}

export default function HomeAlt() {
  return (
    <div className="pt-20">

      {/* ═══════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════ */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-rise-cream via-white to-rise-cream"></div>
        <div className="absolute top-10 right-0 w-[700px] h-[700px] bg-rise-blue/[0.04] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rise-gold/[0.08] rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-rise-navy/[0.02] rounded-full blur-3xl"></div>

        {/* Decorative lines */}
        <div className="absolute left-1/2 top-0 w-px h-40 bg-gradient-to-b from-transparent via-rise-gold/30 to-transparent"></div>
        <div className="absolute right-24 top-32 w-px h-24 bg-gradient-to-b from-rise-gold/20 to-transparent hidden lg:block"></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-rise-navy/5 rounded-full mb-8">
              <span className="w-2 h-2 bg-rise-gold rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-rise-navy">Faith-Aligned Wealth Management</span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold text-rise-navy leading-[1.1] mb-6">
              Retire with confidence.
              <br />
              <span className="text-rise-blue">Leave a legacy that lasts.</span>
            </h1>

            <p className="text-lg md:text-xl text-rise-slate leading-relaxed mb-10 max-w-2xl mx-auto">
              Rise Financial Partners helps Christian families steward their wealth with purpose — so you can provide for your family, give generously, and honor God with every dollar.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#checklist"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-white bg-rise-navy rounded-full hover:bg-rise-blue transition-all duration-300 shadow-xl shadow-rise-navy/20 hover:shadow-rise-blue/30 hover:-translate-y-0.5 group"
              >
                <Download className="w-4 h-4" />
                Download the Retirement Checklist
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-rise-navy bg-white border-2 border-rise-navy/10 rounded-full hover:border-rise-navy/30 hover:bg-rise-cream transition-all duration-300"
              >
                <Calendar className="w-4 h-4" />
                Schedule a Conversation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          PROBLEM SECTION
      ═══════════════════════════════════════════════ */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-rise-navy mb-4">
              You&apos;ve Worked Hard. Now You Have Questions.
            </h2>
            <p className="text-lg text-rise-slate max-w-2xl mx-auto">
              You&apos;ve been faithful with what God has given you. But as retirement approaches, the questions get harder.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: HelpCircle,
                question: '"Will I have enough to retire?"',
                description: 'You\'ve saved diligently for decades, but the uncertainty keeps you up at night. Will it last 20 years? 30? What if the market drops at the wrong time?',
              },
              {
                icon: Landmark,
                question: '"Can I leave an inheritance for my children?"',
                description: 'You want to pass something meaningful to the next generation — not just money, but wisdom and values. But you\'re not sure how to structure it without jeopardizing your own security.',
              },
              {
                icon: Heart,
                question: '"I want to be generous, but I\'m afraid of running out."',
                description: 'You feel called to give — to your church, to causes you believe in. But every time you write a check, there\'s a nagging fear that you\'re giving away your safety net.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group p-8 lg:p-10 bg-rise-cream/50 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-rise-navy/5 transition-all duration-500 border border-transparent hover:border-rise-navy/5"
              >
                <div className="w-14 h-14 rounded-xl bg-rise-navy/10 flex items-center justify-center mb-6 group-hover:bg-rise-navy group-hover:scale-110 transition-all duration-300">
                  <item.icon className="w-7 h-7 text-rise-navy group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-display text-2xl font-semibold text-rise-navy mb-3">{item.question}</h3>
                <p className="text-rise-slate leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SOLUTION SECTION
      ═══════════════════════════════════════════════ */}
      <section className="py-24 bg-rise-cream relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rise-blue/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rise-gold/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-rise-navy mb-4">
              Here&apos;s How We Help
            </h2>
            <p className="text-lg text-rise-slate max-w-2xl mx-auto">
              Three clear solutions for the three biggest concerns you&apos;re carrying.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: 'Retirement Planning',
                description: 'We create a plan that shows you — with confidence — when and how you can retire. No guessing. No anxiety. Just clarity.',
                accent: 'from-rise-navy to-rise-blue',
              },
              {
                icon: Shield,
                title: 'Legacy Strategy',
                description: 'We create a multi-generational plan so your legacy outlives you. Your children and grandchildren will be set up to thrive.',
                accent: 'from-rise-blue to-rise-sky',
              },
              {
                icon: Heart,
                title: 'Generosity Planning',
                description: 'We align your giving with your financial plan so generosity becomes a joy, not a worry. Give freely because the math works.',
                accent: 'from-rise-sky to-rise-gold',
              },
            ].map((item, i) => (
              <div key={i} className="group relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${item.accent} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                <div className="relative p-8 lg:p-10 bg-white rounded-2xl border border-rise-navy/5 group-hover:border-transparent group-hover:text-white transition-all duration-500 h-full">
                  <div className="w-14 h-14 rounded-xl bg-rise-navy/10 flex items-center justify-center mb-6 group-hover:bg-white/20 transition-all duration-300">
                    <item.icon className="w-7 h-7 text-rise-navy group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-rise-navy group-hover:text-white mb-4 transition-colors">{item.title}</h3>
                  <p className="text-rise-slate group-hover:text-white/90 leading-relaxed transition-colors">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SUCCESS SECTION — "What Life Looks Like After"
      ═══════════════════════════════════════════════ */}
      <section className="py-24 bg-rise-navy text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-rise-blue/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-rise-gold/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-8">
            <span className="w-2 h-2 bg-rise-gold rounded-full"></span>
            <span className="text-sm font-medium text-rise-sky">The Transformation</span>
          </div>

          <h2 className="font-display text-4xl md:text-5xl font-semibold mb-8">
            What Life Looks Like After
          </h2>

          <div className="relative">
            <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-rise-gold via-rise-gold/50 to-transparent hidden md:block"></div>
            <blockquote className="md:pl-8">
              <p className="text-xl md:text-2xl text-rise-sky leading-relaxed font-display italic">
                They stop worrying about money and start focusing on what matters most — faith, family, and legacy.
              </p>
            </blockquote>
          </div>

          <p className="text-lg text-rise-sky/80 leading-relaxed mt-8 max-w-2xl mx-auto">
            Imagine opening your quarterly statement without a knot in your stomach. Imagine writing a generous check to your church and feeling only joy. Imagine sitting down with your adult children and showing them the plan — not just for their inheritance, but for the values behind it. That&apos;s the life our clients live.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          TRUST & SOCIAL PROOF SECTION
      ═══════════════════════════════════════════════ */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Stats bar */}
          <div className="text-center mb-20">
            <p className="text-lg text-rise-slate mb-2">Trusted by families across the country</p>
            <p className="font-display text-3xl md:text-4xl font-semibold text-rise-navy">
              Managing over <span className="text-rise-blue">$65 million</span> in assets for dozens of families
            </p>
            <p className="text-rise-slate mt-2">with comprehensive, faith-aligned wealth management.</p>
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              {
                quote: 'Rise gave us the confidence to retire two years earlier than we thought possible. For the first time, we feel at peace about our financial future.',
                name: 'David & Karen M.',
                detail: 'Retired educators',
              },
              {
                quote: 'We\'ve finally been able to set up a giving strategy that doesn\'t keep us up at night. Rise showed us how to be generous AND secure.',
                name: 'Mark & Sarah T.',
                detail: 'Business owners',
              },
              {
                quote: 'Having an advisor who shares our values made all the difference. They understand that it\'s not just about the numbers — it\'s about purpose.',
                name: 'James & Linda R.',
                detail: 'Pre-retirees',
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="p-8 bg-rise-cream/50 rounded-2xl border border-rise-navy/5 relative"
              >
                <Quote className="w-8 h-8 text-rise-gold/30 mb-4" />
                <p className="text-rise-slate leading-relaxed mb-6 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="border-t border-rise-navy/10 pt-4">
                  <p className="font-medium text-rise-navy">{testimonial.name}</p>
                  <p className="text-sm text-rise-slate">{testimonial.detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Credentials & Partners */}
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
                {['CFP®', 'CKA®', 'RICP®', 'ASBC®', 'Fee-Only Fiduciary'].map((cred, i) => (
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
          MEET THE TEAM
      ═══════════════════════════════════════════════ */}
      <section className="py-24 bg-rise-cream relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-rise-navy mb-4">
              Meet the Team
            </h2>
            <p className="text-lg text-rise-slate max-w-2xl mx-auto">
              Four advisors working together to serve your family with excellence, wisdom, and care.
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
                name: 'Josh Elmore, CFP® CKA®',
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
                name: 'Jeff Speers, RICP® ASBC®',
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
          FAITH INTEGRATION
      ═══════════════════════════════════════════════ */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-rise-gold/5 rounded-full blur-3xl -translate-y-1/2"></div>

        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-rise-gold/10 rounded-full mb-8">
            <BookOpen className="w-4 h-4 text-rise-gold" />
            <span className="text-sm font-medium text-rise-navy">Rooted in Faith</span>
          </div>

          <h2 className="font-display text-4xl md:text-5xl font-semibold text-rise-navy mb-8">
            Stewardship Is at the Heart of Everything We Do
          </h2>

          <p className="text-lg text-rise-slate leading-relaxed mb-10 max-w-2xl mx-auto">
            We believe that everything we have belongs to God, and our role is to manage it faithfully. That conviction shapes how we plan, how we invest, and how we serve you. It&apos;s not a marketing angle — it&apos;s our foundation.
          </p>

          <div className="relative inline-block">
            <div className="absolute -left-6 top-0 w-1 h-full bg-rise-gold/40 rounded-full hidden md:block"></div>
            <blockquote className="md:pl-8 text-left md:text-center">
              <p className="font-display text-2xl md:text-3xl text-rise-navy italic leading-snug">
                &ldquo;A good man leaves an inheritance to his children&apos;s children.&rdquo;
              </p>
              <cite className="block mt-4 text-rise-slate not-italic">— Proverbs 13:22</cite>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════════ */}
      <section id="checklist" className="py-24 bg-gradient-to-br from-rise-navy via-rise-blue to-rise-navy relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rise-gold/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-white mb-6">
            Ready to plan with confidence?
          </h2>
          <p className="text-xl text-rise-sky mb-10 max-w-2xl mx-auto">
            Download our free Retirement Readiness Checklist — built specifically for Christians with $1M+ who want to retire well, leave a legacy, and give generously.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 text-lg font-medium text-rise-navy bg-white rounded-full hover:bg-rise-cream transition-all duration-300 shadow-2xl hover:shadow-white/20 hover:-translate-y-1 group"
            >
              <Download className="w-5 h-5" />
              Download the Free Checklist
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 text-lg font-medium text-white border-2 border-white/30 rounded-full hover:bg-white/10 transition-all duration-300"
            >
              Schedule a Conversation
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
