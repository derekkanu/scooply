import { cookies } from 'next/headers'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'admin123'
const ADMIN_COOKIE = 'scooply_admin'
const USER_COOKIE = 'scooply_user'

export type Proficiency = 'beginner' | 'intermediate' | 'advanced'

export interface UserSession {
  name?: string
  email?: string
  proficiency?: Proficiency
  interests?: string[]
  platforms?: string[]
  categoryProficiency?: Record<string, Proficiency>
  viewedPostIds?: string[]
  savedPostIds?: string[]
  likedPostIds?: string[]
  dislikedPostIds?: string[]
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies()
  return store.get(ADMIN_COOKIE)?.value === 'authenticated'
}

export async function setAdminSession(): Promise<void> {
  const store = await cookies()
  store.set(ADMIN_COOKIE, 'authenticated', {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function clearAdminSession(): Promise<void> {
  const store = await cookies()
  store.delete(ADMIN_COOKIE)
}

export function verifyAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD
}

export async function getUserSession(): Promise<UserSession | null> {
  const store = await cookies()
  const raw = store.get(USER_COOKIE)?.value
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    return typeof parsed === 'object' && parsed !== null ? (parsed as UserSession) : null
  } catch {
    // Legacy cookie that stored just the bare name string.
    return { name: raw }
  }
}

export async function setUserSession(session: UserSession): Promise<void> {
  const store = await cookies()
  store.set(USER_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
  })
}

export async function updateUserSession(patch: Partial<UserSession>): Promise<UserSession> {
  const current = (await getUserSession()) ?? {}
  const next: UserSession = { ...current, ...patch }
  await setUserSession(next)
  return next
}

export async function clearUserSession(): Promise<void> {
  const store = await cookies()
  store.delete(USER_COOKIE)
}
