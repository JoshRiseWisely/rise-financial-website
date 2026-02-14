'use client'

import { MessageCircle, ArrowRight } from 'lucide-react'

export default function OpenChatButton() {
  return (
    <button
      onClick={() => window.dispatchEvent(new CustomEvent('open-chat-widget'))}
      className="inline-flex items-center gap-2 px-10 py-5 text-lg font-medium text-white bg-rise-navy rounded-full hover:bg-rise-blue transition-all duration-300 shadow-xl shadow-rise-navy/20 hover:shadow-rise-blue/30 hover:-translate-y-0.5 group"
    >
      <MessageCircle className="w-5 h-5" />
      Chat with Our Virtual Advisor
      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
    </button>
  )
}
