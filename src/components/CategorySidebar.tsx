import Link from 'next/link'
import { categories } from '@/lib/categories'
import { userLogout } from '@/lib/actions'
import ScooplyLogo from './ScooplyLogo'

interface CategorySidebarProps {
  activeKey: string
  userName?: string
}

const FILTER_ITEMS = [
  { id: 'all', name: 'All', href: '/dashboard' },
  ...categories.map((c) => ({ id: c.id, name: c.name, href: `/dashboard?category=${c.id}` })),
]

function DotIndicator({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden
      className={`w-2.5 h-2.5 rounded-full shrink-0 ${
        active ? 'bg-zinc-900' : 'border border-zinc-400/70 bg-transparent'
      }`}
    />
  )
}

function DotRow({
  href,
  label,
  isActive,
}: {
  href: string
  label: string
  isActive: boolean
}) {
  return (
    <Link href={href} className="group flex items-center gap-3">
      <DotIndicator active={isActive} />
      <span
        className={`text-[15px] truncate ${
          isActive ? 'font-semibold text-zinc-900' : 'font-medium text-zinc-600 group-hover:text-zinc-900'
        }`}
      >
        {label}
      </span>
    </Link>
  )
}

export default function CategorySidebar({ activeKey, userName }: CategorySidebarProps) {
  const active = activeKey || 'all'
  const signOutLabel = userName ? `Sign out · ${userName.split(' ')[0]}` : 'Sign out'

  return (
    <aside className="w-72 shrink-0 hidden lg:flex flex-col bg-[#D9D9D9] border-r border-zinc-300/70 sticky top-0 h-screen z-10">
      <Link href="/dashboard" className="flex items-center px-8 pt-8 pb-10">
        <ScooplyLogo size={28} />
      </Link>

      <nav className="flex-1 px-8 flex flex-col gap-5 overflow-y-auto">
        {FILTER_ITEMS.map((item) => (
          <DotRow key={item.id} href={item.href} label={item.name} isActive={active === item.id} />
        ))}

        <div className="my-2 border-t border-zinc-400/40" />

        <DotRow href="/progress" label="Progress" isActive={active === 'progress'} />
        <DotRow href="/settings" label="Settings" isActive={active === 'settings'} />

        <form action={userLogout} className="flex">
          <button type="submit" className="group flex items-center gap-3">
            <DotIndicator active={false} />
            <span className="text-[15px] font-medium text-zinc-600 group-hover:text-zinc-900 truncate">
              {signOutLabel}
            </span>
          </button>
        </form>
      </nav>

      <div className="h-8" />
    </aside>
  )
}
