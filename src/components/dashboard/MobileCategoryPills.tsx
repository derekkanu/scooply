import Link from 'next/link'
import { categories } from '@/lib/categories'

interface MobileCategoryPillsProps {
  active: string
  className?: string
}

const ITEMS = [
  { id: 'all', name: 'All', href: '/dashboard' },
  ...categories.map((c) => ({ id: c.id, name: c.name, href: `/dashboard?category=${c.id}` })),
]

export default function MobileCategoryPills({ active, className = '' }: MobileCategoryPillsProps) {
  const current = active || 'all'
  return (
    <div className={`relative -mx-6 ${className}`}>
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 px-6 pb-1 w-max">
          {ITEMS.map((item) => {
            const isActive = current === item.id
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`shrink-0 inline-flex items-center h-10 px-4 rounded-full text-sm font-medium whitespace-nowrap border transition-colors duration-200 ease-soft ${
                  isActive
                    ? 'bg-cream-deep text-ink border-gold'
                    : 'border-transparent text-ink-3 hover:text-ink'
                }`}
              >
                {item.name}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
