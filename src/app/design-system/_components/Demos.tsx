'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Post } from '@/lib/types'
import Tabs from '@/components/ui/Tabs'
import Chip from '@/components/ui/Chip'
import Toggle from '@/components/ui/Toggle'
import Tooltip from '@/components/ui/Tooltip'
import Button from '@/components/ui/Button'
import Reveal from '@/components/ui/Reveal'
import Orb from '@/components/ui/Orb'
import ListRow from '@/components/ui/ListRow'
import PreviewSheet from '@/components/feed/PreviewSheet'
import { Code, Layers, Lock, Sparkle } from '@/components/ui/icons'

/** Scopes light/dark to the showcase so the rest of the app is unaffected. */
export function ThemeScope({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('sc-ds-theme')
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restore persisted preference after hydration
      if (saved === 'dark' || saved === 'light') setTheme(saved)
    } catch {}
  }, [])

  function flip(next: 'light' | 'dark') {
    setTheme(next)
    try {
      localStorage.setItem('sc-ds-theme', next)
    } catch {}
  }

  return (
    <div data-theme={theme} className="sc-field min-h-screen text-ink">
      <div className="fixed right-4 bottom-4 z-40 sm:right-6 sm:bottom-6">
        <div className="sc-glass inline-flex rounded-full p-1 shadow-float" role="radiogroup" aria-label="Theme">
          {(['light', 'dark'] as const).map((t) => (
            <button
              key={t}
              type="button"
              role="radio"
              aria-checked={theme === t}
              onClick={() => flip(t)}
              className={`h-8 rounded-full px-3.5 text-[12px] font-medium capitalize transition-[background-color,color,box-shadow] duration-200 ease-soft ${
                theme === t ? 'bg-surface text-ink shadow-hairline' : 'text-ink-3 hover:text-ink'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      {children}
    </div>
  )
}

export function TabsDemo() {
  const items = [
    { id: 'all', label: 'All' },
    { id: 'foundations', label: 'Foundations' },
    { id: 'tools', label: 'Tools' },
    { id: 'heart', label: 'With heart' },
    { id: 'curious', label: 'Stay curious' },
  ]
  const [value, setValue] = useState('tools')
  return <Tabs items={items} value={value} onChange={setValue} />
}

export function ChipsDemo() {
  const options = ['Design', 'Dev', 'Product', 'Research', 'Video', 'Music']
  const [picked, setPicked] = useState<Set<string>>(new Set(['Dev', 'Research']))
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <Chip
          key={o}
          selected={picked.has(o)}
          onClick={() =>
            setPicked((p) => {
              const n = new Set(p)
              if (n.has(o)) n.delete(o)
              else n.add(o)
              return n
            })
          }
        >
          {o}
        </Chip>
      ))}
    </div>
  )
}

export function ControlsDemo() {
  return (
    <div className="flex flex-col gap-3">
      <div className="sc-card flex items-center justify-between gap-4 rounded-[16px] p-4">
        <div className="flex items-center gap-3">
          <Lock size={14} className="text-ink-4" />
          <div>
            <p className="text-sm font-medium text-ink">Digest emails</p>
            <p className="text-[12px] text-ink-3">Weekly, every Monday</p>
          </div>
        </div>
        <Tooltip content="Sent every Monday">
          <Toggle label="Digest emails" defaultChecked />
        </Tooltip>
      </div>
      <div className="sc-card flex items-center justify-between gap-4 rounded-[16px] p-4">
        <p className="text-sm font-medium text-ink">Read scoops aloud</p>
        <Toggle label="Read scoops aloud" />
      </div>
    </div>
  )
}

export function JumpListDemo() {
  const [sel, setSel] = useState('beginner')
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      <ListRow icon={<Layers />} title="Your sources" subtitle="6 platforms connected" href="#components" />
      <ListRow icon={<Code />} title="Interests" subtitle="Dev, Research" href="#components" />
      <ListRow
        icon={<Sparkle />}
        title="Beginner"
        subtitle="Fundamentals and big-picture stories"
        selected={sel === 'beginner'}
        onClick={() => setSel('beginner')}
      />
      <ListRow
        icon={<Sparkle />}
        title="Advanced"
        subtitle="Research, benchmarks, expert takes"
        selected={sel === 'advanced'}
        onClick={() => setSel('advanced')}
      />
    </div>
  )
}

export function MotionDemo() {
  const [run, setRun] = useState(0)
  const dirs = [
    { dir: 'up', label: 'Rise — feed items' },
    { dir: 'left', label: 'Drift — drawers' },
    { dir: 'none', label: 'Fade — overlays' },
  ] as const
  return (
    <div>
      <div key={run} className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {dirs.map((d, i) => (
          <Reveal key={d.dir} dir={d.dir} delay={i * 80}>
            <div className="sc-card flex h-28 flex-col justify-between rounded-[16px] p-4">
              <Orb palette={(['ember', 'tide', 'dusk'] as const)[i]} size={20} />
              <p className="text-[13px] text-ink-3">{d.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <Button variant="ghost" size="sm" className="mt-3" onClick={() => setRun((r) => r + 1)}>
        Replay
      </Button>
    </div>
  )
}

const DEMO_POST: Post = {
  id: 'ds-demo-preview',
  title: 'Small models are quietly getting very good at reasoning',
  content:
    'A new wave of compact open models now matches last year’s frontier systems on maths and code benchmarks.\n\nWhy it matters: you can run capable assistants on a laptop, which lowers cost and keeps data private. Researchers credit better training data rather than bigger architectures.\n\nWhat to watch: whether the gains hold on messier real-world tasks.',
  source: 'linkedin',
  sourceUrl: 'https://www.linkedin.com',
  sourceHandle: '@airesearchdaily',
  categoryId: 'ai-foundations',
  tags: ['Models', 'Open source', 'Benchmarks'],
  publishedAt: '2026-10-10',
  createdAt: '2026-10-10',
}

export function PreviewDemo() {
  const [open, setOpen] = useState(false)
  const [summary, setSummary] = useState<string | null>(null)
  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset to the loading state each time the sheet opens
    setSummary(null)
    const t = window.setTimeout(() => setSummary(DEMO_POST.content), 1800)
    return () => window.clearTimeout(t)
  }, [open])

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Sparkle size={14} className="text-accent" />
        Open preview
      </Button>
      <PreviewSheet post={DEMO_POST} open={open} onClose={close} summary={summary} />
    </>
  )
}
