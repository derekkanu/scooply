import { Suspense } from 'react'
import Link from 'next/link'
import { getUserSession } from '@/lib/auth'
import { filterPosts, getPosts } from '@/lib/data'
import { categories, getCategoryById } from '@/lib/categories'
import { userLogout } from '@/lib/actions'
import type { Post } from '@/lib/types'
import PostCard from '@/components/PostCard'
import PlatformIcon from '@/components/PlatformIcon'
import TrackedPostLink from '@/components/TrackedPostLink'
import CategorySidebar from '@/components/CategorySidebar'
import SearchBar from '@/components/SearchBar'
import WelcomeName from '@/components/dashboard/WelcomeName'

interface PageProps {
  searchParams: Promise<{ category?: string; q?: string }>
}

function MobileTopBar() {
  return (
    <div className="lg:hidden sticky top-0 z-40 bg-[#F7F7F5]/90 backdrop-blur border-b border-zinc-100 px-6 h-14 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="13" stroke="black" strokeWidth="1.5" />
          <circle cx="14" cy="14" r="9" stroke="black" strokeWidth="1.5" />
          <circle cx="14" cy="14" r="5" stroke="black" strokeWidth="1.5" />
          <circle cx="14" cy="14" r="2" fill="black" />
          <path d="M14 1 C 14 1, 27 14, 14 27" stroke="black" strokeWidth="1.2" fill="none" />
        </svg>
        <span className="font-bold text-zinc-900">Scooply</span>
      </div>
      <form action={userLogout}>
        <button type="submit" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
          Sign out
        </button>
      </form>
    </div>
  )
}

function PostListRow({ post }: { post: Post }) {
  const category = getCategoryById(post.categoryId)
  return (
    <TrackedPostLink
      postId={post.id}
      href={post.sourceUrl}
      className="group flex items-center gap-4 px-5 py-4 hover:bg-zinc-50 transition-colors"
    >
      <PlatformIcon source={post.source} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-zinc-900 truncate">{post.title}</p>
        <p className="text-xs text-zinc-500 truncate mt-0.5">
          {category?.name}
          {post.sourceHandle ? ` · ${post.sourceHandle}` : ''}
        </p>
      </div>
      <svg
        className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 transition-colors shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </TrackedPostLink>
  )
}

