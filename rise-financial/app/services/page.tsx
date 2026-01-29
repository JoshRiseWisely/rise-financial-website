import Link from 'next/link'
import { ArrowRight, TrendingUp, Briefcase, Building, Shield, PiggyBank, Users, FileText, Heart } from 'lucide-react'

export default function ServicesPage() {
  return (
    <div className="pt-20 bg-rise-cream">
      {/* Hero */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rise-blue/5 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-rise-navy/5 rounded-full mb-6">
              <span className="w-2 h-2 bg-rise-gold rounded-full"></span>
              <span className="text-sm font-medium text-rise-navy">What We Offer</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-rise-navy mb-6">
              Comprehensive Wealth Management
            </h1>
            <p className="text-lg text-rise-slate leading-relaxed">
              We believe money is a tool—an instrument to accomplish your purpose. Our holistic approach addresses your complete financial picture, helping you build, protect, and transfer wealth with intention.
            </p>
          </div>
        </div>
      </section>

      {/* Financial Planning */}
      <section id="planning" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="w-16 h-16 rounded-2xl bg-rise-navy flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-rise-navy mb-6">
                Financial Planning
              </h2>
              <p className="text-lg text-rise-slate leading-relaxed mb-8">
                We want to meet you where you are, discover what's important to you, and chart a course to help you get there. Our comprehensive planning process considers every aspect of your financial life.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: Shield, label: 'Retirement Planning' },
                  { icon: FileText, label: 'Tax Strategy' },
                  { icon: Users, label: 'Estate Planning' },
                  { icon: Heart, label: 'Insurance Analysis' },
                  { icon: PiggyBank, label: 'Education Funding' },
                  { icon: TrendingUp, label: 'Cash Flow Management' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-rise-cream/50 rounded-xl">
                    <div className="w-10 h-10 bg-rise-navy/10 rounded-lg flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-rise-navy" />
                    </div>
                    <span className="font-medium text-rise-navy">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square max-w-md ml-auto bg-gradient-to-br from-rise-navy to-rise-blue rounded-3xl p-8 text-white">
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <p className="text-rise-sky/70 mb-2">Your Financial Plan Includes</p>
                    <h3 className="font-display text-2xl font-semibold">A Clear Roadmap</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                      <span>Discovery & Goals Assessment</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                      <span>Comprehensive Analysis</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                      <span>Strategy Development</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                      <span>Implementation & Monitoring</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-rise-gold rounded-full opacity-80"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Management */}
      <section id="investments" className="py-24 bg-rise-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="bg-white rounded-3xl p-8 shadow-xl shadow-rise-navy/5">
                <h3 className="font-display text-xl font-semibold text-rise-navy mb-6">Investment Options</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Stocks, Bonds & ETFs', desc: 'Core portfolio building blocks' },
                    { label: 'Mutual Funds', desc: 'Diversified fund strategies' },
                    { label: 'Alternative Investments', desc: 'Real estate, private equity guidance' },
                    { label: 'BRI Portfolios', desc: 'Biblically Responsible Investing' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 bg-rise-cream/50 rounded-xl">
                      <div className="w-2 h-2 bg-rise-gold rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-rise-navy">{item.label}</p>
                        <p className="text-sm text-rise-slate">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="w-16 h-16 rounded-2xl bg-rise-blue flex items-center justify-center mb-6">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-rise-navy mb-6">
                Investment Management
              </h2>
              <p className="text-lg text-rise-slate leading-relaxed mb-6">
                Portfolio management is a core component of our service at Rise. We help clients quantify risk and build the most efficient portfolio for their unique financial plan and circumstances.
              </p>
              <p className="text-lg text-rise-slate leading-relaxed mb-8">
                For Christian clients who want to align their investments with their values, we offer Biblically Responsible Investment (BRI) portfolios that screen for alignment with biblical principles.
              </p>
              
              <div className="flex flex-wrap gap-3">
                {['Risk Analysis', 'Portfolio Optimization', 'Tax Efficiency', 'Regular Rebalancing'].map((tag, i) => (
                  <span key={i} className="px-4 py-2 bg-rise-navy/5 rounded-full text-sm font-medium text-rise-navy">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Consulting */}
      <section id="business" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="w-16 h-16 rounded-2xl bg-rise-gold flex items-center justify-center mb-6">
                <Building className="w-8 h-8 text-rise-navy" />
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-rise-navy mb-6">
                Business Consulting
              </h2>
              <p className="text-lg text-rise-slate leading-relaxed mb-8">
                From startup to succession, we help business owners navigate complex financial decisions. Our process ensures your business goals align with your personal wealth strategy.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  'Business Planning & Strategy',
                  'SBA Loan Assistance',
                  'Family Business Transition Planning',
                  'Cash Flow Forecasting',
                  'Risk Management',
                  'Philanthropic Planning',
                  'Distribution Planning',
                  'Asset Protection',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-rise-gold/20 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-rise-gold rounded-full"></div>
                    </div>
                    <span className="text-rise-navy">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-rise-navy rounded-3xl p-8 text-white">
                <h3 className="font-display text-2xl font-semibold mb-8">Our Process</h3>
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-rise-gold rounded-full flex items-center justify-center flex-shrink-0 font-display text-xl font-bold text-rise-navy">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">Business Health Assessment</h4>
                      <p className="text-rise-sky/80">Comprehensive review of your business's financial position and operations.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-rise-gold rounded-full flex items-center justify-center flex-shrink-0 font-display text-xl font-bold text-rise-navy">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">Strategic Recommendations</h4>
                      <p className="text-rise-sky/80">Actionable courses of action tailored to your goals.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-rise-gold rounded-full flex items-center justify-center flex-shrink-0 font-display text-xl font-bold text-rise-navy">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">Monitor & Adjust</h4>
                      <p className="text-rise-sky/80">Ongoing support and strategy refinement throughout execution.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-rise-navy via-rise-blue to-rise-navy relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rise-gold/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-white mb-6">
            Let's Build Your Financial Future
          </h2>
          <p className="text-xl text-rise-sky mb-10 max-w-2xl mx-auto">
            Every journey starts with a conversation. Schedule a complimentary consultation to discuss your goals and discover which services are right for you.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-10 py-5 text-lg font-medium text-rise-navy bg-white rounded-full hover:bg-rise-cream transition-all duration-300 shadow-2xl hover:shadow-white/20 hover:-translate-y-1 group"
          >
            Schedule Your Consultation
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  )
}
