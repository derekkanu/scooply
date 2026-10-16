interface TagProps {
  children: React.ReactNode
  /** Dot color — any CSS color. Defaults to the accent; false hides it. */
  dot?: string | false
  tone?: 'surface' | 'soft'
  className?: string
}

const toneClasses = {
  surface: 'bg-surface text-tan border border-gold-soft',
  soft: 'bg-cream-deep text-tan',
}

/** Small metadata pill from the case cards: white, gold hairline, orange dot, tan text. */
export default function Tag({ children, dot, tone = 'surface', className = '' }: TagProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[12px] leading-none whitespace-nowrap ${toneClasses[tone]} ${className}`}
    >
      {dot !== false && (
        <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: dot || 'var(--sc-accent)' }} />
      )}
      {children}
    </span>
  )
}
