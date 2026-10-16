import type { Metadata } from 'next'
import type { Post } from '@/lib/types'
import { categories } from '@/lib/categories'
import ScooplyLogo from '@/components/ScooplyLogo'
import PixelSphere from '@/components/landing/PixelSphere'
import DashboardSocialCard from '@/components/dashboard/DashboardSocialCard'
import FeaturedScoopCard from '@/components/dashboard/FeaturedScoopCard'
import Button, { buttonClasses } from '@/components/ui/Button'
import Chip from '@/components/ui/Chip'
import Eyebrow from '@/components/ui/Eyebrow'
import IconTile from '@/components/ui/IconTile'
import Input from '@/components/ui/Input'
import Orb, { CATEGORY_ORB, PROFICIENCY_DENSITY } from '@/components/ui/Orb'
import PillNav from '@/components/ui/PillNav'
import Reveal from '@/components/ui/Reveal'
import Tag from '@/components/ui/Tag'
import { ArrowRight, Bookmark, Code, Mail, Search, Sparkle } from '@/components/ui/icons'
import Illustration from '@/components/illustrations/Illustration'
import BentoCard from '@/components/ui/BentoCard'
import CardTag from '@/components/ui/CardTag'
import ListPanel from '@/components/ui/ListPanel'
import QuoteCard from '@/components/ui/QuoteCard'
import StatCard from '@/components/ui/StatCard'
import FeatureRow from '@/components/ui/FeatureRow'
import { ChipsDemo, ControlsDemo, JumpListDemo, MotionDemo, PreviewDemo, TabsDemo, ThemeScope } from './_components/Demos'

export const metadata: Metadata = {
  title: 'Design System · Scooply',
  description: 'Tokens, components and patterns for Scooply.',
}

/* ── Data ─────────────────────────────────────────────────────────────────── */

const NEUTRALS = [
  { token: 'canvas', hex: '#E9E5DA', use: 'Parchment page background' },
  { token: 'surface', hex: '#FBF8F1', use: 'Cream paper: cards and panels' },
  { token: 'surface-muted', hex: '#F3EFE6', use: 'Nested areas' },
  { token: 'line', hex: '8% ink', use: 'Borders, dividers' },
]

const CREAMS = [
  { token: 'cream', hex: '#F6F2E9', use: 'Card fill' },
  { token: 'cream-deep', hex: '#EBE6DA', use: 'Tiles, selected, frames' },
  { token: 'gold', hex: '#A39D90', use: 'Corner brackets' },
  { token: 'gold-soft', hex: '#DDD7CA', use: 'Dividers, numerals' },
  { token: 'tan', hex: '#5F5A50', use: 'Tag and meta text' },
  { token: 'tan-fill', hex: '#E2DDD0', use: 'Quiet fills' },
]

const INKS = [
  { token: 'ink', hex: '#1A1916', use: 'Headings, primary buttons' },
  { token: 'ink-2', hex: '#3D3A35', use: 'Strong body' },
  { token: 'ink-3', hex: '#6B675F', use: 'Body, secondary' },
  { token: 'ink-4', hex: '#9D988D', use: 'Labels, hints' },
]

const SIGNALS = [
  { token: 'accent', hex: '#1A1916', use: 'Ink: dots, selection, toggles' },
  { token: 'positive', hex: '#3F6B4F', use: 'Liked' },
  { token: 'negative', hex: '#9C3B32', use: 'Disliked, errors' },
]

const TYPE_SCALE = [
  { name: 'Narrative', spec: 'Inter Tight Medium · 72 · −2.5%', cls: 'font-display text-[2.6rem] sm:text-[3.4rem] leading-[1.08]', sample: 'AI is meaningful when you can' },
  { name: 'Hero', spec: '60 · medium · −3.5%', cls: 'text-4xl sm:text-6xl font-medium tracking-[-0.035em] leading-[1.05]', sample: 'Your AI news feed' },
  { name: 'Page title', spec: 'Inter Tight Medium · 48 · −2.5%', cls: 'font-display text-[36px] sm:text-[48px] font-light tracking-[-0.02em] leading-[1.05]', sample: 'Hello Alex' },
  { name: 'Step title', spec: 'Inter Tight Medium · 32 · −2.2%', cls: 'font-display text-[30px] font-light leading-[1.1]', sample: "What's your AI level?" },
  { name: 'Card title', spec: '18 · semibold', cls: 'text-[18px] font-semibold leading-snug', sample: 'Small models are getting smarter' },
  { name: 'Body', spec: '15 · regular · 1.6', cls: 'text-[15px] leading-relaxed text-ink-3', sample: 'A smart news aggregator, filtered by your level and interests.' },
  { name: 'Small', spec: '13 · regular', cls: 'text-[13px] leading-relaxed text-ink-3', sample: 'Researchers trained a diffusion model on every color ever named.' },
  { name: 'Label', spec: '11 · semibold · +14%', cls: 'text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-4', sample: 'Step 2 of 4' },
]

