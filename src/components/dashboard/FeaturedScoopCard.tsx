import type { Post } from '@/lib/types'
import type { PostReaction } from '@/lib/actions'
import ScoopCard from '@/components/feed/ScoopCard'

interface FeaturedScoopCardProps {
  post: Post
  reaction?: PostReaction | null
  saved?: boolean
}

/** A post in the New scoop row — the tall version of the scoop card. */
export default function FeaturedScoopCard({ post, reaction = null, saved = false }: FeaturedScoopCardProps) {
  return <ScoopCard post={post} saved={saved} reaction={reaction} size="featured" />
}
