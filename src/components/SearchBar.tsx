'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useRef, useTransition } from 'react'
import { Search } from '@/components/ui/icons'

export default function SearchBar({ defaultValue }: { defaultValue?: string }) {
  const router = useRouter()
  const params = useSearchParams()
  const [, startTransition] = useTransition()
  const ref = useRef<HTMLInputElement>(null)

  function handleChange(value: string) {
    startTransition(() => {
      const p = new URLSearchParams(params.toString())
      if (value.trim()) {
        p.set('q', value.trim())
      } else {
        p.delete('q')
      }
      router.push(`/dashboard?${p.toString()}`)
    })
  }

  return (
    <div className="relative w-full">
      <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-4" />
      <input
        ref={ref}
        defaultValue={defaultValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search scoops…"
        className="w-full h-11 pl-11 pr-4 rounded-full sc-glass shadow-hairline text-base sm:text-sm text-ink placeholder:text-ink-4 focus:outline-none focus:ring-2 focus:ring-ink/10 transition-shadow duration-200 ease-soft"
      />
    </div>
  )
}
