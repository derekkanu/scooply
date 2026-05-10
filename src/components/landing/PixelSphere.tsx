// A large pixelated/dot-matrix sphere: a grid of small squares whose density
// is solid on the right and disintegrates into scattered specks on the left,
// matching the hero illustration in the design.
//
// The pattern is deterministic so the sphere looks stable across renders.

const GRID = 56 // resolution of the square grid (cells per side)

function rand(i: number, j: number) {
  const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453
  return s - Math.floor(s)
}

function isFilled(i: number, j: number) {
  const cx = (GRID - 1) / 2
  const cy = (GRID - 1) / 2
  const dx = i - cx
  const dy = j - cy
  const r = Math.sqrt(dx * dx + dy * dy)
  const radius = GRID / 2
  if (r > radius) return false

  // Normalized horizontal position within the disk: -1 (left edge) → +1 (right edge).
  const xNorm = dx / radius
  // Solid on the right, scattered on the left.
  // Threshold slides from 0 (everything fills) on the right to ~0.95 on the left.
  const threshold = 0.5 - xNorm * 0.55
  const noise = rand(i, j)
  if (noise > threshold) return true

  // Add a few stray dots that float just outside the disk on the dissolving side.
  return false
}

function strayDot(i: number, j: number) {
  const cx = (GRID - 1) / 2
  const cy = (GRID - 1) / 2
  const dx = i - cx
  const dy = j - cy
  const r = Math.sqrt(dx * dx + dy * dy)
  const radius = GRID / 2
  if (r <= radius) return false
  if (r > radius + 4) return false
  // Only on the left side, and very sparse.
  if (dx > -2) return false
  return rand(i + 7, j + 13) > 0.93
}

export default function PixelSphere({ className = '' }: { className?: string }) {
  const cell = 12
  const dot = 9
  const size = GRID * cell
  const cells: Array<{ x: number; y: number }> = []
  for (let i = 0; i < GRID; i++) {
    for (let j = 0; j < GRID; j++) {
      if (isFilled(i, j) || strayDot(i, j)) {
        cells.push({ x: i, y: j })
      }
    }
  }
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      {cells.map(({ x, y }, idx) => (
        <rect
          key={idx}
          x={x * cell + (cell - dot) / 2}
          y={y * cell + (cell - dot) / 2}
          width={dot}
          height={dot}
          fill="#0A0A0A"
        />
      ))}
    </svg>
  )
}
