import { setUserName } from '@/lib/actions'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import ScooplyLogo from '@/components/ScooplyLogo'

export default function WelcomeName() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F7F7F5] px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-3 mb-8">
          <ScooplyLogo size={44} showWordmark={false} />
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm text-center">
          <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-zinc-400">Welcome to Scooply</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight mt-2">
            You're in.
          </h1>
          <p className="text-sm text-zinc-500 mt-2">
            One last thing — what should we call you?
          </p>

          <form action={setUserName} className="flex flex-col gap-4 mt-7 text-left">
            <Input id="welcome-name" name="name" label="Your name" placeholder="e.g. Alex" required autoFocus />
            <Button type="submit" size="lg" className="w-full mt-2">
              Open my dashboard
            </Button>
          </form>
        </div>
      </div>
    </main>
  )
}
