import type { ReactNode } from 'react'

type Platform = 'twitter' | 'linkedin' | 'instagram' | 'tiktok' | 'youtube' | 'blog'

interface SocialCard {
  handle: string
  platform: Platform
  avatar: ReactNode
  title: string
  body: string
}

const BODY =
  'Over the past decade, AI has evolved from a niche tech to a catalyst for creativity across industries. As a product designer, I see AI not as a replacement but as a partner—one that augments our ability to dream, iterate, and create. When we leverage AI thoughtfully, we unlock new realms of design—where human intuition and machine precision meet.'

const TITLE = 'AI’s Impact on Human Creativity'

const CARDS: SocialCard[] = [
  {
    handle: '@oluwa.ilemon1',
    platform: 'instagram',
    avatar: <GradientAvatar from="#fde68a" to="#f97316" />,
    title: TITLE,
    body: BODY,
  },
  {
    handle: '@anthropic',
    platform: 'twitter',
    avatar: <InitialsAvatar initials="AI" bg="#FAF7F2" fg="#9A6B3A" />,
    title: TITLE,
    body: BODY,
  },
  {
    handle: '@DataChaz',
    platform: 'linkedin',
    avatar: <GradientAvatar from="#fbbf24" to="#7c3aed" />,
    title: TITLE,
    body: BODY,
  },
  {
    handle: '@man_vity',
    platform: 'instagram',
    avatar: <GradientAvatar from="#92400e" to="#1c1917" />,
    title: TITLE,
    body: BODY,
  },
  {
    handle: '@deepseek',
    platform: 'tiktok',
    avatar: <DeepseekAvatar />,
    title: TITLE,
    body: BODY,
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

function DeepseekAvatar() {
  return (
    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#4D6BFE" aria-hidden>
        <path d="M21.5 8.5c-1 .3-2 .3-3 0-.5-1.5-2-2.5-3.5-2.5-2 0-3.5 1.5-3.5 3.5 0 .5.1 1 .3 1.5-3 .3-5.5 2-7 4.5-.5-.3-1-.5-1.5-.5C2.4 15 1.5 16 1.5 17s.9 2 2 2c.6 0 1.1-.2 1.5-.6 1.6 1.7 4 2.6 6.5 2.6 4.5 0 8.5-3.2 9-7.8.4-.2.8-.5 1.2-.8.7-.6 1.2-1.4 1.3-2.3.2-.7-.1-1.4-.5-1.6zm-7.5 6c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z" />
      </svg>
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
