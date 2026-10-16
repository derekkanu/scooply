import Link from 'next/link'
import { ArrowRight } from './icons'

interface ListRowProps {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  href?: string
  onClick?: () => void
  /** Replaces the default arrow. */
  trailing?: React.ReactNode
  selected?: boolean
  className?: string
}

/** Icon tile + title/subtitle + arrow. Used for jump lists, settings and onboarding choices. */
export default function ListRow({ title, subtitle, icon, href, onClick, trailing, selected = false, className = '' }: ListRowProps) {
  const cls = `sc-card sc-card-lift group flex w-full items-center gap-3 rounded-[16px] p-3 text-left focus-visible:outline-2 focus-visible:outline-accent ${
    selected ? 'outline-2 -outline-offset-1 outline-accent/60' : ''
  } ${className}`

  const inner = (
    <>
      {icon && (
        <span
          aria-hidden
          className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] [&_svg]:h-4 [&_svg]:w-4 ${
            selected ? 'bg-accent-soft text-accent-ink' : 'bg-surface-muted text-ink-2'
          }`}
        >
          {icon}
        </span>
      )}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-[15px] font-medium text-ink">{title}</span>
        {subtitle && <span className="truncate text-[13px] text-ink-3">{subtitle}</span>}
      </span>
      {trailing ?? (
        <ArrowRight
          size={14}
          className="shrink-0 text-ink-4 transition-[transform,color] duration-200 ease-soft group-hover:translate-x-0.5 group-hover:text-ink"
        />
      )}
    </>
  )

  if (href) {
    return (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    )
  }
  return (
    <button type="button" onClick={onClick} aria-pressed={selected} className={cls}>
      {inner}
    </button>
  )
}
