import Link from 'next/link'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
}

function renderContent(text: string) {
  // Replace "/contact" mentions with a clickable link
  const parts = text.split(/(\/contact)/g)
  return parts.map((part, i) => {
    if (part === '/contact') {
      return (
        <Link
          key={i}
          href="/contact"
          className="text-rise-blue hover:underline font-medium"
        >
          contact page
        </Link>
      )
    }
    return part
  })
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  if (role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] px-4 py-3 bg-rise-navy text-white rounded-2xl rounded-br-md text-sm leading-relaxed font-body">
          {content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-rise-navy/10 flex items-center justify-center flex-shrink-0">
        <span className="font-display text-rise-navy text-sm font-bold">R</span>
      </div>
      <div className="max-w-[85%] px-4 py-3 bg-white text-rise-navy rounded-2xl rounded-bl-md shadow-sm border border-rise-navy/5 text-sm leading-relaxed font-body">
        {renderContent(content)}
      </div>
    </div>
  )
}
