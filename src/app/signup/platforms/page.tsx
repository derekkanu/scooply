import { redirect } from 'next/navigation'
import { getUserSession } from '@/lib/auth'
import { saveSignupPlatforms, skipSignupPlatforms } from '@/lib/signupActions'
import StepFrame from '@/components/signup/StepFrame'
import PlatformDeselect from '@/components/signup/PlatformDeselect'
import type { Source } from '@/lib/types'

export default async function PlatformsPage() {
  const user = await getUserSession()
  if (user?.name) redirect('/dashboard')
  if (!user?.email) redirect('/signup')
  if (!user?.proficiency) redirect('/signup/proficiency')
  if (!user?.interests || user.interests.length === 0) redirect('/signup/interests')

  return (
    <StepFrame
      step={3}
      eyebrow="Step 4 of 4"
      title="Pick your sources"
      subtitle="We pull from these platforms by default. Drop the ones you don't care about."
      backHref="/signup/interests"
    >
      <PlatformDeselect
        initialSelected={user.platforms as Source[] | undefined}
        action={saveSignupPlatforms}
        skipAction={skipSignupPlatforms}
      />
    </StepFrame>
  )
}
