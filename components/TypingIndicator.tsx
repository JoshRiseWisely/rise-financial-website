export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-rise-navy/10 flex items-center justify-center flex-shrink-0">
        <span className="font-display text-rise-navy text-sm font-bold">R</span>
      </div>
      <div className="flex items-center gap-1.5 px-4 py-3 bg-white rounded-2xl rounded-bl-md shadow-sm border border-rise-navy/5">
        <div className="w-2 h-2 bg-rise-navy/30 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="w-2 h-2 bg-rise-navy/30 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="w-2 h-2 bg-rise-navy/30 rounded-full animate-bounce" />
      </div>
    </div>
  )
}
