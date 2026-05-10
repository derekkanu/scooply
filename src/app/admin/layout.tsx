import Link from 'next/link'
import { adminLogout } from '@/lib/actions'
import Button from '@/components/ui/Button'
import ScooplyLogo from '@/components/ScooplyLogo'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#D9D9D9]">
      <header className="sticky top-0 z-40 bg-[#D9D9D9]/90 backdrop-blur border-b border-zinc-300/70">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin/posts" className="flex items-center gap-2.5">
              <ScooplyLogo size={24} showWordmark={false} />
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
