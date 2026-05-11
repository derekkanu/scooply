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
        <div className="flex items-center gap-3 px-6 pb-1 w-max">
          {ITEMS.map((item) => {
            const isActive = current === item.id
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`shrink-0 px-5 py-2.5 rounded-full text-[14px] font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-zinc-900 text-white'
                    : 'border border-zinc-400/70 text-zinc-900 hover:border-zinc-500'
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
