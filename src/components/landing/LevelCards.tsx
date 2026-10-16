import StatCard from '@/components/ui/StatCard'
import { BarChart, Code, Layers } from '@/components/ui/icons'
import type { BentoTone } from '@/components/ui/BentoCard'

// Each level borrows the line icon its kind of reading has in the app's side nav:
// foundations for beginners, hands-on tools for intermediates, research charts for advanced.
const LEVELS: { tag: string; statement: string; tone: BentoTone; icon: React.ReactNode }[] = [
  { tag: 'Beginner', statement: 'Understand what AI actually is', tone: 'paper', icon: <Layers size={28} /> },
  { tag: 'Intermediate', statement: 'Put new tools to work this week', tone: 'paper', icon: <Code size={28} /> },
  { tag: 'Advanced', statement: 'Track the research as it lands', tone: 'paper', icon: <BarChart size={28} /> },
]

/** One card per reading level, left to right from first steps to the frontier. */
export default function LevelCards() {
  return (
    <div className="sc-scroll-group grid grid-cols-1 gap-4 md:grid-cols-3">
      {LEVELS.map((l) => (
        <StatCard className="sc-ripple" key={l.tag} tone={l.tone} tag={l.tag} statement={l.statement} footer={l.icon} />
      ))}
    </div>
  )
}
