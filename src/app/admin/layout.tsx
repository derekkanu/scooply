import Link from 'next/link'
import { adminLogout } from '@/lib/actions'
import Button from '@/components/ui/Button'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F7F7F5]">
      <header className="sticky top-0 z-40 bg-white border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin/posts" className="flex items-center gap-2.5">
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="13" stroke="black" strokeWidth="1.5" />
                <circle cx="14" cy="14" r="9" stroke="black" strokeWidth="1.5" />
                <circle cx="14" cy="14" r="5" stroke="black" strokeWidth="1.5" />
                <circle cx="14" cy="14" r="2" fill="black" />
                <path d="M14 1 C 14 1, 27 14, 14 27" stroke="black" strokeWidth="1.2" fill="none" />
              </svg>
              <span className="font-bold text-zinc-900">CMS</span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/admin/posts" className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors">
                Posts
              </Link>
              <Link href="/admin/posts/new" className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors">
                New post
              </Link>
            </nav>
          </div>
          <form action={adminLogout}>
            <Button variant="ghost" size="sm" type="submit">
              Sign out
            </Button>
          </form>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  )
}
