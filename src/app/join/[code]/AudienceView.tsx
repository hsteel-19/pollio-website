'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type SlideType = 'welcome' | 'content' | 'multiple_choice' | 'scale' | 'word_cloud' | 'open_ended'

interface Slide {
  id: string
  type: SlideType
  title: string
  description: string | null
  settings: Record<string, unknown>
}

interface Session {
  id: string
  code: string
  status: string
  active_slide_id: string | null
}

interface Props {
  session: Session
  initialSlide: Slide | null
}

// Generate or retrieve participant ID from localStorage
function getParticipantId(): string {
  if (typeof window === 'undefined') return ''

  let participantId = localStorage.getItem('pollio_participant_id')
  if (!participantId) {
    participantId = crypto.randomUUID()
    localStorage.setItem('pollio_participant_id', participantId)
  }
  return participantId
}

export function AudienceView({ session, initialSlide }: Props) {
  const [currentSlide, setCurrentSlide] = useState<Slide | null>(initialSlide)
  const [sessionStatus, setSessionStatus] = useState(session.status)
  const [hasResponded, setHasResponded] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [participantId, setParticipantId] = useState('')

  useEffect(() => {
    setParticipantId(getParticipantId())
  }, [])

  // Check if already responded to current slide
  useEffect(() => {
    if (!currentSlide || !participantId) return

    const checkExistingResponse = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('responses')
        .select('id')
        .eq('session_id', session.id)
        .eq('slide_id', currentSlide.id)
        .eq('participant_id', participantId)
        .single()

      setHasResponded(!!data)
    }

    checkExistingResponse()
  }, [currentSlide?.id, participantId, session.id])

  // Subscribe to session changes (active slide, status)
  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel('audience-session')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'sessions',
          filter: `id=eq.${session.id}`,
        },
        async (payload) => {
          const updated = payload.new as Session
          setSessionStatus(updated.status)

          // Fetch new active slide if changed
          if (updated.active_slide_id && updated.active_slide_id !== currentSlide?.id) {
            const { data: newSlide } = await supabase
              .from('slides')
              .select('*')
              .eq('id', updated.active_slide_id)
              .single()

            if (newSlide) {
              setCurrentSlide(newSlide)
              setHasResponded(false)
            }
          }
        }
      )
      .subscribe()

    // Polling fallback for session status (in case realtime doesn't work due to RLS)
    const pollInterval = setInterval(async () => {
      const { data } = await supabase
        .from('sessions')
        .select('status, active_slide_id')
        .eq('id', session.id)
        .single()

      if (data) {
        if (data.status === 'ended') {
          setSessionStatus('ended')
        } else if (data.active_slide_id && data.active_slide_id !== currentSlide?.id) {
          // Fetch new slide if changed
          const { data: newSlide } = await supabase
            .from('slides')
            .select('*')
            .eq('id', data.active_slide_id)
            .single()

          if (newSlide) {
            setCurrentSlide(newSlide)
            setHasResponded(false)
          }
        }
      }
    }, 3000) // Poll every 3 seconds

    return () => {
      supabase.removeChannel(channel)
      clearInterval(pollInterval)
    }
  }, [session.id, currentSlide?.id])

  const submitResponse = async (answer: Record<string, unknown>) => {
    if (!currentSlide || !participantId) return

    setSubmitting(true)
    const supabase = createClient()

    const { error } = await supabase.from('responses').insert({
      session_id: session.id,
      slide_id: currentSlide.id,
      participant_id: participantId,
      answer,
    })

    setSubmitting(false)

    if (!error) {
      setHasResponded(true)
    }
  }

  // Session ended
  if (sessionStatus === 'ended') {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-text-primary mb-2">
          Session ended
        </h1>
        <p className="text-text-secondary mb-6">
          Thanks for participating!
        </p>

        <a
          href="https://pollio.se"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-medium transition-colors"
        >
          Create your own Pollio
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    )
  }

  // No active slide
  if (!currentSlide) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-primary animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-text-primary mb-2">
          Waiting for presenter
        </h1>
        <p className="text-text-secondary">
          The session will begin shortly
        </p>
      </div>
    )
  }

  // Already responded
  if (hasResponded) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-text-primary mb-2">
          Response submitted!
        </h1>
        <p className="text-text-secondary">
          Waiting for the next question...
        </p>
      </div>
    )
  }

  // Welcome slide - show waiting state
  if (currentSlide.type === 'welcome') {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          You&apos;re in!
        </h1>
        <p className="text-text-secondary text-lg mb-2">
          {currentSlide.title}
        </p>
        <p className="text-text-secondary">
          The presenter will start the questions shortly
        </p>
      </div>
    )
  }

  // Content slide - no interaction, just show info
  if (currentSlide.type === 'content') {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-text-primary mb-2">
          {currentSlide.title}
        </h1>
        <p className="text-text-secondary">
          Look at the presentation screen
        </p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-xl font-semibold text-text-primary mb-2 text-center">
        {currentSlide.title}
      </h1>
      {currentSlide.description && (
        <p className="text-text-secondary text-center mb-6">
          {currentSlide.description}
        </p>
      )}

      <div className="mt-6">
        {currentSlide.type === 'multiple_choice' && (
          <MultipleChoiceInput
            settings={currentSlide.settings}
            onSubmit={submitResponse}
            submitting={submitting}
          />
        )}
        {currentSlide.type === 'scale' && (
          <ScaleInput
            settings={currentSlide.settings}
            onSubmit={submitResponse}
            submitting={submitting}
          />
        )}
        {currentSlide.type === 'word_cloud' && (
          <WordCloudInput
            settings={currentSlide.settings}
            onSubmit={submitResponse}
            submitting={submitting}
          />
        )}
        {currentSlide.type === 'open_ended' && (
          <OpenEndedInput
            settings={currentSlide.settings}
            onSubmit={submitResponse}
            submitting={submitting}
          />
        )}
      </div>
    </div>
  )
}

