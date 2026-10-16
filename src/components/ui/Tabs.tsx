'use client'

import Link from 'next/link'

interface TabItem {
  id: string
  label: string
  href?: string
}

interface TabsProps {
  items: TabItem[]
  value: string
  onChange?: (id: string) => void
  /** mono: ink bar on cream paper, for the monotone landing page. */
  tone?: 'accent' | 'mono'
  className?: string
}

/** Segmented tabs over gold bars: the active tab lifts onto white and its bar turns orange. */
export default function Tabs({ items, value, onChange, tone = 'accent', className = '' }: TabsProps) {
  const mono = tone === 'mono'
  return (
    <div className={`overflow-x-auto no-scrollbar ${className}`}>
      <div role="tablist" className={`flex w-max min-w-full gap-1.5 rounded-[12px] p-1.5 ${mono ? 'bg-surface-warm shadow-[inset_0_0_0_1px_var(--sc-line-strong)]' : 'bg-cream'}`}>
        {items.map((item) => {
          const active = item.id === value
          const cls = `flex min-w-[84px] flex-1 flex-col items-center gap-1.5 rounded-[8px] px-3 pt-2 pb-1.5 text-[12px] whitespace-nowrap transition-[background-color,color,box-shadow] duration-300 ease-soft ${
            active ? 'bg-surface text-ink shadow-hairline' : 'text-ink-3 hover:text-ink'
          }`
          const bar = (
            <span
              aria-hidden
              className={`h-[3px] w-full rounded-full transition-colors duration-300 ease-soft ${active ? (mono ? 'bg-ink' : 'bg-accent') : mono ? 'bg-ink/10' : 'bg-gold-soft'}`}
            />
          )
          return item.href ? (
            <Link key={item.id} href={item.href} role="tab" aria-selected={active} className={cls}>
              {item.label}
              {bar}
            </Link>
          ) : (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange?.(item.id)}
              className={cls}
            >
              {item.label}
              {bar}
            </button>
          )
        })}
      </div>
    </div>
  )
}
