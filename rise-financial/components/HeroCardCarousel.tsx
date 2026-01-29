'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, TrendingUp, Shield, Heart, Umbrella, LineChart, Users, Gift } from 'lucide-react'

const cards = [
  {
    items: [
      { icon: TrendingUp, label: 'Portfolio Growth', value: 'Optimized', color: 'bg-rise-navy/10', iconColor: 'text-rise-navy' },
      { icon: Shield, label: 'Risk Management', value: 'Protected', color: 'bg-rise-gold/20', iconColor: 'text-rise-gold' },
      { icon: Heart, label: 'Legacy Planning', value: 'Secured', color: 'bg-rise-blue/10', iconColor: 'text-rise-blue' },
    ]
  },
  {
    items: [
      { icon: Umbrella, label: 'Long-Term Care', value: 'Covered', color: 'bg-rise-blue/10', iconColor: 'text-rise-blue' },
      { icon: Shield, label: 'Life Insurance', value: 'Protected', color: 'bg-rise-gold/20', iconColor: 'text-rise-gold' },
      { icon: Heart, label: 'Peace of Mind', value: 'Secured', color: 'bg-rise-navy/10', iconColor: 'text-rise-navy' },
    ],
    title: 'Insurance'
  },
  {
    items: [
      { icon: LineChart, label: 'Growth Strategies', value: 'Tailored', color: 'bg-rise-navy/10', iconColor: 'text-rise-navy' },
      { icon: Shield, label: 'Wealth Protection', value: 'Prioritized', color: 'bg-rise-gold/20', iconColor: 'text-rise-gold' },
      { icon: TrendingUp, label: 'Portfolio Management', value: 'Optimized', color: 'bg-rise-blue/10', iconColor: 'text-rise-blue' },
    ],
    title: 'Investments'
  },
  {
    items: [
      { icon: Users, label: 'Family Consulting', value: 'Guided', color: 'bg-rise-blue/10', iconColor: 'text-rise-blue' },
      { icon: Heart, label: 'Estate Strategy', value: 'Planned', color: 'bg-rise-gold/20', iconColor: 'text-rise-gold' },
      { icon: Shield, label: 'Finishing Well', value: 'Secured', color: 'bg-rise-navy/10', iconColor: 'text-rise-navy' },
    ],
    title: 'Legacy Planning'
  },
  {
    items: [
      { icon: Gift, label: 'Charitable Giving', value: 'Maximized', color: 'bg-rise-gold/20', iconColor: 'text-rise-gold' },
      { icon: Heart, label: 'Donor-Advised Funds', value: 'Structured', color: 'bg-rise-blue/10', iconColor: 'text-rise-blue' },
      { icon: TrendingUp, label: 'Generous Retirement', value: 'Designed', color: 'bg-rise-navy/10', iconColor: 'text-rise-navy' },
    ],
    title: 'Generosity'
  },
]

export default function HeroCardCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [direction, setDirection] = useState<'left' | 'right'>('right')

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return
    
    const interval = setInterval(() => {
      setDirection('right')
      setCurrentIndex((prev) => (prev + 1) % cards.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToPrevious = () => {
    setIsAutoPlaying(false)
    setDirection('left')
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length)
  }

  const goToNext = () => {
    setIsAutoPlaying(false)
    setDirection('right')
    setCurrentIndex((prev) => (prev + 1) % cards.length)
  }

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false)
    setDirection(index > currentIndex ? 'right' : 'left')
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
        
        {/* Card content with animation */}
        <div className="relative p-8 flex flex-col justify-center h-full">
          {cards.map((card, cardIndex) => (
            <div
              key={cardIndex}
              className={`absolute inset-8 flex flex-col justify-center transition-all duration-500 ease-in-out ${
                cardIndex === currentIndex 
                  ? 'opacity-100 translate-x-0' 
                  : cardIndex < currentIndex || (currentIndex === 0 && cardIndex === cards.length - 1)
                    ? 'opacity-0 -translate-x-full'
                    : 'opacity-0 translate-x-full'
              }`}
            >
              <div className="space-y-6">
                {card.items.map((item, i) => (
                  <div 
                    key={i} 
                    className="flex items-center gap-4"
                    style={{ 
                      transitionDelay: cardIndex === currentIndex ? `${i * 100}ms` : '0ms',
                    }}
                  >
                    <div className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center transition-transform duration-300 hover:scale-110`}>
                      <item.icon className={`w-8 h-8 ${item.iconColor}`} />
                    </div>
                    <div>
                      <p className="text-sm text-rise-slate">{item.label}</p>
                      <p className="font-display text-2xl font-semibold text-rise-navy">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
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
          {cards.map((_, index) => (
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
