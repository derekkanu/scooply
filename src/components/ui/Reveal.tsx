interface RevealProps {
  children: React.ReactNode
  /** ms before the element starts to appear — stagger lists in 60–80ms steps. */
  delay?: number
  dir?: 'up' | 'down' | 'left' | 'right' | 'none'
  as?: 'div' | 'section' | 'li' | 'span'
  className?: string
}

/** Soft entrance: opacity + a short directional drift. Opacity-only under reduced motion. */
export default function Reveal({ children, delay = 0, dir = 'up', as: Tag = 'div', className = '' }: RevealProps) {
  return (
    <Tag
      className={`sc-reveal ${className}`}
      data-dir={dir}
      style={{ '--sc-delay': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  )
}
