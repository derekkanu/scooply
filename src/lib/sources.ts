import type { Source } from './types'

/** How each source platform is named to readers. */
export const SOURCE_LABEL: Record<Source, string> = {
  twitter: 'X',
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  blog: 'Blog',
}
