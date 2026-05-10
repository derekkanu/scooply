'use client'

import { useTransition, useState, type MouseEvent } from 'react'
import { toggleSavedPost } from '@/lib/actions'

interface SaveScoopButtonProps {
  postId: string
  initialSaved: boolean
}

export default function SaveScoopButton({ postId, initialSaved }: SaveScoopButtonProps) {
  const [saved, setSaved] = useState(initialSaved)
  const [, startTransition] = useTransition()

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    e.stopPropagation()
    setSaved((s) => !s)
    startTransition(() => {
      void toggleSavedPost(postId).catch(() => setSaved((s) => !s))
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={saved ? 'Unsave scoop' : 'Save scoop'}
      aria-pressed={saved}
      className="shrink-0 w-9 h-9 rounded-full inline-flex items-center justify-center text-zinc-600 hover:text-zinc-900 hover:bg-white/40 transition-colors"
    >
      {saved ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M6 3.5A1.5 1.5 0 0 1 7.5 2h9A1.5 1.5 0 0 1 18 3.5V21l-6-3.5L6 21V3.5Z" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 3.5A1.5 1.5 0 0 1 7.5 2h9A1.5 1.5 0 0 1 18 3.5V21l-6-3.5L6 21V3.5Z" />
        </svg>
      )}
    </button>
  )
}
