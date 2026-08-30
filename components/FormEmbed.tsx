'use client'

import { useEffect, useRef, useState } from 'react'
import { ExternalLink } from 'lucide-react'

type Props = {
  /** 123FormBuilder form id, e.g. '6625454' */
  formId: string
  title: string
  /** Starting height in px; grows automatically if the form reports its size */
  minHeight?: number
}

/**
 * Embeds a 123FormBuilder form in an iframe.
 *
 * We deliberately keep these forms on 123FormBuilder rather than rebuilding them:
 * they collect SSNs and bank account details, and that data should not touch our
 * infrastructure. See the ACH and KYC pages for context.
 */
export default function FormEmbed({ formId, title, minHeight = 1100 }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState(minHeight)

  useEffect(() => {
    // 123FormBuilder posts its rendered height so the iframe can grow with the form
    function onMessage(event: MessageEvent) {
      if (!event.origin.endsWith('123formbuilder.com')) return

      const raw = event.data
      let next: number | null = null

      if (typeof raw === 'number') {
        next = raw
      } else if (typeof raw === 'string') {
        const match = raw.match(/(\d{3,5})/)
        if (match) next = parseInt(match[1], 10)
      } else if (raw && typeof raw === 'object') {
        const value = (raw as Record<string, unknown>).height ?? (raw as Record<string, unknown>).scrollHeight
        if (typeof value === 'number') next = value
        else if (typeof value === 'string') next = parseInt(value, 10)
      }

      if (next && Number.isFinite(next) && next > 200) {
        setHeight(Math.max(minHeight, next + 40))
      }
    }

    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [minHeight])

  const formUrl = `https://form.123formbuilder.com/${formId}/`

  return (
    <div>
      <div className="rounded-2xl overflow-hidden bg-white border border-rise-navy/10 shadow-lg shadow-rise-navy/5">
        <iframe
          ref={iframeRef}
          src={formUrl}
          title={title}
          style={{ height: `${height}px` }}
          className="w-full block border-0"
          loading="lazy"
        />
      </div>

      <p className="mt-5 text-sm text-rise-slate text-center">
        Trouble with the form above?{' '}
        <a
          href={formUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-rise-navy font-medium underline underline-offset-4 hover:text-rise-blue transition-colors"
        >
          Open it in a new tab
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </p>
    </div>
  )
}
