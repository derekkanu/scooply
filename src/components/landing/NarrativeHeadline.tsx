'use client'

import { Fragment, useEffect, useState } from 'react'

/**
 * One word for each thing Scooply does for a reader — each completes "AI is more useful
 * when you're…": the daily feed (informed, current), early stories (ahead), the preview
 * and saves (prepared), stories at your level (fluent), and where that leads (confident).
 */
const ENDINGS = ['informed.', 'current.', 'ahead.', 'prepared.', 'fluent.', 'confident.']

const HOLD_MS = 3400
const WORD_MS = 90

/**
 * The landing narrative: one sentence whose last word rotates, printing in from pale to ink.
 * Under reduced motion the first word simply stays. The min-heights keep the hero from
 * jumping as words of different lengths swap in.
 */
export default function NarrativeHeadline({ className = '' }: { className?: string }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const words = ENDINGS[index].split(' ').length
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % ENDINGS.length), HOLD_MS + words * WORD_MS)
    return () => window.clearTimeout(t)
  }, [index])

  const words = ENDINGS[index].split(' ')

  return (
    <h1
      className={`min-h-[4.4em] font-display text-[2.75rem] leading-[1.1] text-ink sm:min-h-[3.4em] sm:text-[3.75rem] lg:min-h-[3.4em] lg:text-[4.5rem] lg:leading-[1.12] ${className}`}
    >
      AI is more useful when you&apos;re{' '}
      {/* the word keeps a line of its own, so the headline holds its shape as it changes */}
      <span key={index} aria-live="polite" className="block" data-endings={JSON.stringify(ENDINGS)}>
        {words.map((w, i) => (
          <Fragment key={`${index}-${i}`}>
            <span className="sc-word-in inline-block" style={{ '--sc-delay': `${i * WORD_MS}ms` } as React.CSSProperties}>
              {w}
            </span>
            {i < words.length - 1 ? ' ' : ''}
          </Fragment>
        ))}
      </span>
    </h1>
  )
}
