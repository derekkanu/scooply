/**
 * Outlined label with a small square marker ("■ Move fast"). Given a line icon instead, it
 * drops the outline and leads with the icon. Takes the color of its card.
 */
export default function CardTag({ children, icon, className = '' }: { children: React.ReactNode; icon?: React.ReactNode; className?: string }) {
  // with an icon: no outline, just a clear icon and its label
  if (icon) {
    return (
      <span className={`inline-flex items-center gap-2.5 text-[15px] font-medium ${className}`}>
        <span aria-hidden className="inline-flex [&_svg]:h-5 [&_svg]:w-5 [&_svg]:stroke-[1.9]">
          {icon}
        </span>
        {children}
      </span>
    )
  }
  return (
    <span
      className={`inline-flex h-7 items-center gap-2 rounded-[3px] border border-current/35 px-2.5 text-[13px] font-medium ${className}`}
    >
      <span aria-hidden className="h-[7px] w-[7px] rounded-[1px] bg-current" />
      {children}
    </span>
  )
}
