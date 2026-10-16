'use client'

import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { Play, Stop } from '@/components/ui/icons'

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
      className={`w-8 h-8 rounded-full inline-flex items-center justify-center transition-colors duration-200 ease-soft ${
        speaking
          ? 'bg-accent-soft text-accent-ink'
          : 'text-ink-3 hover:text-ink hover:bg-ink/5'
      }`}
    >
      {speaking ? <Stop size={14} /> : <Play size={14} />}
    </button>
  )
}
