'use client'

import { useEffect, useRef, useState } from 'react'
import Illustration from '@/components/illustrations/Illustration'
import type { SpriteId } from '@/components/illustrations/sprites'

const STEPS: { numeral: string; title: string; body: string; art: SpriteId; from: string; to: string }[] = [
  {
    numeral: 'i.',
    title: 'Tell us your level',
    body: 'Beginner, intermediate or advanced. Every story is matched to the depth you want.',
    art: 'book',
    from: 'you',
    to: 'level',
  },
  {
    numeral: 'ii.',
    title: 'Pick what you’re into',
    body: 'Design, dev, research, music. Your interests decide what reaches the front page.',
    art: 'magnifier',
    from: 'level',
    to: 'topics',
  },
  {
    numeral: 'iii.',
    title: 'We watch every source',
    body: 'X, LinkedIn, YouTube, TikTok, Instagram and the blogs, read for you in one place.',
    art: 'binoculars',
    from: 'topics',
    to: 'sources',
  },
  {
    numeral: 'iv.',
    title: 'Read your scoop',
    body: 'A short preview first, then straight to the original post when you want more.',
    art: 'paper',
    from: 'sources',
    to: 'you',
  },
]

/**
 * Process steps on the left scroll past a pinned panel on the right. The step nearest the
 * middle of the screen is in ink; the rest fade back, and the panel swaps its illustration.
 */
export default function HowItWorks() {
  const [active, setActive] = useState(0)
  const refs = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step))
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    refs.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-16">
      <ol className="flex flex-col gap-12 lg:gap-0 lg:py-[22vh]">
        {STEPS.map((s, i) => (
          <li
            key={s.numeral}
            ref={(el) => {
              refs.current[i] = el
            }}
            data-step={i}
            data-from={s.from}
            data-to={s.to}
            data-numeral={s.numeral}
            className={`transition-opacity duration-500 ease-soft lg:flex lg:min-h-[38vh] lg:flex-col lg:justify-center ${
              i === active ? 'opacity-100' : 'lg:opacity-30'
            }`}
          >
            <Illustration name={s.art} size={140} className="mb-4 lg:hidden" />
            <p className="font-display text-[15px] text-ink">{s.numeral}</p>
            <h3 className="mt-3 font-display text-[28px] leading-tight text-ink">{s.title}</h3>
            <p className="mt-2 max-w-[34ch] text-[15px] leading-relaxed text-ink-3">{s.body}</p>
          </li>
        ))}
      </ol>

      <div className="hidden lg:block">
        <div className="sticky top-[14vh] flex aspect-square w-full flex-col items-center justify-center rounded-[18px] bg-sky">
          <div className="relative w-[64%]">
            {STEPS.map((s, i) => (
              <div
                key={s.art}
                aria-hidden={i !== active}
                className={`transition-opacity duration-500 ease-soft ${i === 0 ? 'relative' : 'absolute inset-0'} ${
                  i === active ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <Illustration name={s.art} still={i !== active} />
              </div>
            ))}
          </div>
          <div data-step-caption className="mt-6 flex w-[78%] items-center gap-3 font-display text-[15px] text-[var(--sc-sky-ink)]/70">
            <span>{STEPS[active].from}.</span>
            <span aria-hidden className="h-px flex-1 bg-[var(--sc-sky-ink)]/30" />
            <span className="text-[var(--sc-sky-ink)]">{STEPS[active].numeral}</span>
            <span aria-hidden className="h-px flex-1 bg-[var(--sc-sky-ink)]/30" />
            <span>{STEPS[active].to}.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
