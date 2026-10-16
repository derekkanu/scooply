import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getUserSession } from '@/lib/auth'
import { ALL_PLATFORM_IDS } from '@/lib/signup'
import ScooplyLogo from '@/components/ScooplyLogo'
import PlatformIcon from '@/components/PlatformIcon'
import Illustration from '@/components/illustrations/Illustration'
import HeroActions from '@/components/landing/HeroActions'
import NarrativeHeadline from '@/components/landing/NarrativeHeadline'
import HeroStrip from '@/components/landing/HeroStrip'
import ProcessSteps from '@/components/landing/ProcessSteps'
import LandingHeader, { type NavItem } from '@/components/landing/LandingHeader'
import TwoWays from '@/components/landing/TwoWays'
import InAction from '@/components/landing/InAction'
import LevelCards from '@/components/landing/LevelCards'
import TopicGrid from '@/components/landing/TopicGrid'
import Faq from '@/components/landing/Faq'
import CtaBand from '@/components/landing/CtaBand'
import SplashOverlay from '@/components/landing/SplashOverlay'
import LandingReveal from '@/components/landing/LandingReveal'
import { buttonClasses } from '@/components/ui/Button'

const NAV: NavItem[] = [
  { href: '#product', label: 'Product' },
  { href: '#how', label: 'How it works' },
  { href: '#in-action', label: 'In action' },
  { href: '#levels', label: 'Levels' },
  { href: '#faq', label: 'FAQ' },
]

const H2 = 'sc-scroll mx-auto max-w-[22ch] text-balance text-center font-display text-[2rem] leading-[1.18] text-ink sm:text-[2.5rem] sm:leading-[1.12]'
const SECTION = 'scroll-mt-16 px-5 py-24 sm:px-10 lg:px-16 lg:py-32'

