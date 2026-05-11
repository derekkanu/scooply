'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import ScooplyLogo from '../ScooplyLogo'

interface WhatIsScooplySheetProps {
  open: boolean
  onClose: () => void
}

function ChaosToSignal() {
  const cell = 10
  const dot = 7
  const GRID_W = 56
  const GRID_H = 22
  const rand = (i: number, j: number) => {
    const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453
    return s - Math.floor(s)
  }
  const cells: Array<{ x: number; y: number; opacity: number }> = []
  for (let i = 0; i < GRID_W; i++) {
    for (let j = 0; j < GRID_H; j++) {
      const xNorm = i / (GRID_W - 1)
      const inBand = j >= 4 && j <= GRID_H - 5
      const threshold = xNorm < 0.55 ? 0.22 + xNorm * 0.4 : 0.95
      const noise = rand(i, j)
      if (xNorm < 0.55) {
        if (noise < threshold) {
          cells.push({ x: i, y: j, opacity: 0.55 + noise * 0.45 })
        }
      } else if (inBand) {
        cells.push({ x: i, y: j, opacity: 1 })
      }
    }
  }
  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 sm:p-12 flex items-center justify-center overflow-hidden">
      <svg
        aria-hidden
        viewBox={`0 0 ${GRID_W * cell} ${GRID_H * cell}`}
        className="w-full max-w-3xl h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        {cells.map((c, idx) => (
          <rect
            key={idx}
            x={c.x * cell + (cell - dot) / 2}
            y={c.y * cell + (cell - dot) / 2}
            width={dot}
            height={dot}
            fill="#0A0A0A"
            opacity={c.opacity}
          />
        ))}
      </svg>
    </div>
  )
}

function ClickVsLearn() {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 sm:p-12 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 items-stretch">
      <div className="rounded-xl bg-white border border-zinc-200 p-6 flex flex-col items-center justify-center gap-4 min-h-[220px]">
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden>
          {[
            [10, 16],
            [44, 8],
            [58, 28],
            [22, 38],
            [6, 48],
            [50, 54],
            [32, 22],
            [38, 60],
          ].map(([x, y], i) => (
            <g key={i} opacity={0.7 - i * 0.05}>
              <circle cx={x + 4} cy={y + 4} r="3" fill="#0A0A0A" />
              <circle cx={x + 4} cy={y + 4} r="8" stroke="#0A0A0A" strokeWidth="1" fill="none" />
            </g>
          ))}
        </svg>
        <div className="text-center">
          <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-zinc-500">Clicks</p>
          <p className="text-sm text-zinc-700 mt-1">What grabs your interest</p>
        </div>
      </div>
      <div className="rounded-xl bg-white border border-zinc-200 p-6 flex flex-col items-center justify-center gap-4 min-h-[220px]">
        <svg width="84" height="72" viewBox="0 0 84 72" fill="none" aria-hidden>
          {(() => {
            const cells: Array<[number, number]> = []
            const grid = [
              '..XXXXXX..',
              '.X......X.',
              'X..XX.XX..X',
              'X.X....X..X',
              'X........X',
              'X..XXXX..X',
              '.X......X.',
              '..XXXXXX..',
            ]
            grid.forEach((row, y) => {
              for (let x = 0; x < row.length; x++) {
                if (row[x] === 'X') cells.push([x, y])
              }
            })
            return cells.map(([x, y], i) => (
              <rect key={i} x={10 + x * 6} y={10 + y * 6} width="5" height="5" fill="#0A0A0A" />
            ))
          })()}
          <path
            d="M58 38l5 5 10-12"
            stroke="#10B981"
            strokeWidth="4"
            strokeLinecap="square"
            strokeLinejoin="miter"
            fill="none"
          />
        </svg>
        <div className="text-center">
          <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-zinc-500">Learning</p>
          <p className="text-sm text-zinc-700 mt-1">What actually sticks</p>
        </div>
      </div>
    </div>
  )
}

