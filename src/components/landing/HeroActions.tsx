'use client'

import { useState } from 'react'
import Link from 'next/link'
import WhatIsScooplySheet from './WhatIsScooplySheet'

export default function HeroActions() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="px-7 py-3.5 rounded-full bg-black text-white text-sm font-medium hover:bg-zinc-800 transition-colors"
        >
          What is Scooply?
        </button>
        <Link
          href="/login"
          className="group px-7 py-3.5 rounded-full bg-transparent text-zinc-900 text-sm font-medium border border-zinc-400/70 hover:border-zinc-500 transition-colors flex items-center gap-2"
        >
          Take a survey
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="transition-transform group-hover:translate-x-0.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>

      <WhatIsScooplySheet open={open} onClose={() => setOpen(false)} />
    </>
  )
}