function FeaturedPost({ post }: { post: Post }) {
  const category = getCategoryById(post.categoryId)
  return (
    <article className="bg-white rounded-3xl shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-[11px] font-bold tracking-[0.12em] uppercase"
            style={{ color: category?.color ?? '#3B82F6' }}
          >
            Featured · {category?.name ?? 'Story'}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 leading-tight">{post.title}</h2>
        <p className="text-sm text-zinc-500 leading-relaxed mt-3 line-clamp-4">{post.content}</p>
      </div>

      {post.imageUrl && (
        <div className="px-6">
          <div className="relative rounded-2xl overflow-hidden">
            <img src={post.imageUrl} alt={post.title} className="w-full h-64 object-cover" />
            <div className="absolute top-3 left-3">
              <PlatformIcon source={post.source} size="sm" />
            </div>
          </div>
        </div>
      )}

      <div className="px-6 pt-5 pb-6 mt-2 border-t border-zinc-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          {post.sourceHandle && <span className="font-medium text-zinc-600">{post.sourceHandle}</span>}
          <span>·</span>
          <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
        <TrackedPostLink
          postId={post.id}
          href={post.sourceUrl}
          className="inline-flex items-center px-4 py-2 rounded-full bg-black text-white text-sm font-medium hover:bg-zinc-800 transition-colors"
        >
          Read full article
        </TrackedPostLink>
      </div>
    </article>
  )
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const { category, q } = await searchParams
  const user = await getUserSession()

  // Just finished signup but haven't told us their name yet.
  if (user && !user.name) {
    return <WelcomeName />
  }

  const [posts, allPosts] = await Promise.all([filterPosts(category, q), getPosts()])

  const postCounts: Record<string, number> = {}
  for (const cat of categories) {
    postCounts[cat.id] = allPosts.filter((p) => p.categoryId === cat.id).length
  }

  const firstName = user?.name?.split(' ')[0] ?? 'there'
  const isAllView = !category || category === 'all'
  const activeCategory = getCategoryById(category ?? '')

  const topPicks = posts.slice(0, 3)
  const featured = posts[3] ?? posts[0]
  const featuredId = featured?.id
  const rest = posts.slice(3).filter((p) => p.id !== featuredId)

  const trending = [...categories]
    .map((c) => ({ ...c, count: postCounts[c.id] ?? 0 }))
    .sort((a, b) => b.count - a.count)

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex">
      <CategorySidebar activeKey={category ?? 'all'} userName={user?.name} />

      <div className="flex-1 min-w-0 flex flex-col">
        <MobileTopBar />

        <main className="flex-1 px-6 lg:px-10 xl:px-14 py-8 lg:py-12">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-8 lg:gap-12">
            {/* Center column */}
            <div className="min-w-0 space-y-6">
              <header>
                {isAllView ? (
                  <>
                    <h1 className="text-3xl font-bold text-zinc-900">Hello {firstName}</h1>
                    <p className="text-zinc-500 mt-1.5 text-sm max-w-2xl">
                      You&apos;re building solid AI literacy habits. This week you explored{' '}
                      <span className="font-semibold text-red-500">{Math.min(posts.length, 12)}</span> stories out of{' '}
                      <span className="font-semibold text-emerald-500">{allPosts.length}</span> we curated. Focus more
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
                    <h1 className="text-3xl font-bold text-zinc-900 mt-1">{activeCategory?.name ?? 'Stories'}</h1>
                    <p className="text-zinc-500 mt-1.5 text-sm max-w-2xl">
                      {activeCategory?.description ?? `Showing posts in this category.`}{' '}
                      <span className="text-zinc-400">
                        ({posts.length} {posts.length === 1 ? 'story' : 'stories'})
                      </span>
                    </p>
                  </>
                )}
              </header>

              {posts.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-sm flex flex-col items-center justify-center py-24 text-zinc-400">
                  <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-base font-medium">No posts found</p>
                  <p className="text-sm mt-1">Try a different search or category.</p>
                </div>
              ) : isAllView ? (
                <>
                  {topPicks.length > 0 && (
                    <section>
                      <div className="flex items-baseline justify-between mb-3 px-1">
                        <h2 className="text-xl font-bold text-zinc-900">Daily Digest</h2>
                        <span className="text-xs text-zinc-400">
                          {posts.length} {posts.length === 1 ? 'story' : 'stories'}
                        </span>
                      </div>
                      <div className="bg-white rounded-3xl shadow-sm divide-y divide-zinc-100 overflow-hidden">
                        {topPicks.map((post) => (
                          <PostListRow key={post.id} post={post} />
                        ))}
                      </div>
                    </section>
                  )}

                  {featured && posts.length > 3 && <FeaturedPost post={featured} />}

                  {rest.length > 0 && (
                    <section>
                      <h2 className="text-xl font-bold text-zinc-900 mb-3 px-1">More stories</h2>
                      <div className="columns-1 sm:columns-2 gap-4 space-y-4">
                        {rest.map((post) => (
                          <div key={post.id} className="break-inside-avoid">
                            <PostCard post={post} />
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </>
              ) : (
                <div className="columns-1 sm:columns-2 gap-4 space-y-4">
                  {posts.map((post) => (
                    <div key={post.id} className="break-inside-avoid">
                      <PostCard post={post} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right column */}
            <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
              <Suspense>
                <SearchBar defaultValue={q} />
              </Suspense>

              <div className="bg-white rounded-3xl shadow-sm p-5">
                <h3 className="text-sm font-semibold text-zinc-900 mb-4">What&apos;s trending</h3>
                <ol className="space-y-4">
                  {trending.map((cat, idx) => (
                    <li key={cat.id}>
                      <Link href={`/dashboard?category=${cat.id}`} className="flex items-baseline gap-3 group">
                        <span className="text-xs font-semibold text-zinc-300 tabular-nums w-5 shrink-0">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-zinc-900 group-hover:text-black truncate">
                            {cat.name}
                          </p>
                          <p className="text-xs text-zinc-400 mt-0.5">
                            {cat.count} {cat.count === 1 ? 'story' : 'stories'}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>

            </aside>
          </div>
        </main>
      </div>
    </div>
  )
}
