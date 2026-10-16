'use client'

import { useTransition, useState, type MouseEvent } from 'react'
import { toggleSavedPost } from '@/lib/actions'
import { Bookmark } from '@/components/ui/icons'

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
      className={`shrink-0 w-8 h-8 rounded-full inline-flex items-center justify-center transition-colors duration-200 ease-soft ${
        saved ? 'bg-accent-soft text-accent-ink' : 'text-ink-3 hover:text-ink hover:bg-ink/5'
      }`}
    >
      <Bookmark size={16} filled={saved} />
    </button>
  )
}
