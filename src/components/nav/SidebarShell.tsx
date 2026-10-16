'use client'

import { useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import ScooplyLogo from '@/components/ScooplyLogo'
import NavRow, { MAIN_NAV, TOPIC_NAV } from './NavRow'
import { userLogout } from '@/lib/actions'
import { ArrowUpRight, Bookmark, ChevronsUpDown, LogOut, PanelLeft, Sliders } from '@/components/ui/icons'

export interface RecentScoop {
  id: string
  handle: string
  title: string
  href: string
  saved: boolean
}

interface SidebarShellProps {
  activeKey: string
  unread: number
  recent: RecentScoop[]
  user: { name: string; subtitle: string }
}

// Collapsed state lives in localStorage; useSyncExternalStore reads it without a flash of
// the wrong width after hydration (the server always renders expanded).
const KEY = 'sc-sidebar-collapsed'
const EVENT = 'sc-sidebar'
function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb)
  window.addEventListener('storage', cb)
  return () => {
    window.removeEventListener(EVENT, cb)
    window.removeEventListener('storage', cb)
  }
}
function readCollapsed() {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}
function writeCollapsed(v: boolean) {
  try {
    localStorage.setItem(KEY, v ? '1' : '0')
  } catch {}
  window.dispatchEvent(new Event(EVENT))
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? 'S') + (parts[1]?.[0] ?? '')).toUpperCase()
}

/**
 * Desktop side nav: a collapse toggle, the app's places, the feed topics, recently read
 * scoops, and the reader's profile with a small account menu.
 */
export default function SidebarShell({ activeKey, unread, recent, user }: SidebarShellProps) {
  const collapsed = useSyncExternalStore(subscribe, readCollapsed, () => false)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <aside
      className={`sticky top-0 z-10 hidden h-screen shrink-0 flex-col border-r border-line bg-surface/60 transition-[width] duration-300 ease-soft lg:flex ${
        collapsed ? 'w-[76px]' : 'w-72'
      }`}
    >
      {/* top: logo and the collapse toggle */}
      <div className={`flex h-16 items-center border-b border-line ${collapsed ? 'justify-center' : 'justify-between px-5'}`}>
        {!collapsed && (
          <Link href="/dashboard" aria-label="Scooply home" className="text-ink">
            <ScooplyLogo size={22} />
          </Link>
        )}
        <button
          type="button"
          onClick={() => writeCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] text-ink-2 transition-colors hover:bg-ink/[0.05] hover:text-ink"
        >
          <PanelLeft size={18} />
        </button>
      </div>

      <nav aria-label="App" className={`flex-1 overflow-y-auto py-4 ${collapsed ? 'px-3' : 'px-4'}`}>
        <div className="flex flex-col gap-0.5">
          {MAIN_NAV.map((item) => (
            <NavRow key={item.id} item={item} active={activeKey === item.id} collapsed={collapsed} badge={item.id === 'all' ? unread : undefined} />
          ))}
        </div>

        <div className="my-4 border-t border-line" />

        {!collapsed && <p className="px-3 pb-2 text-[13px] text-ink-3">Topics</p>}
        <div className="flex flex-col gap-0.5">
          {TOPIC_NAV.map((item) => (
            <NavRow key={item.id} item={item} active={activeKey === item.id} collapsed={collapsed} />
          ))}
        </div>

        {!collapsed && recent.length > 0 && (
          <>
            <div className="my-4 border-t border-line" />
            <p className="px-3 pb-2 text-[13px] text-ink-3">Recently read</p>
            <ul className="flex flex-col gap-0.5">
              {recent.map((r) => (
                <li key={r.id}>
                  <a
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 items-center gap-3 rounded-[10px] px-3 text-[14px] transition-colors hover:bg-ink/[0.04]"
                  >
                    <span aria-hidden className="shrink-0 text-ink">
                      {r.saved ? <Bookmark size={14} filled /> : <ArrowUpRight size={14} />}
                    </span>
                    <span className="min-w-0 truncate">
                      <span className="text-ink">{r.handle}</span>
                      <span className="text-ink-3"> · {r.title}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
      </nav>

      {/* bottom: who's reading, with sign out tucked behind the chevrons */}
      <div className={`relative border-t border-line py-3 ${collapsed ? 'px-3' : 'px-4'}`}>
        {menuOpen && (
          <>
            <button type="button" aria-label="Close menu" className="fixed inset-0 z-10 cursor-default" onClick={() => setMenuOpen(false)} />
            <div className="absolute bottom-full left-3 z-20 mb-2 w-60 rounded-[12px] border border-ink/10 bg-surface p-1.5 shadow-lift">
              <Link
                href="/settings"
                onClick={() => setMenuOpen(false)}
                className="flex h-9 items-center gap-2.5 rounded-[8px] px-2.5 text-[14px] text-ink-2 hover:bg-ink/[0.05] hover:text-ink"
              >
                <Sliders size={16} />
                Settings
              </Link>
              <form action={userLogout}>
                <button type="submit" className="flex h-9 w-full items-center gap-2.5 rounded-[8px] px-2.5 text-[14px] text-ink-2 hover:bg-ink/[0.05] hover:text-ink">
                  <LogOut size={16} />
                  Sign out
                </button>
              </form>
            </div>
          </>
        )}
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-label={`Account: ${user.name}`}
          className={`flex w-full items-center gap-3 rounded-[10px] p-1.5 text-left transition-colors hover:bg-ink/[0.04] ${collapsed ? 'justify-center' : ''}`}
        >
          <span className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-ink text-[13px] font-medium text-[var(--sc-on-ink)]">
            {initials(user.name)}
            <span aria-hidden className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full bg-positive ring-2 ring-[var(--sc-canvas)]" />
          </span>
          {!collapsed && (
            <>
              <span className="min-w-0 flex-1 leading-tight">
                <span className="block truncate text-[15px] text-ink">{user.name}</span>
                <span className="block truncate text-[13px] text-ink-3">{user.subtitle}</span>
              </span>
              <ChevronsUpDown size={16} className="shrink-0 text-ink-3" />
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