const MOTION = [
  { token: 'quick', value: '200ms', use: 'Hover, color, closing' },
  { token: 'base', value: '320ms', use: 'Tabs, toggles, drawers' },
  { token: 'slow', value: '560ms', use: 'Things arriving' },
  { token: 'calm', value: '800ms', use: 'Landing, splash' },
  { token: 'ease-soft', value: '(.22, 1, .36, 1)', use: 'Everything that arrives' },
]

const SAMPLE_POSTS: Post[] = [
  {
    id: 'ds-demo-1',
    title: 'Three new agent SDKs shipped this month',
    content:
      'A quick comparison of what each one is good at, and which is easiest if you are building your first assistant.',
    source: 'twitter',
    sourceUrl: 'https://x.com',
    sourceHandle: '@buildwithai',
    categoryId: 'hands-on-ai-tools',
    tags: ['Agents'],
    publishedAt: '2026-10-11',
    createdAt: '2026-10-11',
  },
  {
    id: 'ds-demo-2',
    title: 'What a "context window" actually is, in 90 seconds',
    content: 'A beginner-friendly explainer with a great visual: why models forget, and how long prompts change cost.',
    source: 'youtube',
    sourceUrl: 'https://youtube.com',
    sourceHandle: '@explainedsimply',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    categoryId: 'ai-foundations',
    tags: ['Basics'],
    publishedAt: '2026-10-11',
    createdAt: '2026-10-11',
  },
  {
    id: 'ds-demo-3',
    title: 'Robots are learning to cook from a single video',
    content: 'New research shows a robot watching one cooking clip and repeating the dish. The dexterity is the surprising part.',
    source: 'instagram',
    sourceUrl: 'https://instagram.com',
    sourceHandle: 'futuretech_daily',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
    categoryId: 'stay-curious',
    tags: ['Robotics'],
    publishedAt: '2026-10-11',
    createdAt: '2026-10-11',
  },
]

/* ── Layout helpers ───────────────────────────────────────────────────────── */

function Section({ id, title, lede, children }: { id: string; title: string; lede: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-line py-14 sm:py-20">
      <Reveal className="grid grid-cols-1 gap-3 lg:grid-cols-12 lg:gap-8">
        <h2 className="text-2xl font-bold tracking-tight text-ink lg:col-span-4">{title}</h2>
        <p className="max-w-xl text-[15px] leading-relaxed text-ink-3 lg:col-span-7 lg:col-start-6">{lede}</p>
      </Reveal>
      <Reveal delay={100} className="mt-10">
        {children}
      </Reveal>
    </section>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-4">{children}</p>
}

function Swatch({ token, hex, use }: { token: string; hex: string; use: string }) {
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden
        className="h-10 w-10 shrink-0 rounded-xl border border-line"
        style={{ background: `var(--sc-${token})` }}
      />
      <div className="min-w-0">
        <p className="text-sm font-medium text-ink">{token}</p>
        <p className="truncate text-[12px] text-ink-4">
          {hex} · {use}
        </p>
      </div>
    </div>
  )
}

/* ── Page ─────────────────────────────────────────────────────────────────── */

const NAV = [
  { id: 'foundations', label: 'Foundations', href: '#color' },
  { id: 'components', label: 'Components', href: '#components' },
  { id: 'feed', label: 'Feed', href: '#feed' },
]

