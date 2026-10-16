'use client'

import { useCallback, useState, type MouseEvent } from 'react'
import type { Post } from '@/lib/types'
import PreviewSheet from './PreviewSheet'
import { Sparkle } from '@/components/ui/icons'

/** Opens the preview sheet for a scoop without following the card's link. */
export default function PreviewButton({ post }: { post: Post }) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    e.stopPropagation()
    setOpen(true)
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-ink/[0.05] px-3 text-[13px] font-medium text-ink transition-colors duration-200 ease-soft hover:bg-ink/10"
      >
        <Sparkle size={13} className="text-ink-2" />
        Preview
      </button>
      <PreviewSheet post={post} open={open} onClose={close} />
    </>
  )
}
