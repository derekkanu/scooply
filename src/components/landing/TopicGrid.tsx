import { INTEREST_OPTIONS } from '@/lib/signup'

/** Logo-wall layout for the interests a reader can follow: a hairline grid of quiet serif names. */
export default function TopicGrid() {
  return (
    <ul className="sc-scroll-group grid grid-cols-2 border-t border-l border-line-strong sm:grid-cols-3 lg:grid-cols-4">
      {INTEREST_OPTIONS.map((t) => (
        <li
          key={t.id}
          className="flex h-24 items-center justify-center border-r border-b border-line-strong font-display text-[24px] text-ink-2 sm:h-28 sm:text-[28px]"
        >
          {t.label}
        </li>
      ))}
    </ul>
  )
}
