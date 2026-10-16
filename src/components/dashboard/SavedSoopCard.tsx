import Link from 'next/link'
import type { Post } from '@/lib/types'
import Eyebrow from '@/components/ui/Eyebrow'
import Illustration from '@/components/illustrations/Illustration'

interface SavedSoopCardProps {
  saved: Post[]
}

const PREVIEW_LIMIT = 3

function SavedRow({ post }: { post: Post }) {
  return (
    <Link
      href={post.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block border-b border-ink/10 py-3 last:border-b-0"
    >
      <h4 className="font-display text-[18px] leading-[1.15] text-ink">
        {post.title}
      </h4>
      <p className="mt-1 text-[12px] leading-relaxed text-ink-3 line-clamp-2">{post.content}</p>
    </Link>
  )
}

export default function SavedSoopCard({ saved }: SavedSoopCardProps) {
  const preview = saved.slice(0, PREVIEW_LIMIT)
  const hasMore = saved.length > PREVIEW_LIMIT

  return (
    <div className="flex min-h-[420px] flex-col rounded-[14px] border border-ink/10 bg-surface-warm p-5 text-ink shadow-float">
      <div className="flex items-center justify-between">
        <Eyebrow className="text-ink-2!">Saved scoops</Eyebrow>
        {saved.length > 0 && (
          <Link
            href="/saved"
            className="text-[12px] font-medium text-ink-3 hover:text-ink transition-colors"
          >
            View all
          </Link>
        )}
      </div>


      {saved.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-2">
          <Illustration name="box" size={120} className="mb-2" />
          <p className="text-small font-medium text-ink-2">No saved scoops yet</p>
          <p className="mt-1 text-[12px] text-ink-3 leading-relaxed max-w-[200px]">
            Tap the bookmark on any scoop to save it for later — they&apos;ll show up here.
          </p>
        </div>
      ) : (
        <div className="mt-1 flex flex-1 flex-col">
          {preview.map((post) => (
            <SavedRow key={post.id} post={post} />
          ))}
          {hasMore && (
            <Link
              href="/saved"
              className="mt-auto pt-2 text-[12px] font-medium text-ink-3 hover:text-ink transition-colors"
            >
              View all {saved.length} saved
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
