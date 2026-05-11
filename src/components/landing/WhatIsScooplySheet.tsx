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

interface ScreenshotPlaceholderProps {
  label: string
  caption: string
  aspect?: string
}

function ScreenshotPlaceholder({ label, caption, aspect = 'aspect-[16/9]' }: ScreenshotPlaceholderProps) {
  return (
    <div
      className={`relative ${aspect} w-full rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50 flex flex-col items-center justify-center gap-2 text-center px-6`}
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className="text-zinc-400"
        strokeWidth="1.5"
      >
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path strokeLinecap="round" d="M3 16l4-4 4 4 3-3 7 7" />
        <circle cx="9" cy="10" r="1.5" fill="currentColor" stroke="none" />
      </svg>
      <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-zinc-500">{label}</p>
      <p className="text-sm text-zinc-500 max-w-md">{caption}</p>
    </div>
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
              visual={
                <ScreenshotPlaceholder
                  label="Dashboard view"
                  caption="The four-category sidebar, New scoop carousel, Your wall, and saved-scoops rail."
                />
              }
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
              visual={
                <ScreenshotPlaceholder
                  label="Your progress card"
                  caption="Cumulative engagement, category completion, and the proficiency level display."
                />
              }
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
              visual={
                <ScreenshotPlaceholder
                  label="Progress dashboard"
                  caption="Four category cards with engagement percentages, completion ratios, and proficiency levels."
                />
              }
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
              visual={
                <ScreenshotPlaceholder
                  label="Saved scoops page"
                  caption="Saved articles with author avatars, titles, and brief descriptions in one quiet view."
                />
              }
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
