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
import Briefing, { BriefingHeadline } from '@/components/dashboard/Briefing'
import SavedSoopCard from '@/components/dashboard/SavedSoopCard'
import MobileMenuDrawer from '@/components/dashboard/MobileMenuDrawer'
import MobileCategoryPills from '@/components/dashboard/MobileCategoryPills'
import Eyebrow from '@/components/ui/Eyebrow'
import Orb, { CATEGORY_ORB } from '@/components/ui/Orb'
import Reveal from '@/components/ui/Reveal'
import Illustration from '@/components/illustrations/Illustration'

interface PageProps {
  searchParams: Promise<{ category?: string; q?: string }>
}

function MobileTopBar({ activeKey, userName }: { activeKey: string; userName?: string }) {
  return (
    <div className="lg:hidden sticky top-0 z-40 sc-glass border-b border-line px-6 h-16 flex items-center justify-between">
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

  // The briefing leads with a photo or video post, then four more that are moving now;
  // everything else goes to the wall.
  const briefPool = isAllView && !q ? [...posts.filter((p) => p.imageUrl), ...posts.filter((p) => !p.imageUrl)].slice(0, 5) : []
  const [lead, ...moving] = briefPool
  const briefIds = new Set(briefPool.map((p) => p.id))
  const wallPosts = posts.filter((p) => !briefIds.has(p.id))
  const viewedIds = user?.viewedPostIds ?? []
  const newCount = allPosts.filter((p) => !viewedIds.includes(p.id)).length

  return (
    <div className="min-h-screen sc-field flex">
      <CategorySidebar activeKey={category ?? 'all'} userName={user?.name} />

      <div className="flex-1 min-w-0 flex flex-col">
        <MobileTopBar activeKey={category ?? 'all'} userName={user?.name} />

        <main className="flex-1 px-6 lg:px-12 xl:px-16 pt-4 pb-10 lg:pt-8 lg:pb-14">
          {lead && (
            <BriefingHeadline firstName={firstName}>
              <MobileCategoryPills active={category ?? 'all'} />
              <Suspense>
                <SearchBar defaultValue={q} />
              </Suspense>
            </BriefingHeadline>
          )}
          {lead && (
            <div className="max-w-6xl mx-auto mt-4 mb-14 lg:mt-6 lg:mb-20">
              <Briefing
                lead={lead}
                moving={moving}
                allPosts={allPosts}
                viewedIds={viewedIds}
                savedCount={savedPosts.length}
                newCount={newCount}
                level={user?.proficiency}
              />
            </div>
          )}
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-10 lg:gap-14">
            {/* Center column */}
            <div className="min-w-0 space-y-6 lg:space-y-8">
              <header className={lead ? 'hidden' : ''}>
                {isAllView ? (
                  <>
                    <h1 className="font-display text-[32px] sm:text-[40px] lg:text-[44px] leading-[1.05] text-ink">
                      Hello {firstName}
                    </h1>
                    <p className="text-ink-3 mt-3 text-[15px] leading-relaxed max-w-2xl">
                      {posts.length} {posts.length === 1 ? 'story matches' : 'stories match'} your search.
                    </p>
                  </>
                ) : (
                  <>
                    <Eyebrow framed className="gap-2">
                      <Orb palette={CATEGORY_ORB[activeCategory?.id ?? ''] ?? 'mono'} size={12} />
                      Category
                    </Eyebrow>
                    <h1 className="font-display mt-4 text-[32px] sm:text-[40px] lg:text-[44px] leading-[1.05] text-ink">
                      {activeCategory?.name ?? 'Stories'}
                    </h1>
                    <p className="text-ink-3 mt-3 text-[15px] leading-relaxed max-w-2xl">
                      {activeCategory?.description ?? 'Showing posts in this category.'}{' '}
                      <span className="text-ink-4">
                        ({posts.length} {posts.length === 1 ? 'story' : 'stories'})
                      </span>
                    </p>
                  </>
                )}
              </header>

              {/* Mobile-only nav + search row (pinned inside the greeting when the briefing shows) */}
              <div className={`lg:hidden space-y-4 ${lead ? 'hidden' : ''}`}>
                <MobileCategoryPills active={category ?? 'all'} />
                <Suspense>
                  <SearchBar defaultValue={q} />
                </Suspense>
              </div>

              {posts.length === 0 ? (
                <div className="sc-card rounded-[24px] flex flex-col items-center justify-center gap-1 py-24 text-ink-3">
                  <Illustration name="magnifier" size={140} className="mb-3" />
                  <p className="text-body font-medium text-ink-2">No posts found</p>
                  <p className="text-small text-ink-4">Try a different search or category.</p>
                </div>
              ) : (
                <>
                  {wallPosts.length > 0 && (
                    <section id="wall" className="scroll-mt-24">
                      <h2 className="mb-5 font-display text-[24px] leading-[1.2] text-ink">Your wall</h2>
                      {/* masonry: cards keep their natural height and stack down two columns */}
                      <div className="columns-1 gap-4 sm:columns-2">
                        {wallPosts.map((post, i) => (
                          <Reveal key={post.id} delay={Math.min(i, 8) * 70} className="mb-4 break-inside-avoid">
                          <DashboardSocialCard
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
                          </Reveal>
                        ))}
                      </div>
                    </section>
                  )}
                </>
              )}
            </div>

            {/* Right column — desktop only; mobile uses inline search + drawer for saved */}
            <aside className="hidden lg:block space-y-5 lg:sticky lg:top-40 lg:self-start">
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
