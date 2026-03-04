'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Mail, Phone, MapPin, Linkedin, Send, CheckCircle, Shield, Heart, BookOpen, TrendingUp } from 'lucide-react'

export default function CKAJoshElmorePage() {
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    investableAssets: '',
    currentSituation: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // TODO: Integrate with your form backend (Formspree, custom API, etc.)
    await new Promise(resolve => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  if (isSubmitted) {
    return (
      <div className="pt-20 min-h-screen bg-rise-cream flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-display text-3xl font-semibold text-rise-navy mb-4">Thank You!</h1>
          <p className="text-rise-slate mb-8">
            Josh has received your request and will personally reach out within one business day to schedule your consultation.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 text-white bg-rise-navy rounded-full hover:bg-rise-blue transition-colors"
          >
            Visit Our Website
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 bg-rise-cream">
      {/* Hero Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rise-blue/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rise-gold/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Intro */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-rise-navy/5 rounded-full mb-6">
                <BookOpen className="w-4 h-4 text-rise-navy" />
                <span className="text-sm font-medium text-rise-navy">Certified Kingdom Advisor®</span>
              </div>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-rise-navy leading-[1.1] mb-4">
                Hi, I&apos;m Josh Elmore
                <span className="text-rise-blue">, CFP®</span>
              </h1>

              <p className="text-lg md:text-xl text-rise-slate leading-relaxed mb-6">
                Thanks for finding me through the Kingdom Advisors directory. I&apos;d love to learn about your financial goals and explore how faith-aligned financial planning can help you steward your resources with purpose.
              </p>

              <p className="text-rise-slate leading-relaxed mb-8">
                As a Certified Financial Planner™ and Certified Kingdom Advisor®, I help clients gain clarity and confidence over their financial picture — so they can focus on what matters most: their family, their business, and their calling.
              </p>

              <div className="flex flex-wrap gap-3">
                {['CERTIFIED FINANCIAL PLANNER™', 'CERTIFIED KINGDOM ADVISOR®', 'Portfolio Manager'].map((item, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-rise-navy/5 rounded-full text-sm text-rise-navy font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Right - Photo */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="aspect-[4/5] w-full max-w-sm relative rounded-2xl overflow-hidden shadow-2xl shadow-rise-navy/15">
                  <Image
                    src="/images/team/josh-elmore.jpg"
                    alt="Josh Elmore, CFP® CKA®"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                {/* Contact card overlay */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-lg border border-rise-navy/5">
                  <div className="space-y-2">
                    <a href="mailto:josh@risewisely.com" className="flex items-center gap-2 text-sm text-rise-slate hover:text-rise-navy transition-colors">
                      <Mail className="w-4 h-4" />
                      josh@risewisely.com
                    </a>
                    <a href="tel:941-841-4420" className="flex items-center gap-2 text-sm text-rise-slate hover:text-rise-navy transition-colors">
                      <Phone className="w-4 h-4" />
                      941-841-4420
                    </a>
                    <div className="flex items-center gap-2 text-sm text-rise-slate">
                      <MapPin className="w-4 h-4" />
                      Sarasota, FL
                    </div>
                    <a
                      href="https://www.linkedin.com/in/joshelmore24/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-rise-slate hover:text-rise-navy transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values-Aligned Approach */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-rise-navy mb-4">
              A Values-Driven Approach to Wealth
            </h2>
            <p className="text-lg text-rise-slate max-w-2xl mx-auto">
              At Rise Financial Partners, we believe money is a tool to accomplish your purpose. Here&apos;s what you can expect working with me.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Fee-Only Fiduciary', desc: 'No commissions, no hidden fees. I\'m legally bound to act in your best interest — always.' },
              { icon: Heart, title: 'Faith-Aligned Investing', desc: 'Biblically Responsible Investment portfolios that align your wealth with your values.' },
              { icon: TrendingUp, title: 'Comprehensive Planning', desc: 'Cash flow, insurance, retirement, tax, investments, and estate planning — all connected.' },
              { icon: BookOpen, title: 'Kingdom Stewardship', desc: 'Helping you steward your resources faithfully to provide for your family and give generously.' },
            ].map((item, i) => (
              <div
                key={i}
                className="group p-8 bg-rise-cream/50 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-rise-navy/5 transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-xl bg-rise-navy/10 flex items-center justify-center mb-6 group-hover:bg-rise-navy group-hover:scale-110 transition-all duration-300">
                  <item.icon className="w-7 h-7 text-rise-navy group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-display text-xl font-semibold text-rise-navy mb-3">{item.title}</h3>
                <p className="text-rise-slate leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-rise-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-rise-navy text-white rounded-2xl p-8 sticky top-28">
                <h2 className="font-display text-2xl font-semibold mb-2">Meet with Josh</h2>
                <p className="text-rise-sky/80 text-sm mb-8">
                  Request a complimentary consultation to discuss your goals and how I can help.
                </p>

                <div className="space-y-6 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-rise-sky/70 text-sm mb-1">Email</p>
                      <a href="mailto:josh@risewisely.com" className="hover:text-rise-gold transition-colors">
                        josh@risewisely.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-rise-sky/70 text-sm mb-1">Phone</p>
                      <a href="tel:941-841-4420" className="hover:text-rise-gold transition-colors">
                        941-841-4420
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-rise-sky/70 text-sm mb-1">Location</p>
                      <p>Sarasota, Florida</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <p className="text-sm text-rise-sky/70 mb-4">What happens next?</p>
                  <ol className="space-y-3 text-sm">
                    <li className="flex gap-3">
                      <span className="w-6 h-6 bg-rise-gold text-rise-navy rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">1</span>
                      <span className="text-rise-sky/90">Josh reviews your information</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="w-6 h-6 bg-rise-gold text-rise-navy rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">2</span>
                      <span className="text-rise-sky/90">Personal call to learn your story</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="w-6 h-6 bg-rise-gold text-rise-navy rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">3</span>
                      <span className="text-rise-sky/90">Custom plan tailored to your goals</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 md:p-10 shadow-xl shadow-rise-navy/5">
                <h2 className="font-display text-2xl font-semibold text-rise-navy mb-2">Request an Appointment with Josh</h2>
                <p className="text-rise-slate text-sm mb-8">Fill out the form below and Josh will personally follow up with you.</p>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-rise-navy mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      value={formState.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-rise-cream/50 border border-rise-navy/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-rise-blue/50 focus:border-transparent transition-all"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-rise-navy mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      value={formState.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-rise-cream/50 border border-rise-navy/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-rise-blue/50 focus:border-transparent transition-all"
                      placeholder="Smith"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-rise-navy mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formState.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-rise-cream/50 border border-rise-navy/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-rise-blue/50 focus:border-transparent transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-rise-navy mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formState.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-rise-cream/50 border border-rise-navy/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-rise-blue/50 focus:border-transparent transition-all"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="investableAssets" className="block text-sm font-medium text-rise-navy mb-2">
                      Investable Assets
                    </label>
                    <select
                      id="investableAssets"
                      name="investableAssets"
                      value={formState.investableAssets}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-rise-cream/50 border border-rise-navy/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-rise-blue/50 focus:border-transparent transition-all"
                    >
                      <option value="">Select range</option>
                      <option value="under-250k">Under $250,000</option>
                      <option value="250k-500k">$250,000 - $500,000</option>
                      <option value="500k-1m">$500,000 - $1,000,000</option>
                      <option value="1m-5m">$1,000,000 - $5,000,000</option>
                      <option value="5m-plus">$5,000,000+</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="currentSituation" className="block text-sm font-medium text-rise-navy mb-2">
                      Current Situation
                    </label>
                    <select
                      id="currentSituation"
                      name="currentSituation"
                      value={formState.currentSituation}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-rise-cream/50 border border-rise-navy/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-rise-blue/50 focus:border-transparent transition-all"
                    >
                      <option value="">Select one</option>
                      <option value="accumulating">Building Wealth</option>
                      <option value="pre-retirement">Preparing for Retirement</option>
                      <option value="retired">Currently Retired</option>
                      <option value="business-owner">Business Owner</option>
                      <option value="inheritance">Received Inheritance</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="mb-8">
                  <label htmlFor="message" className="block text-sm font-medium text-rise-navy mb-2">
                    What are you looking for help with?
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formState.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-rise-cream/50 border border-rise-navy/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-rise-blue/50 focus:border-transparent transition-all resize-none"
                    placeholder="Tell me about your goals, questions, or what prompted you to search the CKA directory..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-white bg-rise-navy rounded-xl hover:bg-rise-blue transition-all duration-300 shadow-lg shadow-rise-navy/20 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Request Appointment with Josh
                    </>
                  )}
                </button>

                <p className="mt-4 text-sm text-rise-slate text-center">
                  By submitting, you agree to our{' '}
                  <a href="/privacy" className="text-rise-blue hover:underline">Privacy Policy</a>.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
