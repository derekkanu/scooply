import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getUserSession, type Proficiency } from '@/lib/auth'
import { getPosts } from '@/lib/data'
import { categories } from '@/lib/categories'
import { userLogout } from '@/lib/actions'
import { PROFICIENCY_OPTIONS } from '@/lib/signup'
import CategorySidebar from '@/components/CategorySidebar'

interface PageProps {
  searchParams: Promise<{ survey?: string }>
}

const PROFICIENCY_LABEL: Record<Proficiency, string> = Object.fromEntries(
  PROFICIENCY_OPTIONS.map((o) => [o.id, o.title]),
) as Record<Proficiency, string>

const PROFICIENCY_PCT: Record<Proficiency, number> = {
  beginner: 33,
  intermediate: 66,
  advanced: 100,
}

function MobileTopBar() {
  return (
    <div className="lg:hidden sticky top-0 z-40 bg-[#F7F7F5]/90 backdrop-blur border-b border-zinc-100 px-6 h-14 flex items-center justify-between">
      <span className="font-bold text-zinc-900">Progress</span>
      <form action={userLogout}>
        <button type="submit" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
          Sign out
        </button>
      </form>
    </div>
  )
}

function CategoryProgressCard({
  name,
  description,
  color,
  total,
  viewed,
  proficiency,
  surveyed,
}: {
  name: string
  description: string
  color: string
  total: number
  viewed: number
  proficiency: Proficiency | undefined
  surveyed: boolean
}) {
  const interactionPct = total > 0 ? Math.round((viewed / total) * 100) : 0
  const levelPct = proficiency ? PROFICIENCY_PCT[proficiency] : 0

  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p
            className="text-[11px] font-bold tracking-[0.14em] uppercase"
            style={{ color }}
          >
            {name}
          </p>
          <p className="text-xs text-zinc-500 leading-relaxed mt-1.5 line-clamp-2">{description}</p>
        </div>
        <span
          className="text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
          style={{ backgroundColor: `${color}18`, color }}
        >
          {viewed}/{total}
        </span>
      </div>

      <div className="flex items-baseline justify-between mt-4">
        <p className="text-sm text-zinc-500">Engagement</p>
        <p className="text-sm font-semibold text-zinc-900 tabular-nums">{interactionPct}%</p>
      </div>
      <div className="relative h-2 rounded-full bg-zinc-100 overflow-hidden mt-2">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
          style={{ width: `${interactionPct}%`, backgroundColor: color }}
        />
      </div>

      <div className="flex items-baseline justify-between mt-4">
        <p className="text-sm text-zinc-500">Your level</p>
        <p className="text-sm font-semibold text-zinc-900">
          {surveyed && proficiency ? PROFICIENCY_LABEL[proficiency] : 'Not assessed'}
        </p>
      </div>
      <div className="relative h-2 rounded-full bg-zinc-100 overflow-hidden mt-2">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
          style={{ width: `${surveyed ? levelPct : 0}%`, backgroundColor: color, opacity: 0.55 }}
        />
      </div>
    </div>
  )
}