// Color palette for multiple choice options (must match SlideEditor)
const OPTION_COLORS = [
  { name: 'Teal', bg: 'bg-teal-500', light: 'bg-teal-50', border: 'border-teal-500' },
  { name: 'Blue', bg: 'bg-blue-500', light: 'bg-blue-50', border: 'border-blue-500' },
  { name: 'Purple', bg: 'bg-purple-500', light: 'bg-purple-50', border: 'border-purple-500' },
  { name: 'Pink', bg: 'bg-pink-500', light: 'bg-pink-50', border: 'border-pink-500' },
  { name: 'Orange', bg: 'bg-orange-500', light: 'bg-orange-50', border: 'border-orange-500' },
  { name: 'Green', bg: 'bg-green-500', light: 'bg-green-50', border: 'border-green-500' },
  { name: 'Red', bg: 'bg-red-500', light: 'bg-red-50', border: 'border-red-500' },
  { name: 'Yellow', bg: 'bg-yellow-500', light: 'bg-yellow-50', border: 'border-yellow-500' },
]

// Multiple Choice Input
function MultipleChoiceInput({
  settings,
  onSubmit,
  submitting,
}: {
  settings: Record<string, unknown>
  onSubmit: (answer: Record<string, unknown>) => void
  submitting: boolean
}) {
  const options = (settings.options as string[]) || []
  const optionColors = (settings.option_colors as number[]) || options.map((_, i) => i % OPTION_COLORS.length)
  const allowMultiple = (settings.allow_multiple as boolean) || false
  const [selected, setSelected] = useState<number[]>([])

  const toggleOption = (index: number) => {
    if (allowMultiple) {
      setSelected((prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index]
      )
    } else {
      setSelected([index])
    }
  }

  return (
    <div className="space-y-3">
      {options.map((option, index) => {
        const colorIndex = optionColors[index] ?? (index % OPTION_COLORS.length)
        const color = OPTION_COLORS[colorIndex]
        const isSelected = selected.includes(index)
        
        return (
          <button
            key={index}
            onClick={() => toggleOption(index)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
              isSelected
                ? `${color.border} ${color.light}`
                : 'border-text-secondary/20 hover:border-text-secondary/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-sm ${
                  isSelected ? color.bg : 'bg-text-secondary/20'
                }`}
              >
                {String.fromCharCode(65 + index)}
              </div>
              <span className="text-text-primary">{option}</span>
            </div>
          </button>
        )
      })}

      <button
        onClick={() => onSubmit({ selected })}
        disabled={selected.length === 0 || submitting}
        className="w-full bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white py-4 rounded-xl font-semibold mt-4 transition-colors"
      >
        {submitting ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  )
}

// Scale Input
function ScaleInput({
  settings,
  onSubmit,
  submitting,
}: {
  settings: Record<string, unknown>
  onSubmit: (answer: Record<string, unknown>) => void
  submitting: boolean
}) {
  const min = (settings.min as number) || 1
  const max = (settings.max as number) || 5
  const minLabel = (settings.min_label as string) || ''
  const maxLabel = (settings.max_label as string) || ''
  const [value, setValue] = useState<number | null>(null)

  return (
    <div>
      <div className="flex justify-between text-sm text-text-secondary mb-2">
        <span>{minLabel || min}</span>
        <span>{maxLabel || max}</span>
      </div>

      <div className="flex gap-2 justify-center">
        {Array.from({ length: max - min + 1 }, (_, i) => {
          const num = min + i
          return (
            <button
              key={num}
              onClick={() => setValue(num)}
              className={`w-12 h-12 rounded-xl font-semibold transition-all ${
                value === num
                  ? 'bg-primary text-white'
                  : 'bg-surface border-2 border-text-secondary/20 text-text-primary hover:border-primary'
              }`}
            >
              {num}
            </button>
          )
        })}
      </div>

      <button
        onClick={() => value !== null && onSubmit({ value })}
        disabled={value === null || submitting}
        className="w-full bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white py-4 rounded-xl font-semibold mt-6 transition-colors"
      >
        {submitting ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  )
}

// Word Cloud Input
function WordCloudInput({
  settings,
  onSubmit,
  submitting,
}: {
  settings: Record<string, unknown>
  onSubmit: (answer: Record<string, unknown>) => void
  submitting: boolean
}) {
  const maxWords = (settings.max_words as number) || 3
  const [words, setWords] = useState<string[]>(Array(maxWords).fill(''))

  const updateWord = (index: number, value: string) => {
    const newWords = [...words]
    newWords[index] = value
    setWords(newWords)
  }

  const filledWords = words.filter((w) => w.trim())

  return (
    <div className="space-y-3">
      {words.map((word, index) => (
        <input
          key={index}
          type="text"
          value={word}
          onChange={(e) => updateWord(index, e.target.value)}
          placeholder={`Word ${index + 1}`}
          className="w-full px-4 py-3 border-2 border-text-secondary/20 rounded-xl focus:border-primary focus:outline-none"
        />
      ))}

      <button
        onClick={() => onSubmit({ words: filledWords })}
        disabled={filledWords.length === 0 || submitting}
        className="w-full bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white py-4 rounded-xl font-semibold mt-4 transition-colors"
      >
        {submitting ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  )
}

// Open Ended Input
function OpenEndedInput({
  settings,
  onSubmit,
  submitting,
}: {
  settings: Record<string, unknown>
  onSubmit: (answer: Record<string, unknown>) => void
  submitting: boolean
}) {
  const maxLength = (settings.max_length as number) || 500
  const [text, setText] = useState('')

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, maxLength))}
        placeholder="Type your answer..."
        rows={4}
        className="w-full px-4 py-3 border-2 border-text-secondary/20 rounded-xl focus:border-primary focus:outline-none resize-none"
      />
      <div className="text-right text-sm text-text-secondary mt-1">
        {text.length}/{maxLength}
      </div>

      <button
        onClick={() => onSubmit({ text })}
        disabled={!text.trim() || submitting}
        className="w-full bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white py-4 rounded-xl font-semibold mt-4 transition-colors"
      >
        {submitting ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  )
}
