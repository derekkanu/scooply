'use client'

import { useEffect, useState } from 'react'

export interface RailItem {
  id: string
  label: string
}

/**
 * Quiet section navigation: small stacked links on a thin rule. The section in view
 * darkens and its piece of the rule turns ink. Desktop only; phones use the top bar.
 */
export default function SideRail({ items }: { items: RailItem[] }) {
  const [active, setActive] = useState(items[0]?.id)

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (hit) setActive(hit.target.id)
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [items])

  return (
    <nav aria-label="Sections" className="flex flex-col border-l border-line">
      {items.map((item) => {
        const on = item.id === active
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            aria-current={on ? 'true' : undefined}
            className={`-ml-px border-l py-1.5 pl-4 text-[14px] transition-colors duration-300 ease-soft ${
              on ? 'border-ink text-ink' : 'border-transparent text-ink-3 hover:text-ink'
            }`}
          >
            {item.label}
          </a>
        )
      })}
    </nav>
  )
}
