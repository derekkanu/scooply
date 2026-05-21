import { NextResponse } from 'next/server'
import type { Content, FunctionDeclaration } from '@google/genai'
import { categories } from '@/lib/categories'
import { INTEREST_OPTIONS, PROFICIENCY_OPTIONS } from '@/lib/signup'
import { getGemini, SURVEY_MODEL } from '@/lib/gemini'
import {
  getUserSession,
  updateUserSession,
  type Proficiency,
  type UserSession,
} from '@/lib/auth'

const PROF_IDS = PROFICIENCY_OPTIONS.map((p) => p.id)
const CATEGORY_IDS = categories.map((c) => c.id)
const INTEREST_IDS = INTEREST_OPTIONS.map((i) => i.id)

const SYSTEM_PROMPT = `You are Scout, Scooply's friendly proficiency-survey assistant. Your job is to have a short, natural conversation that figures out the user's level (beginner / intermediate / advanced) in each of these four AI content categories, and which interest areas matter most to them.

Categories (use these exact IDs when submitting):
${categories.map((c) => `- ${c.id}: ${c.name} — ${c.description}`).join('\n')}

Proficiency levels:
${PROFICIENCY_OPTIONS.map((p) => `- ${p.id}: ${p.description}`).join('\n')}

Interest options (use these exact IDs):
${INTEREST_OPTIONS.map((i) => `- ${i.id}: ${i.label}`).join(', ')}

Rules:
- Keep each message to 1–2 short sentences. This is a chat, not an essay.
- Open with a quick warm greeting and explain you'll ask a few questions.
- Ask about ONE category at a time. Cover all four. You can group naturally related questions but never dump them all at once.
- Infer the proficiency level from the user's reply — don't make them say the exact word "beginner". If their reply is vague, ask one quick clarifier.
- After categories, ask which work areas / interests they'd like more posts about (free-form is fine; map their reply to the closest interest IDs).
- When you have a level for all four categories AND at least one interest, call the submit_survey tool with the structured results. Do NOT also send a text message in the same turn — the UI will show a completion screen after the tool call.
- Never invent categories or interests. Only use the IDs listed above.`

const SUBMIT_TOOL: FunctionDeclaration = {
  name: 'submit_survey',
  description:
    "Submit the user's assessed proficiency per category and their selected interests. Only call this once you have gathered enough signal in the conversation.",
  parametersJsonSchema: {
    type: 'object',
    properties: {
      categoryProficiency: {
        type: 'object',
        description: 'Map of category id to proficiency level.',
        properties: Object.fromEntries(
          CATEGORY_IDS.map((id) => [id, { type: 'string', enum: PROF_IDS }]),
        ),
        required: CATEGORY_IDS,
        additionalProperties: false,
      },
      interests: {
        type: 'array',
        description: 'Interest ids the user cares about most.',
        items: { type: 'string', enum: INTEREST_IDS },
        minItems: 1,
      },
      summary: {
        type: 'string',
        description:
          'One short friendly sentence (max 20 words) summarising what you learned about the user. Shown to them.',
      },
    },
    required: ['categoryProficiency', 'interests', 'summary'],
  },
}

interface IncomingMessage {
  role: 'user' | 'assistant'
  content: string
}

function toGeminiContents(raw: unknown): Content[] {
  if (!Array.isArray(raw)) return []
  const out: Content[] = []
  for (const m of raw as IncomingMessage[]) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant')) continue
    const text = typeof m.content === 'string' ? m.content.trim() : ''
    if (!text) continue
    out.push({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text }],
    })
  }
  return out
}

function validateSurveyInput(input: unknown): {
  categoryProficiency: Record<string, Proficiency>
  interests: string[]
  summary: string
} | null {
  if (!input || typeof input !== 'object') return null
  const obj = input as Record<string, unknown>

  const profRaw = obj.categoryProficiency
  if (!profRaw || typeof profRaw !== 'object') return null
  const prof: Record<string, Proficiency> = {}
  for (const id of CATEGORY_IDS) {
    const v = (profRaw as Record<string, unknown>)[id]
    if (typeof v !== 'string' || !PROF_IDS.includes(v as Proficiency)) return null
    prof[id] = v as Proficiency
  }

  const interestsRaw = obj.interests
  if (!Array.isArray(interestsRaw)) return null
  const interests = interestsRaw.filter(
    (v): v is string => typeof v === 'string' && INTEREST_IDS.includes(v),
  )
  if (interests.length === 0) return null

  const summary = typeof obj.summary === 'string' ? obj.summary.slice(0, 240) : ''

  return { categoryProficiency: prof, interests, summary }
}

export async function POST(request: Request) {
  const session = await getUserSession()
  if (!session) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const contents = toGeminiContents((body as { messages?: unknown }).messages)

  let client
  try {
    client = getGemini()
  } catch {
    return NextResponse.json({ error: 'ai_unavailable' }, { status: 503 })
  }

  const response = await client.models.generateContent({
    model: SURVEY_MODEL,
    contents,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      maxOutputTokens: 600,
      tools: [{ functionDeclarations: [SUBMIT_TOOL] }],
    },
  })

  const assistantText = (response.text ?? '').trim()
  const calls = response.functionCalls ?? []

  let complete = false
  let summary = ''
  const patch: Partial<UserSession> = {}

  for (const call of calls) {
    if (call.name !== 'submit_survey') continue
    const parsed = validateSurveyInput(call.args)
    if (parsed) {
      patch.categoryProficiency = parsed.categoryProficiency
      patch.interests = parsed.interests
      summary = parsed.summary
      complete = true
      break
    }
  }

  if (complete) {
    await updateUserSession(patch)
  }

  return NextResponse.json({
    reply: assistantText,
    complete,
    summary,
  })
}
