import StatCard from '@/components/ui/StatCard'
import Illustration from '@/components/illustrations/Illustration'
import type { BentoTone } from '@/components/ui/BentoCard'
import type { SpriteId } from '@/components/illustrations/sprites'

const LEVELS: { tag: string; statement: string; tone: BentoTone; art: SpriteId }[] = [
  { tag: 'Beginner', statement: 'Understand what AI actually is', tone: 'paper', art: 'paper' },
  { tag: 'Intermediate', statement: 'Put new tools to work this week', tone: 'paper', art: 'magnifier' },
  { tag: 'Advanced', statement: 'Track the research as it lands', tone: 'paper', art: 'binoculars' },
]

/** One card per reading level, left to right from first steps to the frontier. */
export default function LevelCards() {
  return (
    <div className="sc-scroll-group grid grid-cols-1 gap-4 md:grid-cols-3">
      {LEVELS.map((l) => (
        <StatCard key={l.tag} tone={l.tone} tag={l.tag} statement={l.statement} footer={<Illustration name={l.art} size={96} still />} />
      ))}
    </div>
  )
}
