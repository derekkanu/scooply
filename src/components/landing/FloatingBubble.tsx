import type { ReactNode } from 'react'

export type BubbleColor = 'green' | 'orange' | 'purple' | 'blue'
export type DotPosition = 'bottom-left' | 'bottom-right'

interface FloatingBubbleProps {
  color: BubbleColor
  text: string
  avatar: ReactNode
  dotPosition?: DotPosition
  className?: string
}

const colorMap: Record<BubbleColor, { bg: string; border: string; dot: string }> = {
  green: { bg: 'bg-emerald-50/70', border: 'border-emerald-200', dot: 'bg-emerald-400' },
  orange: { bg: 'bg-orange-50/70', border: 'border-orange-200', dot: 'bg-orange-400' },
  purple: { bg: 'bg-violet-50/70', border: 'border-violet-200', dot: 'bg-violet-400' },
  blue: { bg: 'bg-cyan-50/70', border: 'border-cyan-200', dot: 'bg-cyan-400' },
}

// 3 corners pill-rounded; the 4th is sharp (the anchor corner where the dot sits).
const cornerMap: Record<DotPosition, string> = {
  'bottom-right': 'rounded-tl-full rounded-tr-full rounded-bl-full',
  'bottom-left': 'rounded-tl-full rounded-tr-full rounded-br-full',
}

// Center the dot exactly on the sharp corner.
const dotPlacementMap: Record<DotPosition, string> = {
  'bottom-right': 'right-0 bottom-0 translate-x-1/2 translate-y-1/2',
  'bottom-left': 'left-0 bottom-0 -translate-x-1/2 translate-y-1/2',
}

export default function FloatingBubble({
  color,
  text,
  avatar,
  dotPosition = 'bottom-right',
  className = '',
}: FloatingBubbleProps) {
  const c = colorMap[color]
  return (
    <div className={`relative ${className}`}>
      <div
        className={`flex items-center gap-2 px-3 py-2 ${c.bg} border ${c.border} max-w-[210px] ${cornerMap[dotPosition]}`}
      >
        <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-white">
          {avatar}
        </div>
        <p className="text-[10px] leading-snug text-zinc-500">{text}</p>
      </div>
      <span className={`absolute ${dotPlacementMap[dotPosition]} w-1.5 h-1.5 rounded-full ${c.dot}`} />
    </div>
  )
}