function UpwardPath() {
  const cell = 14
  const dot = 11
  const steps = [
    { x: 2, y: 11 },
    { x: 3, y: 11 },
    { x: 4, y: 11 },
    { x: 5, y: 10 },
    { x: 6, y: 10 },
    { x: 7, y: 9 },
    { x: 8, y: 9 },
    { x: 9, y: 8 },
    { x: 10, y: 8 },
    { x: 11, y: 7 },
    { x: 12, y: 7 },
    { x: 13, y: 6 },
    { x: 14, y: 6 },
    { x: 15, y: 5 },
    { x: 16, y: 5 },
    { x: 17, y: 4 },
    { x: 18, y: 4 },
    { x: 19, y: 3 },
    { x: 20, y: 3 },
    { x: 21, y: 2 },
    { x: 22, y: 2 },
    { x: 23, y: 1 },
  ]
  const arrow: Array<[number, number]> = [
    [23, 1],
    [22, 1],
    [23, 2],
    [21, 0],
    [22, 0],
    [23, 0],
    [23, 3],
  ]
  const GRID_W = 26
  const GRID_H = 13
  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 sm:p-12 flex items-center justify-center overflow-hidden">
      <svg
        aria-hidden
        viewBox={`0 0 ${GRID_W * cell} ${GRID_H * cell}`}
        className="w-full max-w-2xl h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        {steps.map((c, i) => (
          <rect
            key={`s-${i}`}
            x={c.x * cell + (cell - dot) / 2}
            y={c.y * cell + (cell - dot) / 2}
            width={dot}
            height={dot}
            fill="#0A0A0A"
          />
        ))}
        {arrow.map(([x, y], i) => (
          <rect
            key={`a-${i}`}
            x={x * cell + (cell - dot) / 2}
            y={y * cell + (cell - dot) / 2}
            width={dot}
            height={dot}
            fill="#0A0A0A"
          />
        ))}
      </svg>
    </div>
  )
}

function MockFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-[#D9D9D9] border border-zinc-300 shadow-sm overflow-hidden">
      {children}
    </div>
  )
}

