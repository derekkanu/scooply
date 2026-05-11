'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { categories } from '@/lib/categories'
import { userLogout } from '@/lib/actions'
import ScooplyLogo from '@/components/ScooplyLogo'

interface MobileMenuDrawerProps {
  activeKey: string
  userName?: string
}

const FILTER_ITEMS = [
  { id: 'all', name: 'All', href: '/dashboard' },
  ...categories.map((c) => ({ id: c.id, name: c.name, href: `/dashboard?category=${c.id}` })),
]

function Dot({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden
      className={`w-2.5 h-2.5 rounded-full shrink-0 ${
        active ? 'bg-zinc-900' : 'border border-zinc-400/70 bg-transparent'
      }`}
    />
  )
}

export default function MobileMenuDrawer({ activeKey, userName }: MobileMenuDrawerProps) {
  const [open, setOpen] = useState(false)
  const active = activeKey || 'all'
  const signOutLabel = userName ? `Sign out · ${userName.split(' ')[0]}` : 'Sign out'

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center w-10 h-10 -mr-2 text-zinc-900 hover:text-zinc-700 transition-colors"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      <div className={`fixed inset-0 z-50 lg:hidden ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/55 transition-opacity duration-300 ${
            open ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        />

        <div
          role="dialog"
          aria-modal="true"
          aria-label="Dashboard menu"
          className={`absolute top-0 bottom-0 right-0 w-[82vw] max-w-[340px] bg-[#D9D9D9] shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <ScooplyLogo size={26} />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="text-zinc-700 hover:text-zinc-900 transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path strokeLinecap="round" d="M6 6L18 18M18 6L6 18" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-6 pb-8 flex flex-col gap-5">
            {FILTER_ITEMS.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setOpen(false)}
                className="group flex items-center gap-3"
              >
                <Dot active={active === item.id} />
                <span
                  className={`text-[15px] truncate ${
                    active === item.id ? 'font-semibold text-zinc-900' : 'font-medium text-zinc-600 group-hover:text-zinc-900'
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            ))}

            <div className="my-2 border-t border-zinc-400/40" />

            <Link href="/saved" onClick={() => setOpen(false)} className="group flex items-center gap-3">
              <Dot active={false} />
              <span className="text-[15px] font-medium text-zinc-600 group-hover:text-zinc-900 truncate">
                Saved scoops
              </span>
            </Link>
            <Link href="/progress" onClick={() => setOpen(false)} className="group flex items-center gap-3">
              <Dot active={false} />
              <span className="text-[15px] font-medium text-zinc-600 group-hover:text-zinc-900 truncate">
                Progress
              </span>
            </Link>
            <Link href="/settings" onClick={() => setOpen(false)} className="group flex items-center gap-3">
              <Dot active={false} />
              <span className="text-[15px] font-medium text-zinc-600 group-hover:text-zinc-900 truncate">
                Settings
              </span>
            </Link>

            <form action={userLogout} className="flex">
              <button type="submit" className="group flex items-center gap-3">
                <Dot active={false} />
                <span className="text-[15px] font-medium text-zinc-600 group-hover:text-zinc-900 truncate">
                  {signOutLabel}
                </span>
              </button>
            </form>
          </nav>
        </div>
      </div>
    </>
  )
}
