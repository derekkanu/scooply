import Link from 'next/link'
import ScooplyLogo from '../ScooplyLogo'
import { SIGNUP_STEPS, type SignupStepIndex } from '@/lib/signup'

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
    <main className="min-h-screen flex flex-col bg-[#D9D9D9] px-4">
      <div className="absolute top-6 left-6">
        <Link
          href={backHref ?? '/login'}
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
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

          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              {SIGNUP_STEPS.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-zinc-900' : 'bg-zinc-200'}`}
                />
              ))}
            </div>

            <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-zinc-400">{eyebrow}</p>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight mt-2">{title}</h1>
            <p className="text-sm text-zinc-500 mt-1.5">{subtitle}</p>

            <div className="mt-7">{children}</div>
          </div>
        </div>
      </div>
    </main>
  )
}
