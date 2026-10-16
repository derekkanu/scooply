import Illustration from '@/components/illustrations/Illustration'
import type { SpriteId } from '@/components/illustrations/sprites'

interface Feature {
  art: SpriteId
  title: string
  body: string
}

/** Three quiet columns split by hairlines: an illustration, a two-line serif title, a short paragraph. */
export default function FeatureRow({ items, className = '' }: { items: Feature[]; className?: string }) {
  return (
    <div className={`grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-0 ${className}`}>
      {items.map((f, i) => (
        <div key={f.title} className={`flex flex-col gap-4 sm:px-8 ${i === 0 ? 'sm:pl-0' : 'sm:border-l sm:border-line-strong'}`}>
          <Illustration name={f.art} size={120} />
          <h3 className="max-w-[16ch] font-display text-[24px] leading-[1.1] text-ink">{f.title}</h3>
          <p className="max-w-[36ch] text-[14px] leading-relaxed text-ink-3">{f.body}</p>
        </div>
      ))}
    </div>
  )
}
