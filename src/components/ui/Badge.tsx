interface BadgeProps {
  children: React.ReactNode
  color?: string
  className?: string
}

export default function Badge({ children, color, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center h-6 px-2.5 rounded-full text-[12px] font-medium bg-ink/[0.05] text-ink-3 ${className}`}
      style={color ? { backgroundColor: `${color}18`, color } : undefined}
    >
      {children}
    </span>
  )
}
