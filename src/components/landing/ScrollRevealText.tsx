'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * A sentence that prints itself as you scroll: words turn from pale to ink in reading order,
 * tied to the block's position in the viewport. Fully inked under reduced motion.
 */
export default function ScrollRevealText({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const words = text.split(' ')
  const [inked, setInked] = useState(words.length)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    const update = () => {
      frame = 0
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      // starts when the block enters the lower fifth, completes as it reaches the upper third
      const progress = (vh * 0.85 - rect.top) / (vh * 0.85 - vh * 0.3 + rect.height * 0.5)
      setInked(Math.round(Math.min(1, Math.max(0, progress)) * words.length))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [words.length])

  return (
    <p ref={ref} className={className} data-scroll-reveal>
      {words.map((w, i) => (
        <span key={i} className={`transition-colors duration-300 ease-soft ${i < inked ? 'text-ink' : 'text-ink-4/60'}`}>
          {w}{' '}
        </span>
      ))}
    </p>
  )
}
