'use client'

import { useEffect, useState } from 'react'
import ScooplyLogo from '@/components/ScooplyLogo'
import { SPLASH_FADE_MS, getSplashHoldMs } from '@/lib/splashTiming'

export default function SplashOverlay() {
  const [phase, setPhase] = useState<'visible' | 'fading' | 'gone'>('visible')

  useEffect(() => {
    const hold = getSplashHoldMs()
    const fadeTimer = window.setTimeout(() => setPhase('fading'), hold)
    const doneTimer = window.setTimeout(() => setPhase('gone'), hold + SPLASH_FADE_MS)
    return () => {
      window.clearTimeout(fadeTimer)
      window.clearTimeout(doneTimer)
    }
  }, [])

  if (phase === 'gone') return null

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#D9D9D9] transition-opacity ease-out ${
        phase === 'fading' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ transitionDuration: `${SPLASH_FADE_MS}ms` }}
    >
      <div className="splash-breathe">
        <ScooplyLogo size={62} showWordmark={false} />
      </div>
    </div>
  )
}
