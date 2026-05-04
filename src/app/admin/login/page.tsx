import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/auth'
import { adminLogin } from '@/lib/actions'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface AdminLoginPageProps {
  searchParams: Promise<{ error?: string }>
}

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const authed = await isAdminAuthenticated()
  if (authed) redirect('/admin/posts')
  const { error } = await searchParams

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F7F7F5] px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-2 mb-10">
          <svg width="44" height="44" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="13" stroke="black" strokeWidth="1.5" />
            <circle cx="14" cy="14" r="9" stroke="black" strokeWidth="1.5" />
            <circle cx="14" cy="14" r="5" stroke="black" strokeWidth="1.5" />
            <circle cx="14" cy="14" r="2" fill="black" />
            <path d="M14 1 C 14 1, 27 14, 14 27" stroke="black" strokeWidth="1.2" fill="none" />
          </svg>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Scooply CMS</h1>
          <p className="text-sm text-zinc-500">Admin access only</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-900 mb-6">Sign in</h2>
          {error === 'invalid' && (
            <p className="text-sm text-red-500 mb-4 bg-red-50 px-3 py-2 rounded-lg">Incorrect password. Try again.</p>
          )}
          <form action={adminLogin} className="flex flex-col gap-4">
            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="Enter admin password"
              required
              autoFocus
            />
            <Button type="submit" size="lg" className="w-full mt-2">
              Sign in
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-zinc-400 mt-6">
          <a href="/login" className="text-zinc-600 underline underline-offset-2">
            Back to user login
          </a>
        </p>
      </div>
    </main>
  )
}
