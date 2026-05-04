import Link from 'next/link'
import { getPosts } from '@/lib/data'
import { getCategoryById } from '@/lib/categories'
import { deletePostAction } from '@/lib/actions'
import PlatformIcon from '@/components/PlatformIcon'
import Button from '@/components/ui/Button'

export default async function AdminPostsPage() {
  const posts = await getPosts()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Posts</h1>
          <p className="text-sm text-zinc-500 mt-1">{posts.length} posts curated</p>
        </div>
        <Link href="/admin/posts/new">
          <Button>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New post
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {posts.length === 0 ? (
          <div className="py-16 text-center text-zinc-400">
            <p>No posts yet. Add your first post.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-100">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Source</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Title</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-zinc-500 uppercase tracking-wide hidden md:table-cell">Category</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-zinc-500 uppercase tracking-wide hidden lg:table-cell">Published</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {posts.map((post) => {
                const category = getCategoryById(post.categoryId)
                return (
                  <tr key={post.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <PlatformIcon source={post.source} size="sm" />
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-zinc-900 line-clamp-1 max-w-xs">{post.title}</p>
                      {post.sourceHandle && (
                        <p className="text-xs text-zinc-400 mt-0.5">{post.sourceHandle}</p>
                      )}
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      {category && (
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: `${category.color}18`, color: category.color }}
                        >
                          {category.name}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell">
                      <span className="text-xs text-zinc-400">
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/posts/${post.id}/edit`}>
                          <Button variant="secondary" size="sm">Edit</Button>
                        </Link>
                        <form
                          action={async () => {
                            'use server'
                            await deletePostAction(post.id)
                          }}
                        >
                          <Button variant="danger" size="sm" type="submit">Delete</Button>
                        </form>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
