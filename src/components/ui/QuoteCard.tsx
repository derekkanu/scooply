import Illustration from '@/components/illustrations/Illustration'
import type { SpriteId } from '@/components/illustrations/sprites'
import { toneStyle, type BentoTone } from './BentoCard'

interface QuoteCardProps {
  quote: string
  name: string
  role: string
  art: SpriteId
  tone?: BentoTone
  className?: string
}

/** White card: a plain tinted square with an illustration, a quote mark tile, a light quote, name and role. */
export default function QuoteCard({ quote, name, role, art, tone = 'lime', className = '' }: QuoteCardProps) {
  return (
    <figure className={`m-0 grid grid-cols-1 gap-6 rounded-[20px] bg-surface p-5 text-ink sm:grid-cols-[minmax(0,320px)_1fr] sm:gap-10 ${className}`}>
      <div className="sc-card-grid flex aspect-square items-center justify-center rounded-[10px] p-8" style={toneStyle(tone)}>
        <Illustration name={art} />
      </div>
      <div className="flex flex-col justify-between gap-8 py-2 sm:pr-6">
        <div>
          <span
            aria-hidden
            className="inline-flex h-10 w-10 items-center justify-center rounded-[4px] font-display text-[28px] leading-none"
            style={toneStyle(tone)}
          >
            “
          </span>
          <blockquote className="m-0 mt-5 font-display text-[24px] leading-[1.25] sm:text-[28px]">{quote}</blockquote>
        </div>
        <figcaption>
          <p className="text-[16px]">{name}</p>
          <p className="mt-0.5 text-[13px] text-ink-3">{role}</p>
        </figcaption>
      </div>
    </figure>
  )
}
