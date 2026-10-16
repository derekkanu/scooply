'use client'

import { useState } from 'react'
import PlatformIcon from '@/components/PlatformIcon'
import { PLATFORM_OPTIONS } from '@/lib/signup'
import { SOURCE_LABEL } from '@/lib/sources'
import type { Source } from '@/lib/types'

/* ── Row 1 · Keep up: a morning's posts, with the noise visibly cut ──────────── */

const MORNING: { time: string; title: string; cut?: string }[] = [
  { time: '06:12', title: 'Claude 4.7 ships with a 2M-token context' },
  { time: '06:40', title: '“AI will replace every designer by Friday”', cut: 'Hot take' },
  { time: '07:05', title: 'Claude 4.7 is here — thread', cut: 'Duplicate ×3' },
  { time: '07:18', title: 'MIT robots learn to cook from one video' },
  { time: '07:31', title: 'Comment “AI” and I’ll DM you my prompts', cut: 'Engagement bait' },
  { time: '08:02', title: 'The state of open-source LLMs in 2026' },
]

function MorningCut() {
  return (
    <ol className="divide-y divide-line border-y border-line">
      {MORNING.map((m) => (
        <li key={m.time} className="flex items-baseline gap-4 py-2.5 text-[14px]">
          <span className="w-11 shrink-0 tabular-nums text-ink-4">{m.time}</span>
          <span className={`min-w-0 flex-1 truncate ${m.cut ? 'text-ink-4 line-through decoration-ink-4/60' : 'text-ink'}`}>{m.title}</span>
          {m.cut && <span className="shrink-0 text-[12px] text-ink-4">{m.cut}</span>}
        </li>
      ))}
    </ol>
  )
}

/* ── Row 2 · Learn at your level: one story, rewritten for each depth ─────────── */

const LEVELS = [
  {
    id: 'beginner',
    label: 'Beginner',
    text: 'A model can now hold about 1,500 pages in mind at once, so it can read a whole codebase or book before answering.',
  },
  {
    id: 'intermediate',
    label: 'Intermediate',
    text: 'A 2M-token window means whole repos fit in one prompt. Expect fewer chunking hacks, but watch cost and latency on long calls.',
  },
  {
    id: 'advanced',
    label: 'Advanced',
    text: 'Retrieval at 2M tokens holds up on needle tests; the open question is degradation past ~800k on multi-hop reasoning.',
  },
] as const

function LevelRewrite() {
  const [level, setLevel] = useState<(typeof LEVELS)[number]['id']>('beginner')
  const current = LEVELS.find((l) => l.id === level)!
  return (
    <div>
      <div role="tablist" aria-label="Reading level" className="flex gap-5 border-b border-line">
        {LEVELS.map((l) => (
          <button
            key={l.id}
            type="button"
            role="tab"
            aria-selected={l.id === level}
            onClick={() => setLevel(l.id)}
            className={`-mb-px border-b pb-2.5 text-[14px] transition-colors duration-200 ease-soft ${
              l.id === level ? 'border-ink text-ink' : 'border-transparent text-ink-4 hover:text-ink-2'
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>
      <p className="mt-5 text-[13px] text-ink-4">Claude 4.7 ships with a 2M-token context</p>
      <p key={level} className="sc-reveal mt-2 min-h-[4.5em] text-[17px] leading-[1.5] text-ink" data-dir="none">
        {current.text}
      </p>
    </div>
  )
}

/* ── Row 3 · Every platform: the sources, each with its own switch ────────────── */

function SourceSwitches() {
  const [off, setOff] = useState<Set<Source>>(() => new Set(['tiktok']))
  const toggle = (id: Source) =>
    setOff((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  return (
    <div>
      <ul className="divide-y divide-line border-y border-line">
        {PLATFORM_OPTIONS.map((p) => {
          const on = !off.has(p.id)
          const name = p.id === 'blog' ? 'Blogs' : SOURCE_LABEL[p.id]
          return (
            <li key={p.id} className="flex items-center gap-3 py-2">
              <PlatformIcon source={p.id} size="sm" tone="brand" className={`transition-opacity duration-300 ${on ? '' : 'opacity-30 grayscale'}`} />
              <span className={`flex-1 text-[14px] transition-colors ${on ? 'text-ink' : 'text-ink-4'}`}>{name}</span>
              <button
                type="button"
                role="switch"
                aria-checked={on}
                aria-label={`${name} in your feed`}
                onClick={() => toggle(p.id)}
                className={`relative h-5 w-9 rounded-full transition-colors duration-200 ease-soft ${on ? 'bg-ink' : 'bg-ink/15'}`}
              >
                <span
                  aria-hidden
                  className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-[var(--sc-paper)] transition-transform duration-200 ease-soft ${on ? 'translate-x-4' : ''}`}
                />
              </button>
            </li>
          )
        })}
      </ul>
      <p className="mt-3 text-[13px] tabular-nums text-ink-4">
        {PLATFORM_OPTIONS.length - off.size} of {PLATFORM_OPTIONS.length} sources in your feed
      </p>
    </div>
  )
}

/* ── The section ───────────────────────────────────────────────────────────────── */

const ROWS = [
  {
    id: 'keep-up',
    n: '01',
    label: 'Keep up',
    title: 'Keep up without the noise',
    body: 'Hot takes, reposts and bait never reach you. What’s left is the morning’s news, once.',
    demo: <MorningCut />,
  },
  {
    id: 'level-up',
    n: '02',
    label: 'Your level',
    title: 'Learn at your own level',
    body: 'The same story reads differently for a beginner and an expert. Pick a level and the summary follows.',
    demo: <LevelRewrite />,
  },
  {
    id: 'every-platform',
    n: '03',
    label: 'Every source',
    title: 'Follow every platform in one place',
    body: 'Six platforms read for you, in one feed. Switch off any you’d rather skip.',
    demo: <SourceSwitches />,
  },
]

/**
 * "In action" as a ledger: a label column, the claim, and a small working piece of the
 * product that proves it. Each row's proof is different in kind (a cut list, a rewrite,
 * a set of switches), so the section never settles into a repeating card-and-bullets beat.
 */
export default function InAction() {
  return (
    <div className="border-t border-ink/70">
      {ROWS.map((r) => (
        <article
          key={r.id}
          id={r.id}
          className="sc-scroll sc-ripple grid scroll-mt-24 grid-cols-1 gap-6 border-b border-line py-10 md:grid-cols-[150px_minmax(0,1fr)_minmax(0,1.15fr)] md:gap-10 md:py-14"
        >
          <p className="flex items-baseline gap-3 text-[13px] text-ink-3 md:flex-col md:gap-1">
            <span className="tabular-nums text-ink">{r.n}</span>
            {r.label}
          </p>
          <div className="max-w-[34ch]">
            <h3 className="font-display text-[26px] leading-[1.15] text-ink sm:text-[30px]">{r.title}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-3">{r.body}</p>
          </div>
          <div>{r.demo}</div>
        </article>
      ))}
    </div>
  )
}
