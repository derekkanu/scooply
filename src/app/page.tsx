import { redirect } from 'next/navigation'
import { getUserSession } from '@/lib/auth'
import ScooplyLogo from '@/components/ScooplyLogo'
import HeroHeadline from '@/components/landing/HeroHeadline'
import HeroBody from '@/components/landing/HeroBody'
import HeroActions from '@/components/landing/HeroActions'
import PixelSphere from '@/components/landing/PixelSphere'
import SocialCardRow from '@/components/landing/SocialCardRow'

export default async function LandingPage() {
  const user = await getUserSession()
  if (user?.name) redirect('/dashboard')

  return (
    <main className="relative min-h-screen bg-[#D9D9D9] overflow-hidden flex flex-col">
      <header className="relative px-10 lg:px-[120px] pt-8">
        <ScooplyLogo size={28} />
      </header>

      <section className="relative px-10 lg:px-[120px] pt-12 sm:pt-16 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 flex flex-col gap-8 max-w-2xl">
            <HeroHeadline />
            <HeroBody />
            <HeroActions />
          </div>

          <div className="lg:col-span-5 flex justify-end items-center">
            <PixelSphere className="w-full max-w-[520px] h-auto" />
          </div>
        </div>
      </section>

      <section className="relative mt-auto">
        <SocialCardRow />
      </section>
    </main>
  )
}
