// Each side has 4 nested L-shaped paths: a horizontal segment entering from the
// off-screen edge, a quarter-circle corner, then a vertical segment that runs
// down past the screen mockup (the screen's white bg hides the bottoms).
// The radii decrease across the stack so the paths fan out into a funnel shape.

const LINES = [
  { y: 200, r: 200 },
  { y: 290, r: 160 },
  { y: 380, r: 120 },
  { y: 470, r: 80 },
]

const ARC_START_LEFT = 380 // x where the left-side horizontals end and the arcs begin
const ARC_START_RIGHT = 1060 // mirror on the right side
const VIEW_HEIGHT = 1500

const STROKE = '#71717A'
const STROKE_WIDTH = 0.75
const STROKE_OPACITY = 0.15

export default function DecorativeLines() {
  return (
    <svg
      aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox={`0 0 1440 ${VIEW_HEIGHT}`}
      preserveAspectRatio="xMidYMin slice"
      fill="none"
    >
      {LINES.map(({ y, r }, i) => {
        const leftVerticalX = ARC_START_LEFT + r
        const rightVerticalX = ARC_START_RIGHT - r
        const arcEndY = y + r
        return (
          <g key={i}>
            {/* Left side: horizontal coming in from -10, clockwise quarter arc, vertical down */}
            <path
              d={`M -10 ${y} L ${ARC_START_LEFT} ${y} A ${r} ${r} 0 0 1 ${leftVerticalX} ${arcEndY} L ${leftVerticalX} ${VIEW_HEIGHT}`}
              stroke={STROKE}
              strokeWidth={STROKE_WIDTH}
              strokeOpacity={STROKE_OPACITY}
              strokeLinecap="round"
            />
            {/* Right side: mirrored — horizontal from 1450, counter-clockwise arc, vertical down */}
            <path
              d={`M 1450 ${y} L ${ARC_START_RIGHT} ${y} A ${r} ${r} 0 0 0 ${rightVerticalX} ${arcEndY} L ${rightVerticalX} ${VIEW_HEIGHT}`}
              stroke={STROKE}
              strokeWidth={STROKE_WIDTH}
              strokeOpacity={STROKE_OPACITY}
              strokeLinecap="round"
            />
          </g>
        )
      })}
    </svg>
  )
}
