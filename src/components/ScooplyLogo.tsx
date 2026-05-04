interface ScooplyLogoProps {
  size?: number
  showWordmark?: boolean
  className?: string
}

export default function ScooplyLogo({ size = 28, showWordmark = true, className = '' }: ScooplyLogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="13" stroke="black" strokeWidth="1.5" />
        <circle cx="14" cy="14" r="9" stroke="black" strokeWidth="1.5" />
        <circle cx="14" cy="14" r="5" stroke="black" strokeWidth="1.5" />
        <circle cx="14" cy="14" r="2" fill="black" />
        <path d="M14 1 C 14 1, 27 14, 14 27" stroke="black" strokeWidth="1.2" fill="none" />
      </svg>
      {showWordmark && (
        <span className="font-bold tracking-tight text-zinc-900" style={{ fontSize: Math.round(size * 0.7) }}>
          Scooply
        </span>
      )}
    </div>
  )
}
