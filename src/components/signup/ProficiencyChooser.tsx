'use client'

import { useState } from 'react'
import { PROFICIENCY_OPTIONS } from '@/lib/signup'
import type { Proficiency } from '@/lib/auth'
import Button from '@/components/ui/Button'
import Orb, { PROFICIENCY_DENSITY } from '@/components/ui/Orb'

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
            className={`sc-card sc-card-lift flex cursor-pointer items-center gap-4 rounded-[16px] p-4 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent ${
              active ? 'outline-2 -outline-offset-1 outline-accent/60' : ''
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
            <Orb palette={active ? 'ember' : 'mono'} variant="pixel" density={PROFICIENCY_DENSITY[opt.id]} size={36} resolution={13} />
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="text-sm font-semibold text-ink">{opt.title}</span>
              <span className="text-xs leading-relaxed text-ink-3">{opt.description}</span>
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
