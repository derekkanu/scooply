interface ScooplyLogoProps {
  size?: number
  showWordmark?: boolean
  className?: string
}

// Inherits text color so the mark follows the theme (ink on light, ink on dark).
const MARK_FILL = 'currentColor'

function DotMatrixMark({ size }: { size: number }) {
  const cx = size / 2
  const cy = size / 2
  const sq = size * 0.072
  const innerR = size * 0.275
  const outerR = size * 0.405
  const centerR = size * 0.105
  const N = 12
  // rounded so server and browser trig agree to the digit (no hydration mismatch)
  const r3 = (n: number) => Math.round(n * 1000) / 1000
  const dots: Array<{ x: number; y: number }> = []
  for (let i = 0; i < N; i++) {
    const aInner = (i / N) * Math.PI * 2 - Math.PI / 2
    dots.push({
      x: r3(cx + Math.cos(aInner) * innerR - sq / 2),
      y: r3(cy + Math.sin(aInner) * innerR - sq / 2),
    })
    const aOuter = ((i + 0.5) / N) * Math.PI * 2 - Math.PI / 2
    dots.push({
      x: r3(cx + Math.cos(aOuter) * outerR - sq / 2),
      y: r3(cy + Math.sin(aOuter) * outerR - sq / 2),
    })
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" aria-hidden>
      <circle cx={cx} cy={cy} r={centerR} fill={MARK_FILL} />
      {dots.map((d, i) => (
        <rect key={i} x={d.x} y={d.y} width={sq} height={sq} fill={MARK_FILL} />
      ))}
    </svg>
  )
}

export default function ScooplyLogo({ size = 28, showWordmark = true, className = '' }: ScooplyLogoProps) {
  return (
    <div className={`inline-flex items-center gap-2 text-ink ${className}`}>
      <DotMatrixMark size={size} />
      {showWordmark && (
        <span
          className="font-semibold tracking-tight"
          style={{ fontSize: Math.round(size * 0.78), letterSpacing: '-0.02em' }}
        >
          Scooply.
        </span>
      )}
    </div>
  )
}
