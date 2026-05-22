import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getUserSession } from '@/lib/auth'
import CategorySidebar from '@/components/CategorySidebar'
import ScooplyLogo from '@/components/ScooplyLogo'
import MobileMenuDrawer from '@/components/dashboard/MobileMenuDrawer'
import ChatSurvey from '@/components/progress/ChatSurvey'

function MobileTopBar({ userName }: { userName?: string }) {
  return (
    <div className="lg:hidden sticky top-0 z-40 bg-[#D9D9D9]/90 backdrop-blur px-6 h-16 flex items-center justify-between">
      <Link href="/dashboard" className="inline-flex items-center" aria-label="Scooply home">
        <ScooplyLogo size={26} showWordmark={false} />
      </Link>
      <MobileMenuDrawer activeKey="progress" userName={userName} />
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
        <MobileTopBar userName={user.name} />

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
                Chat with Scout — Scooply&apos;s AI guide. A few questions and your level + interests are dialled in.
              </p>
            </header>

            <ChatSurvey />
          </div>
        </main>
      </div>
    </div>
  )
}
