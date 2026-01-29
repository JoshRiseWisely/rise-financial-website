import Link from 'next/link'
import { ArrowRight, Users, Target, Shield, Heart, TrendingUp, Briefcase, Building } from 'lucide-react'

export default function Home() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-rise-cream via-white to-rise-cream"></div>
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-rise-blue/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-rise-gold/10 rounded-full blur-3xl"></div>
        
        {/* Decorative line */}
        <div className="absolute left-1/2 top-0 w-px h-32 bg-gradient-to-b from-transparent via-rise-gold/40 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-rise-navy/5 rounded-full mb-8">
                <span className="w-2 h-2 bg-rise-gold rounded-full animate-pulse"></span>
                <span className="text-sm font-medium text-rise-navy">Independent Fiduciary Advisors</span>
              </div>
              
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold text-rise-navy leading-[1.1] mb-6">
                Live Boldly.
                <br />
                <span className="text-rise-blue">Live Generously.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-rise-slate leading-relaxed mb-10 max-w-xl">
                Experience clarity and confidence in your financial life. We help you build wealth with purpose so you can focus on what matters most.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-white bg-rise-navy rounded-full hover:bg-rise-blue transition-all duration-300 shadow-xl shadow-rise-navy/20 hover:shadow-rise-blue/30 hover:-translate-y-0.5 group"
                >
                  Start Your Journey
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-rise-navy bg-white border-2 border-rise-navy/10 rounded-full hover:border-rise-navy/30 hover:bg-rise-cream transition-all duration-300"
                >
                  Explore Services
                </Link>
              </div>
            </div>
            
            {/* Hero Image / Visual */}
            <div className="relative hidden lg:block">
              <div className="relative aspect-square max-w-lg ml-auto">
                {/* Layered geometric shapes */}
                <div className="absolute inset-0 bg-gradient-to-br from-rise-navy to-rise-blue rounded-3xl transform rotate-3 opacity-10"></div>
                <div className="absolute inset-4 bg-gradient-to-br from-rise-blue to-rise-sky rounded-3xl transform -rotate-2 opacity-20"></div>
                <div className="absolute inset-8 bg-white rounded-3xl shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-rise-cream to-white"></div>
                  <div className="relative p-8 flex flex-col justify-center h-full">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-rise-navy/10 flex items-center justify-center">
                          <TrendingUp className="w-8 h-8 text-rise-navy" />
                        </div>
                        <div>
                          <p className="text-sm text-rise-slate">Portfolio Growth</p>
                          <p className="font-display text-2xl font-semibold text-rise-navy">Optimized</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-rise-gold/20 flex items-center justify-center">
                          <Shield className="w-8 h-8 text-rise-gold" />
                        </div>
                        <div>
                          <p className="text-sm text-rise-slate">Risk Management</p>
                          <p className="font-display text-2xl font-semibold text-rise-navy">Protected</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-rise-blue/10 flex items-center justify-center">
                          <Heart className="w-8 h-8 text-rise-blue" />
                        </div>
                        <div>
                          <p className="text-sm text-rise-slate">Legacy Planning</p>
                          <p className="font-display text-2xl font-semibold text-rise-navy">Secured</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Accent dot */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-rise-gold rounded-full opacity-80"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What to Expect Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-rise-navy mb-4">
              What to Expect at Rise
            </h2>
            <p className="text-lg text-rise-slate max-w-2xl mx-auto">
              An exceptional experience from independent fiduciary advisors who put your interests first.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Users, title: 'A Team that Collaborates', desc: 'Multiple advisors working together to serve your unique needs.' },
              { icon: Target, title: 'A Dedicated Advisor', desc: 'Your personal point of contact who knows your story and goals.' },
              { icon: Shield, title: 'Objective Analysis', desc: 'Fee-only fiduciary advice with no hidden agendas or commissions.' },
              { icon: Heart, title: 'A Strategy for You', desc: 'Customized wealth strategies aligned with your values and vision.' },
            ].map((item, i) => (
              <div 
                key={i} 
                className="group p-8 bg-rise-cream/50 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-rise-navy/5 transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-xl bg-rise-navy/10 flex items-center justify-center mb-6 group-hover:bg-rise-navy group-hover:scale-110 transition-all duration-300">
                  <item.icon className="w-7 h-7 text-rise-navy group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-display text-xl font-semibold text-rise-navy mb-3">{item.title}</h3>
                <p className="text-rise-slate leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-24 bg-rise-navy text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-rise-blue/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-rise-gold/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16">
            <div className="relative">
              <div className="absolute -left-4 top-0 w-1 h-20 bg-gradient-to-b from-rise-gold to-transparent"></div>
              <h2 className="font-display text-4xl font-semibold mb-6">Our Mission</h2>
              <p className="text-xl text-rise-sky leading-relaxed">
                Empower clients to live boldly and generously through exceptional and relational wealth management.
              </p>
            </div>
            <div className="relative">
              <div className="absolute -left-4 top-0 w-1 h-20 bg-gradient-to-b from-rise-gold to-transparent"></div>
              <h2 className="font-display text-4xl font-semibold mb-6">Our Vision</h2>
              <p className="text-xl text-rise-sky leading-relaxed">
                Inspire intergenerational stewardship in our clients and communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 bg-rise-cream relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-rise-navy mb-4">
              Core Values
            </h2>
            <p className="text-lg text-rise-slate">The principles that guide everything we do.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Excellence', desc: 'Commit to giving the utmost effort, always.', color: 'from-rise-navy to-rise-blue' },
              { title: 'Partnership', desc: 'Build relationships now and for the future.', color: 'from-rise-blue to-rise-sky' },
              { title: 'Stewardship', desc: 'Diligent management of all entrusted to us.', color: 'from-rise-sky to-rise-blue' },
              { title: 'Service', desc: 'Serve our clients more so they can do less.', color: 'from-rise-gold to-yellow-500' },
            ].map((value, i) => (
              <div key={i} className="group relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${value.color} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                <div className="relative p-8 bg-white rounded-2xl border border-rise-navy/5 group-hover:border-transparent group-hover:text-white transition-all duration-500 h-full">
                  <h3 className="font-display text-2xl font-semibold text-rise-navy group-hover:text-white mb-4 transition-colors">{value.title}</h3>
                  <p className="text-rise-slate group-hover:text-white/90 transition-colors">{value.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16">
            <div>
              <h2 className="font-display text-4xl md:text-5xl font-semibold text-rise-navy mb-4">
                Our Services
              </h2>
              <p className="text-lg text-rise-slate max-w-xl">
                Comprehensive wealth management tailored to your unique situation and goals.
              </p>
            </div>
            <Link 
              href="/services" 
              className="inline-flex items-center gap-2 text-rise-navy font-medium hover:text-rise-blue transition-colors group"
            >
              View all services
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: 'Financial Planning',
                desc: 'We believe money is a tool to accomplish your purpose. Our holistic approach addresses your "big picture" and charts a course to help you get there.',
                features: ['Retirement Planning', 'Tax Strategy', 'Estate Planning', 'Insurance Analysis'],
              },
              {
                icon: Briefcase,
                title: 'Investment Management',
                desc: 'Portfolio management is a core component of our service. We help quantify risk and build efficient portfolios for your unique circumstances.',
                features: ['Stocks, Bonds & ETFs', 'Alternative Investments', 'BRI Portfolios', 'Risk Analysis'],
              },
              {
                icon: Building,
                title: 'Business Consulting',
                desc: 'From business planning to succession, we help business owners navigate complex decisions and protect what they\'ve built.',
                features: ['Business Planning', 'Exit Strategy', 'Cash Flow Forecasting', 'Risk Management'],
              },
            ].map((service, i) => (
              <div 
                key={i} 
                className="group p-8 bg-rise-cream/30 rounded-2xl border border-rise-navy/5 hover:bg-white hover:shadow-2xl hover:shadow-rise-navy/10 hover:border-transparent transition-all duration-500"
              >
                <div className="w-16 h-16 rounded-2xl bg-rise-navy flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-display text-2xl font-semibold text-rise-navy mb-4">{service.title}</h3>
                <p className="text-rise-slate mb-6 leading-relaxed">{service.desc}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-rise-slate">
                      <div className="w-1.5 h-1.5 bg-rise-gold rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-rise-navy via-rise-blue to-rise-navy relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rise-gold/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-white mb-6">
            Ready to Rise?
          </h2>
          <p className="text-xl text-rise-sky mb-10 max-w-2xl mx-auto">
            Schedule a complimentary consultation to discuss your financial goals and discover how we can help you live boldly and generously.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-10 py-5 text-lg font-medium text-rise-navy bg-white rounded-full hover:bg-rise-cream transition-all duration-300 shadow-2xl hover:shadow-white/20 hover:-translate-y-1 group"
          >
            Book Your Free Consultation
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  )
}