export default async function ProgressPage({ searchParams }: PageProps) {
  const user = await getUserSession()
  if (!user) redirect('/login')

  const { survey } = await searchParams
  const allPosts = await getPosts()
  const profMap = user.categoryProficiency ?? {}
  const fallback = user.proficiency
  const surveyed = Object.keys(profMap).length > 0
  const viewedSet = new Set(user.viewedPostIds ?? [])

  const data = categories.map((cat) => {
    const catPosts = allPosts.filter((p) => p.categoryId === cat.id)
    const viewed = catPosts.filter((p) => viewedSet.has(p.id)).length
    return {
      ...cat,
      total: catPosts.length,
      viewed,
      proficiency: (profMap[cat.id] ?? fallback) as Proficiency | undefined,
      surveyed: cat.id in profMap,
    }
  })

  const totalAvailable = allPosts.length
  const totalViewed = allPosts.filter((p) => viewedSet.has(p.id)).length
  const cumulativePct = totalAvailable > 0 ? Math.round((totalViewed / totalAvailable) * 100) : 0
  const mostExplored = [...data].sort((a, b) => b.viewed - a.viewed)[0]
  const leastExplored = [...data]
    .filter((d) => d.total > 0)
    .sort((a, b) => a.viewed / a.total - b.viewed / b.total)[0]

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex">
      <CategorySidebar activeKey="progress" userName={user.name} />

      <div className="flex-1 min-w-0 flex flex-col">
        <MobileTopBar />

        <main className="flex-1 px-6 lg:px-10 xl:px-14 py-8 lg:py-12">
          <div className="max-w-4xl mx-auto space-y-6">
            <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-zinc-900">Your Progress</h1>
                <p className="text-zinc-500 mt-1.5 text-sm max-w-2xl">
                  How you&apos;ve interacted with stories — per category and cumulatively. Take the proficiency survey
                  any time to recalibrate your levels.
                </p>
              </div>
              <Link
                href="/progress/survey"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-black text-white text-sm font-semibold hover:bg-zinc-800 transition-colors whitespace-nowrap"
              >
                {surveyed ? 'Retake survey' : 'Take proficiency survey'}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </header>

            {survey === 'done' && (
              <p className="text-sm text-emerald-700 bg-emerald-50 px-4 py-2.5 rounded-xl">
                Survey saved. Your category levels are now reflected below.
              </p>
            )}

            <section className="bg-white rounded-3xl shadow-sm p-6 sm:p-8">
              <div className="flex items-baseline justify-between mb-1">
                <h2 className="text-sm font-semibold text-zinc-900">Cumulative engagement</h2>
                <span className="text-xs text-zinc-400">across all categories</span>
              </div>
              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-5xl font-bold text-zinc-900 tabular-nums">{totalViewed}</span>
                <span className="text-sm text-zinc-500">
                  of {totalAvailable} {totalAvailable === 1 ? 'story' : 'stories'} explored
                </span>
              </div>
              <div className="relative h-2.5 rounded-full bg-zinc-100 overflow-hidden mt-4">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-zinc-900 transition-all duration-500"
                  style={{ width: `${cumulativePct}%` }}
                />
              </div>
              <p className="text-xs text-zinc-400 mt-2 tabular-nums">{cumulativePct}% of catalog</p>

              {totalViewed > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                  {mostExplored && mostExplored.viewed > 0 && (
                    <div className="rounded-2xl bg-zinc-50 px-4 py-3">
                      <p className="text-[11px] uppercase tracking-wider text-zinc-400">Most explored</p>
                      <p className="text-sm font-semibold text-zinc-900 mt-1">{mostExplored.name}</p>
                      <p className="text-xs text-zinc-500">
                        {mostExplored.viewed}/{mostExplored.total} stories
                      </p>
                    </div>
                  )}
                  {leastExplored && leastExplored.viewed < leastExplored.total && (
                    <div className="rounded-2xl bg-zinc-50 px-4 py-3">
                      <p className="text-[11px] uppercase tracking-wider text-zinc-400">Room to explore</p>
                      <p className="text-sm font-semibold text-zinc-900 mt-1">{leastExplored.name}</p>
                      <p className="text-xs text-zinc-500">
                        {leastExplored.viewed}/{leastExplored.total} stories
                      </p>
                    </div>
                  )}
                </div>
              )}

              {totalViewed === 0 && (
                <p className="text-sm text-zinc-500 mt-4">
                  You haven&apos;t opened any stories yet. Click into a post on the dashboard and it&apos;ll show up
                  here.
                </p>
              )}
            </section>

            <section>
              <h2 className="text-xl font-bold text-zinc-900 mb-3 px-1">By category</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.map((cat) => (
                  <CategoryProgressCard
                    key={cat.id}
                    name={cat.name}
                    description={cat.description}
                    color={cat.color}
                    total={cat.total}
                    viewed={cat.viewed}
                    proficiency={cat.proficiency}
                    surveyed={cat.surveyed}
                  />
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}
