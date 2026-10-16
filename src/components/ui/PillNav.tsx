import Link from 'next/link'

interface PillNavProps {
  items: { id: string; label: string; href: string }[]
  active: string
  className?: string
}

/** Cream pill navigation; the active item lifts onto white and gains an orange dot. */
export default function PillNav({ items, active, className = '' }: PillNavProps) {
  return (
    <nav className={`inline-flex items-center gap-0.5 rounded-full border border-gold-soft bg-cream p-1 ${className}`} aria-label="Primary">
      {items.map((item) => {
        const isActive = item.id === active
        return (
          <Link
            key={item.id}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={`inline-flex h-8 items-center gap-1.5 rounded-full px-4 text-[13px] font-medium transition-[background-color,color,box-shadow] duration-200 ease-soft ${
              isActive ? 'bg-surface text-accent-ink shadow-hairline' : 'text-ink-3 hover:text-ink'
            }`}
          >
            {item.label}
            {isActive && <span aria-hidden className="h-1 w-1 rounded-full bg-accent" />}
          </Link>
        )
      })}
    </nav>
  )
}
