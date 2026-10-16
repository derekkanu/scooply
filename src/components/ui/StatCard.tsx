import CardTag from './CardTag'
import { toneStyle, type BentoTone } from './BentoCard'

interface StatCardProps {
  tag: string
  statement: string
  footer?: React.ReactNode
  /** glass: translucent white over whatever sits behind (an image band or a tint). */
  tone?: BentoTone | 'glass'
  className?: string
}

/** A tag, one big light statement, and a small footer. For outcomes, not features. */
export default function StatCard({ tag, statement, footer, tone = 'white', className = '' }: StatCardProps) {
  const style = tone === 'glass' ? undefined : toneStyle(tone)
  return (
    <article
      className={`flex min-h-[300px] flex-col justify-between gap-8 rounded-[14px] p-5 sm:p-6 ${
        tone === 'glass' ? 'bg-white/35 text-ink backdrop-blur-md' : ''
      } ${className}`}
      style={style}
    >
      <div className="flex flex-col items-start gap-6">
        <CardTag>{tag}</CardTag>
        <p className="font-display text-[28px] leading-[1.15] sm:text-[32px]">{statement}</p>
      </div>
      {footer && <div className="text-[13px] opacity-70">{footer}</div>}
    </article>
  )
}
