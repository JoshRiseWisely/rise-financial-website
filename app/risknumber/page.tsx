import Link from 'next/link'
import { ArrowRight, Gauge, ShieldCheck, Clock, LineChart, Calendar, CheckCircle } from 'lucide-react'
import RiskNumberVideo from '@/components/RiskNumberVideo'

export const metadata = {
  title: 'What\'s Your Risk Number?',
  description: 'Find out how much investment risk is right for you. Answer a few questions and get your free Risk Number report in about five minutes.',
}

const QUESTIONNAIRE_URL = 'https://pro.riskalyze.com/embed/a3ada4b46ec01dfe5972'

export default function RiskNumber() {
  return (
    <div className="pt-20">

      {/* ═══════════════════════════════════════════════
          HERO — headline + video
      ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-rise-navy">
        <div className="absolute inset-0 bg-gradient-to-br from-rise-navy via-[#1e3557] to-rise-navy"></div>
        <div className="absolute top-10 right-0 w-[800px] h-[800px] bg-rise-blue/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-rise-gold/[0.06] rounded-full blur-3xl"></div>
        <div className="absolute left-1/2 top-0 w-px h-48 bg-gradient-to-b from-transparent via-rise-gold/20 to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-16 items-center">

            <div>
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/[0.08] backdrop-blur-sm rounded-full mb-8 border border-white/10">
                <span className="w-2 h-2 bg-rise-gold rounded-full"></span>
                <span className="text-sm font-medium text-rise-sky">Free &middot; About 5 Minutes</span>
              </div>

              <h1 className="font-display text-5xl md:text-6xl font-semibold text-white leading-[1.1] mb-6">
                Get your free
                <br />
                <span className="text-rise-gold">Risk Number</span> report.
              </h1>

              <p className="text-lg md:text-xl text-rise-sky leading-relaxed mb-10 max-w-xl">
                Most investors have never been told, in plain numbers, how much risk they are actually taking. A few questions is all it takes to find out where you stand — and whether your portfolio agrees with you.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={QUESTIONNAIRE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-rise-navy bg-white rounded-full hover:bg-rise-cream transition-all duration-300 shadow-2xl shadow-black/20 hover:-translate-y-0.5"
                >
                  <Gauge className="w-4 h-4" />
                  What&apos;s Your Risk Number?
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-white border-2 border-white/20 rounded-full hover:bg-white/10 hover:border-white/40 transition-all duration-300"
                >
                  <Calendar className="w-4 h-4" />
                  Talk With an Advisor
                </Link>
              </div>
            </div>

            {/* Video */}
            <div className="relative">
              <div className="absolute -inset-4 bg-rise-gold/[0.07] rounded-3xl blur-2xl"></div>
              <div className="relative">
                <RiskNumberVideo />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          WHY IT MATTERS
      ═══════════════════════════════════════════════ */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-rise-navy mb-4">
              Risk Is Personal. Your Portfolio Should Be Too.
            </h2>
            <p className="text-lg text-rise-slate max-w-2xl mx-auto">
              &ldquo;Moderately aggressive&rdquo; means something different to every investor — and to every advisor. A number removes the guesswork from the conversation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                number: '01',
                title: 'You have never seen your risk in plain numbers.',
                description: 'Vague labels like "balanced" or "growth" hide more than they reveal. Putting a number to your comfort with risk makes it something you can actually discuss, compare, and revisit.',
                icon: Gauge,
              },
              {
                number: '02',
                title: 'Your portfolio may not match your temperament.',
                description: 'Portfolios drift over time, and so do priorities. The gap between the risk you are comfortable with and the risk you currently hold is worth knowing before the market reveals it for you.',
                icon: LineChart,
              },
              {
                number: '03',
                title: 'Approaching retirement changes the math.',
                description: 'The risk that served you while you were building wealth is rarely the risk that serves you while you are drawing on it. Timing matters as much as tolerance.',
                icon: ShieldCheck,
              },
            ].map((item, i) => (
              <div key={i} className="group relative">
                <div className="absolute -top-3 -left-3 font-display text-7xl font-bold text-rise-navy/[0.04] select-none">
                  {item.number}
                </div>
                <div className="relative p-8 lg:p-10">
                  <div className="w-14 h-14 rounded-xl bg-rise-navy flex items-center justify-center mb-6">
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-rise-navy mb-4 leading-snug">{item.title}</h3>
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
          HOW IT WORKS
      ═══════════════════════════════════════════════ */}
      <section className="py-28 bg-rise-cream">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-rise-navy mb-4">
              How It Works
            </h2>
            <p className="text-lg text-rise-slate max-w-2xl mx-auto">
              Three short steps. No account to create, no cost, no obligation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: 'Step 1',
                title: 'Answer a few questions',
                description: 'A short set of questions about your goals, your timeline, and how you would respond to real market movement.',
                icon: Clock,
              },
              {
                step: 'Step 2',
                title: 'Get your Risk Number',
                description: 'You receive a single number that captures how much risk fits you — along with a report explaining what it means.',
                icon: Gauge,
              },
              {
                step: 'Step 3',
                title: 'Compare it to your portfolio',
                description: 'We can walk through how your current holdings line up against that number, and what to do if they do not.',
                icon: CheckCircle,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 border border-rise-navy/5 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-rise-gold/10 flex items-center justify-center mb-5">
                  <item.icon className="w-6 h-6 text-rise-gold" />
                </div>
                <div className="text-xs font-medium tracking-wide uppercase text-rise-gold mb-2">{item.step}</div>
                <h3 className="font-display text-xl font-semibold text-rise-navy mb-3">{item.title}</h3>
                <p className="text-rise-slate leading-relaxed text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════════ */}
      <section className="py-28 bg-gradient-to-br from-rise-navy via-[#1e3557] to-rise-navy relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-rise-gold/[0.04] rounded-full blur-3xl"></div>
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-rise-blue/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-white mb-6">
            Find out where you stand.
          </h2>
          <p className="text-xl text-rise-sky mb-12 max-w-2xl mx-auto">
            Take a few minutes to discover your Risk Number — then let&apos;s talk about what it means for your plan.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={QUESTIONNAIRE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 text-lg font-medium text-rise-navy bg-white rounded-full hover:bg-rise-cream transition-all duration-300 shadow-2xl shadow-black/20 hover:-translate-y-1"
            >
              <Gauge className="w-5 h-5" />
              Discover Your Risk Number
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 text-lg font-medium text-white border-2 border-white/20 rounded-full hover:bg-white/10 hover:border-white/40 transition-all duration-300"
            >
              Schedule a Conversation
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <p className="mt-12 text-sm text-rise-sky/60 max-w-2xl mx-auto leading-relaxed">
            The Risk Number questionnaire is provided through a third-party platform. It is an educational tool and does not constitute investment advice or a recommendation to buy or sell any security.
          </p>
        </div>
      </section>

    </div>
  )
}
