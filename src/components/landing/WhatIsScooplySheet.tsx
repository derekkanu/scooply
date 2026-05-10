'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import PlatformIcon from '../PlatformIcon'
import ScooplyLogo from '../ScooplyLogo'

interface WhatIsScooplySheetProps {
  open: boolean
  onClose: () => void
}

const SIDEBAR_ITEMS = [
  { label: 'All', active: true },
  { label: 'AI Foundations', active: false },
  { label: 'Hands-On AI Tools', active: false },
  { label: 'AI with Heart', active: false },
  { label: 'Stay Curious', active: false },
] as const

const SIDEBAR_SECONDARY = ['Saved', 'Progress', 'Settings'] as const

const NEW_SCOOPS = [
  { tag: 'Twitter', title: 'GPT-5 benchmark results just dropped' },
  { tag: 'LinkedIn', title: 'Why AI literacy is the new digital literacy' },
] as const

const WALL_POSTS = [
  { handle: '@man_vity', title: "AI's Impact on Human Creativity", saved: true },
  { handle: '@samantha', title: "Building agents that don't break in production", saved: false },
  { handle: '@dev_notes', title: 'A simple mental model for prompt caching', saved: false },
] as const

function MiniDot({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden
      className={`w-2 h-2 rounded-full shrink-0 ${
        active ? 'bg-zinc-900' : 'border border-zinc-400/70 bg-transparent'
      }`}
    />
  )
}

