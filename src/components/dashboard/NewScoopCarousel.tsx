'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Post } from '@/lib/types'
import type { PostReaction } from '@/lib/actions'
import FeaturedScoopCard from './FeaturedScoopCard'

interface NewScoopCarouselProps {
  posts: Post[]
  reactions?: Record<string, PostReaction>
}

export default function NewScoopCarousel({ posts, reactions }: NewScoopCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)

  const updateBounds = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setCanPrev(el.scrollLeft > 4)
    setCanNext(el.scrollLeft < max - 4)
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    updateBounds()
    el.addEventListener('scroll', updateBounds, { passive: true })
    window.addEventListener('resize', updateBounds)
    return () => {
      el.removeEventListener('scroll', updateBounds)
      window.removeEventListener('resize', updateBounds)
    }
  }, [updateBounds])

  const scrollByCard = useCallback((direction: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('[data-scoop-card]')
    const cardWidth = card?.offsetWidth ?? 320
    const gap = 20 // matches gap-5
    el.scrollBy({ left: direction * (cardWidth + gap), behavior: 'smooth' })
  }, [])

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="overflow-x-auto no-scrollbar snap-x snap-mandatory"
      >
        <div className="flex gap-5 w-max lg:w-full">
          {posts.map((post) => (
            <div
              key={post.id}
              data-scoop-card
              className="snap-start shrink-0 w-[72vw] max-w-[340px] sm:w-[58vw] lg:w-[calc((100%-1.25rem)/2)] lg:max-w-none"
            >
              <FeaturedScoopCard post={post} reaction={reactions?.[post.id] ?? null} />
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        aria-label="Previous"
        onClick={() => scrollByCard(-1)}
        className={`hidden lg:inline-flex items-center justify-center absolute -left-10 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full text-zinc-700 hover:text-zinc-900 transition-opacity ${
          canPrev ? 'opacity-100' : 'opacity-25 pointer-events-none'
        }`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={() => scrollByCard(1)}
        className={`hidden lg:inline-flex items-center justify-center absolute -right-10 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full text-zinc-700 hover:text-zinc-900 transition-opacity ${
          canNext ? 'opacity-100' : 'opacity-25 pointer-events-none'
        }`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" d="M9 5l7 7-7 7" strokeLinejoin="round" strokeWidth={2} />
        </svg>
      </button>
    </div>
  )
}
