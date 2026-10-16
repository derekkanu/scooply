import Link from 'next/link'
import ScooplyLogo from '../ScooplyLogo'
import { SIGNUP_STEPS, type SignupStepIndex } from '@/lib/signup'
import Eyebrow from '../ui/Eyebrow'
import Reveal from '../ui/Reveal'
import { ArrowLeft } from '../ui/icons'
import Illustration from '../illustrations/Illustration'

// One reading tool per step: sign up, pick a level, choose interests, choose sources.
const STEP_ILLUSTRATION = ['paper', 'book', 'magnifier', 'binoculars'] as const

interface StepFrameProps {
  step: SignupStepIndex
  eyebrow: string
  title: string
  subtitle: string
  backHref?: string
  children: React.ReactNode
}

export default function StepFrame({ step, eyebrow, title, subtitle, backHref, children }: StepFrameProps) {
  return (
    <main className="relative min-h-screen flex flex-col sc-field px-4">
      <div className="absolute top-6 left-6">
        <Link
          href={backHref ?? '/login'}
          className="inline-flex items-center gap-1.5 text-small text-ink-3 hover:text-ink transition-colors"
        >
          <ArrowLeft size={16} />
          {backHref ? 'Back' : 'Back to login'}
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center py-16">
        <div className="w-full max-w-xl">
          <div className="flex flex-col items-center gap-3 mb-8">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <ScooplyLogo size={40} showWordmark={false} />
            </Link>
          </div>

          <Reveal className="sc-card rounded-[28px] p-8 sm:p-10">
            <div className="flex items-center gap-2 mb-6">
              {SIGNUP_STEPS.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors duration-500 ease-soft ${i < step ? 'bg-gold' : i === step ? 'bg-accent' : 'bg-gold-soft'}`}
                />
              ))}
            </div>

            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <Eyebrow framed>{eyebrow}</Eyebrow>
                <h1 className="font-display text-[32px] text-ink mt-4">{title}</h1>
                <p className="text-sm text-ink-3 mt-1.5">{subtitle}</p>
              </div>
              <Illustration name={STEP_ILLUSTRATION[step]} size={112} className="-mt-4 -mr-2 hidden sm:block" />
            </div>

            <div className="mt-7">{children}</div>
          </Reveal>
        </div>
      </div>
    </main>
  )
}