export default function DesignSystemPage() {
  return (
    <ThemeScope>
      <header className="sticky top-0 z-30 sc-glass border-b border-line">
        <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between gap-4 px-5 sm:px-8">
          <ScooplyLogo size={24} />
          <div className="hidden md:block">
            <PillNav items={NAV} active="foundations" />
          </div>
          <span className="text-[12px] text-ink-4">Design system</span>
        </div>
      </header>

      <main className="mx-auto max-w-[1120px] px-5 pb-28 sm:px-8">
        {/* Hero — the original landing composition */}
        <section className="grid grid-cols-1 items-center gap-10 py-16 sm:py-24 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow dot>Scooply design system · Futuristic newspaper</Eyebrow>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="mt-4 text-4xl font-medium leading-[1.05] tracking-[-0.035em] text-ink sm:text-5xl md:text-6xl">
                The news, set in dots.
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink-3">
                A futuristic newspaper: white and warm cream like newsprint, bright cards, and reading tools set in
                the dots of the Scooply mark. Black is kept for words and print; color shows up in card tints,
                an orange dot and soft topic orbs.
              </p>
            </Reveal>
            <Reveal delay={300} className="mt-8 flex flex-wrap gap-3">
              <a href="#components" className={buttonClasses({ size: 'lg' })}>
                Browse components
              </a>
              <a href="#feed" className={buttonClasses({ variant: 'ghost', size: 'lg', className: 'group' })}>
                See the feed
                <ArrowRight size={16} className="transition-transform duration-200 ease-soft group-hover:translate-x-0.5" />
              </a>
            </Reveal>
          </div>
          <Reveal delay={400} dir="left" className="lg:col-span-5">
            <PixelSphere className="mx-auto h-auto w-full max-w-[380px]" />
          </Reveal>
        </section>

        {/* Principles */}
        <section className="grid grid-cols-1 gap-8 border-t border-line py-14 sm:grid-cols-3 sm:py-16">
          {[
            { t: 'Black is for text', d: 'Surfaces, buttons and selected states stay light: white, cream and tan. Ink is reserved for words, the logo and the pixel sphere.' },
            { t: 'Cream, gold, one orange', d: 'Cards sit on cream inside gold corner brackets. Orange marks the active thing; soft gradient orbs give each topic its color.' },
            { t: 'Built from the mark', d: 'Illustrations are lit 3D objects printed as a halftone: one even grid of black dots that grow and strengthen smoothly from highlight to shadow.' },
          ].map((p) => (
            <div key={p.t}>
              <p className="text-[15px] font-semibold text-ink">{p.t}</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink-3">{p.d}</p>
            </div>
          ))}
        </section>

        {/* Illustrations */}
        <Section
          id="illustrations"
          title="Illustrations"
          lede="Everyday reading tools, modelled in 3D, lit by one soft light from the upper left, and printed as a halftone on one even grid of round dots. Every dot is black ink: as the surface darkens, the dot grows and its ink strengthens in one smooth progression, from faint specks in the highlights through the midtones to solid black in shadow. No white or fixed greys, so it sits cleanly on any colour. Cast shadows are a flat, light field of dots."
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {[
              { id: 'sphere', name: 'Sphere', use: 'Hero, calls to action', tone: 'stone' },
              { id: 'paper', name: 'Newspaper', use: 'Sign up, welcome', tone: 'sky' },
              { id: 'book', name: 'Open book', use: 'Choosing a level', tone: 'butter' },
              { id: 'magnifier', name: 'Magnifying glass', use: 'Interests, preview, search', tone: 'blush' },
              { id: 'binoculars', name: 'Binoculars', use: 'Choosing sources', tone: 'coral' },
              { id: 'box', name: 'Box', use: 'Saved, empty states', tone: 'stone' },
              { id: 'mug', name: 'Mug', use: 'Morning digest · steam moves', tone: 'sky' },
            ].map((it) => (
              <figure key={it.id} className="m-0 flex flex-col gap-3 rounded-[18px] p-5" style={{ background: `var(--sc-${it.tone})` }}>
                <Illustration name={it.id as 'sphere'} />
                <figcaption>
                  <p className="font-display text-[22px] leading-none text-ink">{it.name}</p>
                  <p className="mt-1.5 text-[12px] text-ink/60">{it.use}</p>
                </figcaption>
              </figure>
            ))}
            <figure className="m-0 flex flex-col justify-between gap-3 rounded-[18px] border border-dashed border-line-strong p-5">
              <p className="text-[13px] leading-relaxed text-ink-3">
                Adding one? Model it in scripts/illustrations.ts, pick a slice direction that follows its shape, use one
                material accent at most, and run bun scripts/illustrations.ts.
              </p>
              <p className="text-[12px] text-ink-4">Halftone · --style=contour for lines · --style=dither for pixels</p>
            </figure>
          </div>
        </Section>

        {/* Cards */}
        <Section
          id="cards"
          title="Cards"
          lede="Flat, saturated tints with no border or shadow: the tint is the card. Every card opens with an outlined tag, speaks in a large light headline, and puts its illustration or demo on a plain inner panel in a darker shade of its own color."
        >
          <Label>Feature card · side</Label>
          <BentoCard
            tone="lavender"
            layout="side"
            tag="Your topics"
            title="Reach the stories that matter to you"
            body="Pick what you care about and Scooply builds the front page around it."
            cta={{ label: 'See how it works', href: '#cards' }}
            panel={
              <ListPanel
                items={[
                  { icon: <Mail />, label: 'AI Foundations' },
                  { icon: <Code />, label: 'Hands-On AI Tools' },
                  { icon: <Sparkle />, label: 'AI with Heart' },
                  { icon: <Search />, label: 'Stay Curious' },
                ]}
              />
            }
          />
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <BentoCard tone="lime" tag="Preview first" art="magnifier" title="Read the gist before you click" />
            <BentoCard tone="mint" tag="Every source" art="binoculars" title="Six platforms, one calm feed" />
            <BentoCard tone="white" tag="Morning scoop" art="mug" title="Ready with your coffee" />
          </div>

          <div className="mt-10">
            <Label>Statement cards · glass on a tinted band</Label>
            <div
              className="sc-card-grid grid grid-cols-1 gap-3 rounded-[20px] p-3 sm:p-4 md:grid-cols-3"
              style={{ ['--sc-card' as string]: 'var(--sc-mint)', ['--sc-card-ink' as string]: 'var(--sc-mint-ink)' }}
            >
              <StatCard tone="glass" tag="Save time" statement="Catch up on AI in five minutes a day" footer="Scooply" />
              <StatCard tone="glass" tag="Stay current" statement="Every platform, read for you overnight" footer="Scooply" />
              <StatCard tone="glass" tag="Level up" statement="Stories matched to the depth you want" footer="Scooply" />
            </div>
          </div>

          <div className="mt-10">
            <Label>Quote card · example copy</Label>
            <QuoteCard
              tone="lime"
              art="paper"
              quote="I used to keep six tabs open to follow AI. Now I read one feed over breakfast and I’m caught up."
              name="Example reader"
              role="Placeholder · replace with a real quote"
            />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 text-ink">
                <CardTag>Move fast</CardTag>
                <CardTag>Trends and insights</CardTag>
                <span style={{ color: 'var(--sc-lavender-ink)' }}>
                  <CardTag>Your topics</CardTag>
                </span>
              </div>
            </div>
            <div>
              <Label>Tints</Label>
              <div className="flex flex-wrap gap-3">
                {(['lime', 'lavender', 'mint', 'sky', 'butter', 'blush', 'coral', 'stone'] as const).map((t) => (
                  <span key={t} className="flex items-center gap-2 text-[12px] text-ink-3">
                    <span className="h-7 w-7 rounded-md" style={{ background: `var(--sc-${t})` }} />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-14">
            <Label>Feature row</Label>
            <FeatureRow
              items={[
                { art: 'paper', title: 'Less feed. More news.', body: 'We keep the stories that matter and skip the rest.' },
                { art: 'book', title: 'Your level, every time.', body: 'The same story at the depth that suits you.' },
                { art: 'binoculars', title: 'Every platform, one place.', body: 'Six sources, one calm feed.' },
              ]}
            />
          </div>
        </Section>

        {/* Brand graphics */}
        <Section
          id="graphics"
          title="Brand graphics"
          lede="Print marks for heroes and edges: the masthead of newspaper columns with the contoured sphere standing in front, and line fades for card corners."
        >
          <Illustration name="masthead" />
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sc-card relative flex items-end overflow-hidden rounded-[20px] p-5">
              <span aria-hidden className="absolute top-0 left-0">
                <Illustration name="corner" size={72} tint="var(--sc-gold)" />
              </span>
              <span aria-hidden className="absolute top-0 right-0 -scale-x-100">
                <Illustration name="corner" size={72} tint="var(--sc-gold)" />
              </span>
              <div className="pt-16">
                <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-ink">Contour corners</p>
                <p className="text-[12px] text-ink-4">Gold arcs for card corners. Use one or two, never all four.</p>
              </div>
            </div>
            <div className="sc-card relative flex items-center gap-5 overflow-hidden rounded-[20px] p-5">
              <Illustration name="sphere" size={96} />
              <div>
                <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-ink">Pixel sphere</p>
                <p className="text-[12px] text-ink-4">The Scooply mark&apos;s dots, wrapped around a sphere and shaded by size.</p>
              </div>
            </div>
          </div>
        </Section>

        {/* Color */}
        <Section
          id="color"
          title="Color"
          lede="White and cream surfaces, gold for frames and dividers, tan for small meta text, black only for headings and body. Orange marks what's active. Green and red appear only on likes, dislikes and errors."
        >
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Label>Cream and gold</Label>
              <div className="flex flex-col gap-4">
                {CREAMS.map((s) => (
                  <Swatch key={s.token} {...s} />
                ))}
              </div>
            </div>
            <div>
              <Label>Surfaces</Label>
              <div className="flex flex-col gap-4">
                {NEUTRALS.map((s) => (
                  <Swatch key={s.token} {...s} />
                ))}
              </div>
            </div>
            <div>
              <Label>Text</Label>
              <div className="flex flex-col gap-4">
                {INKS.map((s) => (
                  <Swatch key={s.token} {...s} />
                ))}
              </div>
            </div>
            <div>
              <Label>Signal</Label>
              <div className="flex flex-col gap-4">
                {SIGNALS.map((s) => (
                  <Swatch key={s.token} {...s} />
                ))}
              </div>
              <div className="mt-8">
                <Label>Topic orbs</Label>
                <div className="grid grid-cols-1 gap-3">
                  {categories.map((c) => (
                    <div key={c.id} className="flex items-center gap-2">
                      <Orb palette={CATEGORY_ORB[c.id]} size={20} />
                      <span className="text-[13px] text-ink-3">{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Type */}
        <Section
          id="type"
          title="Typography"
          lede="Inter Tight runs the product. Inter Tight carries everything: regular for reading, medium and tight for headlines, always sentence case."
        >
          <div className="divide-y divide-line">
            {TYPE_SCALE.map((t) => (
              <div key={t.name} className="grid grid-cols-1 items-baseline gap-1 py-5 sm:grid-cols-[180px_1fr] sm:gap-6">
                <div>
                  <p className="text-[13px] font-medium text-ink-2">{t.name}</p>
                  <p className="text-[12px] text-ink-4">{t.spec}</p>
                </div>
                <p className={`min-w-0 text-ink ${t.cls}`}>{t.sample}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Shape, space, grid, motion */}
        <Section
          id="layout"
          title="Shape, space and motion"
          lede="A 4px spacing base, generous rounding, hairline borders before shadows. A 4-column grid on phones, 8 on tablets, 12 on desktop."
        >
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div>
              <Label>Radius</Label>
              <div className="flex flex-wrap items-end gap-4">
                {[
                  { n: 'Tile', px: 10, c: 'rounded-tile' },
                  { n: 'Field', px: 14, c: 'rounded-control' },
                  { n: 'Option', px: 16, c: 'rounded-2xl' },
                  { n: 'Card', px: 24, c: 'rounded-3xl' },
                  { n: 'Sheet', px: 36, c: 'rounded-sheet' },
                ].map((r) => (
                  <div key={r.n} className="flex flex-col items-center gap-2">
                    <span className={`block h-14 w-14 border border-gold-soft bg-surface ${r.c}`} />
                    <span className="text-[12px] text-ink-4">
                      {r.n} {r.px}
                    </span>
                  </div>
                ))}
                <div className="flex flex-col items-center gap-2">
                  <span className="sc-card block h-14 w-14 rounded-[26px]" />
                  <span className="text-[12px] text-ink-4">Scoop 26</span>
                </div>
              </div>
              <div className="mt-10">
                <Label>Depth</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { n: 'Border', c: 'border border-line' },
                    { n: 'Hover', c: 'shadow-float' },
                    { n: 'Sheet', c: 'shadow-lift' },
                  ].map((e) => (
                    <div key={e.n} className={`flex h-20 items-end rounded-2xl bg-surface p-3 ${e.c}`}>
                      <span className="text-[12px] text-ink-4">{e.n}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <Label>Motion</Label>
              <MotionDemo />
              <div className="mt-6 divide-y divide-line">
                {MOTION.map((m) => (
                  <div key={m.token} className="flex items-baseline justify-between gap-4 py-2.5">
                    <span className="text-[13px] font-medium text-ink-2">{m.token}</span>
                    <span className="text-right text-[12px] text-ink-4 tabular-nums">
                      {m.value} · {m.use}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Components */}
        <Section
          id="components"
          title="Components"
          lede="Light controls with clear states. Primary actions sit on a warm tan fill, card actions are small square-cornered tan buttons, and selection gets gold edges with an orange dot."
        >
          <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-2">
            <div>
              <Label>Buttons</Label>
              <div className="flex flex-wrap gap-2">
                <Button>Continue</Button>
                <Button shape="rect">See scoop</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
            <div>
              <Label>Navigation</Label>
              <PillNav
                active="feed"
                items={[
                  { id: 'feed', label: 'Feed', href: '#feed' },
                  { id: 'saved', label: 'Saved', href: '#feed' },
                  { id: 'progress', label: 'Progress', href: '#feed' },
                ]}
              />
            </div>
            <div>
              <Label>Interest chips</Label>
              <ChipsDemo />
            </div>
            <div>
              <Label>Category tabs</Label>
              <TabsDemo />
            </div>
            <div>
              <Label>Search</Label>
              {/* Same styling as SearchBar, without its navigation to /dashboard */}
              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-4" />
                <input
                  id="ds-search"
                  placeholder="Search scoops…"
                  className="h-11 w-full rounded-full sc-glass shadow-hairline pl-11 pr-4 text-base text-ink placeholder:text-ink-4 focus:outline-none focus:ring-2 focus:ring-ink/10 sm:text-sm"
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Chip variant="soft">Agents for beginners</Chip>
                <Chip variant="soft">Open models</Chip>
                <Chip variant="soft">What&apos;s new?</Chip>
              </div>
            </div>
            <div>
              <Label>Input</Label>
              <Input id="ds-input" label="Your name" placeholder="e.g. Alex" />
            </div>
            <div>
              <Label>Settings rows</Label>
              <ControlsDemo />
            </div>
            <div>
              <Label>List rows</Label>
              <JumpListDemo />
            </div>
            <div>
              <Label>Tags and icon tiles</Label>
              <div className="flex flex-wrap items-center gap-2">
                <Tag>Open source</Tag>
                <Tag dot="#4C8DF6">Foundations</Tag>
                <Tag tone="soft" dot={false}>
                  Benchmarks
                </Tag>
                <span className="mx-1 h-5 w-px bg-line" aria-hidden />
                <IconTile>
                  <Code />
                </IconTile>
                <IconTile tone="muted">
                  <Mail />
                </IconTile>
                <IconTile tone="accent">
                  <Bookmark />
                </IconTile>
              </div>
            </div>
            <div>
              <Label>Proficiency orbs</Label>
              <div className="flex items-end gap-8">
                {(Object.keys(PROFICIENCY_DENSITY) as (keyof typeof PROFICIENCY_DENSITY)[]).map((k) => (
                  <div key={k} className="flex flex-col items-center gap-2">
                    <Orb palette="ember" variant="pixel" density={PROFICIENCY_DENSITY[k]} size={40} resolution={13} />
                    <span className="text-[12px] capitalize text-ink-4">{k}</span>
                  </div>
                ))}
                <div className="flex flex-col items-center gap-2">
                  <Orb palette="dusk" variant="glass" size={40} />
                  <span className="text-[12px] text-ink-4 animate-breathe">Thinking…</span>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Feed */}
        <Section
          id="feed"
          title="Feed"
          lede="Three kinds of scoop share one white frame with soft layered shadows. Photo and video posts let the media fill the card, with a white info card floating over it; text posts from X, LinkedIn and blogs lead with their words. The preview fades its summary out before handing off."
        >
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="flex flex-col gap-4 lg:col-span-7">
              <Label>Wall · photo, then text</Label>
              {[SAMPLE_POSTS[2], SAMPLE_POSTS[0]].map((p, i) => (
                <Reveal key={p.id} delay={i * 70}>
                  <DashboardSocialCard post={p} saved={i === 1} />
                </Reveal>
              ))}
            </div>
            <div className="flex flex-col gap-4 lg:col-span-5">
              <Label>New scoop · video</Label>
              <FeaturedScoopCard post={SAMPLE_POSTS[1]} />
              <div className="mt-4 rounded-[20px] bg-surface p-6 shadow-hairline">
                <p className="text-[15px] font-semibold text-ink">Preview, then redirect</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-3">
                  A short &ldquo;Thinking…&rdquo; state, a summary that fades out, then one clear link to the original post.
                </p>
                <div className="mt-4">
                  <PreviewDemo />
                </div>
              </div>
            </div>
          </div>
          <p className="mt-8 flex items-center gap-2 text-[12px] text-ink-4">
            <Sparkle size={12} className="text-accent" />
            Demo cards use the real components. If you&apos;re signed in, reacting to them saves demo ids to your
            session.
          </p>
        </Section>
      </main>
    </ThemeScope>
  )
}
