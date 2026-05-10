import Link from 'next/link'
import type { Post } from '@/lib/types'

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
      className="block group"
    >
      <h4 className="text-[15px] font-semibold text-zinc-900 leading-snug group-hover:text-black">
        {post.title}
      </h4>
      <p className="mt-1.5 text-[12px] text-zinc-500 leading-relaxed line-clamp-2">{post.content}</p>
    </Link>
  )
}

export default function SavedSoopCard({ saved }: SavedSoopCardProps) {
  const preview = saved.slice(0, PREVIEW_LIMIT)
  const hasMore = saved.length > PREVIEW_LIMIT

  return (
    <div className="rounded-3xl bg-zinc-300/70 border border-zinc-400/30 p-6 min-h-[420px] flex flex-col">
      <div className="flex items-baseline justify-between">
        <h3 className="text-[14px] font-semibold text-zinc-700">Saved soop</h3>
        {saved.length > 0 && (
          <Link
            href="/saved"
            className="text-[12px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            View all
          </Link>
        )}
      </div>

      {saved.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-2">
          <span
            aria-hidden
            className="w-10 h-10 rounded-full bg-zinc-400/30 inline-flex items-center justify-center text-zinc-500 mb-3"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 3.5A1.5 1.5 0 0 1 7.5 2h9A1.5 1.5 0 0 1 18 3.5V21l-6-3.5L6 21V3.5Z" />
            </svg>
          </span>
          <p className="text-[13px] font-medium text-zinc-700">No saved scoops yet</p>
          <p className="mt-1 text-[12px] text-zinc-500 leading-relaxed max-w-[200px]">
            Tap the bookmark on any scoop to save it for later — they&apos;ll show up here.
          </p>
        </div>
      ) : (
        <div className="mt-5 flex flex-col gap-5 flex-1">
          {preview.map((post) => (
            <SavedRow key={post.id} post={post} />
          ))}
          {hasMore && (
            <Link
              href="/saved"
              className="mt-auto pt-2 text-[12px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              View all {saved.length} saved
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
