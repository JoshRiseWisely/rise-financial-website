'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, TrendingUp, Shield, Heart, Umbrella, LineChart, Users, Gift, CheckCircle, Sparkles, Target } from 'lucide-react'

export default function HeroCardCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const totalCards = 5

  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalCards)
    }, 4000)
    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToPrevious = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev - 1 + totalCards) % totalCards)
  }

  const goToNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % totalCards)
  }

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false)
    setCurrentIndex(index)
  }

  return (
    <div 
      className="relative aspect-square max-w-lg ml-auto"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Layered geometric shapes */}
      <div className="absolute inset-0 bg-gradient-to-br from-rise-navy to-rise-blue rounded-3xl transform rotate-3 opacity-10"></div>
      <div className="absolute inset-4 bg-gradient-to-br from-rise-blue to-rise-sky rounded-3xl transform -rotate-2 opacity-20"></div>
      
      {/* Main card */}
      <div className="absolute inset-8 bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rise-cream to-white"></div>
        
        {/* Card 1: Original - Portfolio/Risk/Legacy */}
        <div className={`absolute inset-0 p-8 flex flex-col justify-center transition-all duration-500 ${currentIndex === 0 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}`}>
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

        {/* Card 2: Insurance - Shield-focused design */}
        <div className={`absolute inset-0 p-8 flex flex-col justify-center transition-all duration-500 ${currentIndex === 1 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}`}>
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rise-gold/20 to-rise-gold/5 flex items-center justify-center mx-auto mb-6">
              <Umbrella className="w-10 h-10 text-rise-gold" />
            </div>
            <p className="text-sm uppercase tracking-widest text-rise-gold font-medium mb-2">Insurance</p>
            <p className="font-display text-3xl font-semibold text-rise-navy mb-6">Protection Planning</p>
            <div className="space-y-3">
              {['Long-Term Care Coverage', 'Life Insurance Strategy', 'Disability Protection'].map((item, i) => (
                <div key={i} className="flex items-center justify-center gap-2 text-rise-slate">
                  <CheckCircle className="w-4 h-4 text-rise-gold" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 3: Investments - Chart-style design */}
        <div className={`absolute inset-0 p-8 flex flex-col justify-center transition-all duration-500 ${currentIndex === 2 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}`}>
          <p className="text-sm uppercase tracking-widest text-rise-blue font-medium mb-4">Investments</p>
          <p className="font-display text-2xl font-semibold text-rise-navy mb-6">Grow & Protect Your Wealth</p>
          
          {/* Mini bar chart visualization */}
          <div className="flex items-end justify-between gap-3 h-32 mb-6">
            {[40, 65, 50, 80, 70, 90, 75].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-gradient-to-t from-rise-navy to-rise-blue rounded-t-lg transition-all duration-500"
                  style={{ height: `${height}%` }}
                ></div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between text-xs text-rise-slate">
            <span>Diversified</span>
            <span>Tax-Efficient</span>
            <span>Goal-Aligned</span>
          </div>
        </div>

        {/* Card 4: Legacy Planning - Family tree style */}
        <div className={`absolute inset-0 p-8 flex flex-col justify-center transition-all duration-500 ${currentIndex === 3 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}`}>
          <div className="text-center mb-6">
            <p className="text-sm uppercase tracking-widest text-rise-navy/50 font-medium mb-2">Legacy Planning</p>
            <p className="font-display text-2xl font-semibold text-rise-navy">Finish Well</p>
          </div>
          
          {/* Family tree visualization */}
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-rise-navy flex items-center justify-center mb-2">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div className="w-px h-6 bg-rise-navy/30"></div>
            <div className="flex items-center gap-8">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-rise-blue/20 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-rise-blue" />
                </div>
                <p className="text-xs text-rise-slate mt-2">Family</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-rise-gold/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-rise-gold" />
                </div>
                <p className="text-xs text-rise-slate mt-2">Values</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-rise-navy/10 flex items-center justify-center">
                  <Gift className="w-5 h-5 text-rise-navy" />
                </div>
                <p className="text-xs text-rise-slate mt-2">Giving</p>
              </div>
            </div>
          </div>
          
          <p className="text-center text-sm text-rise-slate mt-6">Consulting your family for intergenerational impact</p>
        </div>

        {/* Card 5: Generosity - Heart-centered design */}
        <div className={`absolute inset-0 p-6 flex flex-col justify-center transition-all duration-500 ${currentIndex === 4 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}`}>
          <div className="relative">
            {/* Decorative hearts */}
            <div className="absolute -top-2 -right-2 w-8 h-8 text-rise-gold/20">
              <Sparkles className="w-full h-full" />
            </div>
            
            <p className="text-sm uppercase tracking-widest text-rise-gold font-medium mb-2">Generosity</p>
            <p className="font-display text-2xl font-semibold text-rise-navy mb-6">Plan to Give</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-rise-gold/10 to-transparent rounded-2xl p-4">
                <Gift className="w-6 h-6 text-rise-gold mb-2" />
                <p className="text-sm font-medium text-rise-navy">Charitable Strategies</p>
              </div>
              <div className="bg-gradient-to-br from-rise-blue/10 to-transparent rounded-2xl p-4">
                <Heart className="w-6 h-6 text-rise-blue mb-2" />
                <p className="text-sm font-medium text-rise-navy">Donor-Advised Funds</p>
              </div>
              <div className="col-span-2 bg-gradient-to-br from-rise-navy/5 to-transparent rounded-2xl p-4 text-center">
                <p className="text-sm font-medium text-rise-navy">Build a Generous Retirement</p>
                <p className="text-xs text-rise-slate mt-1">Live boldly. Give generously.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 z-10"
          aria-label="Previous card"
        >
          <ChevronLeft className="w-5 h-5 text-rise-navy" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 z-10"
          aria-label="Next card"
        >
          <ChevronRight className="w-5 h-5 text-rise-navy" />
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          {Array.from({ length: totalCards }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex 
                  ? 'w-8 h-2 bg-rise-navy' 
                  : 'w-2 h-2 bg-rise-navy/30 hover:bg-rise-navy/50'
              }`}
              aria-label={`Go to card ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Accent dot */}
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-rise-gold rounded-full opacity-80"></div>
    </div>
  )
}
