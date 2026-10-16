import { getUserSession } from '@/lib/auth'
import { getPosts } from '@/lib/data'
import SidebarShell, { type RecentScoop } from './nav/SidebarShell'

interface CategorySidebarProps {
  /** The page or topic in view: 'all', 'saved', 'progress', 'settings' or a category id. */
  activeKey: string
  /** Kept for callers; the sidebar reads the session itself. */
  userName?: string
}

/** Reads who's signed in and what they've read, then hands the side nav its data. */
export default async function CategorySidebar({ activeKey, userName }: CategorySidebarProps) {
  const [user, posts] = await Promise.all([getUserSession(), getPosts()])
  const viewed = user?.viewedPostIds ?? []
  const viewedSet = new Set(viewed)
  const savedSet = new Set(user?.savedPostIds ?? [])
  const byId = new Map(posts.map((p) => [p.id, p]))

  const recent: RecentScoop[] = [...viewed]
    .reverse()
    .slice(0, 3)
    .flatMap((id) => {
      const p = byId.get(id)
      return p ? [{ id: p.id, handle: p.sourceHandle ?? '@scooply', title: p.title, href: p.sourceUrl, saved: savedSet.has(p.id) }] : []
    })

  const name = user?.name ?? userName ?? 'Reader'
  const level = user?.proficiency
  const subtitle = user?.email ?? (level ? `${level[0].toUpperCase()}${level.slice(1)} reader` : 'Exploring Scooply')

  return (
    <SidebarShell
      activeKey={activeKey || 'all'}
      unread={posts.filter((p) => !viewedSet.has(p.id)).length}
      recent={recent}
      user={{ name, subtitle }}
    />
  )
}
