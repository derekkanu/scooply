'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { Post } from '@/lib/types'
import { SOURCE_LABEL } from '@/lib/sources'
import TrackedPostLink from '@/components/TrackedPostLink'
import PlatformIcon from '@/components/PlatformIcon'
import Illustration from '@/components/illustrations/Illustration'
import { buttonClasses } from '@/components/ui/Button'
import { ArrowUpRight, Close } from '@/components/ui/icons'

const EXIT_MS = 200 // matches --sc-dur-quick

interface PreviewSheetProps {
  post: Post
  open: boolean
  onClose: () => void
  /** AI summary. `null` shows the "Thinking…" orb while it loads. */
  summary?: string | null
}

/**
 * Click-to-preview: summarises a scoop, then hands off to the source platform.
 * Bottom sheet on mobile, centred card on desktop. Enters with opacity + 16px rise.
 * Portalled to <body>: cards animate with transforms, and a transformed ancestor would
 * otherwise trap this fixed layer inside the card. Everything behind it blurs away.
 */
export default function PreviewSheet({ post, open, onClose, summary }: PreviewSheetProps) {
  const [mounted, setMounted] = useState(open)
  const [prevOpen, setPrevOpen] = useState(open)
  const closeRef = useRef<HTMLButtonElement>(null)

  // Mount immediately on open; on close, stay mounted long enough to play the exit.
  if (open !== prevOpen) {
    setPrevOpen(open)
    if (open) setMounted(true)
  }
  const leaving = mounted && !open

  useEffect(() => {
    if (!leaving) return
    const t = window.setTimeout(() => setMounted(false), EXIT_MS)
    return () => window.clearTimeout(t)
  }, [leaving])

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!mounted) return null

  const loading = summary === null
  const body = summary ?? post.content
  const platform = post.source === 'blog' ? 'the blog' : SOURCE_LABEL[post.source]
  const motion = leaving ? 'sc-exit' : 'sc-reveal'

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close preview"
        onClick={onClose}
        className={`absolute inset-0 bg-canvas/45 backdrop-blur-xl backdrop-saturate-[0.85] ${motion}`}
        data-dir="none"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="sc-preview-title"
        className={`relative w-full sm:max-w-[520px] max-h-[88vh] overflow-y-auto rounded-t-sheet border border-ink/10 bg-surface-warm shadow-lift sm:rounded-[18px] ${motion}`}
        data-dir="up"
        style={{ '--sc-from-y': '16px' } as React.CSSProperties}
      >
        <div className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-line-strong sm:hidden" aria-hidden />

        <div className="px-6 pt-5 pb-6 sm:px-8 sm:pt-7 sm:pb-8">
          {/* byline, set like a scoop card: who posted it, where, and a way out */}
          <div className="flex items-center gap-3">
            <PlatformIcon source={post.source} size="sm" />
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-[13px] font-medium text-ink">{post.sourceHandle ?? '@scooply'}</p>
              <p className="truncate text-[13px] text-ink-4">
                Scoop preview · {SOURCE_LABEL[post.source]}
              </p>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-mr-2 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-ink/5 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              <Close size={16} />
            </button>
          </div>


          <h2 id="sc-preview-title" className="mt-5 font-display text-[26px] leading-[1.1] text-ink sm:text-[30px]">
            {post.title}
          </h2>

          {loading ? (
            <div className="flex flex-col items-center gap-3 py-10" aria-live="polite">
              <Illustration name="magnifier" size={120} />
              <p className="animate-breathe text-[12px] text-ink-3">Reading the story…</p>
            </div>
          ) : (
            <p className="sc-fade-out mt-4 max-h-[260px] overflow-hidden whitespace-pre-line text-[15px] leading-relaxed text-ink-2">{body}</p>
          )}

          {post.tags.length > 0 && (
            <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-ink-3">
              {post.tags.slice(0, 4).map((t) => (
                <span key={t}>#{t}</span>
              ))}
            </p>
          )}

          {/* hand-off: one line of context above a full-width action, so neither ever squeezes */}
          <div className="mt-6 border-t border-ink/10 pt-5">
            <p className="text-[13px] font-medium text-ink-2">Continue reading</p>
            <p className="mt-1 text-[14px] text-ink-3">You&apos;re leaving Scooply for {platform}.</p>
            <TrackedPostLink postId={post.id} href={post.sourceUrl} className={buttonClasses({ size: 'lg', className: 'mt-4 w-full' })}>
              Open on {platform}
              <ArrowUpRight size={15} />
            </TrackedPostLink>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
