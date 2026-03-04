'use client'

import { useState } from 'react'
import { Mail, MapPin, Phone, Send, CheckCircle } from 'lucide-react'

export default function ContactPage() {
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
    // For now, simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState(prev => ({
      ...prev,
      [e.target.name]: e.target.value
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
            We've received your information and will be in touch within one business day to schedule your consultation.
          </p>
          <a 
            href="/" 
            className="inline-flex items-center gap-2 px-6 py-3 text-white bg-rise-navy rounded-full hover:bg-rise-blue transition-colors"
          >
            Return Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 bg-rise-cream">
      {/* Hero */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rise-blue/5 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-rise-navy mb-6">
              Let's Start a Conversation
            </h1>
            <p className="text-lg text-rise-slate leading-relaxed">
              We'd love to learn about your financial goals and explore how Rise can help you achieve them. Schedule a complimentary consultation with our team.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <div className="bg-rise-navy text-white rounded-2xl p-8 sticky top-28">
                <h2 className="font-display text-2xl font-semibold mb-6">Get in Touch</h2>
                
                <div className="space-y-6 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-rise-sky/70 text-sm mb-1">Email</p>
                      <a href="mailto:info@RiseWisely.com" className="hover:text-rise-gold transition-colors">
                        info@RiseWisely.com
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
                      <span className="text-rise-sky/90">We'll review your information</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="w-6 h-6 bg-rise-gold text-rise-navy rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">2</span>
                      <span className="text-rise-sky/90">Schedule a discovery call</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="w-6 h-6 bg-rise-gold text-rise-navy rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">3</span>
                      <span className="text-rise-sky/90">Create your personalized plan</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 md:p-10 shadow-xl shadow-rise-navy/5">
                <h2 className="font-display text-2xl font-semibold text-rise-navy mb-8">Request a Consultation</h2>
                
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
                    Anything specific you'd like us to know?
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formState.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-rise-cream/50 border border-rise-navy/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-rise-blue/50 focus:border-transparent transition-all resize-none"
                    placeholder="Tell us about your goals, concerns, or questions..."
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
                      Request Consultation
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
