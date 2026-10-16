'use client'

import { useState, useTransition, type MouseEvent } from 'react'
import { setPostReaction, type PostReaction } from '@/lib/actions'
import { ThumbDown, ThumbUp } from '@/components/ui/icons'

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
        className={`w-8 h-8 rounded-full inline-flex items-center justify-center transition-colors duration-200 ease-soft ${
          liked
            ? 'bg-positive-soft text-positive'
            : 'text-ink-3 hover:text-ink hover:bg-ink/5'
        }`}
      >
        <ThumbUp size={16} filled={liked} />
      </button>
      <button
        type="button"
        onClick={handleClick('dislike')}
        aria-label={disliked ? 'Remove thumbs down' : 'Thumbs down'}
        aria-pressed={disliked}
        className={`w-8 h-8 rounded-full inline-flex items-center justify-center transition-colors duration-200 ease-soft ${
          disliked
            ? 'bg-negative-soft text-negative'
            : 'text-ink-3 hover:text-ink hover:bg-ink/5'
        }`}
      >
        <ThumbDown size={16} filled={disliked} />
      </button>
    </div>
  )
}
