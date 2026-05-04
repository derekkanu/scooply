import { redirect } from 'next/navigation'
import { getUserSession } from '@/lib/auth'
import { saveSignupAccount } from '@/lib/signupActions'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import StepFrame from '@/components/signup/StepFrame'

interface SignupPageProps {
  searchParams: Promise<{ error?: string }>
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const user = await getUserSession()
  if (user?.name) redirect('/dashboard')
  const { error } = await searchParams

  return (
    <StepFrame
      step={0}
      eyebrow="Step 1 of 4"
      title="Create your account"
      subtitle="Use your email and a password — we'll personalize the rest in a minute."
    >
      {error === 'email' && (
        <p className="text-sm text-red-500 mb-4 bg-red-50 px-3 py-2 rounded-lg">Enter a valid email address.</p>
      )}
      {error === 'password' && (
        <p className="text-sm text-red-500 mb-4 bg-red-50 px-3 py-2 rounded-lg">
          Password must be at least 6 characters.
        </p>
      )}

      <form action={saveSignupAccount} className="flex flex-col gap-4">
        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="you@domain.com"
          defaultValue={user?.email ?? ''}
          required
          autoFocus
        />
        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="At least 6 characters"
          minLength={6}
          required
        />
        <Button type="submit" size="lg" className="w-full mt-2">
          Continue
        </Button>
      </form>
    </StepFrame>
  )
}
