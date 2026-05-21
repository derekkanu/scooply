'use client'

import { useState, useTransition, type MouseEvent } from 'react'
import { setPostReaction, type PostReaction } from '@/lib/actions'

interface ReactionButtonsProps {
  postId: string
  initialReaction: PostReaction | null
}

export default function ReactionButtons({ postId, initialReaction }: ReactionButtonsProps) {
  const [reaction, setReaction] = useState<PostReaction | null>(initialReaction)
  const [, startTransition] = useTransition()

  function handleClick(next: PostReaction) {
    return (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()
      const previous = reaction
      const resolved = previous === next ? null : next
      setReaction(resolved)
      startTransition(() => {
        void setPostReaction(postId, resolved).catch(() => setReaction(previous))
      })
    }
  }

  const liked = reaction === 'like'
  const disliked = reaction === 'dislike'

  return (
    <div className="inline-flex items-center gap-1">
      <button
        type="button"
        onClick={handleClick('like')}
        aria-label={liked ? 'Remove thumbs up' : 'Thumbs up'}
        aria-pressed={liked}
        className={`w-8 h-8 rounded-full inline-flex items-center justify-center transition-colors ${
          liked
            ? 'bg-emerald-500/15 text-emerald-600'
            : 'text-zinc-500 hover:text-zinc-900 hover:bg-white/40'
        }`}
      >
        {liked ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M2 10.5A1.5 1.5 0 0 1 3.5 9H6v12H3.5A1.5 1.5 0 0 1 2 19.5v-9Zm6 .5 4.2-7.3a1.5 1.5 0 0 1 2.8.6V9h4.6a2 2 0 0 1 1.98 2.3l-1.3 8a2 2 0 0 1-1.98 1.7H8V11Z" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 10v10M7 10l3.6-6.3a1.5 1.5 0 0 1 2.8.6V9h4.6a2 2 0 0 1 1.98 2.3l-1.3 8a2 2 0 0 1-1.98 1.7H7M7 10H4.5A1.5 1.5 0 0 0 3 11.5v7A1.5 1.5 0 0 0 4.5 20H7" />
          </svg>
        )}
      </button>
      <button
        type="button"
        onClick={handleClick('dislike')}
        aria-label={disliked ? 'Remove thumbs down' : 'Thumbs down'}
        aria-pressed={disliked}
        className={`w-8 h-8 rounded-full inline-flex items-center justify-center transition-colors ${
          disliked
            ? 'bg-rose-500/15 text-rose-600'
            : 'text-zinc-500 hover:text-zinc-900 hover:bg-white/40'
        }`}
      >
        {disliked ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M22 13.5A1.5 1.5 0 0 1 20.5 15H18V3h2.5A1.5 1.5 0 0 1 22 4.5v9Zm-6-.5-4.2 7.3a1.5 1.5 0 0 1-2.8-.6V15H4.4a2 2 0 0 1-1.98-2.3l1.3-8A2 2 0 0 1 5.7 3H16v10Z" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 14V4M17 14l-3.6 6.3a1.5 1.5 0 0 1-2.8-.6V15H6a2 2 0 0 1-1.98-2.3l1.3-8A2 2 0 0 1 7.3 3H17M17 14h2.5A1.5 1.5 0 0 0 21 12.5v-7A1.5 1.5 0 0 0 19.5 4H17" />
          </svg>
        )}
      </button>
    </div>
  )
}
