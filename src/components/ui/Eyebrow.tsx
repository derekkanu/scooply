interface EyebrowProps {
  children: React.ReactNode
  /** A small orange dot before the label — the only color an eyebrow carries. */
  dot?: boolean
  /** Sets the label in a small white pill with a hairline edge. */
  framed?: boolean
  className?: string
}

/** Original Scooply label: 11px, semibold, wide-tracked. */
export default function Eyebrow({ children, dot = false, framed = false, className = '' }: EyebrowProps) {
  return (
    <p
      className={`inline-flex items-center gap-1.5 text-[13px] font-semibold ${
        framed ? 'rounded-full bg-surface px-3 py-1.5 text-ink-2 shadow-[0_0_0_1px_var(--sc-line)]' : 'text-ink-4'
      } ${className}`}
    >
      {dot && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />}
      {children}
    </p>
  )
}
