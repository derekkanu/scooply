'use client'

import { useEffect, useRef, useState, type MouseEvent } from 'react'

interface ListenButtonProps {
  title: string
  content: string
}

export default function ListenButton({ title, content }: ListenButtonProps) {
  const [speaking, setSpeaking] = useState(false)
  const speakingRef = useRef(false)

  useEffect(() => {
    return () => {
      // Stop our narration if this card unmounts mid-speech.
      if (speakingRef.current && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    e.stopPropagation()
    if (!('speechSynthesis' in window)) return
    const synth = window.speechSynthesis

    if (speaking) {
      synth.cancel()
      speakingRef.current = false
      setSpeaking(false)
      return
    }

    // Cancel anything another card may be reading before we start.
    synth.cancel()
    const utterance = new SpeechSynthesisUtterance(`${title}. ${content}`)
    utterance.rate = 1
    utterance.onend = () => {
      speakingRef.current = false
      setSpeaking(false)
    }
    utterance.onerror = () => {
      speakingRef.current = false
      setSpeaking(false)
    }
    speakingRef.current = true
    setSpeaking(true)
    synth.speak(utterance)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={speaking ? 'Stop reading scoop aloud' : 'Read scoop aloud'}
      aria-pressed={speaking}
      className={`w-8 h-8 rounded-full inline-flex items-center justify-center transition-colors ${
        speaking
          ? 'bg-sky-500/15 text-sky-600'
          : 'text-zinc-500 hover:text-zinc-900 hover:bg-white/40'
      }`}
    >
      {speaking ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <rect x="6" y="6" width="12" height="12" rx="2" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M8 5.14v13.72a1 1 0 0 0 1.52.85l11.2-6.86a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14Z" />
        </svg>
      )}
    </button>
  )
}
