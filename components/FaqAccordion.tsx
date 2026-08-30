'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'

export type FaqItem = {
  question: string
  answer: string[]
}

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="divide-y divide-rise-navy/10 border-y border-rise-navy/10">
      {items.map((item, i) => {
        const isOpen = openIndex === i
        const panelId = `faq-panel-${i}`
        const buttonId = `faq-button-${i}`

        return (
          <div key={i}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-start justify-between gap-6 text-left py-6 group"
              >
                <span className="font-display text-xl md:text-2xl font-semibold text-rise-navy group-hover:text-rise-blue transition-colors">
                  {item.question}
                </span>
                <span
                  className={`flex-shrink-0 mt-1 w-8 h-8 rounded-full border border-rise-navy/15 flex items-center justify-center text-rise-navy transition-all duration-300 group-hover:border-rise-gold group-hover:text-rise-gold ${
                    isOpen ? 'rotate-45 bg-rise-navy/5' : ''
                  }`}
                >
                  <Plus className="w-4 h-4" />
                </span>
              </button>
            </h3>

            {/* Grid-rows transition animates to the content's natural height */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <div className="pb-7 pr-14 space-y-4">
                  {item.answer.map((para, p) => (
                    <p key={p} className="text-rise-slate leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
