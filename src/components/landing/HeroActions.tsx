import Link from 'next/link'
import { exploreAsGuest } from '@/lib/actions'
import { ArrowUpRight } from '@/components/ui/icons'

const LINK = 'group inline-flex items-center gap-1 text-[13px] font-medium text-ink underline-offset-4 hover:underline'
const ARROW = 'transition-transform duration-200 ease-soft group-hover:-translate-y-0.5 group-hover:translate-x-0.5'

/** Two quiet text actions under the hero's supporting line. Explore drops visitors straight into the feed. */
export default function HeroActions() {
  return (
    <div className="flex items-center gap-8">
      <Link href="/waitlist" className={LINK}>
        Join the waitlist
        <ArrowUpRight size={14} className={ARROW} />
      </Link>
      <form action={exploreAsGuest}>
        <button type="submit" className={LINK}>
          Explore
          <ArrowUpRight size={14} className={ARROW} />
        </button>
      </form>
    </div>
  )
}
