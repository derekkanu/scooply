'use client'

import { markPostViewed } from '@/lib/actions'

interface TrackedPostLinkProps {
  postId: string
  href: string
  className?: string
  children: React.ReactNode
  target?: string
  rel?: string
}

export default function TrackedPostLink({
  postId,
  href,
  className,
  children,
  target = '_blank',
  rel = 'noopener noreferrer',
}: TrackedPostLinkProps) {
  function handleClick() {
    void markPostViewed(postId).catch(() => {})
  }

  return (
    <a href={href} target={target} rel={rel} className={className} onClick={handleClick}>
      {children}
    </a>
  )
}