function DashboardVisual() {
  return (
    <div className="rounded-2xl overflow-hidden bg-[#D9D9D9] border border-zinc-400/30 shadow-xl">
      <div className="flex h-[360px] sm:h-[440px]">
        {/* Sidebar */}
        <div className="hidden sm:flex flex-col w-44 shrink-0 bg-[#D9D9D9] border-r border-zinc-400/40 p-5 gap-4">
          <ScooplyLogo size={18} showWordmark={false} />
          <div className="flex flex-col gap-3 mt-2">
            {SIDEBAR_ITEMS.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <MiniDot active={item.active} />
                <span
                  className={`text-[11px] truncate ${
                    item.active ? 'font-semibold text-zinc-900' : 'font-medium text-zinc-600'
                  }`}
                >
                  {item.label}
                </span>
              </div>
            ))}
            <div className="my-1 border-t border-zinc-400/40" />
            {SIDEBAR_SECONDARY.map((label) => (
              <div key={label} className="flex items-center gap-2">
                <MiniDot active={false} />
                <span className="text-[11px] font-medium text-zinc-600 truncate">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main */}
        <div className="flex-1 bg-[#D9D9D9] p-5 overflow-hidden">
          <p className="text-[15px] font-bold text-zinc-900">Hello Alex</p>
          <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">
            You explored <span className="font-semibold text-red-500">8</span> stories this week out of the{' '}
            <span className="font-semibold text-emerald-500">42</span> we curated.
          </p>

          <p className="text-[10px] font-medium text-zinc-700 mt-4 mb-2">New scoop</p>
          <div className="grid grid-cols-2 gap-2">
            {NEW_SCOOPS.map((s) => (
              <div
                key={s.title}
                className="rounded-xl border border-zinc-400/40 bg-white/20 backdrop-blur-[1px] p-2.5"
              >
                <p className="text-[9px] text-zinc-500 mb-1">{s.tag}</p>
                <p className="text-[10px] font-semibold text-zinc-900 leading-snug line-clamp-2">{s.title}</p>
              </div>
            ))}
          </div>

          <p className="text-[10px] font-medium text-zinc-700 mt-4 mb-2">Your wall</p>
          <div className="flex flex-col gap-2">
            {WALL_POSTS.slice(0, 2).map((p) => (
              <div
                key={p.title}
                className="rounded-xl bg-white p-2.5 flex items-start gap-2 shadow-sm"
              >
                <div className="w-5 h-5 rounded-full bg-zinc-200 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] text-zinc-500">{p.handle}</p>
                  <p className="text-[10px] font-semibold text-zinc-900 leading-snug line-clamp-1">
                    {p.title}
                  </p>
                </div>
                <span
                  aria-hidden
                  className={`text-[10px] ${p.saved ? 'text-zinc-900' : 'text-zinc-300'}`}
                >
                  ▮
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function SavedScoopsVisual() {
  return (
    <div className="rounded-2xl bg-[#D9D9D9] border border-zinc-400/30 p-6 sm:p-8 shadow-xl">
      <p className="text-[20px] font-bold text-zinc-900 tracking-tight">Saved scoops</p>
      <p className="text-[11px] text-zinc-500 mt-1">3 scoops saved.</p>

      <div className="mt-5 flex flex-col gap-3">
        {WALL_POSTS.map((p) => (
          <div
            key={p.title}
            className="rounded-2xl bg-white p-4 flex items-start gap-3 shadow-sm"
          >
            <div className="w-8 h-8 rounded-full bg-zinc-200 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-zinc-500">{p.handle}</p>
              <p className="text-[13px] font-semibold text-zinc-900 leading-snug">{p.title}</p>
            </div>
            <span aria-hidden className="text-zinc-900 text-sm">
              ▮
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProgressVisual() {
  const cats = [
    { name: 'AI Foundations', color: '#3B82F6', viewed: 9, total: 12, level: 'Intermediate', levelPct: 66 },
    { name: 'Hands-On AI Tools', color: '#F59E0B', viewed: 5, total: 10, level: 'Beginner', levelPct: 33 },
    { name: 'AI with Heart', color: '#8B5CF6', viewed: 7, total: 11, level: 'Advanced', levelPct: 100 },
    { name: 'Stay Curious', color: '#10B981', viewed: 3, total: 9, level: 'Beginner', levelPct: 33 },
  ]
  return (
    <div className="rounded-2xl bg-[#D9D9D9] border border-zinc-400/30 p-6 sm:p-8 shadow-xl">
      <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
        <div className="flex items-baseline justify-between">
          <p className="text-[12px] font-semibold text-zinc-900">Cumulative engagement</p>
          <span className="text-[10px] text-zinc-400">across all categories</span>
        </div>
        <div className="flex items-baseline gap-2 mt-3">
          <span className="text-3xl font-bold text-zinc-900 tabular-nums">24</span>
          <span className="text-[11px] text-zinc-500">of 42 stories explored</span>
        </div>
        <div className="relative h-2 rounded-full bg-zinc-100 overflow-hidden mt-3">
          <div className="absolute inset-y-0 left-0 rounded-full bg-zinc-900" style={{ width: '57%' }} />
        </div>
        <p className="text-[10px] text-zinc-400 mt-2 tabular-nums">57% of catalog</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {cats.map((c) => (
          <div key={c.name} className="bg-white rounded-2xl shadow-sm p-4">
            <div className="flex items-start justify-between">
              <p
                className="text-[10px] font-bold tracking-[0.14em] uppercase"
                style={{ color: c.color }}
              >
                {c.name}
              </p>
              <span
                className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                style={{ backgroundColor: `${c.color}18`, color: c.color }}
              >
                {c.viewed}/{c.total}
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-3">
              <p className="text-[10px] text-zinc-500">Engagement</p>
              <p className="text-[10px] font-semibold text-zinc-900 tabular-nums">
                {Math.round((c.viewed / c.total) * 100)}%
              </p>
            </div>
            <div className="relative h-1.5 rounded-full bg-zinc-100 overflow-hidden mt-1.5">
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ width: `${(c.viewed / c.total) * 100}%`, backgroundColor: c.color }}
              />
            </div>
            <div className="flex items-baseline justify-between mt-3">
              <p className="text-[10px] text-zinc-500">Your level</p>
              <p className="text-[10px] font-semibold text-zinc-900">{c.level}</p>
            </div>
            <div className="relative h-1.5 rounded-full bg-zinc-100 overflow-hidden mt-1.5">
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ width: `${c.levelPct}%`, backgroundColor: c.color, opacity: 0.55 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PlatformsVisual() {
  const sources = ['twitter', 'linkedin', 'instagram', 'youtube', 'tiktok', 'blog'] as const
  return (
    <div className="rounded-2xl bg-zinc-100/60 border border-zinc-300/50 p-10 sm:p-14 flex items-center justify-center">
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 sm:gap-10">
        {sources.map((s) => (
          <div key={s} className="flex flex-col items-center gap-2">
            <PlatformIcon source={s} size="lg" />
            <span className="text-xs text-zinc-600 capitalize">{s === 'blog' ? 'Blogs' : s}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

interface SectionProps {
  headline: string
  body: string
  visual?: React.ReactNode
}

function Section({ headline, body, visual }: SectionProps) {
  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col gap-5 max-w-2xl">
        <h2 className="text-2xl sm:text-3xl md:text-[40px] font-bold tracking-tight text-zinc-900 leading-[1.1] whitespace-pre-line">
          {headline}
        </h2>
        <p className="text-zinc-600 leading-relaxed text-[15px]">{body}</p>
      </div>
      {visual}
    </section>
  )
}

export default function WhatIsScooplySheet({ open, onClose }: WhatIsScooplySheetProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <div
      className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/55 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="What is Scooply"
        className={`absolute inset-y-0 right-0 w-[75vw] bg-[#D9D9D9] rounded-l-3xl shadow-2xl transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-7 left-8 z-10 text-zinc-700 hover:text-zinc-900 transition-colors"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" d="M6 6L18 18M18 6L6 18" />
          </svg>
        </button>

        <div className="h-full overflow-y-auto">
          <div className="max-w-5xl mx-auto px-6 sm:px-12 py-14 sm:py-20 flex flex-col gap-20 sm:gap-28">
            <section className="flex flex-col gap-8">
              <ScooplyLogo size={64} showWordmark={false} />
              <div className="flex flex-col gap-5 max-w-2xl">
                <h2 className="text-2xl sm:text-3xl md:text-[40px] font-bold tracking-tight text-zinc-900 leading-[1.1]">
                  Stay Ahead of the AI Curve
                  <br />
                  Without Getting Lost in the Noise
                </h2>
                <p className="text-zinc-600 leading-relaxed text-[15px]">
                  AI is everywhere, and it&apos;s moving at lightning speed. Every day there&apos;s something new
                  to learn, something breaking, something that could change how you work. But keeping up feels
                  impossible — there&apos;s too much noise, too many sources, too much information all at once.
                  That&apos;s where Scooply comes in. We&apos;ve built a platform that filters the chaos and
                  brings you the AI news that actually matters, tailored to your level and your interests. No
                  overwhelm. Just signal.
                </p>
              </div>
            </section>

            <Section
              headline={`A dashboard built\naround your wall`}
              body="Sign in and you land on a dashboard that feels like yours. The sidebar lets you switch between every category we cover — AI Foundations, Hands-On Tools, AI with Heart, Stay Curious — or stay on All for the full mix. On the All view we surface the freshest picks under New scoop, with everything else stacked below on Your wall. Pick a category and the wall narrows to just that beat. Search and your saved scoops sit on the right, always one glance away."
              visual={<DashboardVisual />}
            />

            <Section
              headline={`Save the scoops\nyou want to come back to`}
              body="Hit the bookmark on any post and it lands in your Saved scoops — both in the right rail of your dashboard and on a dedicated page where they live until you decide otherwise. No accounts to wire up, no Read-It-Later app to juggle. Save it once, find it later, open the original source in one tap."
              visual={<SavedScoopsVisual />}
            />

            <Section
              headline={`Watch your AI literacy\nlevel up over time`}
              body="The Progress page shows how far you&apos;ve gone — total stories explored against the full catalog, plus a per-category breakdown. Each category card tracks both your engagement and your current proficiency: beginner, intermediate, or advanced. Take the proficiency survey any time to recalibrate your level, and the feed adapts to match where you actually are."
              visual={<ProgressVisual />}
            />

            <Section
              headline={`From every corner\nof the AI world`}
              body="The best AI takes don't live in one place. Researchers post threads on Twitter. Founders write essays on LinkedIn. Designers ship demos on Instagram. Engineers explain on YouTube. Storytellers riff on TikTok. And the deepest dives still live on blogs. Scooply pulls from all of them — every post is hand-vetted by our team, attached to the original source, and one click away from the creator who made it. We don't generate content. We curate it."
              visual={<PlatformsVisual />}
            />

            <Section
              headline={`Your feed,\nyour pace, your way.`}
              body="Tell us a little about yourself, pick the platforms you trust, and we'll build a feed that's actually worth your morning coffee. Two minutes to onboard. A lifetime of staying ahead."
            />

            <div className="-mt-8">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-black text-white text-sm font-medium hover:bg-zinc-800 transition-colors"
              >
                Take the survey
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
