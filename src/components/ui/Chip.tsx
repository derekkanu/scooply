import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean
  /** outline: filter / interest chip. soft: compact suggestion chip. */
  variant?: 'outline' | 'soft'
}

/** Selection reads like a case-card tag: cream, gold edge, orange dot. Never a black fill. */
const Chip = forwardRef<HTMLButtonElement, ChipProps>(
  ({ selected = false, variant = 'outline', className = '', type = 'button', ...props }, ref) => {
    const base =
      'inline-flex items-center gap-1.5 rounded-full whitespace-nowrap border transition-[background-color,border-color,color] duration-200 ease-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

    const size = variant === 'soft' ? 'h-7 px-3 text-[12px]' : 'h-9 px-4 text-sm font-medium'
    const look = selected
      ? 'bg-cream-deep text-ink border-gold'
      : variant === 'soft'
        ? 'bg-ink/[0.05] text-ink-2 border-transparent hover:bg-ink/[0.08]'
        : 'bg-surface/60 text-ink-2 border-line-strong hover:bg-surface hover:text-ink'

    return (
      <button ref={ref} type={type} aria-pressed={selected} className={`${base} ${size} ${look} ${className}`} {...props}>
        <span
          aria-hidden
          className={`h-1.5 w-1.5 rounded-full bg-accent transition-[opacity,margin] duration-200 ease-soft ${
            selected ? 'opacity-100' : '-mr-3 opacity-0'
          }`}
        />
        {props.children}
      </button>
    )
  },
)

Chip.displayName = 'Chip'
export default Chip
