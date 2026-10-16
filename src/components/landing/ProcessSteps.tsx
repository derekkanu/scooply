import Illustration from '@/components/illustrations/Illustration'
import type { SpriteId } from '@/components/illustrations/sprites'

const STEPS: { art: SpriteId; title: string; body: string }[] = [
  { art: 'book', title: 'Tell us your level', body: 'Beginner, intermediate or advanced. Every story is matched to the depth you want.' },
  { art: 'magnifier', title: 'Pick your topics', body: 'Design, dev, research, music. Your interests decide what reaches the front page.' },
  { art: 'binoculars', title: 'We watch every source', body: 'X, LinkedIn, YouTube, TikTok, Instagram and the blogs, read for you in one place.' },
  { art: 'mug', title: 'Read your scoop', body: 'A short preview first, then straight to the original post when you want more.' },
]

/** Four process columns: an engraving, an title, a short line of body copy. */
export default function ProcessSteps() {
  return (
    <ol className="sc-scroll-group grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
      {STEPS.map((s) => (
        <li key={s.title} className="flex flex-col">
          <Illustration name={s.art} size={128} className="-ml-3" />
          <h3 className="mt-6 text-[19px] leading-tight tracking-[-0.005em] text-ink">{s.title}</h3>
          <p className="mt-3 max-w-[32ch] text-[15px] leading-relaxed text-ink-3">{s.body}</p>
        </li>
      ))}
    </ol>
  )
}
