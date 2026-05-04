'use client'

import { useState } from 'react'
import { PROFICIENCY_OPTIONS } from '@/lib/signup'
import type { Proficiency } from '@/lib/auth'
import Button from '@/components/ui/Button'

interface ProficiencyChooserProps {
  initialValue?: Proficiency
  action: (formData: FormData) => void
}

export default function ProficiencyChooser({ initialValue, action }: ProficiencyChooserProps) {
  const [selected, setSelected] = useState<Proficiency | undefined>(initialValue)

  return (
    <form action={action} className="flex flex-col gap-3">
      {PROFICIENCY_OPTIONS.map((opt) => {
        const active = selected === opt.id
        return (
          <label
            key={opt.id}
            className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors ${
              active
                ? 'border-zinc-900 bg-zinc-50'
                : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50/40'
            }`}
          >
            <input
              type="radio"
              name="proficiency"
              value={opt.id}
              checked={active}
              onChange={() => setSelected(opt.id)}
              className="sr-only"
            />
            <span
              className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                active ? 'border-zinc-900' : 'border-zinc-300'
              }`}
            >
              {active && <span className="h-2.5 w-2.5 rounded-full bg-zinc-900" />}
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-zinc-900">{opt.title}</span>
              <span className="text-xs text-zinc-500 leading-relaxed">{opt.description}</span>
            </span>
          </label>
        )
      })}

      <Button type="submit" size="lg" className="w-full mt-3" disabled={!selected}>
        Continue
      </Button>
    </form>
  )
}
