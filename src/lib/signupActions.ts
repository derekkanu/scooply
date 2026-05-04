'use server'

import { redirect } from 'next/navigation'
import { updateUserSession, type Proficiency } from './auth'
import { ALL_PLATFORM_IDS, INTEREST_OPTIONS, PROFICIENCY_OPTIONS } from './signup'
import type { Source } from './types'

const VALID_PROFICIENCIES = new Set<Proficiency>(PROFICIENCY_OPTIONS.map((o) => o.id))
const VALID_INTERESTS = new Set<string>(INTEREST_OPTIONS.map((o) => o.id))
const VALID_PLATFORMS = new Set<Source>(ALL_PLATFORM_IDS)

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export async function saveSignupAccount(formData: FormData) {
  const email = (formData.get('email') as string | null)?.trim() ?? ''
  const password = (formData.get('password') as string | null) ?? ''

  if (!isValidEmail(email)) {
    redirect('/signup?error=email')
  }
  if (password.length < 6) {
    redirect('/signup?error=password')
  }

  // Prototype: we capture the email but don't store the password.
  await updateUserSession({ email })
  redirect('/signup/proficiency')
}

export async function saveSignupProficiency(formData: FormData) {
  const value = formData.get('proficiency') as string | null
  if (!value || !VALID_PROFICIENCIES.has(value as Proficiency)) {
    redirect('/signup/proficiency?error=required')
  }

  await updateUserSession({ proficiency: value as Proficiency })
  redirect('/signup/interests')
}

export async function saveSignupInterests(formData: FormData) {
  const selected = formData.getAll('interests').map(String).filter((v) => VALID_INTERESTS.has(v))

  if (selected.length === 0) {
    redirect('/signup/interests?error=required')
  }

  await updateUserSession({ interests: selected })
  redirect('/signup/platforms')
}

export async function saveSignupPlatforms(formData: FormData) {
  const selected = formData
    .getAll('platforms')
    .map(String)
    .filter((v): v is Source => VALID_PLATFORMS.has(v as Source))

  // The user always reaches the dashboard from here. Welcome step asks for
  // their name — we leave that field empty in the session on purpose.
  await updateUserSession({ platforms: selected })
  redirect('/dashboard')
}

export async function skipSignupPlatforms() {
  await updateUserSession({ platforms: [...ALL_PLATFORM_IDS] })
  redirect('/dashboard')
}
