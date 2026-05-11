import fs from 'fs/promises'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'src/data/waitlist.json')

export interface WaitlistEntry {
  email: string
  joinedAt: string
}

export async function getWaitlist(): Promise<WaitlistEntry[]> {
  const raw = await fs.readFile(DATA_FILE, 'utf-8')
  return JSON.parse(raw) as WaitlistEntry[]
}

export async function addToWaitlist(email: string): Promise<{ added: boolean }> {
  const list = await getWaitlist()
  const normalized = email.trim().toLowerCase()
  if (list.some((e) => e.email === normalized)) {
    return { added: false }
  }
  list.push({ email: normalized, joinedAt: new Date().toISOString() })
  await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2))
  return { added: true }
}
