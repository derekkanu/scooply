'use client'

import { useState } from 'react'
import { INTEREST_OPTIONS } from '@/lib/signup'
import Button from '@/components/ui/Button'
import Chip from '@/components/ui/Chip'

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
            <Chip key={opt.id} selected={active} onClick={() => toggle(opt.id)}>
              {opt.label}
            </Chip>
          )
        })}
      </div>

      <p className="text-xs text-ink-4">
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