export default async function LandingPage() {
  const user = await getUserSession()
  if (user?.name) redirect('/dashboard')

  return (
    <div className="relative min-h-screen bg-parchment">
      <SplashOverlay />
      <LandingHeader items={NAV} />

      <main>
        {/* Hero — a split headline, then a strip of scoops drifting over a starburst */}
        <section id="top" className="pt-12 sm:pt-16 lg:pt-20">
          <div className="mx-auto grid max-w-[1160px] grid-cols-1 items-end gap-8 px-5 sm:px-10 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
            <LandingReveal delay={150}>
              <NarrativeHeadline className="sc-drift" />
            </LandingReveal>
            <LandingReveal delay={400} className="lg:pb-3">
              <p className="sc-drift max-w-[36ch] text-[18px] leading-snug text-ink [--sc-drift:40px] sm:text-[20px]">
                Scooply reads every platform, every day, and keeps only the AI stories that fit your level and your interests.
              </p>
              <div className="mt-7">
                <HeroActions />
              </div>
            </LandingReveal>
          </div>
          <LandingReveal delay={650} className="mt-4 lg:mt-6">
            <HeroStrip />
          </LandingReveal>
        </section>

        {/* Trust bar */}
        <section aria-label="Sources" className="border-y border-line px-5 py-6 sm:px-10">
          <div className="sc-scroll mx-auto flex max-w-[1000px] flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <p className="text-[15px] text-ink-2">Scooply reads six platforms every day, so you don’t have to.</p>
            <div className="flex gap-2">
              {ALL_PLATFORM_IDS.map((s) => (
                <PlatformIcon key={s} source={s} size="sm" tone="mono" />
              ))}
            </div>
          </div>
        </section>

        {/* 1 · Two ways to use Scooply */}
        <section id="product" className={SECTION}>
          <div className="mx-auto max-w-[1000px]">
            <h2 className={H2}>
              Two ways people use <em>Scooply</em>
            </h2>
            <div className="mt-12">
              <TwoWays />
            </div>
          </div>
        </section>

        {/* 2 · How it works */}
        <section id="how" className={`${SECTION} bg-parchment-deep`}>
          <div className="mx-auto max-w-[1160px]">
            <h2 className={H2}>
              Four steps to a feed <em>that knows you</em>
            </h2>
            <div className="mt-16 lg:mt-20">
              <ProcessSteps />
            </div>
          </div>
        </section>

        {/* 3 · In action */}
        <section id="in-action" className={SECTION}>
          <div className="mx-auto max-w-[1000px]">
            <h2 className={H2}>
              Scooply <em>in action</em>
            </h2>
            <p className="sc-scroll mx-auto mt-4 max-w-[44ch] text-center text-[15px] text-ink-3">
              Real scoops from the feed. Reading for something else? Tell us and we’ll build it in.
            </p>
            <div className="mt-16 lg:mt-20">
              <InAction />
            </div>
          </div>
        </section>

        <CtaBand />

        {/* 3 · Every level */}
        <section id="levels" className={SECTION}>
          <div className="mx-auto max-w-[1000px]">
            <h2 className={H2}>
              Read by people at <em>every level</em>
            </h2>
            <div className="mt-14">
              <LevelCards />
            </div>
            <div className="sc-scroll mt-16 grid grid-cols-1 gap-8 border-t border-line-strong pt-10 md:grid-cols-[1fr_1.4fr] md:gap-16">
              <h3 className="font-display text-[2rem] leading-[1.1] text-ink sm:text-[2.6rem]">
                Scooply grows <em>with you.</em>
              </h3>
              <div className="flex flex-col items-start gap-4 text-[15px] leading-relaxed text-ink-3">
                <p>Start with the fundamentals and the big-picture stories. As the words start to make sense, move up a level and the feed follows.</p>
                <p>When you’re deep in the weeds, Scooply brings the research, the benchmarks and the expert takes, without the explainer you no longer need.</p>
                <Link href="/waitlist" className={buttonClasses({ className: 'mt-2' })}>
                  Get started
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 4 · Topics (logo wall) */}
        <section id="topics" className={`${SECTION} bg-parchment-deep`}>
          <div className="mx-auto max-w-[1000px]">
            <h2 className={H2}>
              Every corner of AI <em>you care about</em>
            </h2>
            <div className="mt-14">
              <TopicGrid />
            </div>
          </div>
        </section>

        {/* 5 · FAQ */}
        <section id="faq" className={SECTION}>
          <div className="mx-auto grid max-w-[1000px] grid-cols-1 gap-10 md:grid-cols-[1fr_1.6fr] md:gap-16">
            <div>
              <h2 className="sc-scroll max-w-[14ch] font-display text-[2.2rem] leading-[1.1] text-ink sm:text-[3rem]">
                Everything you <em>need to know</em>
              </h2>
            </div>
            <Faq />
          </div>
        </section>

        {/* Closing call to action */}
        <section id="join" className="scroll-mt-16 px-5 pb-24 sm:px-10 lg:px-16 lg:pb-32">
          <div
            className="sc-scroll mx-auto flex max-w-[1000px] flex-col items-center rounded-[24px] px-6 py-16 text-center sm:py-20"
            style={{ background: 'var(--sc-ink)', color: 'var(--sc-parchment)' }}
          >
            <Illustration name="sphere" size={150} tint="var(--sc-parchment)" />
            <h2 className="mt-6 max-w-[18ch] font-display text-[2.2rem] leading-[1.1] sm:text-[3rem]">
              AI news that <em>meets you</em> where you are.
            </h2>
            <p className="mt-3 text-[15px] opacity-80">Scooply is free while we’re in early access.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/waitlist" className={buttonClasses({ variant: 'secondary', size: 'lg', className: 'border-transparent' })}>
                Join the waiting list
              </Link>
              <Link href="/login" className={buttonClasses({ variant: 'ghost', size: 'lg', className: 'text-[var(--sc-parchment)]! hover:bg-white/10' })}>
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line px-5 py-10 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[1000px] flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-3">
            <ScooplyLogo size={22} />
            <p className="text-[13px] text-ink-4">AI news, curated by who you are.</p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-[14px] text-ink-3">
            <a href="#faq" className="hover:text-ink">FAQ</a>
            <Link href="/waitlist" className="hover:text-ink">Waiting list</Link>
            <Link href="/login" className="hover:text-ink">Sign in</Link>
            <Link href="/design-system" className="hover:text-ink">Design system</Link>
          </nav>
        </div>
        <p className="mx-auto mt-8 max-w-[1000px] text-[13px] text-ink-4">© {new Date().getFullYear()} Scooply. All rights reserved.</p>
      </footer>
    </div>
  )
}
