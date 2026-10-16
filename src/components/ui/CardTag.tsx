/** Outlined label with a small square marker: "■ MOVE FAST". Takes the color of its card. */
export default function CardTag({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex h-7 items-center gap-2 rounded-[3px] border border-current/35 px-2.5 text-[13px] font-medium ${className}`}
    >
      <span aria-hidden className="h-[7px] w-[7px] rounded-[1px] bg-current" />
      {children}
    </span>
  )
}
