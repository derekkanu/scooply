import { redirect } from 'next/navigation'
import { getUserSession } from '@/lib/auth'
import ScooplyLogo from '@/components/ScooplyLogo'
import HeroHeadline from '@/components/landing/HeroHeadline'
import HeroBody from '@/components/landing/HeroBody'
import HeroActions from '@/components/landing/HeroActions'
import FloatingBubbles from '@/components/landing/FloatingBubbles'
import DecorativeLines from '@/components/landing/DecorativeLines'
import ScreenPreview from '@/components/landing/ScreenPreview'

export default async function LandingPage() {
  const user = await getUserSession()
  if (user?.name) redirect('/dashboard')

  return (
    <main className="relative min-h-screen bg-white overflow-hidden">
      {/* Background lines span the full landing page — they pass behind the screen */}
      <DecorativeLines />

      <section className="relative">
        <FloatingBubbles />

        <div className="relative max-w-6xl mx-auto px-6 pt-12 pb-32 flex flex-col items-center gap-10">
          <ScooplyLogo size={32} />

          <div className="flex flex-col items-center gap-6 mt-8 max-w-3xl">
            <HeroHeadline />
            <HeroBody />
          </div>

          <HeroActions />
        </div>
      </section>

      <section className="relative px-4 sm:px-6 z-10">
        <ScreenPreview />
      </section>
    </main>
  )
}
