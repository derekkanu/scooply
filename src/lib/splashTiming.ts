export const DESKTOP_HOLD_MS = 1500
export const MOBILE_HOLD_MS = 6600
export const SPLASH_FADE_MS = 600

export function getSplashHoldMs(): number {
  if (typeof window === 'undefined') return DESKTOP_HOLD_MS
  return window.matchMedia('(max-width: 767px)').matches ? MOBILE_HOLD_MS : DESKTOP_HOLD_MS
}
