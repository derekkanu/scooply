import { ButtonHTMLAttributes, forwardRef } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type ButtonShape = 'pill' | 'rect'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  shape?: ButtonShape
}

// The primary action is set in ink, like a headline; everything else stays on paper.
const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-ink text-[var(--sc-on-ink)] hover:bg-ink-2',
  secondary: 'bg-surface text-ink border border-line-strong hover:bg-cream',
  outline: 'bg-transparent text-ink border border-line-strong hover:bg-surface',
  ghost: 'bg-transparent text-ink-3 hover:text-ink hover:bg-ink/5',
  accent: 'bg-ink text-[var(--sc-on-ink)] hover:bg-ink-2',
  danger: 'bg-negative-soft text-negative hover:bg-negative/15',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3.5 text-[13px]',
  md: 'h-10 px-5 text-sm',
  lg: 'h-12 px-6 text-[15px]',
}

const shapeClasses: Record<ButtonShape, string> = {
  pill: 'rounded-full',
  // The case-card CTA: small, square-cornered,. Ignores `size`.
  rect: 'rounded-[4px] h-8 px-3.5 text-[13px]',
}

/** Class string for anything that should look like a button (e.g. a Link). */
export function buttonClasses({
  variant = 'primary',
  size = 'md',
  shape = 'pill',
  className = '',
}: { variant?: ButtonVariant; size?: ButtonSize; shape?: ButtonShape; className?: string } = {}) {
  return `inline-flex items-center justify-center gap-2 ${shapeClasses[shape]} font-medium whitespace-nowrap transition-[background-color,border-color,color,box-shadow,opacity] duration-200 ease-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-40 disabled:cursor-not-allowed ${variantClasses[variant]} ${shape === 'pill' ? sizeClasses[size] : ''} ${className}`
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', shape = 'pill', className = '', ...props }, ref) => {
    return <button ref={ref} className={buttonClasses({ variant, size, shape, className })} {...props} />
  },
)

Button.displayName = 'Button'
export default Button
