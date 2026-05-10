import type { Post } from '@/lib/types'
import TrackedPostLink from '@/components/TrackedPostLink'

interface FeaturedScoopCardProps {
  post: Post
}

export default function FeaturedScoopCard({ post }: FeaturedScoopCardProps) {
  return (
    <TrackedPostLink
      postId={post.id}
      href={post.sourceUrl}
      className="group block rounded-3xl border border-zinc-400/40 bg-white/15 hover:bg-white/30 backdrop-blur-[2px] p-5 transition-colors"
    >
      <h3 className="text-[18px] font-semibold text-zinc-900 leading-snug">{post.title}</h3>
      <p className="mt-2 text-[13px] text-zinc-500 leading-relaxed line-clamp-2">{post.content}</p>
    </TrackedPostLink>
  )
}
