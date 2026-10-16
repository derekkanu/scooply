import Link from 'next/link'
import type { Post } from '@/lib/types'
import { categories } from '@/lib/categories'
import { SOURCE_LABEL } from '@/lib/sources'
import PlatformIcon from '@/components/PlatformIcon'
import ScooplyLogo from '@/components/ScooplyLogo'
import TrackedPostLink from '@/components/TrackedPostLink'
import PreviewButton from '@/components/feed/PreviewButton'
import Illustration from '@/components/illustrations/Illustration'
import type { SpriteId } from '@/components/illustrations/sprites'
import { BarChart } from '@/components/ui/icons'
import { TOPIC_NAV } from '@/components/nav/NavRow'

interface BriefingProps {
  lead: Post
  moving: Post[]
  allPosts: Post[]
  viewedIds: string[]
  savedCount: number
  newCount: number
  level?: string
}

/** "3h ago", measured from the newest post so the briefing reads the same on every render. */
function ago(iso: string, newest: number) {
  const h = Math.max(1, Math.round((newest - Date.parse(iso)) / 3_600_000))
  return h < 24 ? `${h}h ago` : `${Math.round(h / 24)}d ago`
}

/**
 * A stage: a quiet tinted surface with one engraving pressed faintly into a corner, like a
 * relief, and a piece of live product sitting on it. Captioned underneath.
 */
function Stage({
  dark = false,
  relief,
  title,
  caption,
  children,
  className = '',
}: {
  dark?: boolean
  relief: SpriteId
  title: string
  caption: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <figure className={`sc-scroll m-0 flex flex-col ${className}`}>
      <div
        className={`relative flex min-h-[300px] flex-1 items-center justify-center overflow-hidden rounded-[12px] p-5 sm:p-7 ${
          dark ? 'bg-ink' : 'bg-parchment-deep'
        }`}
      >
        {/* the relief lives on its own layer, out of the flow, so it never nudges the content */}
        <span aria-hidden className={`pointer-events-none absolute -right-14 -bottom-16 ${dark ? 'opacity-[0.14]' : 'opacity-[0.07]'}`}>
          <Illustration name={relief} still size={260} tint={dark ? 'var(--sc-parchment)' : 'var(--sc-ink)'} />
        </span>
        <div className="relative w-full max-w-[340px]">{children}</div>
      </div>
      <figcaption className="mt-4">
        <p className="text-[16px] font-medium text-ink">{title}</p>
        <p className="mt-1 text-[15px] leading-relaxed text-ink-3">{caption}</p>
      </figcaption>
    </figure>
  )
}

/**
 * The top of the dashboard: an index of the day and three small stages. The greeting above
 * it is BriefingHeadline, which stays pinned while the feed scrolls underneath.
 */
