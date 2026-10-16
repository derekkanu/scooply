import { ChevronRight } from './icons'

interface ListPanelItem {
  icon: React.ReactNode
  label: string
}

/** A small white "app" list that sits inside a card's inner panel: tinted icon tile, label, chevron. */
export default function ListPanel({ items, className = '' }: { items: ListPanelItem[]; className?: string }) {
  return (
    <div className={`w-full max-w-[320px] rounded-[10px] bg-surface p-2 text-ink shadow-float ${className}`}>
      <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
        {items.map((it) => (
          <li key={it.label} className="flex items-center gap-3 rounded-[6px] border border-line px-2 py-1.5">
            <span
              aria-hidden
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] [&_svg]:h-4 [&_svg]:w-4"
              style={{ background: 'color-mix(in srgb, var(--sc-card, var(--sc-lavender)) 70%, white)', color: 'var(--sc-card-ink, var(--sc-ink))' }}
            >
              {it.icon}
            </span>
            <span className="flex-1 truncate text-[14px]">{it.label}</span>
            <ChevronRight size={14} className="text-ink-3" />
          </li>
        ))}
      </ul>
    </div>
  )
}
