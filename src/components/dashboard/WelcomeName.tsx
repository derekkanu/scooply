import { setUserName } from '@/lib/actions'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import ScooplyLogo from '@/components/ScooplyLogo'
import Eyebrow from '@/components/ui/Eyebrow'
import Reveal from '@/components/ui/Reveal'
import Illustration from '@/components/illustrations/Illustration'

export default function WelcomeName() {
  return (
    <main className="min-h-screen flex items-center justify-center sc-field px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-3 mb-8">
          <ScooplyLogo size={44} showWordmark={false} />
        </div>

        <Reveal className="sc-card rounded-[28px] p-8 sm:p-10 text-center">
          <Illustration name="paper" size={120} className="mx-auto mb-2 block" />
          <Eyebrow framed>Welcome to Scooply</Eyebrow>
          <h1 className="font-display text-[32px] sm:text-[38px] text-ink mt-4">
            You&apos;re in.
          </h1>
          <p className="text-body text-ink-3 mt-2">
            One last thing — what should we call you?
          </p>

          <form action={setUserName} className="flex flex-col gap-4 mt-7 text-left">
            <Input id="welcome-name" name="name" label="Your name" placeholder="e.g. Alex" required autoFocus />
            <Button type="submit" size="lg" className="w-full mt-2">
              Open my dashboard
            </Button>
          </form>
        </Reveal>
      </div>
    </main>
  )
}
