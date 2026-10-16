interface TooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  side?: 'top' | 'bottom'
  /** Keep it visible (for demos / onboarding hints). */
  open?: boolean
  className?: string
}

/** CSS-only tooltip: fades and drifts 4px toward its anchor on hover or focus. */
export default function Tooltip({ content, children, side = 'top', open = false, className = '' }: TooltipProps) {
  const pos = side === 'top' ? 'bottom-full mb-2 translate-y-1' : 'top-full mt-2 -translate-y-1'
  return (
    <span className={`group/tip relative inline-flex ${className}`}>
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-full bg-surface px-2.5 py-1 text-[12px] text-ink-2 shadow-float transition-[opacity,transform] duration-200 ease-soft ${pos} ${
          open
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 group-hover/tip:opacity-100 group-hover/tip:translate-y-0 group-focus-within/tip:opacity-100 group-focus-within/tip:translate-y-0'
        }`}
      >
        {content}
      </span>
    </span>
  )
}
