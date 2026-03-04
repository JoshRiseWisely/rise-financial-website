'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'
import ChatMessage from './ChatMessage'
import TypingIndicator from './TypingIndicator'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Welcome to Rise Financial Partners! I'm here to help you explore whether we might be a good fit for your financial needs. What brings you here today?",
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Listen for custom event from homepage CTA
  useEffect(() => {
    const handleOpen = () => setIsOpen(true)
    window.addEventListener('open-chat-widget', handleOpen)
    return () => window.removeEventListener('open-chat-widget', handleOpen)
  }, [])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  // Abort stream on close
  const handleClose = useCallback(() => {
    setIsOpen(false)
    abortControllerRef.current?.abort()
  }, [])

  const sendMessage = async () => {
    if (!input.trim() || isStreaming) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsStreaming(true)
    setError(null)

    const apiMessages = [...messages, userMessage].map(({ role, content }) => ({
      role,
      content,
    }))

    try {
      abortControllerRef.current = new AbortController()

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Something went wrong')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      const assistantId = (Date.now() + 1).toString()
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: 'assistant', content: '' },
      ])

      if (reader) {
        let buffer = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') break
              try {
                const parsed = JSON.parse(data)
                if (parsed.text) {
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantId
                        ? { ...m, content: m.content + parsed.text }
                        : m
                    )
                  )
                }
              } catch {
                // skip malformed chunks
              }
            }
          }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      setError(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      )
    } finally {
      setIsStreaming(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => (isOpen ? handleClose() : setIsOpen(true))}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
          isOpen
            ? 'bg-rise-slate hover:bg-rise-navy'
            : 'bg-rise-navy hover:bg-rise-blue'
        }`}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6 text-white" />
            {/* Gold pulse ring */}
            <span className="absolute inset-0 rounded-full border-2 border-rise-gold/60 animate-ping" />
          </>
        )}
      </button>

      {/* Chat Panel */}
      <div
        className={`fixed z-50 flex flex-col bg-white shadow-2xl shadow-rise-navy/20 transition-all duration-300 ${
          isOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none'
        } inset-0 sm:inset-auto sm:bottom-24 sm:right-6 sm:w-[420px] sm:h-[600px] sm:rounded-2xl`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-rise-navy text-white sm:rounded-t-2xl">
          <div>
            <h3 className="font-display text-lg font-semibold">
              Rise Financial Partners
            </h3>
            <p className="text-rise-sky text-xs">
              See if we&apos;re a fit for you
            </p>
          </div>
          <button
            onClick={handleClose}
            className="sm:hidden w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="Close chat"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-rise-cream/30">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
          ))}
          {isStreaming &&
            messages[messages.length - 1]?.content === '' && (
              <TypingIndicator />
            )}
          <div ref={messagesEndRef} />
        </div>

        {/* Error */}
        {error && (
          <div className="mx-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-700 font-medium hover:text-red-900 underline ml-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Disclaimer */}
        <div className="px-4 pt-2">
          <p className="text-[10px] text-rise-slate/50 text-center leading-tight">
            For informational purposes only. Not financial advice. Rise
            Financial Partners LLC is a registered investment adviser.
          </p>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-rise-navy/10">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              disabled={isStreaming}
              className="flex-1 px-4 py-3 bg-rise-cream/50 border border-rise-navy/10 rounded-xl text-sm text-rise-navy placeholder:text-rise-slate/40 focus:outline-none focus:ring-2 focus:ring-rise-blue/50 disabled:opacity-50 font-body"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isStreaming}
              className="w-11 h-11 rounded-xl bg-rise-navy flex items-center justify-center hover:bg-rise-blue transition-colors disabled:opacity-30 disabled:hover:bg-rise-navy flex-shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