export default function Briefing({ lead, moving, allPosts, viewedIds, savedCount, newCount, level }: BriefingProps) {
  const newest = Math.max(...allPosts.map((p) => Date.parse(p.publishedAt)))
  const viewed = new Set(viewedIds)

  // reading per topic, and a nudge toward the topic read least
  const reading = categories.map((c) => {
    const inTopic = allPosts.filter((p) => p.categoryId === c.id)
    return { ...c, read: inTopic.filter((p) => viewed.has(p.id)).length, total: inTopic.length }
  })
  const quietest = [...reading].sort((a, b) => a.read / a.total - b.read / b.total)[0]
  const busiest = [...reading].sort((a, b) => b.read - a.read)[0]
  const nudge =
    busiest.read === 0
      ? `Start anywhere. ${quietest.name} has ${quietest.total} stories waiting.`
      : `You've read most in ${busiest.name}. Try one from ${quietest.name} today.`

  return (
    <section aria-labelledby="brief-title">
      <div className="grid grid-cols-1 gap-8 lg:mt-14 xl:grid-cols-[200px_minmax(0,1fr)] xl:gap-12">
        {/* index of the day, set like a table of contents */}
        <nav aria-label="Briefing" className="text-[15px]">
          <div className="border-b border-line pb-5">
            <p className="font-medium text-ink">Today&apos;s brief</p>
            <p className="mt-1.5 leading-relaxed text-ink-3">
              {newCount} new {newCount === 1 ? 'story' : 'stories'} since your last visit
              {level ? `, picked for an ${level} reader.` : '.'}
            </p>
          </div>
          <a href="#wall" className="block border-b border-line py-4 text-ink-3 transition-colors hover:text-ink">
            Your wall
          </a>
          <Link href="/saved" className="flex items-center justify-between border-b border-line py-4 text-ink-3 transition-colors hover:text-ink">
            Saved
            <span className="tabular-nums text-ink-4">{savedCount}</span>
          </Link>
        </nav>

        {/* the lead stands tall on the left; the two smaller stages stack beside it */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Stage dark relief="paper" className="sm:row-span-2" title="Today's lead" caption="The story with the most pull this morning, across every platform.">
            <article className="rounded-[10px] bg-surface p-5 text-ink shadow-lift">
              <div className="flex items-center gap-2.5">
                <PlatformIcon source={lead.source} size="sm" tone="brand" />
                <p className="min-w-0 truncate text-[13px]">
                  <span className="font-medium">{lead.sourceHandle ?? '@scooply'}</span>
                  <span className="text-ink-4"> · {ago(lead.publishedAt, newest)}</span>
                </p>
              </div>
              <h2 className="mt-4 font-display text-[20px] leading-[1.2]">{lead.title}</h2>
              <p className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-ink-3">{lead.content}</p>
              <div className="mt-4">
                <PreviewButton post={lead} />
              </div>
            </article>
          </Stage>

          <Stage relief="binoculars" title="Moving now" caption="Stories picking up speed, so you hear about them early.">
            <p className="mb-2.5 flex items-center gap-1.5 text-[13px] text-ink-2">
              <BarChart size={14} />
              Moving now
            </p>
            <ul className="flex flex-col gap-1.5">
              {moving.map((p) => (
                <li key={p.id}>
                  <TrackedPostLink
                    postId={p.id}
                    href={p.sourceUrl}
                    className="flex items-center gap-2.5 rounded-[8px] bg-surface px-3 py-2.5 shadow-float transition-transform duration-200 ease-soft hover:-translate-y-px"
                  >
                    <PlatformIcon source={p.source} size="sm" tone="brand" />
                    <span className="min-w-0 flex-1 truncate text-[14px] text-ink">{p.title}</span>
                    <span className="shrink-0 text-[12px] text-ink-4" title={SOURCE_LABEL[p.source]}>
                      {ago(p.publishedAt, newest)}
                    </span>
                  </TrackedPostLink>
                </li>
              ))}
            </ul>
          </Stage>

          <Stage relief="book" title="Your reading" caption="Where your week has gone, and a nudge toward what you've missed.">
            <div className="rounded-[10px] bg-surface p-4 shadow-float">
              <ul className="flex flex-col gap-3">
                {reading.map((r) => {
                  const icon = TOPIC_NAV.find((t) => t.id === r.id)?.icon
                  return (
                    <li key={r.id}>
                      <Link href={`/dashboard?category=${r.id}`} className="group block">
                        <div className="flex items-center gap-2 text-[13px]">
                          <span className="text-ink-2 [&_svg]:h-[15px] [&_svg]:w-[15px]">{icon}</span>
                          <span className="flex-1 truncate text-ink group-hover:underline">{r.name}</span>
                          <span className="tabular-nums text-ink-4">
                            {r.read}/{r.total}
                          </span>
                        </div>
                        <div className="mt-1.5 h-[3px] overflow-hidden rounded-full bg-ink/[0.07]">
                          <div className="h-full rounded-full bg-ink" style={{ width: `${Math.max(2, (r.read / Math.max(1, r.total)) * 100)}%` }} />
                        </div>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
            <div className="mt-3 flex gap-2.5 px-1">
              <ScooplyLogo size={18} showWordmark={false} className="mt-0.5 shrink-0" />
              <div>
                <p className="text-[13px] leading-relaxed text-ink-2">{nudge}</p>
              </div>
            </div>
          </Stage>
        </div>
      </div>
    </section>
  )
}

/**
 * The greeting, pinned to the top of the dashboard. It sits on the page's own background
 * (fixed, so the band is seamless) and fades out at its lower edge, so the feed scrolls up
 * and dissolves beneath it. Over the first stretch of scroll it eases down to a compact
 * size (.sc-shrink in globals.css) so it never crowds the screen. On phones it also carries
 * the topic pills and search (passed as children), which the desktop keeps in the sidebar.
 */
export function BriefingHeadline({ firstName, children }: { firstName: string; children?: React.ReactNode }) {
  return (
    <div className="sc-field sticky top-16 z-20 -mx-6 px-6 pt-3 pb-12 [mask-image:linear-gradient(to_bottom,black_calc(100%-2.75rem),transparent)] lg:top-0 lg:-mx-12 lg:px-12 lg:pt-6 xl:-mx-16 xl:px-16">
      <h1
        id="brief-title"
        className="sc-shrink mx-auto max-w-6xl font-display text-[30px] leading-[1.1] text-ink [--sc-shrink-to:20px] sm:text-[48px] sm:leading-[1.08] sm:[--sc-shrink-to:26px] lg:text-[56px] lg:[--sc-shrink-to:30px]"
      >
        Hello {firstName}.
        <br />
        <span className="text-ink-4">Here&apos;s what moved in AI.</span>
      </h1>
      {/* phones only: topic pills and search pin along with the greeting */}
      {children && <div className="mt-4 space-y-3 lg:hidden">{children}</div>}
    </div>
  )
}
