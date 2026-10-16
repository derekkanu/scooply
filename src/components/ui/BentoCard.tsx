import Link from 'next/link'
import Illustration from '@/components/illustrations/Illustration'
import type { SpriteId } from '@/components/illustrations/sprites'
import CardTag from './CardTag'
import { ArrowRight } from './icons'

export type BentoTone = 'lime' | 'lavender' | 'mint' | 'sky' | 'butter' | 'blush' | 'coral' | 'stone' | 'white' | 'paper'

/** Background and ink for a card tone. White cards use the page ink. */
export function toneStyle(tone: BentoTone): React.CSSProperties {
  if (tone === 'paper') {
    // monotone: cream paper like the scoop clippings, its pattern in a deeper parchment
    return {
      backgroundColor: 'var(--sc-surface-warm)',
      color: 'var(--sc-ink)',
      boxShadow: 'inset 0 0 0 1px var(--sc-line-strong)',
      ['--sc-card' as string]: 'var(--sc-parchment-deep)',
      ['--sc-card-ink' as string]: 'var(--sc-ink)',
    }
  }
  if (tone === 'white') {
    return {
      backgroundColor: 'var(--sc-surface)',
      color: 'var(--sc-ink)',
      ['--sc-card' as string]: 'var(--sc-stone)',
      ['--sc-card-ink' as string]: 'var(--sc-ink)',
    }
  }
  return {
    backgroundColor: `var(--sc-${tone})`,
    color: `var(--sc-${tone}-ink)`,
    ['--sc-card' as string]: `var(--sc-${tone})`,
    ['--sc-card-ink' as string]: `var(--sc-${tone}-ink)`,
  }
}

interface BentoCardProps {
  tone?: BentoTone
  art?: SpriteId
  /** Custom content for the art panel (e.g. a ListPanel); replaces `art`. */
  panel?: React.ReactNode
  tag?: string
  title: string
  body?: string
  cta?: { label: string; href: string }
  /**
   * stack: words on top, art panel below (tall cards).
   * side: words left, art panel right (wide cards).
   * top: words only, small art in the corner (short cards).
   */
  layout?: 'stack' | 'side' | 'top'
  artSize?: number
  className?: string
}

/**
 * Feature card: a flat, saturated tint with an outlined tag, a large light headline and a
 * plain inner panel holding the illustration. No border, no shadow — the tint is the card.
 */
export default function BentoCard({
  tone = 'lime',
  art,
  panel,
  tag,
  title,
  body,
  cta,
  layout = 'stack',
  artSize,
  className = '',
}: BentoCardProps) {
  const words = (
    <div className="flex flex-col items-start">
      {tag && <CardTag className="mb-5">{tag}</CardTag>}
      <h3 className="font-display text-[28px] leading-[1.12] sm:text-[32px]">{title}</h3>
      {body && <p className="mt-3 max-w-[40ch] text-[15px] leading-relaxed opacity-75">{body}</p>}
      {cta && (
        <Link href={cta.href} className="group mt-5 inline-flex items-center gap-1.5 text-[15px] underline-offset-4 hover:underline">
          {cta.label}
          <ArrowRight size={15} className="transition-transform duration-200 ease-soft group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  )
  const artPanel = (panel || art) && (
    <div className="sc-card-grid flex min-h-[200px] flex-1 items-center justify-center overflow-hidden rounded-[14px] p-6">
      {panel ?? <Illustration name={art!} size={artSize ?? 200} />}
    </div>
  )

  return (
    <article
      className={`flex rounded-[20px] p-6 sm:p-8 ${
        layout === 'side' ? 'flex-col gap-6 md:flex-row md:items-stretch md:gap-8 md:[&>*]:flex-1' : 'flex-col gap-6'
      } ${className}`}
      style={toneStyle(tone)}
    >
      {layout === 'top' ? (
        <>
          {art && <Illustration name={art} size={artSize ?? 112} className="-mt-2 -ml-2" />}
          {words}
        </>
      ) : (
        <>
          {words}
          {artPanel}
        </>
      )}
    </article>
  )
}
