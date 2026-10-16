import Link from 'next/link'
import { buttonClasses } from '@/components/ui/Button'
import { ArrowRight } from '@/components/ui/icons'

/** A thin repeating call to action between sections: one line, one button. */
export default function CtaBand() {
  return (
    <div className="border-y border-line px-5 sm:px-10">
      <div className="sc-scroll sc-ripple mx-auto flex max-w-[1000px] flex-col items-start justify-between gap-4 py-6 sm:flex-row sm:items-center">
        <p className="font-display text-[24px] leading-tight text-ink sm:text-[28px]">
          All of AI, <em>one calm feed.</em>
        </p>
        <Link href="/waitlist" className={buttonClasses({ className: 'group' })}>
          Get started
          <ArrowRight size={15} className="transition-transform duration-200 ease-soft group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  )
}
