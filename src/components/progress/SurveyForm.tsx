'use client'

import { useState } from 'react'
import { categories } from '@/lib/categories'
import { PROFICIENCY_OPTIONS } from '@/lib/signup'
import type { Proficiency } from '@/lib/auth'
import Button from '@/components/ui/Button'

interface SurveyFormProps {
  initial?: Record<string, Proficiency>
  action: (formData: FormData) => void
}

export default function SurveyForm({ initial = {}, action }: SurveyFormProps) {
  const [answers, setAnswers] = useState<Record<string, Proficiency>>(initial)

  const allAnswered = categories.every((c) => answers[c.id])

  function setAnswer(catId: string, prof: Proficiency) {
    setAnswers((prev) => ({ ...prev, [catId]: prof }))
  }

  return (
    <form action={action} className="space-y-5">
      {categories.map((cat, idx) => (
        <fieldset
          key={cat.id}
          className="bg-white rounded-3xl shadow-sm p-6"
        >
          <legend className="contents">
            <p
              className="text-[11px] font-bold tracking-[0.14em] uppercase"
              style={{ color: cat.color }}
            >
              Question {idx + 1} of {categories.length}
            </p>
            <p className="text-lg font-bold text-zinc-900 mt-1">
              How would you rate yourself on <span style={{ color: cat.color }}>{cat.name}</span>?
            </p>
            <p className="text-sm text-zinc-500 mt-1">{cat.description}</p>
          </legend>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
            {PROFICIENCY_OPTIONS.map((opt) => {
              const active = answers[cat.id] === opt.id
              return (
                <label
                  key={opt.id}
                  className={`cursor-pointer rounded-2xl border p-3 transition-colors ${
                    active
                      ? 'border-zinc-900 bg-zinc-50'
                      : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50/40'
                  }`}
                >
                  <input
                    type="radio"
                    name={`prof_${cat.id}`}
                    value={opt.id}
                    checked={active}
                    onChange={() => setAnswer(cat.id, opt.id)}
                    className="sr-only"
                  />
                  <span className="block text-sm font-semibold text-zinc-900">{opt.title}</span>
                  <span className="block text-xs text-zinc-500 leading-relaxed mt-1">{opt.description}</span>
                </label>
              )
            })}
          </div>
        </fieldset>
      ))}

      <div className="bg-white rounded-3xl shadow-sm p-6 flex flex-col gap-3">
        <p className="text-xs text-zinc-400">
          {allAnswered
            ? 'All set — submit to save your levels.'
            : `Answer all ${categories.length} questions to submit.`}
        </p>
        <Button type="submit" size="lg" className="w-full" disabled={!allAnswered}>
          Save my levels
        </Button>
      </div>
    </form>
  )
}
