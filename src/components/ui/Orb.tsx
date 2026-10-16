// Orbs used to carry Scooply's secondary color; in the editorial system every palette is a
// step of paper and ink, so topics differ by tone, never by hue. Three renderings share one palette set:
//  - "gradient": a soft pastel sphere (the case-card orb) — the default, used for topics
//  - "pixel": a dot-matrix sphere (the original PixelSphere language, in color);
//    its density doubles as meaning — sparse for beginner, dense for advanced
//  - "glass": a glossy sphere with a specular highlight, for the "Thinking…" state
//
// Patterns are deterministic so orbs look identical across renders.

export type OrbPalette = 'ember' | 'tide' | 'bloom' | 'sun' | 'moss' | 'prism' | 'dusk' | 'mono'

export const ORB_PALETTES: Record<OrbPalette, [string, string, string]> = {
  ember: ['#fbf8f1', '#6b675f', '#1a1916'],
  tide: ['#f3efe6', '#5f5a50', '#1a1916'],
  bloom: ['#ebe6da', '#7d786d', '#2b2924'],
  sun: ['#fbf8f1', '#8a8578', '#3d3a35'],
  moss: ['#e2ddd0', '#55514a', '#1a1916'],
  prism: ['#fbf8f1', '#9d988d', '#3d3a35'],
  dusk: ['#ebe6da', '#6b675f', '#2b2924'],
  mono: ['#fbf8f1', '#8a8578', '#1a1916'],
}

// Soft pastel blends for the gradient variant: top-left → centre → bottom-right.
export const GRADIENT_PALETTES: Record<OrbPalette, [string, string, string]> = {
  ember: ['#fbf8f1', '#9d988d', '#3d3a35'],
  tide: ['#fbf8f1', '#b8b2a5', '#55514a'],
  bloom: ['#f3efe6', '#a39d90', '#6b675f'],
  sun: ['#fbf8f1', '#cfc9bb', '#8a8578'],
  moss: ['#ebe6da', '#8a8578', '#3d3a35'],
  prism: ['#fbf8f1', '#c9c2b3', '#7d786d'],
  dusk: ['#f3efe6', '#b8b2a5', '#6b675f'],
  mono: ['#fbf8f1', '#ddd8ce', '#aba497'],
}

// Category → orb, so every feed topic owns a color without owning a surface.
export const CATEGORY_ORB: Record<string, OrbPalette> = {
  'ai-foundations': 'tide',
  'hands-on-ai-tools': 'sun',
  'ai-with-heart': 'bloom',
  'stay-curious': 'moss',
}

// Proficiency → pixel density.
export const PROFICIENCY_DENSITY = { beginner: 0.45, intermediate: 0.72, advanced: 1 } as const

function rand(i: number, j: number) {
  const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453
  return s - Math.floor(s)
}

interface OrbProps {
  palette?: OrbPalette
  variant?: 'gradient' | 'pixel' | 'glass'
  size?: number
  /** pixel variant only: 0 (sparse) → 1 (solid core) */
  density?: number
  /** pixel variant only: cells per side */
  resolution?: number
  shadow?: boolean
  float?: boolean
  className?: string
  label?: string
}

export default function Orb({
  palette = 'ember',
  variant = 'gradient',
  size = 40,
  density = 1,
  resolution,
  shadow = false,
  float = false,
  className = '',
  label,
}: OrbProps) {
  const [light, mid, deep] = ORB_PALETTES[palette]
  const gid = `sc-orb-${palette}-${variant}`
  const grid = resolution ?? Math.max(9, Math.min(28, Math.round(size / 4)))
  const vb = 100

  let body: React.ReactNode
  if (variant === 'gradient') {
    body = (
      <>
        <circle cx="50" cy="50" r="48" fill={`url(#${gid}-soft)`} />
        <circle cx="50" cy="50" r="48" fill={`url(#${gid}-light)`} />
      </>
    )
  } else if (variant === 'glass') {
    body = (
      <>
        <circle cx="50" cy="50" r="48" fill={`url(#${gid})`} />
        <circle cx="50" cy="50" r="48" fill={`url(#${gid}-rim)`} />
        <ellipse cx="36" cy="28" rx="18" ry="11" fill="white" opacity="0.55" />
      </>
    )
  } else {
    const cell = vb / grid
    const dot = cell * 0.78
    const c = (grid - 1) / 2
    const R = grid / 2
    const rects: React.ReactNode[] = []
    for (let i = 0; i < grid; i++) {
      for (let j = 0; j < grid; j++) {
        if (Math.hypot(i - c, j - c) > R) continue
        // Same rule as the hero PixelSphere: solid on the lit right, dissolving to the left.
        // density 1 = solid disk; lower density widens the dissolve.
        const threshold = Math.max(0, 0.5 - ((i - c) / R) * 0.55) * (1 - density) * 2
        if (rand(i, j) < threshold) continue
        rects.push(
          <rect
            key={`${i}-${j}`}
            x={i * cell + (cell - dot) / 2}
            y={j * cell + (cell - dot) / 2}
            width={dot}
            height={dot}
            fill={`url(#${gid})`}
          />,
        )
      }
    }
    body = rects
  }

  return (
    <span
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`relative inline-block shrink-0 ${float ? 'sc-float' : ''} ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox={`0 0 ${vb} ${vb}`} width={size} height={size} className="relative z-10 block">
        <defs>
          {variant === 'gradient' && (
            <>
              <linearGradient id={`${gid}-soft`} x1="0.1" y1="0.05" x2="0.9" y2="0.95">
                <stop offset="0%" stopColor={GRADIENT_PALETTES[palette][0]} />
                <stop offset="52%" stopColor={GRADIENT_PALETTES[palette][1]} />
                <stop offset="100%" stopColor={GRADIENT_PALETTES[palette][2]} />
              </linearGradient>
              <radialGradient id={`${gid}-light`} cx="32%" cy="26%" r="62%">
                <stop offset="0%" stopColor="white" stopOpacity="0.55" />
                <stop offset="60%" stopColor="white" stopOpacity="0" />
              </radialGradient>
            </>
          )}
          {palette === 'prism' ? (
            <linearGradient id={gid} x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={light} />
              <stop offset="55%" stopColor={mid} />
              <stop offset="100%" stopColor={deep} />
            </linearGradient>
          ) : (
            <radialGradient id={gid} cx="38" cy="32" r="75" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={light} />
              <stop offset="48%" stopColor={mid} />
              <stop offset="100%" stopColor={deep} />
            </radialGradient>
          )}
          <radialGradient id={`${gid}-rim`} cx="50%" cy="50%" r="50%">
            <stop offset="78%" stopColor="white" stopOpacity="0" />
            <stop offset="100%" stopColor="white" stopOpacity="0.28" />
          </radialGradient>
        </defs>
        {variant === 'pixel' ? <g>{body}</g> : body}
      </svg>
      {shadow && (
        <span
          aria-hidden
          className="absolute left-1/2 -translate-x-1/2 rounded-[50%] blur-md"
          style={{
            top: '88%',
            width: '70%',
            height: '22%',
            background: 'radial-gradient(closest-side, rgb(10 10 10 / 0.28), transparent)',
          }}
        />
      )}
    </span>
  )
}
