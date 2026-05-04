import ScooplyLogo from '../ScooplyLogo'

function MiniCard({ tag, title, lines = 3 }: { tag?: string; title: string; lines?: number }) {
  return (
    <div className="bg-white rounded-xl p-3 shadow-sm flex flex-col gap-2 break-inside-avoid mb-3">
      {tag && (
        <span className="inline-flex w-fit items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-100 text-[10px] text-zinc-500">
          {tag}
        </span>
      )}
      <p className="text-[12px] font-semibold text-zinc-800 leading-tight">{title}</p>
      <div className="flex flex-col gap-1">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="h-1.5 rounded-full bg-zinc-100" style={{ width: `${100 - i * 12}%` }} />
        ))}
      </div>
    </div>
  )
}

const COLUMNS = [
  {
    label: 'Inbox',
    cards: [
      { tag: 'Twitter', title: 'GPT-5 benchmark results are in' },
      { tag: 'LinkedIn', title: 'AI in healthcare is a game changer' },
    ],
  },
  {
    label: 'Up Next',
    cards: [
      { tag: 'Instagram', title: 'AI-Powered Design: A New Era' },
      { tag: 'Blog', title: 'How Mistral Beat GPT-4 on Coding Tasks' },
    ],
  },
  {
    label: 'In Progress',
    cards: [
      { tag: 'YouTube', title: 'Building AI Agents with LangChain' },
      { tag: 'LinkedIn', title: 'The Ethics of AI in Education' },
    ],
  },
  {
    label: 'Reading',
    cards: [
      { tag: 'TikTok', title: 'AI-Powered Design Tools' },
      { tag: 'Twitter', title: 'AI Generates Music That Made Me Cry' },
    ],
  },
]

export default function ScreenPreview() {
  return (
    <div
      id="preview"
      className="relative mx-auto w-full max-w-6xl rounded-t-3xl bg-white shadow-[0_-2px_40px_-12px_rgba(0,0,0,0.12)] border border-zinc-200/70 border-b-0 overflow-hidden"
    >
      <div className="flex h-[420px] sm:h-[500px]">
        {/* mini sidebar */}
        <div className="hidden sm:flex flex-col w-44 shrink-0 bg-white border-r border-zinc-100 p-4 gap-4">
          <ScooplyLogo size={20} />
          <div className="flex flex-col gap-3 mt-2">
            {[
              { name: 'AI Foundations', color: '#3B82F6', w: 60 },
              { name: 'Hands-On AI Tools', color: '#F59E0B', w: 40 },
              { name: 'AI with Heart', color: '#8B5CF6', w: 75 },
              { name: 'Stay Curious', color: '#10B981', w: 25 },
            ].map((c) => (
              <div key={c.name} className="flex flex-col gap-1.5">
                <p className="text-[10px] font-semibold text-zinc-700">{c.name}</p>
                <div className="h-0.5 rounded-full bg-zinc-100">
                  <div className="h-full rounded-full" style={{ width: `${c.w}%`, backgroundColor: c.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* main content */}
        <div className="flex-1 bg-[#FAFAF8] p-5 overflow-hidden">
          <p className="text-[13px] font-semibold text-zinc-800 mb-1">Good morning, John</p>
          <div className="flex gap-3 mt-4 overflow-hidden">
            {COLUMNS.map((col) => (
              <div key={col.label} className="flex-1 min-w-0">
                <p className="text-[11px] text-zinc-500 mb-2">
                  {col.label} <span className="text-zinc-300 ml-1">{col.cards.length}</span>
                </p>
                {col.cards.map((card) => (
                  <MiniCard key={card.title} tag={card.tag} title={card.title} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
