'use client'

import { useState } from 'react'
import PlatformIcon from '../PlatformIcon'
import Button from '@/components/ui/Button'
import { ALL_PLATFORM_IDS, PLATFORM_OPTIONS } from '@/lib/signup'
import type { Source } from '@/lib/types'

interface PlatformDeselectProps {
  initialSelected?: Source[]
  action: (formData: FormData) => void
  skipAction?: () => void
  submitLabel?: string
}

export default function PlatformDeselect({
  initialSelected,
  action,
  skipAction,
  submitLabel = 'Finish setup',
}: PlatformDeselectProps) {
  const [selected, setSelected] = useState<Set<Source>>(
    () => new Set(initialSelected ?? ALL_PLATFORM_IDS),
  )

  function toggle(id: Source) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {PLATFORM_OPTIONS.map((p) => {
          const active = selected.has(p.id)
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => toggle(p.id)}
              aria-pressed={active}
              className={`relative flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all ${
                active
                  ? 'border-zinc-900 bg-white'
                  : 'border-zinc-200 bg-zinc-50 opacity-50 hover:opacity-80'
              }`}
            >
              <PlatformIcon source={p.id} size="md" className={active ? '' : 'grayscale'} />
              <span className="text-sm font-medium text-zinc-800">{p.label}</span>
              {!active && (
                <span className="absolute top-2 right-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                  Off
                </span>
              )}
            </button>
          )
        })}
      </div>

      <p className="text-xs text-zinc-400">
        Tap to turn off any source you don't want in your feed. We'll keep the rest.
      </p>

      <form action={action} className="flex flex-col gap-3">
        {Array.from(selected).map((id) => (
          <input key={id} type="hidden" name="platforms" value={id} />
        ))}
        <Button type="submit" size="lg" className="w-full">
          {submitLabel}
        </Button>
      </form>

      {skipAction && (
        <form action={skipAction}>
          <button
            type="submit"
            className="w-full text-sm text-zinc-500 hover:text-zinc-900 transition-colors py-2"
          >
            Skip — keep all sources
          </button>
        </form>
      )}
    </div>
  )
}
