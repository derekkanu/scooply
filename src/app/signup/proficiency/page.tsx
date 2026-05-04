import { redirect } from 'next/navigation'
import { getUserSession } from '@/lib/auth'
import { saveSignupProficiency } from '@/lib/signupActions'
import StepFrame from '@/components/signup/StepFrame'
import ProficiencyChooser from '@/components/signup/ProficiencyChooser'

interface ProficiencyPageProps {
  searchParams: Promise<{ error?: string }>
}

export default async function ProficiencyPage({ searchParams }: ProficiencyPageProps) {
  const user = await getUserSession()
  if (user?.name) redirect('/dashboard')
  if (!user?.email) redirect('/signup')
  const { error } = await searchParams

  return (
    <StepFrame
      step={1}
      eyebrow="Step 2 of 4"
      title="What's your AI level?"
      subtitle="We'll tune your feed to stories you can actually use."
      backHref="/signup"
    >
      {error === 'required' && (
        <p className="text-sm text-red-500 mb-4 bg-red-50 px-3 py-2 rounded-lg">Pick one to continue.</p>
      )}
      <ProficiencyChooser initialValue={user.proficiency} action={saveSignupProficiency} />
    </StepFrame>
  )
}
