'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { getSplashHoldMs } from '@/lib/splashTiming'

interface LandingRevealProps {
  children: ReactNode
  delay?: number
  className?: string
}

export default function LandingReveal({ children, delay = 0, className = '' }: LandingRevealProps) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const start = getSplashHoldMs() + delay
    const t = window.setTimeout(() => setReady(true), start)
    return () => window.clearTimeout(t)
  }, [delay])

  return (
    <div
      className={className}
      style={{
        opacity: ready ? 1 : 0,
        transform: ready ? 'none' : 'translate3d(0, 10px, 0)',
        transition: 'opacity var(--sc-dur-calm) var(--ease-soft), transform var(--sc-dur-calm) var(--ease-soft)',
      }}
    >
      {children}
    </div>
  )
}
