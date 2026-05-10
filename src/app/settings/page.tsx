import { redirect } from 'next/navigation'
import { getUserSession } from '@/lib/auth'
import {
  saveSettingsProficiency,
  saveSettingsInterests,
  saveSettingsPlatforms,
  userLogout,
} from '@/lib/actions'
import CategorySidebar from '@/components/CategorySidebar'
import ProficiencyChooser from '@/components/signup/ProficiencyChooser'
import InterestsChooser from '@/components/signup/InterestsChooser'
import PlatformDeselect from '@/components/signup/PlatformDeselect'
import type { Source } from '@/lib/types'

interface PageProps {
  searchParams: Promise<{ saved?: string; error?: string }>
}

function MobileTopBar() {
  return (
    <div className="lg:hidden sticky top-0 z-40 bg-[#D9D9D9]/90 backdrop-blur border-b border-zinc-100 px-6 h-14 flex items-center justify-between">
      <span className="font-bold text-zinc-900">Settings</span>
      <form action={userLogout}>
        <button type="submit" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
          Sign out
        </button>
      </form>
    </div>
  )
}

function StatusBanner({ saved, error }: { saved?: string; error?: string }) {
  if (!saved && !error) return null
  if (error) {
    return (
      <p className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-xl">
        {error === 'proficiency' && 'Pick a proficiency level to save.'}
        {error === 'interests' && 'Pick at least one interest to save.'}
      </p>
    )
  }
  return (
    <p className="text-sm text-emerald-700 bg-emerald-50 px-4 py-2.5 rounded-xl">
      Saved your {saved}.
    </p>
  )
}

function SectionCard({
  id,
  title,
  description,
  children,
}: {
  id: string
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="bg-white rounded-3xl shadow-sm p-6 sm:p-8 scroll-mt-8">
      <h2 className="text-lg font-bold text-zinc-900">{title}</h2>
      <p className="text-sm text-zinc-500 mt-1">{description}</p>
      <div className="mt-5">{children}</div>
    </section>
  )
}

export default async function SettingsPage({ searchParams }: PageProps) {
  const user = await getUserSession()
  if (!user) redirect('/login')

  const { saved, error } = await searchParams

  return (
    <div className="min-h-screen bg-[#D9D9D9] flex">
      <CategorySidebar activeKey="settings" userName={user.name} />

      <div className="flex-1 min-w-0 flex flex-col">
        <MobileTopBar />

        <main className="flex-1 px-6 lg:px-10 xl:px-14 py-8 lg:py-12">
          <div className="max-w-2xl mx-auto space-y-6">
            <header>
              <h1 className="text-3xl font-bold text-zinc-900">Settings</h1>
              <p className="text-zinc-500 mt-1.5 text-sm">
                Update what we feed you. Changes save instantly.
              </p>
            </header>

            <StatusBanner saved={saved} error={error} />

            <SectionCard
              id="proficiency"
              title="Proficiency level"
              description="We tune story difficulty to match where you're at."
            >
              <ProficiencyChooser initialValue={user.proficiency} action={saveSettingsProficiency} />
            </SectionCard>

            <SectionCard
              id="interests"
              title="Interests"
              description="Topics you want to see more of."
            >
              <InterestsChooser initialSelected={user.interests} action={saveSettingsInterests} />
            </SectionCard>

            <SectionCard
              id="platforms"
              title="Social platforms"
              description="Sources you want in your feed. Tap to toggle off any you'd rather skip."
            >
              <PlatformDeselect
                initialSelected={user.platforms as Source[] | undefined}
                action={saveSettingsPlatforms}
                submitLabel="Save sources"
              />
            </SectionCard>
          </div>
        </main>
      </div>
    </div>
  )
}
