import fs from 'fs/promises'
import path from 'path'
import type { Post } from './types'

const DATA_FILE = path.join(process.cwd(), 'src/data/posts.json')

export async function getPosts(): Promise<Post[]> {
  const raw = await fs.readFile(DATA_FILE, 'utf-8')
  const posts: Post[] = JSON.parse(raw)
  return posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

export async function getPostById(id: string): Promise<Post | undefined> {
  const posts = await getPosts()
  return posts.find((p) => p.id === id)
}

export async function createPost(post: Omit<Post, 'id' | 'createdAt'>): Promise<Post> {
  const posts = await getPosts()
  const newPost: Post = {
    ...post,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  posts.push(newPost)
  await fs.writeFile(DATA_FILE, JSON.stringify(posts, null, 2))
  return newPost
}

export async function updatePost(id: string, updates: Partial<Omit<Post, 'id' | 'createdAt'>>): Promise<Post | null> {
  const raw = await fs.readFile(DATA_FILE, 'utf-8')
  const posts: Post[] = JSON.parse(raw)
  const idx = posts.findIndex((p) => p.id === id)
  if (idx === -1) return null
  posts[idx] = { ...posts[idx], ...updates }
  await fs.writeFile(DATA_FILE, JSON.stringify(posts, null, 2))
  return posts[idx]
}

export async function deletePost(id: string): Promise<boolean> {
  const raw = await fs.readFile(DATA_FILE, 'utf-8')
  const posts: Post[] = JSON.parse(raw)
  const filtered = posts.filter((p) => p.id !== id)
  if (filtered.length === posts.length) return false
  await fs.writeFile(DATA_FILE, JSON.stringify(filtered, null, 2))
  return true
}

export async function filterPosts(categoryId?: string, query?: string): Promise<Post[]> {
  let posts = await getPosts()
  if (categoryId && categoryId !== 'all') {
    posts = posts.filter((p) => p.categoryId === categoryId)
  }
  if (query) {
    const q = query.toLowerCase()
    posts = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    )
  }
  return posts
}
