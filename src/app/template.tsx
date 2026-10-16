import { ViewTransition } from 'react'

/**
 * Re-mounts on every route change, so the outgoing page fades up and away and the new one
 * settles in (classes in globals.css). default="none" keeps in-page transitions — saving,
 * reacting, loading — from fading the whole page.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="sc-page-in" exit="sc-page-out" default="none">
      {children}
    </ViewTransition>
  )
}
