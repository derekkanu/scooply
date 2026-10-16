'use client'

import { useEffect, useRef } from 'react'

const MAX_SCALE = 16 // strongest displacement, in px
const GAIN = 0.45 // displacement per px of scroll per frame
const EASE = 0.14 // how quickly the ripple follows the scroll
const IDLE = 0.15 // below this the filter is switched off entirely

/**
 * A water-ripple distortion tied to scroll speed. An SVG displacement filter (horizontal
 * turbulence bands) is applied to `.sc-ripple` blocks while the page moves: the faster the
 * scroll, the deeper the wave; it eases out and the filter is removed at rest so text is
 * never left soft. Off under reduced motion.
 */
export default function ScrollRipple() {
  const turbulence = useRef<SVGFETurbulenceElement>(null)
  const displace = useRef<SVGFEDisplacementMapElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const root = document.documentElement
    let lastY = window.scrollY
    let scale = 0
    let frame = 0
    let t = 0

    const tick = () => {
      const y = window.scrollY
      const speed = Math.abs(y - lastY)
      lastY = y
      const target = Math.min(MAX_SCALE, speed * GAIN)
      scale += (target - scale) * EASE
      t += 0.04
      // the bands breathe a little while active, so the wave feels like it travels
      turbulence.current?.setAttribute('baseFrequency', `0.0015 ${(0.012 + 0.004 * Math.sin(t)).toFixed(4)}`)
      displace.current?.setAttribute('scale', scale.toFixed(2))

      if (scale < IDLE && speed === 0) {
        root.classList.remove('sc-rippling')
        displace.current?.setAttribute('scale', '0')
        frame = 0
        return
      }
      frame = requestAnimationFrame(tick)
    }

    const onScroll = () => {
      if (frame) return
      root.classList.add('sc-rippling')
      frame = requestAnimationFrame(tick)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
      root.classList.remove('sc-rippling')
    }
  }, [])

  return (
    <svg aria-hidden width="0" height="0" className="pointer-events-none absolute">
      <filter id="sc-ripple" x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
        <feTurbulence ref={turbulence} type="fractalNoise" baseFrequency="0.0015 0.012" numOctaves={1} seed={7} result="waves" />
        <feDisplacementMap ref={displace} in="SourceGraphic" in2="waves" scale="0" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  )
}
