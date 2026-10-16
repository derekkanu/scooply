// Scooply icon set — 24px grid, 1.6 stroke, round caps. Inherit currentColor.

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number }

function Base({ size = 16, children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  )
}

export const ArrowRight = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Base>
)
export const ArrowUpRight = (p: IconProps) => (
  <Base {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </Base>
)
export const ArrowLeft = (p: IconProps) => (
  <Base {...p}>
    <path d="M19 12H5M11 18l-6-6 6-6" />
  </Base>
)
export const ChevronLeft = (p: IconProps) => (
  <Base {...p}>
    <path d="m15 18-6-6 6-6" />
  </Base>
)
export const ChevronRight = (p: IconProps) => (
  <Base {...p}>
    <path d="m9 18 6-6-6-6" />
  </Base>
)
export const Close = (p: IconProps) => (
  <Base {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Base>
)
export const Search = (p: IconProps) => (
  <Base {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4-4" />
  </Base>
)
export const Code = (p: IconProps) => (
  <Base {...p}>
    <path d="m9 8-4 4 4 4M15 8l4 4-4 4" />
  </Base>
)
export const Sparkle = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.5 6.5l2 2M15.5 15.5l2 2M6.5 17.5l2-2M15.5 8.5l2-2" />
  </Base>
)
export const Lock = (p: IconProps) => (
  <Base {...p}>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </Base>
)
export const Bookmark = ({ filled, ...p }: IconProps & { filled?: boolean }) => (
  <Base {...p} fill={filled ? 'currentColor' : 'none'}>
    <path d="M6 3.5A1.5 1.5 0 0 1 7.5 2h9A1.5 1.5 0 0 1 18 3.5V21l-6-3.5L6 21V3.5Z" />
  </Base>
)
export const ThumbUp = ({ filled, ...p }: IconProps & { filled?: boolean }) => (
  <Base {...p} fill={filled ? 'currentColor' : 'none'}>
    <path d="M7 10v10M7 10l3.6-6.3a1.5 1.5 0 0 1 2.8.6V9h4.6a2 2 0 0 1 1.98 2.3l-1.3 8a2 2 0 0 1-1.98 1.7H7M7 10H4.5A1.5 1.5 0 0 0 3 11.5v7A1.5 1.5 0 0 0 4.5 20H7" />
  </Base>
)
export const ThumbDown = ({ filled, ...p }: IconProps & { filled?: boolean }) => (
  <Base {...p} fill={filled ? 'currentColor' : 'none'}>
    <path d="M17 14V4M17 14l-3.6 6.3a1.5 1.5 0 0 1-2.8-.6V15H6a2 2 0 0 1-1.98-2.3l1.3-8A2 2 0 0 1 7.3 3H17M17 14h2.5A1.5 1.5 0 0 0 21 12.5v-7A1.5 1.5 0 0 0 19.5 4H17" />
  </Base>
)
export const Play = (p: IconProps) => (
  <Base {...p} fill="currentColor" stroke="none">
    <path d="M8 5.14v13.72a1 1 0 0 0 1.52.85l11.2-6.86a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14Z" />
  </Base>
)
export const Stop = (p: IconProps) => (
  <Base {...p} fill="currentColor" stroke="none">
    <rect x="6" y="6" width="12" height="12" rx="2" />
  </Base>
)
export const Mail = (p: IconProps) => (
  <Base {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </Base>
)
export const Layers = (p: IconProps) => (
  <Base {...p}>
    <path d="m12 3 9 5-9 5-9-5 9-5Z" />
    <path d="m3 13 9 5 9-5" />
  </Base>
)
export const Grid = (p: IconProps) => (
  <Base {...p}>
    <rect x="4" y="4" width="6" height="6" rx="1" />
    <rect x="14" y="4" width="6" height="6" rx="1" />
    <rect x="4" y="14" width="6" height="6" rx="1" />
    <rect x="14" y="14" width="6" height="6" rx="1" />
  </Base>
)
export const Menu = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 8h16M4 16h16" />
  </Base>
)

// ── Navigation ─────────────────────────────────────────────────────────────
export const PanelLeft = (p: IconProps) => (
  <Base {...p}>
    <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
    <path d="M9 4.5v15" />
  </Base>
)
export const Inbox = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 13.5 6.2 6.3A2 2 0 0 1 8.1 5h7.8a2 2 0 0 1 1.9 1.3L20 13.5V18a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18v-4.5Z" />
    <path d="M4 13.5h4.5l1 2h5l1-2H20" />
  </Base>
)
export const BarChart = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 19.5V11M12 19.5V5M19 19.5v-6" />
  </Base>
)
export const Sliders = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 7h9M17 7h3M4 17h3M11 17h9M4 12h5M13 12h7" />
    <circle cx="15" cy="7" r="2" />
    <circle cx="9" cy="17" r="2" />
    <circle cx="11" cy="12" r="2" />
  </Base>
)
export const Heart = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 19.5s-7.5-4.4-7.5-9.6A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.5 2.5c0 5.2-7.5 9.6-7.5 9.6Z" />
  </Base>
)
export const Compass = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
  </Base>
)
export const ChevronsUpDown = (p: IconProps) => (
  <Base {...p}>
    <path d="m8 9.5 4-4 4 4M8 14.5l4 4 4-4" />
  </Base>
)
export const LogOut = (p: IconProps) => (
  <Base {...p}>
    <path d="M14 4.5H6.5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2H14M10 12h10M16.5 8.5 20 12l-3.5 3.5" />
  </Base>
)
