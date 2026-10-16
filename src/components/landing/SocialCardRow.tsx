import type { Post } from '@/lib/types'
import ScoopCard from '@/components/feed/ScoopCard'

/** Sample scoops for the landing page — the same cards as the feed, without the controls. */
export const SCOOPS: Post[] = [
  {
    id: 'landing-1',
    title: 'Claude 4.7 ships with a 2M-token context',
    content: 'Faster tool use, longer reasoning chains, fewer refusals on legit security work. Early benchmarks put it ahead of o4 on agentic coding. Model card has the full breakdown.',
    source: 'twitter',
    sourceUrl: 'https://x.com',
    sourceHandle: '@anthropic',
    categoryId: 'hands-on-ai-tools',
    tags: [],
    publishedAt: '2026-10-12',
    createdAt: '2026-10-12',
  },
  {
    id: 'landing-2',
    title: 'The ethics of AI in education',
    content: "As AI tutors become mainstream, we have to ask: who benefits? Students in well-funded schools get personalized AI mentors while others fall behind. This isn't a tech problem — it's a policy one.",
    source: 'linkedin',
    sourceUrl: 'https://linkedin.com',
    sourceHandle: 'Dr. Maya Patel',
    categoryId: 'ai-with-heart',
    tags: [],
    publishedAt: '2026-10-12',
    createdAt: '2026-10-12',
  },
  {
    id: 'landing-3',
    title: 'AI generated a song that made me cry',
    content: 'I asked Suno to write a song about my grandmother. What came back was so emotionally resonant I genuinely teared up. Is that a gift or a warning?',
    source: 'twitter',
    sourceUrl: 'https://x.com',
    sourceHandle: '@musicandmachines',
    categoryId: 'hands-on-ai-tools',
    tags: [],
    publishedAt: '2026-10-12',
    createdAt: '2026-10-12',
  },
  {
    id: 'landing-4',
    title: 'Robots learning to cook from YouTube',
    content: 'New MIT research: robots watch a single cooking video and replicate the dish. The dexterity is wild. Commercial AI chefs might be five years away, not fifty.',
    source: 'instagram',
    sourceUrl: 'https://instagram.com',
    sourceHandle: 'futuretech_daily',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
    categoryId: 'stay-curious',
    tags: [],
    publishedAt: '2026-10-12',
    createdAt: '2026-10-12',
  },
  {
    id: 'landing-5',
    title: 'Prompt caching cut our API bill 90%',
    content: 'We were spending $14k/month on Anthropic. Turned on prompt caching for our system prompt and tool defs — monthly bill dropped to $1.4k. Same throughput, same quality.',
    source: 'twitter',
    sourceUrl: 'https://x.com',
    sourceHandle: '@swyx',
    categoryId: 'hands-on-ai-tools',
    tags: [],
    publishedAt: '2026-10-12',
    createdAt: '2026-10-12',
  },
  {
    id: 'landing-6',
    title: 'Build your first AI agent in 30 minutes',
    content: 'Walkthrough on building an autonomous AI agent end-to-end: memory, tools, and multi-step reasoning. Full code in the description so you can ship one tonight.',
    source: 'youtube',
    sourceUrl: 'https://youtube.com',
    sourceHandle: 'AI Engineering Hub',
    imageUrl: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
    categoryId: 'hands-on-ai-tools',
    tags: [],
    publishedAt: '2026-10-12',
    createdAt: '2026-10-12',
  },
]

export default function SocialCardRow() {
  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-stretch gap-5 pr-5" aria-hidden={hidden || undefined}>
      {SCOOPS.map((post) => (
        <div key={`${hidden ? 'b' : 'a'}-${post.id}`} className="w-[300px] shrink-0 sm:w-[320px]">
          <ScoopCard post={post} size="featured" interactive={false} />
        </div>
      ))}
    </div>
  )
  return (
    <div className="relative w-full overflow-hidden pt-2 pb-16">
      <div className="flex w-max marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}
