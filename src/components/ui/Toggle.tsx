'use client'

import { useState } from 'react'

interface ToggleProps {
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  label: string
  className?: string
}

export default function Toggle({ checked, defaultChecked = false, onChange, disabled, label, className = '' }: ToggleProps) {
  const [inner, setInner] = useState(defaultChecked)
  const on = checked ?? inner

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      onClick={() => {
        const next = !on
        setInner(next)
        onChange?.(next)
      }}
      className={`relative inline-flex h-6 w-10 shrink-0 items-center rounded-full p-0.5 transition-colors duration-300 ease-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-40 ${
        on ? 'bg-accent' : 'bg-gold-soft'
      } ${className}`}
    >
      <span
        aria-hidden
        className={`h-5 w-5 rounded-full bg-surface shadow-hairline transition-transform duration-300 ease-soft ${
          on ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  )
}
