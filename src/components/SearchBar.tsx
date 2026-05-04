'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useRef, useTransition } from 'react'

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
      <svg
        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        ref={ref}
        defaultValue={defaultValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search a post..."
        className="w-full pl-10 pr-4 py-2.5 rounded-full border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 transition-colors"
      />
    </div>
  )
}
