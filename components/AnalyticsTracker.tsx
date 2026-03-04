'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  let sid = sessionStorage.getItem('_rise_sid')
  if (!sid) {
    sid = crypto.randomUUID()
    sessionStorage.setItem('_rise_sid', sid)
  }
  return sid
}

export default function AnalyticsTracker() {
  const pathname = usePathname()
  const lastPath = useRef<string>('')

  useEffect(() => {
    // Avoid double-tracking the same path
    if (pathname === lastPath.current) return
    lastPath.current = pathname

    const sessionId = getSessionId()

    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: pathname,
        referrer: document.referrer || undefined,
        sessionId,
      }),
    }).catch(() => {}) // Silent fail — never block navigation
  }, [pathname])

  return null
}
