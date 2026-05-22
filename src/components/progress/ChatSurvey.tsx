'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

const KICKOFF: ChatMessage = {
  role: 'user',
  content: "Hi! I'm ready for the proficiency survey.",
}

export default function ChatSurvey() {
  const router = useRouter()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [completeSummary, setCompleteSummary] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const hasKickoffStarted = useRef(false)

  useEffect(() => {
    if (hasKickoffStarted.current) return
    hasKickoffStarted.current = true
    void sendTurn([KICKOFF])
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, sending])

  async function sendTurn(history: ChatMessage[]) {
    setSending(true)
    setError(null)
    try {
      const res = await fetch('/api/survey/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(data.error ?? 'request_failed')
      }
      const data = (await res.json()) as {
        reply?: string
        complete?: boolean
        summary?: string
      }
      const reply = (data.reply ?? '').trim()
      if (reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
      }
      if (data.complete) {
        setCompleteSummary(data.summary ?? 'Survey complete.')
      }
    } catch (e) {
      const reason = e instanceof Error ? e.message : 'request_failed'
      setError(
        reason === 'ai_unavailable'
          ? 'Survey assistant is offline (no API key configured).'
          : 'Something went wrong. Try again.',
      )
    } finally {
      setSending(false)
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const text = input.trim()
    if (!text || sending || completeSummary) return
    const userMsg: ChatMessage = { role: 'user', content: text }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput('')
    void sendTurn([KICKOFF, ...next])
  }

  const visibleMessages = messages

  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col h-[70vh] min-h-[480px] max-h-[720px]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
        {visibleMessages.length === 0 && sending && <TypingBubble />}
        {visibleMessages.map((m, i) => (
          <Bubble key={i} role={m.role}>{m.content}</Bubble>
        ))}
        {sending && visibleMessages.length > 0 && <TypingBubble />}
        {completeSummary && (
          <div className="mt-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm font-semibold text-emerald-800">Survey complete</p>
            <p className="text-sm text-emerald-700 mt-1">{completeSummary}</p>
            <button
              type="button"
              onClick={() => router.push('/progress?survey=done')}
              className="mt-3 inline-flex items-center px-4 py-2 rounded-full bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
            >
              See my updated progress
            </button>
          </div>
        )}
        {error && (
          <p className="text-sm text-rose-600 bg-rose-50 rounded-xl px-3 py-2">{error}</p>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t border-zinc-100 p-3 flex items-end gap-2 bg-white"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              ;(e.currentTarget.form as HTMLFormElement | null)?.requestSubmit()
            }
          }}
          placeholder={completeSummary ? 'Survey complete' : 'Type your reply…'}
          rows={1}
          disabled={sending || !!completeSummary}
          className="flex-1 resize-none rounded-2xl bg-zinc-100 px-4 py-2.5 text-base sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={sending || !input.trim() || !!completeSummary}
          className="shrink-0 w-10 h-10 rounded-full bg-zinc-900 text-white inline-flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"
          aria-label="Send"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </form>
    </div>
  )
}

function Bubble({ role, children }: { role: 'user' | 'assistant'; children: string }) {
  const isUser = role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-900'
        }`}
      >
        {children}
      </div>
    </div>
  )
}

function TypingBubble() {
  return (
    <div className="flex justify-start">
      <div className="bg-zinc-100 rounded-2xl px-4 py-3 inline-flex gap-1">
        <Dot delay="0ms" />
        <Dot delay="120ms" />
        <Dot delay="240ms" />
      </div>
    </div>
  )
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="w-1.5 h-1.5 rounded-full bg-zinc-400 inline-block animate-bounce"
      style={{ animationDelay: delay }}
    />
  )
}
