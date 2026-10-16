import { ChevronRight } from '@/components/ui/icons'

const QUESTIONS = [
  {
    q: 'What is Scooply?',
    a: 'Scooply reads the AI internet for you, every platform, every day, and keeps only what fits your level and your interests.',
  },
  {
    q: 'Which platforms does Scooply read?',
    a: 'X, LinkedIn, YouTube, TikTok, Instagram and the blogs. You can switch any of them off in your settings.',
  },
  {
    q: 'How does Scooply know my level?',
    a: 'You tell us when you sign up: beginner, intermediate or advanced. You can change it at any time as you grow.',
  },
  {
    q: 'Do I have to leave the platforms I already use?',
    a: 'No. Every scoop links straight to the original post, so you can read, reply or follow the author where they posted.',
  },
  {
    q: 'How much does Scooply cost?',
    a: 'Scooply is free while we’re in early access. Join the waiting list and we’ll let you in as spots open.',
  },
]

/** Accordion of common questions, built on native details so it works without JavaScript. */
export default function Faq() {
  return (
    <div className="sc-scroll-group border-t border-line-strong">
      {QUESTIONS.map(({ q, a }) => (
        <details key={q} className="group border-b border-line-strong">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[17px] text-ink [&::-webkit-details-marker]:hidden">
            {q}
            <ChevronRight size={16} className="shrink-0 text-ink-3 transition-transform duration-200 ease-soft group-open:rotate-90" />
          </summary>
          <p className="max-w-[60ch] pb-6 text-[15px] leading-relaxed text-ink-3">{a}</p>
        </details>
      ))}
    </div>
  )
}
