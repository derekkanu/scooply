import ScoopCard from '@/components/feed/ScoopCard'
import { SCOOPS } from './SocialCardRow'

const RAYS = 56

/**
 * The hero strip: scoop clippings drifting left to right over a faint engraved starburst,
 * fading out at both edges. Hovering pauses the drift; reduced motion stops it.
 */
export default function HeroStrip() {
  const row = (copy: boolean) => (
    <div className="flex shrink-0 gap-5 pr-5" aria-hidden={copy || undefined}>
      {SCOOPS.map((post, i) => (
        <div key={`${copy ? 'b' : 'a'}-${post.id}`} className="h-[400px] w-[290px] shrink-0 sm:w-[310px]">
          <ScoopCard post={post} size="featured" interactive={false} n={i + 1} scroll={false} />
        </div>
      ))}
    </div>
  )

  return (
    <div className="group relative overflow-hidden py-10 sm:py-14">
      <svg viewBox="-500 -500 1000 1000" preserveAspectRatio="xMidYMid slice" className="sc-turn absolute inset-0 h-full w-full text-ink/15" aria-hidden>
        {Array.from({ length: RAYS }, (_, i) => {
          const a = (i / RAYS) * Math.PI * 2
          return (
            <line
              key={i}
              x1={0}
              y1={0}
              x2={Math.round(Math.cos(a) * 720)}
              y2={Math.round(Math.sin(a) * 720)}
              stroke="currentColor"
              strokeWidth={0.8}
              vectorEffect="non-scaling-stroke"
            />
          )
        })}
      </svg>

      <div className="relative [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div className="marquee-track flex w-max [animation-direction:reverse] [animation-duration:70s] group-hover:[animation-play-state:paused]">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </div>
  )
}
