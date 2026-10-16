import StatCard from '@/components/ui/StatCard'
import { BarChart, Code, Layers } from '@/components/ui/icons'
import type { BentoTone } from '@/components/ui/BentoCard'

// Each level borrows the line icon its kind of reading has in the app's side nav:
// foundations for beginners, hands-on tools for intermediates, research charts for advanced.
const LEVELS: { tag: string; statement: string; tone: BentoTone; icon: React.ReactNode }[] = [
  { tag: 'Beginner', statement: 'New to AI, or just getting into it', tone: 'paper', icon: <Layers /> },
  { tag: 'Intermediate', statement: 'Already using AI, ready to go deeper', tone: 'paper', icon: <Code /> },
  { tag: 'Advanced', statement: 'Deep in AI and living at the frontier', tone: 'paper', icon: <BarChart /> },
]

/** One card per reading level, each saying who it's for: newcomers, regular users, deep practitioners. */
export default function LevelCards() {
  return (
    <div className="sc-scroll-group grid grid-cols-1 gap-4 md:grid-cols-3">
      {LEVELS.map((l) => (
        <StatCard className="sc-ripple" key={l.tag} size="fit" tone={l.tone} tag={l.tag} icon={l.icon} statement={l.statement} />
      ))}
    </div>
  )
}
