import type { Proficiency } from './auth'
import type { Source } from './types'

export const PROFICIENCY_OPTIONS: ReadonlyArray<{
  id: Proficiency
  title: string
  description: string
}> = [
  {
    id: 'beginner',
    title: 'Beginner',
    description: 'New to AI — start with the fundamentals and big-picture stories.',
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    description: 'Comfortable with AI tools — get applied tutorials and trends.',
  },
  {
    id: 'advanced',
    title: 'Advanced',
    description: 'Deep in the weeds — research, benchmarks, and expert takes.',
  },
]

export const INTEREST_OPTIONS: ReadonlyArray<{ id: string; label: string }> = [
  { id: 'design', label: 'Design' },
  { id: 'dev', label: 'Dev' },
  { id: 'copywriting', label: 'Copywriting' },
  { id: 'product', label: 'Product' },
  { id: 'video', label: 'Video' },
  { id: 'animation', label: 'Animation' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'research', label: 'Research' },
  { id: 'photography', label: 'Photography' },
  { id: 'writing', label: 'Writing' },
  { id: 'music', label: 'Music' },
]

export const PLATFORM_OPTIONS: ReadonlyArray<{ id: Source; label: string }> = [
  { id: 'twitter', label: 'Twitter' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'blog', label: 'Blogs' },
]

export const ALL_PLATFORM_IDS: readonly Source[] = PLATFORM_OPTIONS.map((p) => p.id)

export const SIGNUP_STEPS = [
  { path: '/signup', label: 'Account' },
  { path: '/signup/proficiency', label: 'Proficiency' },
  { path: '/signup/interests', label: 'Interests' },
  { path: '/signup/platforms', label: 'Sources' },
] as const

export type SignupStepIndex = 0 | 1 | 2 | 3
