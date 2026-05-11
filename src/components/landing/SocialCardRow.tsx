import type { ReactNode } from 'react'

type Platform = 'twitter' | 'linkedin' | 'instagram' | 'tiktok' | 'youtube' | 'blog'

interface SocialCard {
  handle: string
  platform: Platform
  avatar: ReactNode
  title: string
  body: string
}

const CARDS: SocialCard[] = [
  {
    handle: '@anthropic',
    platform: 'twitter',
    avatar: <InitialsAvatar initials="AN" bg="#FAF7F2" fg="#9A6B3A" />,
    title: 'Claude 4.7 ships with a 2M-token context',
    body: 'Faster tool use, longer reasoning chains, fewer refusals on legit security work. Early benchmarks put it ahead of o4 on agentic coding. Model card has the full breakdown.',
  },
  {
    handle: 'Dr. Maya Patel',
    platform: 'linkedin',
    avatar: <GradientAvatar from="#fbcfe8" to="#c084fc" />,
    title: 'The ethics of AI in education',
    body: "As AI tutors become mainstream, we have to ask: who benefits? Students in well-funded schools get personalized AI mentors while others fall behind. This isn't a tech problem — it's a policy one.",
  },
  {
    handle: '@musicandmachines',
    platform: 'twitter',
    avatar: <GradientAvatar from="#fde68a" to="#f97316" />,
    title: 'AI generated a song that made me cry',
    body: 'I asked Suno to write a song about my grandmother. What came back was so emotionally resonant I genuinely teared up. Is that a gift or a warning?',
  },
  {
    handle: 'futuretech_daily',
    platform: 'instagram',
    avatar: <GradientAvatar from="#bbf7d0" to="#34d399" />,
    title: 'Robots learning to cook from YouTube',
    body: 'New MIT research: robots watch a single cooking video and replicate the dish. The dexterity is wild. Commercial AI chefs might be five years away, not fifty.',
  },
  {
    handle: '@swyx',
    platform: 'twitter',
    avatar: <InitialsAvatar initials="SW" bg="#E0E7FF" fg="#3730A3" />,
    title: 'Prompt caching cut our API bill 90%',
    body: 'We were spending $14k/month on Anthropic. Turned on prompt caching for our system prompt and tool defs — monthly bill dropped to $1.4k. Same throughput, same quality.',
  },
  {
    handle: 'AI Engineering Hub',
    platform: 'youtube',
    avatar: <InitialsAvatar initials="AE" bg="#FEE2E2" fg="#991B1B" />,
    title: 'Build your first AI agent in 30 minutes',
    body: 'Walkthrough on building an autonomous AI agent end-to-end: memory, tools, and multi-step reasoning. Full code in the description so you can ship one tonight.',
  },
]

function GradientAvatar({ from, to }: { from: string; to: string }) {
  return (
    <div
      className="w-10 h-10 rounded-full"
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    />
  )
}

function InitialsAvatar({ initials, bg, fg }: { initials: string; bg: string; fg: string }) {
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-semibold"
      style={{ backgroundColor: bg, color: fg }}
    >
      {initials}
    </div>
  )
}

function PlatformBadge({ platform }: { platform: Platform }) {
  const common = 'absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center'
  if (platform === 'twitter') {
    return (
      <span className={`${common} bg-black`}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.736l7.73-8.835L1.254 2.25H8.08l4.259 5.632L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
        </svg>
      </span>
    )
  }
  if (platform === 'linkedin') {
    return (
      <span className={`${common} bg-[#0077B5]`}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
          <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43A2.06 2.06 0 1 1 5.34 3.3a2.06 2.06 0 0 1 0 4.13zm1.78 13.02H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
        </svg>
      </span>
    )
  }
  if (platform === 'instagram') {
    return (
      <span
        className={common}
        style={{
          background:
            'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)',
        }}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
          <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85 0 3.21-.01 3.58-.07 4.85-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07-3.2 0-3.58-.01-4.85-.07-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.64-.07-4.85 0-3.2.01-3.58.07-4.85.15-3.23 1.66-4.77 4.92-4.92C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
        </svg>
      </span>
    )
  }
  if (platform === 'tiktok') {
    return (
      <span className={`${common} bg-black`}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 1 0 5.55 6.29V8.79a8.26 8.26 0 0 0 4.84 1.55V6.89a4.85 4.85 0 0 1-1.07-.2z" />
        </svg>
      </span>
    )
  }
  if (platform === 'youtube') {
    return (
      <span className={`${common} bg-[#FF0000]`}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
          <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.2C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.87.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" />
        </svg>
      </span>
    )
  }
  return null
}

function Card({ card }: { card: SocialCard }) {
  return (
    <div className="shrink-0 w-[320px] sm:w-[340px] rounded-3xl border border-zinc-300/70 bg-white/10 backdrop-blur-[2px] p-5 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="relative">
          {card.avatar}
          <PlatformBadge platform={card.platform} />
        </div>
        <p className="text-[15px] text-zinc-700">{card.handle}</p>
      </div>
      <h3 className="text-[17px] font-semibold text-zinc-900 leading-snug">{card.title}</h3>
      <p className="text-[13px] text-zinc-500 leading-relaxed">{card.body}</p>
    </div>
  )
}

export default function SocialCardRow() {
  return (
    <div className="relative w-full overflow-hidden pb-12">
      <div className="flex w-max marquee-track">
        <div className="flex gap-5 pr-5 shrink-0" aria-hidden="false">
          {CARDS.map((card) => (
            <Card key={`a-${card.handle}`} card={card} />
          ))}
        </div>
        <div className="flex gap-5 pr-5 shrink-0" aria-hidden="true">
          {CARDS.map((card) => (
            <Card key={`b-${card.handle}`} card={card} />
          ))}
        </div>
      </div>
    </div>
  )
}
