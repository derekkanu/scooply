'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import NavRow, { MAIN_NAV, TOPIC_NAV } from '@/components/nav/NavRow'
import { LogOut } from '@/components/ui/icons'
import { userLogout } from '@/lib/actions'
import ScooplyLogo from '@/components/ScooplyLogo'

interface MobileMenuDrawerProps {
  activeKey: string
  userName?: string
}

export default function MobileMenuDrawer({ activeKey, userName }: MobileMenuDrawerProps) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const active = activeKey || 'all'
  const signOutLabel = userName ? `Sign out · ${userName.split(' ')[0]}` : 'Sign out'

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- guards createPortal against SSR where document.body is undefined
    setMounted(true)
  }, [])

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

  const drawer = (
    <div
      className={`fixed inset-0 z-[60] lg:hidden ${open ? '' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      <div
        onClick={() => setOpen(false)}
        className={`absolute inset-0 bg-canvas/60 backdrop-blur-sm transition-opacity duration-300 ease-soft ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Dashboard menu"
        className={`absolute top-0 bottom-0 right-0 w-[82vw] max-w-[340px] sc-field shadow-lift rounded-l-panel transition-[transform,opacity] duration-300 ease-soft flex flex-col ${
          open ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'
        }`}
      >
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <ScooplyLogo size={26} />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-2 hover:text-ink hover:bg-ink/5 transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path strokeLinecap="round" d="M6 6L18 18M18 6L6 18" />
              </svg>
            </button>
          </div>

          <nav aria-label="App" className="flex-1 overflow-y-auto px-4 pb-8">
            <div className="flex flex-col gap-0.5">
              {MAIN_NAV.map((item) => (
                <NavRow key={item.id} item={item} active={active === item.id} onClick={() => setOpen(false)} />
              ))}
            </div>

            <div className="my-4 border-t border-line" />

            <p className="px-3 pb-2 text-[13px] text-ink-3">Topics</p>
            <div className="flex flex-col gap-0.5">
              {TOPIC_NAV.map((item) => (
                <NavRow key={item.id} item={item} active={active === item.id} onClick={() => setOpen(false)} />
              ))}
            </div>

            <div className="my-4 border-t border-line" />

            <form action={userLogout}>
              <button
                type="submit"
                className="flex h-10 w-full items-center gap-3 rounded-[10px] px-3 text-[15px] text-ink-2 transition-colors hover:bg-ink/[0.04] hover:text-ink"
              >
                <LogOut size={18} />
                <span className="truncate">{signOutLabel}</span>
              </button>
            </form>
          </nav>
        </div>
      </div>
  )

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center w-10 h-10 -mr-2 text-ink hover:text-ink-2 transition-colors"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>
      {mounted ? createPortal(drawer, document.body) : null}
    </>
  )
}
