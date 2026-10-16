import Link from 'next/link'
import { categories } from '@/lib/categories'
import { BarChart, Bookmark, Code, Compass, Heart, Inbox, Layers, Sliders } from '@/components/ui/icons'

export interface NavItem {
  id: string
  label: string
  href: string
  icon: React.ReactNode
}

/** The app's own places, in reading order. */
export const MAIN_NAV: NavItem[] = [
  { id: 'all', label: 'All scoops', href: '/dashboard', icon: <Inbox size={18} /> },
  { id: 'saved', label: 'Saved', href: '/saved', icon: <Bookmark size={18} /> },
  { id: 'progress', label: 'Progress', href: '/progress', icon: <BarChart size={18} /> },
  { id: 'settings', label: 'Settings', href: '/settings', icon: <Sliders size={18} /> },
]

const TOPIC_ICONS: Record<string, React.ReactNode> = {
  'ai-foundations': <Layers size={18} />,
  'hands-on-ai-tools': <Code size={18} />,
  'ai-with-heart': <Heart size={18} />,
  'stay-curious': <Compass size={18} />,
}

/** One row per feed topic. */
export const TOPIC_NAV: NavItem[] = categories.map((c) => ({
  id: c.id,
  label: c.name,
  href: `/dashboard?category=${c.id}`,
  icon: TOPIC_ICONS[c.id] ?? <Layers size={18} />,
}))

interface NavRowProps {
  item: NavItem
  active: boolean
  /** Icon-only rail: the label is kept for screen readers and shown as a tooltip. */
  collapsed?: boolean
  /** A count on the right (e.g. unread scoops); a dot when collapsed. */
  badge?: number
  onClick?: () => void
}

/** A sidebar row: line icon, label, optional count. The active row sits on a soft ink pill. */
export default function NavRow({ item, active, collapsed = false, badge, onClick }: NavRowProps) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      title={collapsed ? item.label : undefined}
      className={`relative flex h-10 items-center gap-3 rounded-[10px] text-[15px] transition-colors duration-200 ease-soft ${
        collapsed ? 'justify-center px-0' : 'px-3'
      } ${active ? 'bg-ink/[0.07] font-medium text-ink' : 'text-ink-2 hover:bg-ink/[0.04] hover:text-ink'}`}
    >
      <span aria-hidden className={`shrink-0 ${active ? 'text-ink' : 'text-ink-2'}`}>
        {item.icon}
      </span>
      <span className={collapsed ? 'sr-only' : 'min-w-0 flex-1 truncate'}>{item.label}</span>
      {!!badge &&
        (collapsed ? (
          <span aria-hidden className="absolute top-2 right-2.5 h-1.5 w-1.5 rounded-full bg-ink" />
        ) : (
          <span className="inline-flex h-5 min-w-6 items-center justify-center rounded-full bg-ink px-1.5 text-[11px] font-medium text-[var(--sc-on-ink)]">
            {badge > 99 ? '99+' : badge}
          </span>
        ))}
    </Link>
  )
}
