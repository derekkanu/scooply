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

function NavRow({
  href,
  label,
  isActive,
  icon,
}: {
  href: string
  label: string
  isActive: boolean
  icon: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors ${
        isActive ? 'bg-white shadow-sm' : 'hover:bg-white/60'
      }`}
    >
      {icon}
      <span
        className={`text-sm truncate ${
          isActive ? 'font-semibold text-zinc-900' : 'font-medium text-zinc-600'
        }`}
      >
        {label}
      </span>
    </Link>
  )
}

export default function CategorySidebar({ activeKey, userName }: CategorySidebarProps) {
  const active = activeKey || 'all'

  return (
    <aside className="w-72 shrink-0 hidden lg:flex flex-col bg-[#F7F7F5] sticky top-0 h-screen z-10">
      <Link href="/dashboard" className="flex items-center px-7 py-6">
        <ScooplyLogo size={28} />
      </Link>

      <nav className="flex-1 px-5 pt-2 pb-6 flex flex-col gap-2 overflow-y-auto">
        {FILTER_ITEMS.map((item) => {
          const isActive = active === item.id
          return (
            <NavRow
              key={item.id}
              href={item.href}
              label={item.name}
              isActive={isActive}
              icon={
                <span
                  aria-hidden
                  className={`w-4 h-4 rounded-md shrink-0 ${isActive ? 'bg-zinc-900' : 'bg-zinc-200'}`}
                />
              }
            />
          )
        })}

        <div className="mt-3 pt-3 border-t border-zinc-200/60 flex flex-col gap-1.5">
          <NavRow
            href="/progress"
            label="Progress"
            isActive={active === 'progress'}
            icon={
              <span
                aria-hidden
                className={`w-6 h-6 rounded-md shrink-0 inline-flex items-center justify-center ${
                  active === 'progress' ? 'bg-zinc-900 text-white' : 'bg-zinc-200 text-zinc-500'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M3 17l5-5 4 4 8-8" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M14 8h6v6" />
                </svg>
              </span>
            }
          />
          <NavRow
            href="/settings"
            label="Settings"
            isActive={active === 'settings'}
            icon={
              <span
                aria-hidden
                className={`w-6 h-6 rounded-md shrink-0 inline-flex items-center justify-center ${
                  active === 'settings' ? 'bg-zinc-900 text-white' : 'bg-zinc-200 text-zinc-500'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
            }
          />
          <form action={userLogout}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-zinc-600 hover:bg-white/60 hover:text-zinc-900 transition-colors"
            >
              <span
                aria-hidden
                className="w-6 h-6 rounded-md shrink-0 inline-flex items-center justify-center bg-zinc-200 text-zinc-500"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </span>
              <span className="truncate">Sign out{userName ? ` · ${userName}` : ''}</span>
            </button>
          </form>
        </div>
      </nav>
    </aside>
  )
}
