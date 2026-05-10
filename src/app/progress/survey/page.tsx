import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getUserSession } from '@/lib/auth'
import { saveSurveyResults, userLogout } from '@/lib/actions'
import CategorySidebar from '@/components/CategorySidebar'
import SurveyForm from '@/components/progress/SurveyForm'

function MobileTopBar() {
  return (
    <div className="lg:hidden sticky top-0 z-40 bg-[#D9D9D9]/90 backdrop-blur border-b border-zinc-100 px-6 h-14 flex items-center justify-between">
      <span className="font-bold text-zinc-900">Survey</span>
      <form action={userLogout}>
        <button type="submit" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
          Sign out
        </button>
      </form>
    </div>
  )
}

export default async function SurveyPage() {
  const user = await getUserSession()
  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-[#D9D9D9] flex">
      <CategorySidebar activeKey="progress" userName={user.name} />

      <div className="flex-1 min-w-0 flex flex-col">
        <MobileTopBar />

        <main className="flex-1 px-6 lg:px-10 xl:px-14 py-8 lg:py-12">
          <div className="max-w-2xl mx-auto space-y-6">
            <header>
              <Link
                href="/progress"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors mb-4"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to progress
              </Link>
              <h1 className="text-3xl font-bold text-zinc-900">Proficiency survey</h1>
              <p className="text-zinc-500 mt-1.5 text-sm max-w-2xl">
                Quick self-rating per category. We&apos;ll use this to score where you are and surface stories that fit
                your level.
              </p>
            </header>

            <SurveyForm initial={user.categoryProficiency} action={saveSurveyResults} />
          </div>
        </main>
      </div>
    </div>
  )
}
