import type { Post } from '@/lib/types'
import { getCategoryById } from '@/lib/categories'
import PlatformIcon from './PlatformIcon'
import TrackedPostLink from './TrackedPostLink'

interface PostCardProps {
  post: Post
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function PostCard({ post }: PostCardProps) {
  const category = getCategoryById(post.categoryId)
  const hasImage = !!post.imageUrl
  const isVideo = post.source === 'youtube' || post.source === 'tiktok'

  return (
    <TrackedPostLink
      postId={post.id}
      href={post.sourceUrl}
      className="group block rounded-3xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      {hasImage && (
        <div className="relative">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-3 left-3">
            <PlatformIcon source={post.source} size="sm" />
          </div>
          {isVideo && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="p-4 flex flex-col gap-2">
        {!hasImage && (
          <div className="flex items-center gap-2">
            <PlatformIcon source={post.source} size="sm" />
            {post.sourceHandle && (
              <span className="text-sm font-medium text-zinc-700 truncate">{post.sourceHandle}</span>
            )}
          </div>
        )}

        <h3 className="font-semibold text-zinc-900 leading-snug group-hover:text-black transition-colors line-clamp-2">
          {post.title}
        </h3>

        <p className="text-sm text-zinc-500 leading-relaxed line-clamp-3">{post.content}</p>

        <div className="flex items-center justify-between mt-1">
          {category && (
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${category.color}18`, color: category.color }}
            >
              {category.name}
            </span>
          )}
          <span className="text-xs text-zinc-400 ml-auto">{formatDate(post.publishedAt)}</span>
        </div>
      </div>
    </TrackedPostLink>
  )
}
