import type { Category } from './types'

export const categories: Category[] = [
  {
    id: 'ai-foundations',
    name: 'AI Foundations',
    description: 'Core concepts, model releases, and research breakthroughs shaping the AI landscape.',
    color: '#3B82F6',
  },
  {
    id: 'hands-on-ai-tools',
    name: 'Hands-On AI Tools',
    description: 'Practical tools, tutorials, and workflows to level up your AI skills.',
    color: '#F59E0B',
  },
  {
    id: 'ai-with-heart',
    name: 'AI with Heart',
    description: 'Human stories, ethics, and the social impact of AI on communities.',
    color: '#8B5CF6',
  },
  {
    id: 'stay-curious',
    name: 'Stay Curious',
    description: 'Weird, wonderful, and unexpected frontiers of AI exploration.',
    color: '#10B981',
  },
]

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id)
}
