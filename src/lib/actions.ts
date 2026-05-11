'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createPost, updatePost, deletePost } from './data'
import { addToWaitlist } from './waitlist'
import {
  verifyAdminPassword,
  setAdminSession,
  clearAdminSession,
  getUserSession,
  setUserSession,
  updateUserSession,
  clearUserSession,
  type Proficiency,
} from './auth'
import { ALL_PLATFORM_IDS, INTEREST_OPTIONS, PROFICIENCY_OPTIONS } from './signup'
import { categories } from './categories'
import type { Source } from './types'

const VALID_PROFICIENCIES = new Set<Proficiency>(PROFICIENCY_OPTIONS.map((o) => o.id))
const VALID_INTERESTS = new Set<string>(INTEREST_OPTIONS.map((o) => o.id))
const VALID_PLATFORMS = new Set<Source>(ALL_PLATFORM_IDS)
const VALID_CATEGORY_IDS = new Set<string>(categories.map((c) => c.id))

export async function adminLogin(formData: FormData) {
  const password = formData.get('password') as string
  if (!verifyAdminPassword(password)) {
    redirect('/admin/login?error=invalid')
  }
  await setAdminSession()
  redirect('/admin/posts')
}

export async function adminLogout() {
  await clearAdminSession()
  redirect('/admin/login')
}

export async function userLogin(formData: FormData) {
  const name = formData.get('name') as string
  if (!name?.trim()) {
    redirect('/login?error=name')
  }
  await setUserSession({ name: name.trim() })
  redirect('/dashboard')
}

export async function setUserName(formData: FormData) {
  const name = formData.get('name') as string
  if (!name?.trim()) {
    redirect('/dashboard?welcome=name')
  }
  await updateUserSession({ name: name.trim() })
  revalidatePath('/dashboard')
  redirect('/dashboard')
}

export async function userLogout() {
  await clearUserSession()
  redirect('/login')
}

export async function saveSettingsProficiency(formData: FormData) {
  const value = formData.get('proficiency') as string | null
  if (!value || !VALID_PROFICIENCIES.has(value as Proficiency)) {
    redirect('/settings?error=proficiency#proficiency')
  }
  await updateUserSession({ proficiency: value as Proficiency })
  redirect('/settings?saved=proficiency#proficiency')
}

export async function saveSettingsInterests(formData: FormData) {
  const selected = formData.getAll('interests').map(String).filter((v) => VALID_INTERESTS.has(v))
  if (selected.length === 0) {
    redirect('/settings?error=interests#interests')
  }
  await updateUserSession({ interests: selected })
  redirect('/settings?saved=interests#interests')
}

export async function saveSettingsPlatforms(formData: FormData) {
  const selected = formData
    .getAll('platforms')
    .map(String)
    .filter((v): v is Source => VALID_PLATFORMS.has(v as Source))
  await updateUserSession({ platforms: selected })
  redirect('/settings?saved=platforms#platforms')
}

export async function markPostViewed(postId: string) {
  if (typeof postId !== 'string' || !postId) return
  const current = await getUserSession()
  if (!current) return
  const existing = new Set(current.viewedPostIds ?? [])
  if (existing.has(postId)) return
  existing.add(postId)
  await updateUserSession({ viewedPostIds: Array.from(existing) })
}

export async function toggleSavedPost(postId: string) {
  if (typeof postId !== 'string' || !postId) return
  const current = await getUserSession()
  if (!current) return
  const existing = new Set(current.savedPostIds ?? [])
  if (existing.has(postId)) existing.delete(postId)
  else existing.add(postId)
  await updateUserSession({ savedPostIds: Array.from(existing) })
  revalidatePath('/dashboard')
  revalidatePath('/saved')
}

export async function saveSurveyResults(formData: FormData) {
  const map: Record<string, Proficiency> = {}
  for (const cat of categories) {
    if (!VALID_CATEGORY_IDS.has(cat.id)) continue
    const v = formData.get(`prof_${cat.id}`) as string | null
    if (v && VALID_PROFICIENCIES.has(v as Proficiency)) {
      map[cat.id] = v as Proficiency
    }
  }
  await updateUserSession({ categoryProficiency: map })
  revalidatePath('/progress')
  redirect('/progress?survey=done')
}

function parseTagsField(raw: string): string[] {
  return raw
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
}

export async function createPostAction(formData: FormData) {
  const post = await createPost({
    title: formData.get('title') as string,
    content: formData.get('content') as string,
    source: formData.get('source') as Source,
    sourceUrl: formData.get('sourceUrl') as string,
    sourceHandle: (formData.get('sourceHandle') as string) || undefined,
    imageUrl: (formData.get('imageUrl') as string) || undefined,
    categoryId: formData.get('categoryId') as string,
    tags: parseTagsField(formData.get('tags') as string),
    publishedAt: formData.get('publishedAt') as string,
  })
  revalidatePath('/dashboard')
  revalidatePath('/admin/posts')
  redirect(`/admin/posts`)
}

export async function updatePostAction(id: string, formData: FormData) {
  await updatePost(id, {
    title: formData.get('title') as string,
    content: formData.get('content') as string,
    source: formData.get('source') as Source,
    sourceUrl: formData.get('sourceUrl') as string,
    sourceHandle: (formData.get('sourceHandle') as string) || undefined,
    imageUrl: (formData.get('imageUrl') as string) || undefined,
    categoryId: formData.get('categoryId') as string,
    tags: parseTagsField(formData.get('tags') as string),
    publishedAt: formData.get('publishedAt') as string,
  })
  revalidatePath('/dashboard')
  revalidatePath('/admin/posts')
  redirect('/admin/posts')
}

export async function deletePostAction(id: string) {
  await deletePost(id)
  revalidatePath('/dashboard')
  revalidatePath('/admin/posts')
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function joinWaitlistAction(formData: FormData) {
  const raw = (formData.get('email') as string | null)?.trim() ?? ''
  if (!raw || !EMAIL_RE.test(raw)) {
    redirect('/waitlist?error=email')
  }
  const { added } = await addToWaitlist(raw)
  redirect(added ? '/waitlist?status=joined' : '/waitlist?status=already')
}
