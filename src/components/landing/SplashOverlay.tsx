'use client'

import { useEffect, useState } from 'react'
import ScooplyLogo from '@/components/ScooplyLogo'

const HOLD_MS = 1500
const FADE_MS = 600

export default function SplashOverlay() {
  const [phase, setPhase] = useState<'visible' | 'fading' | 'gone'>('visible')

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setPhase('fading'), HOLD_MS)
    const doneTimer = window.setTimeout(() => setPhase('gone'), HOLD_MS + FADE_MS)
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
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      <div className="splash-breathe">
        <ScooplyLogo size={29} />
      </div>
    </div>
  )
}
