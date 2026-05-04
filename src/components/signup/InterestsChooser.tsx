'use client'

import { useState } from 'react'
import { INTEREST_OPTIONS } from '@/lib/signup'
import Button from '@/components/ui/Button'

interface InterestsChooserProps {
  initialSelected?: string[]
  action: (formData: FormData) => void
}

export default function InterestsChooser({ initialSelected = [], action }: InterestsChooserProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set(initialSelected))

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <form action={action} className="flex flex-col gap-5">
      {Array.from(selected).map((id) => (
        <input key={id} type="hidden" name="interests" value={id} />
      ))}

      <div className="flex flex-wrap gap-2">
        {INTEREST_OPTIONS.map((opt) => {
          const active = selected.has(opt.id)
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggle(opt.id)}
              aria-pressed={active}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'border-zinc-900 bg-zinc-900 text-white'
                  : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50'
              }`}
            >
              {opt.label}
            </button>
          )
        })}
      </div>

      <p className="text-xs text-zinc-400">
        {selected.size === 0
          ? 'Pick at least one to continue.'
          : `${selected.size} selected — pick a few for a sharper feed.`}
      </p>

      <Button type="submit" size="lg" className="w-full" disabled={selected.size === 0}>
        Continue
      </Button>
    </form>
  )
}
