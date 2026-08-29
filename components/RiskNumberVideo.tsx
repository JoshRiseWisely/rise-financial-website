'use client'

import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX, Film } from 'lucide-react'

// Hosted in the public Supabase "media" bucket. Upload with:
//   ./scripts/upload-media.sh <file> videos/risk-number.mp4
// Override either URL with NEXT_PUBLIC_RISK_VIDEO_URL / NEXT_PUBLIC_RISK_VIDEO_POSTER_URL.
// Leave VIDEO_SRC empty to show the placeholder frame.
const VIDEO_SRC = process.env.NEXT_PUBLIC_RISK_VIDEO_URL || ''
const POSTER_SRC = process.env.NEXT_PUBLIC_RISK_VIDEO_POSTER_URL || ''

export default function RiskNumberVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  // Browsers only permit autoplay while muted, so we start muted and let the viewer turn sound on.
  const [isMuted, setIsMuted] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    // Some browsers reject the autoplay promise even when muted; ignore it rather than throwing.
    video.play().catch(() => {})
  }, [])

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setIsMuted(video.muted)
  }

  if (!VIDEO_SRC) {
    return (
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden border-2 border-dashed border-white/20 bg-white/[0.04] backdrop-blur-sm flex items-center justify-center">
        <div className="text-center px-6">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center mx-auto mb-5">
            <Film className="w-7 h-7 text-rise-gold" />
          </div>
          <p className="font-display text-2xl text-white mb-2">Video coming soon</p>
          <p className="text-sm text-rise-sky max-w-sm mx-auto leading-relaxed">
            Upload with{' '}
            <code className="text-rise-gold">./scripts/upload-media.sh</code>, then set{' '}
            <code className="text-rise-gold">NEXT_PUBLIC_RISK_VIDEO_URL</code> to the public URL it prints.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl shadow-black/40 ring-1 ring-white/10">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        muted
        playsInline
        controls
        preload="metadata"
        poster={POSTER_SRC || undefined}
      >
        <source src={VIDEO_SRC} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <button
        type="button"
        onClick={toggleMute}
        aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        className="absolute top-4 right-4 h-11 px-4 gap-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-colors duration-200"
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        <span className="text-sm font-medium">{isMuted ? 'Tap for sound' : 'Sound on'}</span>
      </button>
    </div>
  )
}
