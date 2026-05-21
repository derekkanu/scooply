import { Suspense } from 'react'
import Link from 'next/link'
import { getUserSession } from '@/lib/auth'
import { filterPosts, getPosts } from '@/lib/data'
import { getCategoryById } from '@/lib/categories'
import CategorySidebar from '@/components/CategorySidebar'
import SearchBar from '@/components/SearchBar'
import ScooplyLogo from '@/components/ScooplyLogo'
import WelcomeName from '@/components/dashboard/WelcomeName'
import DashboardSocialCard from '@/components/dashboard/DashboardSocialCard'
import NewScoopCarousel from '@/components/dashboard/NewScoopCarousel'
import SavedSoopCard from '@/components/dashboard/SavedSoopCard'
import MobileMenuDrawer from '@/components/dashboard/MobileMenuDrawer'
import MobileCategoryPills from '@/components/dashboard/MobileCategoryPills'

interface PageProps {
  searchParams: Promise<{ category?: string; q?: string }>
}

function MobileTopBar({ activeKey, userName }: { activeKey: string; userName?: string }) {
  return (
    <div className="lg:hidden sticky top-0 z-40 bg-[#D9D9D9]/90 backdrop-blur px-6 h-16 flex items-center justify-between">
      <Link href="/dashboard" className="inline-flex items-center" aria-label="Scooply home">
        <ScooplyLogo size={26} showWordmark={false} />
      </Link>
      <MobileMenuDrawer activeKey={activeKey} userName={userName} />
    </div>
  )
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const { category, q } = await searchParams
  const user = await getUserSession()

  if (user && !user.name) {
    return <WelcomeName />
  }

  const [rawPosts, allPosts] = await Promise.all([filterPosts(category, q), getPosts()])

  const savedIds = new Set(user?.savedPostIds ?? [])
  const likedIds = new Set(user?.likedPostIds ?? [])
  const dislikedIds = new Set(user?.dislikedPostIds ?? [])
  const savedPosts = allPosts.filter((p) => savedIds.has(p.id))

  const posts = rawPosts.filter((p) => !dislikedIds.has(p.id))

  const firstName = user?.name?.split(' ')[0] ?? 'there'
  const isAllView = !category || category === 'all'
  const activeCategory = getCategoryById(category ?? '')

  const featuredPool = isAllView ? posts.slice(0, Math.min(posts.length, 8)) : []
  const featuredIds = new Set(featuredPool.map((p) => p.id))
  const wallPosts = posts.filter((p) => !featuredIds.has(p.id))

  return (
    <div className="min-h-screen bg-[#D9D9D9] flex">
      <CategorySidebar activeKey={category ?? 'all'} userName={user?.name} />

      <div className="flex-1 min-w-0 flex flex-col">
        <MobileTopBar activeKey={category ?? 'all'} userName={user?.name} />

        <main className="flex-1 px-6 lg:px-12 xl:px-16 pt-4 pb-10 lg:py-14">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-10 lg:gap-14">
            {/* Center column */}
            <div className="min-w-0 space-y-6 lg:space-y-8">
              <header>
                {isAllView ? (
                  <>
                    <h1 className="text-[32px] sm:text-[40px] lg:text-[44px] leading-[1.05] font-bold text-zinc-900 tracking-tight">
                      Hello {firstName}
                    </h1>
                    <p className="text-zinc-500 mt-3 text-[15px] leading-relaxed max-w-2xl">
                      You&apos;re building solid AI literacy habits. This week you explored{' '}
                      <span className="font-semibold text-red-500">{Math.min(posts.length, 12)}</span> stories out of the{' '}
                      <span className="font-semibold text-emerald-500">{allPosts.length}</span> we curated, focus more
                      on emerging tech to round out your knowledge.
                    </p>
                  </>
                ) : (
                  <>
                    <p
                      className="text-[11px] font-bold tracking-[0.14em] uppercase"
                      style={{ color: activeCategory?.color ?? '#3B82F6' }}
                    >
                      {activeCategory?.name ?? 'Filtered'}
                    </p>
                    <h1 className="text-[32px] sm:text-[40px] lg:text-[44px] leading-[1.05] font-bold text-zinc-900 tracking-tight mt-1">
                      {activeCategory?.name ?? 'Stories'}
                    </h1>
                    <p className="text-zinc-500 mt-3 text-[15px] leading-relaxed max-w-2xl">
                      {activeCategory?.description ?? 'Showing posts in this category.'}{' '}
                      <span className="text-zinc-400">
                        ({posts.length} {posts.length === 1 ? 'story' : 'stories'})
                      </span>
                    </p>
                  </>
                )}
              </header>

              {/* Mobile-only nav + search row */}
              <div className="lg:hidden space-y-4">
                <MobileCategoryPills active={category ?? 'all'} />
                <Suspense>
                  <SearchBar defaultValue={q} />
                </Suspense>
              </div>

              {posts.length === 0 ? (
                <div className="rounded-3xl border border-zinc-400/40 bg-white/15 backdrop-blur-[2px] flex flex-col items-center justify-center py-24 text-zinc-500">
                  <p className="text-base font-medium">No posts found</p>
                  <p className="text-sm mt-1 text-zinc-400">Try a different search or category.</p>
                </div>
              ) : (
                <>
                  {featuredPool.length > 0 && (
                    <section>
                      <h2 className="text-[14px] font-medium text-zinc-700 mb-3">New scoop</h2>
                      <NewScoopCarousel
                        posts={featuredPool}
                        reactions={Object.fromEntries([
                          ...Array.from(likedIds).map((id) => [id, 'like'] as const),
                          ...Array.from(dislikedIds).map((id) => [id, 'dislike'] as const),
                        ])}
                      />
                    </section>
                  )}

                  {wallPosts.length > 0 && (
                    <section>
                      <h2 className="text-[14px] font-medium text-zinc-700 mb-3">Your wall</h2>
                      <div className="flex flex-col gap-5">
                        {wallPosts.map((post) => (
                          <DashboardSocialCard
                            key={post.id}
                            post={post}
                            saved={savedIds.has(post.id)}
                            reaction={
                              likedIds.has(post.id)
                                ? 'like'
                                : dislikedIds.has(post.id)
                                  ? 'dislike'
                                  : null
                            }
                          />
                        ))}
                      </div>
                    </section>
                  )}
                </>
              )}
            </div>

            {/* Right column — desktop only; mobile uses inline search + drawer for saved */}
            <aside className="hidden lg:block space-y-5 lg:sticky lg:top-6 lg:self-start">
              <Suspense>
                <SearchBar defaultValue={q} />
              </Suspense>

              <SavedSoopCard saved={savedPosts} />
            </aside>
          </div>
        </main>
      </div>
    </div>
  )
}
