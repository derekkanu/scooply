import { redirect } from 'next/navigation'
import { getUserSession } from '@/lib/auth'
import { saveSignupInterests } from '@/lib/signupActions'
import StepFrame from '@/components/signup/StepFrame'
import InterestsChooser from '@/components/signup/InterestsChooser'

interface InterestsPageProps {
  searchParams: Promise<{ error?: string }>
}

export default async function InterestsPage({ searchParams }: InterestsPageProps) {
  const user = await getUserSession()
  if (user?.name) redirect('/dashboard')
  if (!user?.email) redirect('/signup')
  if (!user?.proficiency) redirect('/signup/proficiency')
  const { error } = await searchParams

  return (
    <StepFrame
      step={2}
      eyebrow="Step 3 of 4"
      title="What are you into?"
      subtitle="Pick the topics you actually want in your morning coffee."
      backHref="/signup/proficiency"
    >
      {error === 'required' && (
        <p className="text-sm text-red-500 mb-4 bg-red-50 px-3 py-2 rounded-lg">Pick at least one interest.</p>
      )}
      <InterestsChooser initialSelected={user.interests} action={saveSignupInterests} />
    </StepFrame>
  )
}
