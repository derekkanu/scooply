import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getUserSession } from '@/lib/auth'
import { userLogin } from '@/lib/actions'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import ScooplyLogo from '@/components/ScooplyLogo'

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getUserSession()
  if (user?.name) redirect('/dashboard')
  const { error } = await searchParams

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
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Scooply</h1>
            <p className="text-sm text-zinc-500 text-center">Your AI news feed, curated daily.</p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900 mb-1">Welcome back</h2>
            <p className="text-sm text-zinc-500 mb-6">Enter your name to get started.</p>

            {error === 'name' && (
              <p className="text-sm text-red-500 mb-4 bg-red-50 px-3 py-2 rounded-lg">Please enter your name.</p>
            )}
            <form action={userLogin} className="flex flex-col gap-4">
              <Input id="name" name="name" label="Your name" placeholder="e.g. Alex" required autoFocus />
              <Button type="submit" size="lg" className="w-full mt-2">
                Enter Scooply
              </Button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <span className="h-px flex-1 bg-zinc-100" />
              <span className="text-[11px] uppercase tracking-[0.14em] text-zinc-400">New here?</span>
              <span className="h-px flex-1 bg-zinc-100" />
            </div>

            <Link
              href="/signup"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-6 py-3 text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-50 active:bg-zinc-100"
            >
              Sign up for Scooply
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>

          <p className="text-center text-xs text-zinc-400 mt-6">
            Are you an admin?{' '}
            <Link href="/admin/login" className="text-zinc-600 underline underline-offset-2">
              Sign in to CMS
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
