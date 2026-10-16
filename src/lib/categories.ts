import type { Category } from './types'

export const categories: Category[] = [
  {
    id: 'ai-foundations',
    name: 'AI Foundations',
    description: 'Core concepts, model releases, and research breakthroughs shaping the AI landscape.',
    color: '#1a1916',
  },
  {
    id: 'hands-on-ai-tools',
    name: 'Hands-On AI Tools',
    description: 'Practical tools, tutorials, and workflows to level up your AI skills.',
    color: '#3d3a35',
  },
  {
    id: 'ai-with-heart',
    name: 'AI with Heart',
    description: 'Human stories, ethics, and the social impact of AI on communities.',
    color: '#55514a',
  },
  {
    id: 'stay-curious',
    name: 'Stay Curious',
    description: 'Weird, wonderful, and unexpected frontiers of AI exploration.',
    color: '#6b675f',
  },
]

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id)
}
