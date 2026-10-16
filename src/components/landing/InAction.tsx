import Link from 'next/link'
import ScoopCard from '@/components/feed/ScoopCard'
import { ArrowRight } from '@/components/ui/icons'
import { buttonClasses } from '@/components/ui/Button'
import { SCOOPS } from './SocialCardRow'

const USES = [
  {
    id: 'keep-up',
    title: 'Keep up without the noise',
    sub: 'We skip the hot takes and engagement bait, and keep the stories that matter.',
    points: [
      'A short preview of every story before you click',
      'Duplicates merged, so you read each story once',
      'A fresh scoop ready with your morning coffee',
      'Save anything for later in one tap',
    ],
    scoop: SCOOPS[0],
  },
  {
    id: 'level-up',
    title: 'Learn at your own level',
    sub: 'A story reads differently for a beginner and an expert. We know which one you are.',
    points: [
      'Beginner, intermediate or advanced depth',
      'Plain-language context when you need it',
      'Research and benchmarks when you don’t',
      'Change your level any time as you grow',
    ],
    scoop: SCOOPS[1],
  },
  {
    id: 'every-platform',
    title: 'Follow every platform in one place',
    sub: 'X, LinkedIn, YouTube, TikTok, Instagram and the blogs, without six open tabs.',
    points: [
      'Posts, threads and videos side by side',
      'Turn any platform off in settings',
      'One tap through to the original post',
      'Topics you pick decide what reaches you',
    ],
    scoop: SCOOPS[5],
  },
]

/** Alternating blocks: a live example scoop on one side; heading, four points and a link on the other. */
export default function InAction() {
  return (
    <div className="flex flex-col gap-20 lg:gap-28">
      {USES.map((u, i) => (
        <article key={u.id} id={u.id} className="grid scroll-mt-24 grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
          <div className={`sc-parallax mx-auto h-[440px] w-full max-w-[360px] [--sc-depth:28px] ${i % 2 ? 'md:order-2' : ''}`}>
            <ScoopCard post={u.scoop} size="featured" interactive={false} />
          </div>
          <div className="sc-scroll flex flex-col items-start" data-dir={i % 2 ? 'left' : 'right'}>
            <h3 className="font-display text-[2rem] leading-[1.1] text-ink sm:text-[2.6rem]">{u.title}</h3>
            <p className="mt-3 max-w-[40ch] text-[16px] leading-relaxed text-ink-3">{u.sub}</p>
            <ul className="mt-6 flex w-full flex-col border-t border-line">
              {u.points.map((p) => (
                <li key={p} className="flex items-center gap-3 border-b border-line py-3 text-[15px] text-ink-2">
                  <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />
                  {p}
                </li>
              ))}
            </ul>
            <Link href="/waitlist" className={buttonClasses({ variant: 'outline', className: 'group mt-7' })}>
              Learn more
              <ArrowRight size={15} className="transition-transform duration-200 ease-soft group-hover:translate-x-0.5" />
            </Link>
          </div>
        </article>
      ))}
    </div>
  )
}
