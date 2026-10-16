'use client'

import { useState } from 'react'
import Link from 'next/link'
import ScooplyLogo from '@/components/ScooplyLogo'
import { Close, Menu } from '@/components/ui/icons'

export interface NavItem {
  href: string
  label: string
}

/** Sticky top bar: logo and section links. Phones fold the links into a menu. */
export default function LandingHeader({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-parchment/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1160px] items-center justify-between gap-6 px-5 sm:px-10">
        <Link href="/" aria-label="Scooply home" className="text-ink">
          <ScooplyLogo size={24} />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {items.map((item) => (
            <a key={item.href} href={item.href} className="text-[13px] font-medium text-ink-2 transition-colors duration-200 ease-soft hover:text-ink">
              {item.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="landing-menu"
          className="inline-flex h-9 items-center gap-2 rounded-full px-3 text-[14px] text-ink md:hidden"
        >
          {open ? <Close size={16} /> : <Menu size={16} />}
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      {open && (
        <div id="landing-menu" className="border-t border-line px-5 pt-3 pb-6 md:hidden">
          <nav aria-label="Primary" className="flex flex-col">
            {items.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setOpen(false)} className="border-b border-line py-3 text-[16px] text-ink">
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
