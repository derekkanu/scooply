import Image from 'next/image'
import type { Post } from '@/lib/types'
import type { PostReaction } from '@/lib/actions'
import TrackedPostLink from '@/components/TrackedPostLink'
import PlatformIcon from '@/components/PlatformIcon'
import SaveScoopButton from '@/components/dashboard/SaveScoopButton'
import ReactionButtons from '@/components/dashboard/ReactionButtons'
import ListenButton from '@/components/dashboard/ListenButton'
import PreviewButton from './PreviewButton'
import { ArrowUpRight, Play } from '@/components/ui/icons'
import { SOURCE_LABEL } from '@/lib/sources'

// ── Scoop card ─────────────────────────────────────────────────────────────
// Every post is a clipping on cream paper with a hairline edge: a byline (the platform's icon
// keeps its brand color), a light display headline, then either the photo (video posts get a
// play mark) or the post's opening lines. The footer holds the reader's controls, or a quiet
// "Read the scoop" on display-only cards.

export type ScoopKind = 'image' | 'video' | 'text'

export function scoopKind(post: Post): ScoopKind {
  if (post.source === 'youtube' || post.source === 'tiktok') return post.imageUrl ? 'video' : 'text'
  return post.imageUrl ? 'image' : 'text'
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** "2026-10-12" → "Oct 12", without locale formatting (same on server and client). */
// Tiles on the wall vary their photo shape and type size by post, so the masonry never
// settles into a grid. Derived from the post id, so a post keeps its shape across renders.
const TILE_ASPECTS = ['aspect-[4/5]', 'aspect-square', 'aspect-[3/4]', 'aspect-[16/10]', 'aspect-[5/4]', 'aspect-[2/3]']

function seedOf(id: string) {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0
  return Math.abs(h)
}

function shortDate(iso: string) {
  const [, m, d] = iso.slice(0, 10).split('-').map(Number)
  return m && d ? `${MONTHS[m - 1]} ${d}` : ''
}

interface ScoopCardProps {
  post: Post
  saved?: boolean
  reaction?: PostReaction | null
  /**
   * wall: wide, one per row. tile: natural height for the masonry wall, with varied photo
   * shapes. featured: fixed-height, for the New scoop row and the hero strip.
   */
  size?: 'wall' | 'tile' | 'featured'
  /** false: display only (landing page) — no preview, reactions or save. */
  interactive?: boolean
  /** Issue number shown in the byline ("No. 03"), for runs of cards like the hero strip. */
  n?: number
  /** Fade in and out with the scroll (off for cards that move on their own, like the hero strip). */
  scroll?: boolean
}

export default function ScoopCard({ post, saved = false, reaction = null, size = 'wall', interactive = true, n, scroll = true }: ScoopCardProps) {
  const kind = scoopKind(post)
  const featured = size === 'featured'
  const tile = size === 'tile'
  const seed = seedOf(post.id)
  // text-only tiles: every third one sets its headline large, like a pull quote
  const bigTitle = tile && !post.imageUrl && seed % 3 === 0
  const date = shortDate(post.publishedAt)

  return (
    <article
      className={`group/card flex h-full flex-col rounded-[14px] border border-ink/10 bg-surface-warm p-5 text-ink shadow-float ${scroll ? 'sc-scroll' : ''} ${
        interactive ? 'transition-[transform,box-shadow] duration-300 ease-soft hover:[transform:translateY(-2px)] hover:shadow-lift' : ''
      } ${featured || tile ? '' : 'sm:p-6'}`}
    >
      <header className="flex items-center gap-2.5">
        <PlatformIcon source={post.source} size="sm" tone="brand" />
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-[13px] font-medium">{post.sourceHandle ?? '@scooply'}</p>
          <p className="truncate text-[13px] text-ink-4">
            {SOURCE_LABEL[post.source]}
            {date && ` · ${date}`}
          </p>
        </div>
        {n !== undefined ? (
          <span className="shrink-0 text-[13px] text-ink-4">No. {String(n).padStart(2, '0')}</span>
        ) : (
          kind === 'video' && <span className="shrink-0 text-[13px] text-ink-4">Video</span>
        )}
      </header>


      <TrackedPostLink postId={post.id} href={post.sourceUrl} className="mt-4 flex min-h-0 flex-1 flex-col">
        <h3
          className={`font-display leading-[1.08] ${
            featured ? 'line-clamp-3 text-[25px]' : tile ? (bigTitle ? 'text-[26px] leading-[1.05] sm:text-[32px] sm:leading-[1.02]' : 'text-[22px] sm:text-[24px]') : 'text-[26px] sm:text-[30px]'
          }`}
        >
          {post.title}
        </h3>

        {post.imageUrl ? (
          <>
            {!featured && <p className={`mt-3 text-[15px] leading-relaxed text-ink-3 ${tile ? 'line-clamp-3 text-[14px]' : 'line-clamp-2'}`}>{post.content}</p>}
            <div
              className={`relative mt-4 overflow-hidden rounded-[8px] bg-ink/5 ${
                featured ? 'min-h-[140px] flex-1' : tile ? TILE_ASPECTS[seed % TILE_ASPECTS.length] : 'aspect-[16/9]'
              }`}
            >
              <Image
                src={post.imageUrl}
                alt=""
                fill
                sizes={featured || tile ? '(min-width: 640px) 400px, 100vw' : '(min-width: 1024px) 680px, 100vw'}
                className="object-cover transition-transform duration-700 ease-soft group-hover/card:scale-[1.03]"
              />
              {kind === 'video' && (
                <span
                  aria-hidden
                  className="absolute left-1/2 top-1/2 inline-flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-surface-warm/85 text-ink ring-1 ring-ink/15 backdrop-blur-sm"
                >
                  <Play size={16} />
                </span>
              )}
            </div>
          </>
        ) : (
          <p
            className={`mt-3 flex-1 text-[15px] leading-relaxed text-ink-3 ${
              featured ? 'line-clamp-5 text-[14px]' : tile ? (bigTitle ? 'line-clamp-3 text-[14px]' : 'line-clamp-[8] text-[14px]') : 'line-clamp-3'
            }`}
          >
            {post.content}
          </p>
        )}
      </TrackedPostLink>

      <footer className="mt-4 flex items-center justify-between gap-2 border-t border-ink/10 pt-3">
        {interactive ? (
          <>
            <PreviewButton post={post} />
            <div className="flex items-center gap-0.5">
              <ListenButton title={post.title} content={post.content} />
              <ReactionButtons postId={post.id} initialReaction={reaction} />
              <SaveScoopButton postId={post.id} initialSaved={saved} />
            </div>
          </>
        ) : (
          <>
            <span className="text-[13px] font-medium text-ink-2">Read the scoop</span>
            <ArrowUpRight size={13} className="text-ink-3" />
          </>
        )}
      </footer>
    </article>
  )
}
