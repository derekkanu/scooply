import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getUserSession } from '@/lib/auth'
import { getPosts } from '@/lib/data'
import { userLogout } from '@/lib/actions'
import CategorySidebar from '@/components/CategorySidebar'
import DashboardSocialCard from '@/components/dashboard/DashboardSocialCard'

function MobileTopBar() {
  return (
    <div className="lg:hidden sticky top-0 z-40 bg-[#D9D9D9]/90 backdrop-blur border-b border-zinc-300/70 px-6 h-14 flex items-center justify-between">
      <span className="font-semibold text-zinc-900">Saved</span>
      <form action={userLogout}>
        <button type="submit" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
          Sign out
        </button>
      </form>
    </div>
  )
}

export default async function SavedScoopsPage() {
  const user = await getUserSession()
  if (!user) redirect('/login')

  const allPosts = await getPosts()
  const savedIds = new Set(user.savedPostIds ?? [])
  const savedPosts = allPosts.filter((p) => savedIds.has(p.id))

  return (
    <div className="min-h-screen bg-[#D9D9D9] flex">
      <CategorySidebar activeKey="saved" userName={user.name} />

      <div className="flex-1 min-w-0 flex flex-col">
        <MobileTopBar />

        <main className="flex-1 px-6 lg:px-12 xl:px-16 py-10 lg:py-14">
          <div className="max-w-3xl mx-auto">
            <header className="mb-8">
              <h1 className="text-[44px] leading-[1.05] font-bold text-zinc-900 tracking-tight">
                Saved scoops
              </h1>
              <p className="text-zinc-500 mt-3 text-[15px] leading-relaxed max-w-2xl">
                {savedPosts.length === 0
                  ? "Nothing saved yet — tap the bookmark on any scoop to keep it for later."
                  : `${savedPosts.length} ${savedPosts.length === 1 ? 'scoop' : 'scoops'} saved.`}
              </p>
            </header>

            {savedPosts.length === 0 ? (
              <div className="rounded-3xl border border-zinc-400/40 bg-white/15 backdrop-blur-[2px] flex flex-col items-center justify-center py-20 text-center">
                <span
                  aria-hidden
                  className="w-12 h-12 rounded-full bg-zinc-400/30 inline-flex items-center justify-center text-zinc-500 mb-4"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 3.5A1.5 1.5 0 0 1 7.5 2h9A1.5 1.5 0 0 1 18 3.5V21l-6-3.5L6 21V3.5Z" />
                  </svg>
                </span>
                <p className="text-base font-medium text-zinc-700">No saved scoops</p>
                <p className="text-sm mt-1 text-zinc-500 max-w-xs">
                  Saved scoops will show up here so you can come back to them anytime.
                </p>
                <Link
                  href="/dashboard"
                  className="mt-5 inline-flex items-center px-4 py-2 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-black transition-colors"
                >
                  Browse scoops
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {savedPosts.map((post) => (
                  <DashboardSocialCard key={post.id} post={post} saved />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
