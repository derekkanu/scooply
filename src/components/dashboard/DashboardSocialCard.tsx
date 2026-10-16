import type { Post } from '@/lib/types'
import type { PostReaction } from '@/lib/actions'
import ScoopCard from '@/components/feed/ScoopCard'

interface DashboardSocialCardProps {
  post: Post
  saved: boolean
  reaction?: PostReaction | null
}

/** A tile on the masonry wall — image, video or text, chosen from the post itself. */
export default function DashboardSocialCard({ post, saved, reaction = null }: DashboardSocialCardProps) {
  return <ScoopCard post={post} saved={saved} reaction={reaction} size="tile" />
}