function MockDot({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden
      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
        active ? 'bg-zinc-900' : 'border border-zinc-400 bg-transparent'
      }`}
    />
  )
}

const MOCK_SIDEBAR = [
  { label: 'All', active: true },
  { label: 'AI Foundations', active: false },
  { label: 'Hands-On AI Tools', active: false },
  { label: 'AI with Heart', active: false },
  { label: 'Stay Curious', active: false },
] as const

const MOCK_SECONDARY = ['Progress', 'Settings', 'Sign out'] as const

const MOCK_NEW_SCOOPS = [
  { title: "AI's Impact on Human Creativity", body: 'Over the past decade, AI has evolved from a niche tech to a catalyst for creativity across industries.' },
  { title: 'Stay Up to Date: The Rise of AI in Daily Life', body: "Whether you're a pro staying ahead or just starting out, Scoop helps you track what matters most." },
] as const

const MOCK_WALL = [
  { initials: 'DR', name: 'Dr. Maya Patel', title: 'The Ethics of AI in Education', body: 'As AI tutors become mainstream, we must ask: who benefits?' },
  { initials: 'MU', handle: '@musicandmachines', title: 'AI Generates Music That Made Me Cry', body: 'I asked Suno to write a song about my grandmother. What came back was so emotionally resonant…' },
] as const

function DashboardMock() {
  return (
    <MockFrame>
      <div className="flex h-[420px] sm:h-[480px] text-zinc-900">
        {/* Sidebar */}
        <div className="hidden sm:flex flex-col w-[150px] shrink-0 border-r border-zinc-300/70 p-4 gap-2.5">
          <ScooplyLogo size={14} showWordmark />
          <div className="mt-3 flex flex-col gap-2.5">
            {MOCK_SIDEBAR.map((it) => (
              <div key={it.label} className="flex items-center gap-2">
                <MockDot active={it.active} />
                <span className={`text-[10px] truncate ${it.active ? 'font-semibold text-zinc-900' : 'text-zinc-600'}`}>
                  {it.label}
                </span>
              </div>
            ))}
          </div>
          <div className="my-2 border-t border-zinc-300/70" />
          <div className="flex flex-col gap-2.5">
            {MOCK_SECONDARY.map((label) => (
              <div key={label} className="flex items-center gap-2">
                <MockDot active={false} />
                <span className="text-[10px] text-zinc-600 truncate">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main */}
        <div className="flex-1 min-w-0 p-4 sm:p-5 overflow-hidden">
          <p className="text-[18px] sm:text-[22px] font-bold tracking-tight">Hello d</p>
          <p className="text-[9px] sm:text-[10px] text-zinc-600 mt-1 leading-snug">
            You&apos;re building solid AI literacy habits. This week you explored{' '}
            <span className="text-red-500 font-semibold">12</span> stories out of the{' '}
            <span className="text-red-500 font-semibold">12</span> we curated.
          </p>

          <p className="text-[9px] font-medium text-zinc-600 mt-3">New scoop</p>
          <div className="grid grid-cols-2 gap-2 mt-1.5">
            {MOCK_NEW_SCOOPS.map((s) => (
              <div key={s.title} className="rounded-lg border border-zinc-300/70 bg-white/30 p-2">
                <p className="text-[9px] font-semibold leading-snug line-clamp-2">{s.title}</p>
                <p className="text-[8px] text-zinc-600 mt-1 leading-snug line-clamp-2">{s.body}</p>
              </div>
            ))}
          </div>

          <p className="text-[9px] font-medium text-zinc-600 mt-3">Your wall</p>
          <div className="flex flex-col gap-1.5 mt-1.5">
            {MOCK_WALL.map((p) => (
              <div key={p.title} className="rounded-lg bg-white p-2 flex items-start gap-2 shadow-sm">
                <div className="w-4 h-4 rounded-full bg-zinc-200 shrink-0 flex items-center justify-center text-[6px] font-bold text-zinc-500">
                  {p.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[8px] text-zinc-500 truncate">{'handle' in p ? p.handle : p.name}</p>
                  <p className="text-[9px] font-semibold leading-snug line-clamp-1">{p.title}</p>
                  <p className="text-[8px] text-zinc-500 leading-snug line-clamp-1 mt-0.5">{p.body}</p>
                </div>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-400 shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                </svg>
              </div>
            ))}
          </div>
        </div>

        {/* Right rail */}
        <div className="hidden md:flex flex-col w-[140px] shrink-0 p-4 gap-3">
          <div className="rounded-md border border-zinc-300/70 bg-white/40 px-2 py-1.5 flex items-center gap-1.5">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-500">
              <circle cx="11" cy="11" r="7" />
              <path strokeLinecap="round" d="M21 21l-4-4" />
            </svg>
            <span className="text-[8px] text-zinc-500">Search a post…</span>
          </div>
          <div className="rounded-lg bg-white/60 border border-zinc-300/40 p-3 flex flex-col items-center text-center gap-1.5">
            <p className="text-[9px] font-semibold self-start text-zinc-700">Saved soop</p>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-400 mt-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
            </svg>
            <p className="text-[9px] font-medium text-zinc-700">No saved scoops yet</p>
            <p className="text-[7px] text-zinc-500 leading-snug">Tap the bookmark on any scoop to save it for later.</p>
          </div>
        </div>
      </div>
    </MockFrame>
  )
}

function ProgressCardMock() {
  return (
    <MockFrame>
      <div className="p-6 sm:p-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[20px] sm:text-[26px] font-bold tracking-tight text-zinc-900 leading-tight">Your Progress</p>
            <p className="text-[10px] sm:text-[11px] text-zinc-600 mt-1 max-w-md leading-snug">
              How you&apos;ve interacted with stories — per category and cumulatively. Take the proficiency survey any time to recalibrate.
            </p>
          </div>
          <div className="hidden sm:inline-flex items-center gap-1.5 bg-zinc-900 text-white text-[10px] font-medium px-3 py-2 rounded-full">
            Take proficiency survey
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-white shadow-sm p-5">
          <div className="flex items-baseline justify-between">
            <p className="text-[11px] sm:text-[12px] font-semibold text-zinc-900">Cumulative engagement</p>
            <span className="text-[9px] sm:text-[10px] text-zinc-400">across all categories</span>
          </div>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-3xl sm:text-4xl font-bold tabular-nums">0</span>
            <span className="text-[10px] sm:text-[11px] text-zinc-500">of 12 stories explored</span>
          </div>
          <div className="relative h-1.5 rounded-full bg-zinc-100 overflow-hidden mt-4">
            <div className="absolute inset-y-0 left-0 w-0 rounded-full bg-zinc-900" />
          </div>
          <p className="text-[9px] sm:text-[10px] text-zinc-400 mt-2 tabular-nums">0% of catalog</p>
          <p className="text-[9px] sm:text-[10px] text-zinc-500 mt-3">
            You haven&apos;t opened any stories yet. Click into a post on the dashboard and it&apos;ll show up here.
          </p>
        </div>
      </div>
    </MockFrame>
  )
}

const MOCK_CATEGORIES = [
  { name: 'AI Foundations', color: '#3B82F6', desc: 'Core concepts, model releases, and research breakthroughs shaping the AI landscape.', ratio: '0/4' },
  { name: 'Hands-On AI Tools', color: '#F59E0B', desc: 'Practical tools, tutorials, and workflows to level up your AI skills.', ratio: '0/3' },
  { name: 'AI with Heart', color: '#8B5CF6', desc: 'Human stories, ethics, and the social impact of AI on communities.', ratio: '0/3' },
  { name: 'Stay Curious', color: '#10B981', desc: 'Weird, wonderful, and unexpected frontiers of AI exploration.', ratio: '0/2' },
] as const

function ProgressDashboardMock() {
  return (
    <MockFrame>
      <div className="p-6 sm:p-8">
        <p className="text-[12px] sm:text-[14px] font-bold tracking-tight text-zinc-900">By category</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {MOCK_CATEGORIES.map((c) => (
            <div key={c.name} className="rounded-2xl bg-white shadow-sm p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="text-[9px] sm:text-[10px] font-bold tracking-[0.14em] uppercase" style={{ color: c.color }}>
                  {c.name}
                </p>
                <span
                  className="text-[8px] sm:text-[9px] font-semibold px-1.5 py-0.5 rounded-full tabular-nums"
                  style={{ backgroundColor: `${c.color}18`, color: c.color }}
                >
                  {c.ratio}
                </span>
              </div>
              <p className="text-[8px] sm:text-[9px] text-zinc-500 mt-2 leading-snug line-clamp-2">{c.desc}</p>

              <div className="flex items-baseline justify-between mt-3">
                <p className="text-[8px] sm:text-[9px] text-zinc-500">Engagement</p>
                <p className="text-[8px] sm:text-[9px] font-semibold tabular-nums text-zinc-900">0%</p>
              </div>
              <div className="relative h-1 rounded-full bg-zinc-100 overflow-hidden mt-1">
                <div className="absolute inset-y-0 left-0 w-0 rounded-full" style={{ backgroundColor: c.color }} />
              </div>

              <div className="flex items-baseline justify-between mt-2.5">
                <p className="text-[8px] sm:text-[9px] text-zinc-500">Your level</p>
                <p className="text-[8px] sm:text-[9px] font-semibold text-zinc-900">Not assessed</p>
              </div>
              <div className="relative h-1 rounded-full bg-zinc-100 overflow-hidden mt-1">
                <div className="absolute inset-y-0 left-0 w-0 rounded-full" style={{ backgroundColor: c.color, opacity: 0.55 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </MockFrame>
  )
}

const MOCK_SAVED = [
  { initials: 'DR', name: 'Dr. Maya Patel', title: 'The Ethics of AI in Education', body: 'As AI tutors become mainstream, we must ask: who benefits? Students in well-funded schools get personalized AI mentors while others fall behind.' },
  { initials: 'MU', name: '@musicandmachines', title: 'AI Generates Music That Made Me Cry', body: 'I asked Suno to write a song about my grandmother. What came back was so emotionally resonant I genuinely teared up.' },
] as const

function SavedScoopsMock() {
  return (
    <MockFrame>
      <div className="p-6 sm:p-10">
        <p className="text-[22px] sm:text-[28px] font-bold tracking-tight text-zinc-900 leading-tight">Saved scoops</p>
        <p className="text-[10px] sm:text-[11px] text-zinc-500 mt-1">2 scoops saved.</p>

        <div className="mt-5 flex flex-col gap-3">
          {MOCK_SAVED.map((p) => (
            <div key={p.title} className="rounded-2xl bg-white p-4 flex items-start gap-3 shadow-sm">
              <div className="w-7 h-7 rounded-full bg-zinc-200 shrink-0 flex items-center justify-center text-[9px] font-bold text-zinc-500">
                {p.initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-[11px] text-zinc-500">{p.name}</p>
                <p className="text-[11px] sm:text-[13px] font-semibold leading-snug text-zinc-900 mt-0.5">{p.title}</p>
                <p className="text-[9px] sm:text-[10px] text-zinc-500 leading-snug mt-1 line-clamp-2">{p.body}</p>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-zinc-900 shrink-0">
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </MockFrame>
  )
}

interface SectionProps {
  headline: string
  body: React.ReactNode
  visual?: React.ReactNode
}

function Section({ headline, body, visual }: SectionProps) {
  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col gap-5 max-w-2xl">
        <h2 className="text-2xl sm:text-3xl md:text-[40px] font-bold tracking-tight text-zinc-900 leading-[1.1] whitespace-pre-line">
          {headline}
        </h2>
        <div className="text-zinc-600 leading-relaxed text-[15px]">{body}</div>
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
        className={`absolute left-0 right-0 bottom-0 top-12 rounded-t-3xl sm:top-0 sm:left-auto sm:w-[75vw] sm:rounded-t-none sm:rounded-l-3xl bg-white shadow-2xl transition-transform duration-300 ease-out ${
          open ? 'translate-y-0 sm:translate-x-0' : 'translate-y-full sm:translate-y-0 sm:translate-x-full'
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
            {/* Section 1 — The Problem */}
            <section className="flex flex-col gap-8">
              <ScooplyLogo size={64} showWordmark={false} />
              <div className="flex flex-col gap-5 max-w-2xl">
                <h2 className="text-2xl sm:text-3xl md:text-[40px] font-bold tracking-tight text-zinc-900 leading-[1.1]">
                  Stay ahead of the AI curve
                  <br />
                  without getting lost in the noise.
                </h2>
                <p className="text-zinc-600 leading-relaxed text-[15px]">
                  AI is everywhere, and it&apos;s moving at lightning speed. Every day there&apos;s something
                  new to learn, something breaking, something that could change how you work. But keeping up
                  feels impossible — too much noise, too many sources, too much information all at once.
                  That&apos;s where Scooply comes in. We filter the chaos and bring you the AI news that
                  actually matters, tailored to your level and your interests. No overwhelm. Just signal.
                </p>
              </div>
              <ChaosToSignal />
            </section>

            {/* Section 2 — How It Works */}
            <Section
              headline={`Curated content.\nFour categories.\nOne dashboard.`}
              body={
                <>
                  <p>
                    Sign in and land on a dashboard that feels like yours. The sidebar lets you switch between
                    every category we cover — AI Foundations, Hands-On AI Tools, AI with Heart, Stay Curious —
                    or stay on All for the full mix. On the All view we surface the freshest picks under{' '}
                    <span className="font-semibold text-zinc-800">New scoop</span>, with everything else
                    stacked below on <span className="font-semibold text-zinc-800">Your wall</span>. Pick a
                    category and the wall narrows to just that beat. Search and your saved scoops sit on the
                    right, always one glance away.
                  </p>
                  <p className="mt-4">
                    When you find something worth reading, click it. It opens in a new tab — LinkedIn, Medium,
                    Twitter, wherever the original lives. You read, you learn, you come back. Scooply is never
                    in your way. It&apos;s just the gateway.
                  </p>
                </>
              }
              visual={<DashboardMock />}
            />

            {/* Section 3 — Learning That Sticks */}
            <Section
              headline={`We track what you actually\nlearn — not just what you click.`}
              body={
                <>
                  <p>
                    Clicking doesn&apos;t equal learning. You might browse five stories and retain nothing. So
                    we built a validation layer. Every time you complete a category — meaning you&apos;ve
                    engaged with enough stories to hit one hundred percent progress — we ask you to take a
                    quick proficiency survey. These aren&apos;t gatekeepers. They&apos;re checkpoints. Score
                    above fifty percent and you&apos;ve proven you absorbed something real. That category
                    counts toward your progression. If you don&apos;t hit that threshold, we know you need
                    more time in that beat, and the platform adjusts.
                  </p>
                  <p className="mt-4">
                    Your clicks show us what interests you. Your survey results show us what you&apos;ve
                    learned. Together, they paint a real picture of where you actually stand.
                  </p>
                </>
              }
              visual={<ClickVsLearn />}
            />

            {/* Section 4 — Progression */}
            <Section
              headline={`From beginner to advanced\n— at your own pace.`}
              body={
                <>
                  <p>
                    You start somewhere. Maybe you&apos;re brand new to AI, just curious about the hype. Or
                    maybe you&apos;ve been building with models for months. Scooply meets you there. Your
                    first proficiency survey places you at a level: Beginner, Intermediate, or Advanced. From
                    there, the content adapts. Beginners see foundational pieces and explanatory deep-dives.
                    Intermediate learners get technical tutorials and emerging research. Advanced users get
                    cutting-edge papers, framework comparisons, and insider perspectives.
                  </p>
                  <p className="mt-4">
                    As you complete categories and pass their surveys, you unlock progress. Complete all four
                    categories at your current level with validated learning, and Scooply suggests you level
                    up. No artificial gatekeeping. Just real progression based on real comprehension.
                  </p>
                </>
              }
              visual={<ProgressCardMock />}
            />

            {/* Section 5 — Performance at a Glance */}
            <Section
              headline={`See exactly where your interests\nand learning align.`}
              body={
                <p>
                  The Progress page shows you everything. Your cumulative engagement across all categories
                  tells you how many stories you&apos;ve explored. The{' '}
                  <span className="font-semibold text-zinc-800">By category</span> breakdown shows your
                  completion percentage per beat, your engagement rate, and your current proficiency level in
                  that category. Over time, you&apos;ll notice patterns. Maybe you&apos;re crushing it in
                  Hands-On AI Tools but lagging in AI with Heart. Maybe Stay Curious is where you spend most
                  of your time. These insights aren&apos;t judgmental — they&apos;re directional. They help
                  you understand yourself as a learner and guide where you want to go next.
                </p>
              }
              visual={<ProgressDashboardMock />}
            />

            {/* Section 6 — Save What Matters */}
            <Section
              headline={`Bookmark stories.\nBuild your knowledge library.`}
              body={
                <p>
                  Found something you want to revisit? Save it. Your saved scoops live in one place — always
                  accessible, never buried. Whether it&apos;s a breakthrough paper, a tutorial you want to
                  reference, or an essay that changed how you think about AI, it&apos;s there when you need
                  it. Your library grows with you.
                </p>
              }
              visual={<SavedScoopsMock />}
            />

            {/* Section 7 — Why This Matters */}
            <Section
              headline={`AI literacy isn't optional\nanymore.`}
              body={
                <>
                  <p>
                    AI is reshaping work, creativity, and society. But understanding it shouldn&apos;t require
                    a computer science degree or hours of doom-scrolling through algorithm feeds. Scooply
                    exists because we believe AI knowledge should be accessible, personalized, and actually
                    retained — not just consumed. We&apos;re not here to add noise to your day. We&apos;re
                    here to bring clarity. To meet you where you are. To help you stay ahead without burning
                    out.
                  </p>
                  <p className="mt-4">
                    This is how we think about AI learning: intentional, paced, and grounded in what you
                    actually want to know.
                  </p>
                </>
              }
              visual={<UpwardPath />}
            />

            {/* CTA */}
            <section className="flex flex-col gap-6">
              <h2 className="text-2xl sm:text-3xl md:text-[40px] font-bold tracking-tight text-zinc-900 leading-[1.1]">
                Ready to stay ahead?
              </h2>
              <p className="text-zinc-600 leading-relaxed text-[15px] max-w-2xl">
                Take the survey. Find your level. Start curating your feed.
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-black text-white text-sm font-medium hover:bg-zinc-800 transition-colors"
                >
                  Take a survey
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.querySelector('[aria-label="What is Scooply"]')
                    el?.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-zinc-300 text-zinc-900 text-sm font-medium hover:border-zinc-500 transition-colors"
                >
                  What is Scooply?
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
