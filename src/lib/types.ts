export type Source = 'twitter' | 'linkedin' | 'instagram' | 'youtube' | 'tiktok' | 'blog'

export interface Post {
  id: string
  title: string
  content: string
  source: Source
  sourceUrl: string
  sourceHandle?: string
  imageUrl?: string
  categoryId: string
  tags: string[]
  publishedAt: string
  createdAt: string
}

export interface Category {
  id: string
  name: string
  description: string
  color: string
}
