'use client'

import { useState } from 'react'
import Tabs from '@/components/ui/Tabs'
import BentoCard from '@/components/ui/BentoCard'

const WAYS = [
  {
    id: 'keep-up',
    label: 'Keep up',
    tone: 'paper',
    art: 'mug',
    tag: 'Daily scoop',
    title: 'Catch up on AI in five minutes a day',
    body: 'One calm feed of the stories that moved overnight, read for you across every platform.',
    href: '#keep-up',
  },
  {
    id: 'level-up',
    label: 'Level up',
    tone: 'paper',
    art: 'book',
    tag: 'Your level',
    title: 'Go from curious to confident',
    body: 'Stories pitched at the depth you want, so every read teaches you something without losing you.',
    href: '#level-up',
  },
] as const

/** Two-option toggle over a feature card. */
export default function TwoWays() {
  const [value, setValue] = useState<string>(WAYS[0].id)
  const way = WAYS.find((w) => w.id === value)!

  return (
    <div className="flex flex-col gap-10">
      <Tabs items={WAYS.map(({ id, label }) => ({ id, label }))} value={value} onChange={setValue} tone="mono" className="mx-auto w-full max-w-[320px]" />

      <BentoCard
        key={way.id}
        tone={way.tone}
        layout="side"
        art={way.art}
        tag={way.tag}
        title={way.title}
        body={way.body}
        cta={{ label: 'Learn more', href: way.href }}
        className="sc-scroll sc-ripple"
      />
    </div>
  )
}
