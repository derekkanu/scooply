interface IconTileProps {
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  tone?: 'warm' | 'muted' | 'accent'
  className?: string
}

const sizeClasses = {
  sm: 'h-7 w-7 [&_svg]:h-3.5 [&_svg]:w-3.5',
  md: 'h-9 w-9 [&_svg]:h-4 [&_svg]:w-4',
  lg: 'h-12 w-12 [&_svg]:h-5 [&_svg]:w-5',
}

const toneClasses = {
  warm: 'bg-cream-deep text-ink-2',
  muted: 'bg-surface border border-gold-soft text-ink-2',
  accent: 'bg-accent-soft text-accent-ink',
}

export default function IconTile({ children, size = 'md', tone = 'warm', className = '' }: IconTileProps) {
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center rounded-tile ${sizeClasses[size]} ${toneClasses[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
