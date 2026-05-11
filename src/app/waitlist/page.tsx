import Link from 'next/link'
import { joinWaitlistAction } from '@/lib/actions'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import ScooplyLogo from '@/components/ScooplyLogo'

interface WaitlistPageProps {
  searchParams: Promise<{ status?: string; error?: string }>
}

export default async function WaitlistPage({ searchParams }: WaitlistPageProps) {
  const { status, error } = await searchParams
  const joined = status === 'joined' || status === 'already'

  return (
    <main className="min-h-screen flex flex-col bg-[#D9D9D9] px-4">
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to home
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center gap-3 mb-10">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <ScooplyLogo size={44} showWordmark={false} />
            </Link>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Join the waiting list</h1>
            <p className="text-sm text-zinc-500 text-center">
              We&apos;ll let you know the moment Scooply opens its doors.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm">
            {joined ? (
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-zinc-900">
                  {status === 'already' ? "You're already on the list" : "You're on the list"}
                </h2>
                <p className="text-sm text-zinc-500">
                  {status === 'already'
                    ? "Sit tight — we'll be in touch as soon as we have something to share."
                    : "Thanks for joining. We'll reach out the moment your spot is ready."}
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-zinc-900 hover:text-zinc-700 transition-colors"
                >
                  Back to home
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-zinc-900 mb-1">Save your spot</h2>
                <p className="text-sm text-zinc-500 mb-6">
                  Drop your email and we&apos;ll send you an invite when we&apos;re ready.
                </p>

                {error === 'email' && (
                  <p className="text-sm text-red-500 mb-4 bg-red-50 px-3 py-2 rounded-lg">
                    Please enter a valid email address.
                  </p>
                )}

                <form action={joinWaitlistAction} className="flex flex-col gap-4">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    label="Your email"
                    placeholder="you@example.com"
                    required
                    autoFocus
                  />
                  <Button type="submit" size="lg" className="w-full mt-2">
                    Join the waiting list
                  </Button>
                </form>

                <div className="flex items-center gap-3 my-6">
                  <span className="h-px flex-1 bg-zinc-100" />
                  <span className="text-[11px] uppercase tracking-[0.14em] text-zinc-400">Already in?</span>
                  <span className="h-px flex-1 bg-zinc-100" />
                </div>

                <Link
                  href="/login"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-6 py-3 text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-50 active:bg-zinc-100"
                >
                  Sign in to Scooply
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
