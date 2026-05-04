'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import PlatformIcon from '../PlatformIcon'
import ScooplyLogo from '../ScooplyLogo'

interface WhatIsScooplySheetProps {
  open: boolean
  onClose: () => void
}

const FEED_TRACKS = [
  { name: 'AI Foundations', color: '#3B82F6', w: 60 },
  { name: 'Hands-On AI Tools', color: '#F59E0B', w: 40 },
  { name: 'AI with Heart', color: '#8B5CF6', w: 75 },
  { name: 'Stay Curious', color: '#10B981', w: 25 },
] as const

const FEED_COLUMNS = [
  {
    label: 'Inbox',
    cards: [
      { tag: 'Twitter', title: 'GPT-5 benchmark results are in' },
      { tag: 'LinkedIn', title: 'AI in healthcare is a game changer' },
    ],
  },
  {
    label: 'Up Next',
    cards: [
      { tag: 'Instagram', title: 'AI-powered design: a new era' },
      { tag: 'Blog', title: 'How Mistral beat GPT-4 on coding' },
    ],
  },
  {
    label: 'In Progress',
    cards: [
      { tag: 'YouTube', title: 'Building AI agents with LangChain' },
      { tag: 'LinkedIn', title: 'The ethics of AI in education' },
    ],
  },
  {
    label: 'Reading',
    cards: [
      { tag: 'TikTok', title: 'AI-powered design tools' },
      { tag: 'Twitter', title: 'AI generated music that made me cry' },
    ],
  },
] as const

function FeedMiniCard({ tag, title }: { tag: string; title: string }) {
  return (
    <div className="bg-white rounded-lg p-2.5 shadow-sm flex flex-col gap-1.5 mb-2">
      <span className="inline-flex w-fit items-center gap-1 px-1.5 py-0.5 rounded-full bg-zinc-100 text-[9px] text-zinc-500">
        {tag}
      </span>
      <p className="text-[11px] font-semibold text-zinc-800 leading-tight line-clamp-2">{title}</p>
      <div className="flex flex-col gap-1 mt-0.5">
        <div className="h-1 rounded-full bg-zinc-100 w-full" />
        <div className="h-1 rounded-full bg-zinc-100 w-4/5" />
      </div>
    </div>
  )
}

function FeedVisual() {
  return (
    <div className="rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-200/70 shadow-xl">
      <div className="flex h-[300px] sm:h-[380px]">
        <div className="hidden sm:flex flex-col w-44 shrink-0 bg-white border-r border-zinc-100 p-4 gap-4">
          <ScooplyLogo size={20} />
          <div className="flex flex-col gap-3 mt-2">
            {FEED_TRACKS.map((c) => (
              <div key={c.name} className="flex flex-col gap-1.5">
                <p className="text-[10px] font-semibold text-zinc-700">{c.name}</p>
                <div className="h-0.5 rounded-full bg-zinc-100">
                  <div className="h-full rounded-full" style={{ width: `${c.w}%`, backgroundColor: c.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 bg-[#FAFAF8] p-5 overflow-hidden">
          <p className="text-[12px] font-semibold text-zinc-800 mb-3">Good morning, John</p>
          <div className="flex gap-3 overflow-hidden">
            {FEED_COLUMNS.map((col) => (
              <div key={col.label} className="flex-1 min-w-0">
                <p className="text-[10px] text-zinc-500 mb-2">
                  {col.label} <span className="text-zinc-300 ml-1">{col.cards.length}</span>
                </p>
                {col.cards.map((card) => (
                  <FeedMiniCard key={card.title} tag={card.tag} title={card.title} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function TracksVisual() {
  const tracks = [
    { name: 'AI Foundations', color: '#3B82F6', pct: 78 },
    { name: 'Hands-On AI Tools', color: '#F59E0B', pct: 52 },
    { name: 'AI with Heart', color: '#8B5CF6', pct: 64 },
    { name: 'Stay Curious', color: '#10B981', pct: 38 },
  ]
  return (
    <div className="rounded-2xl bg-zinc-50 p-8 sm:p-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
      {tracks.map((t) => (
        <div key={t.name} className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-base font-semibold text-zinc-900">{t.name}</p>
            <span className="text-xs font-mono text-zinc-400">{t.pct}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-zinc-200 overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${t.pct}%`, backgroundColor: t.color }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function PlatformsVisual() {
  const sources = ['twitter', 'linkedin', 'instagram', 'youtube', 'tiktok', 'blog'] as const
  return (
    <div className="rounded-2xl bg-zinc-50 p-10 sm:p-14 flex items-center justify-center">
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 sm:gap-10">
        {sources.map((s) => (
          <div key={s} className="flex flex-col items-center gap-2">
            <PlatformIcon source={s} size="lg" />
            <span className="text-xs text-zinc-500 capitalize">{s === 'blog' ? 'Blogs' : s}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

interface SectionProps {
  eyebrow?: string
  headline: string
  body: string
  visual?: React.ReactNode
}

function Section({ eyebrow, headline, body, visual }: SectionProps) {
  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col gap-5 max-w-2xl">
        {eyebrow && (
          <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-zinc-400">{eyebrow}</span>
        )}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 leading-[1.1] whitespace-pre-line">
          {headline}
        </h2>
        <p className="text-zinc-500 leading-relaxed text-[15px]">{body}</p>
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
        className={`absolute inset-y-0 right-0 w-[75vw] bg-white rounded-l-3xl shadow-2xl transition-transform duration-300 ease-out ${
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
            <Section
              eyebrow="What is Scooply"
              headline={`Stay Ahead of the AI Curve\nWithout Getting Lost in the Noise`}
              body="AI is everywhere, and it's moving at lightning speed. Every day there's something new to learn, something breaking, something that could change how you work. But keeping up feels impossible — there's too much noise, too many sources, too much information all at once. That's where Scooply comes in. We've built a platform that filters the chaos and brings you the AI news that actually matters, tailored to your level and your interests. No overwhelm. Just signal."
              visual={<FeedVisual />}
            />

            <Section
              eyebrow="Built around you"
              headline={`A feed that knows\nwhere you are in your AI journey`}
              body="During onboarding we ask two simple questions: how comfortable are you with AI, and what do you actually care about? From there, every story you see is filtered against your proficiency level — beginner, intermediate, or advanced — and your interests, whether that's design, coding, product, video, or anything in between. The bars on the left of your dashboard fill up as you read, so the more you use Scooply, the better it knows what to show you next."
              visual={<TracksVisual />}
            />

            <Section
              eyebrow="Curated, not crawled"
              headline={`From every corner\nof the AI world`}
              body="The best AI takes don't live in one place. Researchers post threads on Twitter. Founders write essays on LinkedIn. Designers ship demos on Instagram. Engineers explain on YouTube. Storytellers riff on TikTok. And the deepest dives still live on blogs. Scooply pulls from all of them — every post is hand-vetted by our team, attached to the original source, and one click away from the creator who made it. We don't generate content. We curate it."
              visual={<PlatformsVisual />}
            />

            <Section
              eyebrow="Get started"
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
