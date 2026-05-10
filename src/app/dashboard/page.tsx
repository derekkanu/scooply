import { Suspense } from 'react'
import Link from 'next/link'
import { getUserSession } from '@/lib/auth'
import { filterPosts, getPosts } from '@/lib/data'
import { getCategoryById } from '@/lib/categories'
import { userLogout } from '@/lib/actions'
import CategorySidebar from '@/components/CategorySidebar'
import SearchBar from '@/components/SearchBar'
import WelcomeName from '@/components/dashboard/WelcomeName'
import DashboardSocialCard from '@/components/dashboard/DashboardSocialCard'
import FeaturedScoopCard from '@/components/dashboard/FeaturedScoopCard'
import SavedSoopCard from '@/components/dashboard/SavedSoopCard'

interface PageProps {
  searchParams: Promise<{ category?: string; q?: string; fp?: string }>
}

const FEATURED_PAGE_SIZE = 2

function MobileTopBar() {
  return (
    <div className="lg:hidden sticky top-0 z-40 bg-[#D9D9D9]/90 backdrop-blur border-b border-zinc-300/70 px-6 h-14 flex items-center justify-between">
      <span className="font-semibold text-zinc-900">Scooply.</span>
      <form action={userLogout}>
        <button type="submit" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
          Sign out
        </button>
      </form>
    </div>
  )
}

function CarouselArrow({
  href,
  direction,
  disabled,
}: {
  href: string
  direction: 'prev' | 'next'
  disabled: boolean
}) {
  const label = direction === 'prev' ? 'Previous featured' : 'Next featured'
  const arrow =
    direction === 'prev' ? (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    )
  const className =
    'w-9 h-9 rounded-full inline-flex items-center justify-center text-zinc-700 hover:text-zinc-900 transition-colors'
  if (disabled) {
    return (
      <span aria-hidden className={`${className} opacity-30 pointer-events-none`}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {arrow}
        </svg>
      </span>
    )
  }
  return (
    <Link aria-label={label} href={href} className={className}>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {arrow}
      </svg>
    </Link>
  )
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const { category, q, fp } = await searchParams
  const user = await getUserSession()

  if (user && !user.name) {
    return <WelcomeName />
  }

  const [posts, allPosts] = await Promise.all([filterPosts(category, q), getPosts()])

  const savedIds = new Set(user?.savedPostIds ?? [])
  const savedPosts = allPosts.filter((p) => savedIds.has(p.id))

  const firstName = user?.name?.split(' ')[0] ?? 'there'
  const isAllView = !category || category === 'all'
  const activeCategory = getCategoryById(category ?? '')

  const featuredPool = isAllView ? posts.slice(0, Math.min(posts.length, 8)) : []
  const totalFeaturedPages = Math.max(1, Math.ceil(featuredPool.length / FEATURED_PAGE_SIZE))
  const fpNum = Math.min(Math.max(parseInt(fp ?? '0', 10) || 0, 0), totalFeaturedPages - 1)
  const featuredStart = fpNum * FEATURED_PAGE_SIZE
  const featured = featuredPool.slice(featuredStart, featuredStart + FEATURED_PAGE_SIZE)
  const featuredIds = new Set(featuredPool.map((p) => p.id))
  const wallPosts = posts.filter((p) => !featuredIds.has(p.id))

  const buildPageHref = (page: number) => {
    const p = new URLSearchParams()
    if (category) p.set('category', category)
    if (q) p.set('q', q)
    if (page > 0) p.set('fp', String(page))
    const qs = p.toString()
    return qs ? `/dashboard?${qs}` : '/dashboard'
  }

  return (
    <div className="min-h-screen bg-[#D9D9D9] flex">
      <CategorySidebar activeKey={category ?? 'all'} userName={user?.name} />

      <div className="flex-1 min-w-0 flex flex-col">
        <MobileTopBar />

        <main className="flex-1 px-6 lg:px-12 xl:px-16 py-10 lg:py-14">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-10 lg:gap-14">
            {/* Center column */}
            <div className="min-w-0 space-y-8">
              <header>
                {isAllView ? (
                  <>
                    <h1 className="text-[44px] leading-[1.05] font-bold text-zinc-900 tracking-tight">
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
                    <h1 className="text-[44px] leading-[1.05] font-bold text-zinc-900 tracking-tight mt-1">
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

              {posts.length === 0 ? (
                <div className="rounded-3xl border border-zinc-400/40 bg-white/15 backdrop-blur-[2px] flex flex-col items-center justify-center py-24 text-zinc-500">
                  <p className="text-base font-medium">No posts found</p>
                  <p className="text-sm mt-1 text-zinc-400">Try a different search or category.</p>
                </div>
              ) : (
                <>
                  {featured.length > 0 && (
                    <section>
                      <h2 className="text-[14px] font-medium text-zinc-700 mb-3">New scoop</h2>
                      <div className="flex items-stretch gap-2">
                        <div className="flex items-center">
                          <CarouselArrow
                            href={buildPageHref(fpNum - 1)}
                            direction="prev"
                            disabled={fpNum === 0}
                          />
                        </div>
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
                          {featured.map((post) => (
                            <FeaturedScoopCard key={post.id} post={post} />
                          ))}
                        </div>
                        <div className="flex items-center">
                          <CarouselArrow
                            href={buildPageHref(fpNum + 1)}
                            direction="next"
                            disabled={fpNum >= totalFeaturedPages - 1}
                          />
                        </div>
                      </div>
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
                          />
                        ))}
                      </div>
                    </section>
                  )}
                </>
              )}
            </div>

            {/* Right column */}
            <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
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
