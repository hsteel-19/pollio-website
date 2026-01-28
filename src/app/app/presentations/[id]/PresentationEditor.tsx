'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SlideEditor } from './SlideEditor'
import { AddSlideModal } from './AddSlideModal'
import { UpgradeModal } from '@/components/UpgradeModal'
import { FREE_TIER_LIMITS } from '@/lib/subscription'

type SlideType = 'welcome' | 'multiple_choice' | 'scale' | 'word_cloud' | 'open_ended'

interface Slide {
  id: string
  presentation_id: string
  type: SlideType
  title: string
  description: string | null
  position: number
  settings: Record<string, unknown>
}

interface Presentation {
  id: string
  title: string
  user_id: string
}

interface Session {
  id: string
  code: string
  started_at: string
  ended_at: string | null
  response_count?: number
  participant_count?: number
}

interface Props {
  presentation: Presentation
  initialSlides: Slide[]
  initialSessions?: Session[]
  isLocked?: boolean
  isPro?: boolean
  completedSessionCount?: number
  maxSessions?: number
}

const slideTypeLabels: Record<SlideType, string> = {
  welcome: 'Welcome',
  multiple_choice: 'Multiple Choice',
  scale: 'Scale',
  word_cloud: 'Word Cloud',
  open_ended: 'Open Ended',
}

const slideTypeIcons: Record<SlideType, React.ReactNode> = {
  welcome: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  ),
  multiple_choice: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  scale: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  word_cloud: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
    </svg>
  ),
  open_ended: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
    </svg>
  ),
}

export function PresentationEditor({
  presentation,
  initialSlides,
  initialSessions = [],
  isLocked = false,
  isPro = false,
  completedSessionCount = 0,
  maxSessions = 2,
}: Props) {
  const [title, setTitle] = useState(presentation.title)
  const [slides, setSlides] = useState<Slide[]>(initialSlides)
  const [selectedSlideId, setSelectedSlideId] = useState<string | null>(
    initialSlides[0]?.id || null
  )
  const [showAddModal, setShowAddModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [startingSession, setStartingSession] = useState(false)
  const [activeTab, setActiveTab] = useState<'create' | 'results'>(isLocked ? 'results' : 'create')
  const [sessions, setSessions] = useState<Session[]>(initialSessions)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [duplicating, setDuplicating] = useState(false)
  const router = useRouter()

  // Fetch sessions with response counts
  useEffect(() => {
    const fetchSessions = async () => {
      const supabase = createClient()
      const { data: sessionsData } = await supabase
        .from('sessions')
        .select('*')
        .eq('presentation_id', presentation.id)
        .order('started_at', { ascending: false })

      if (sessionsData) {
        // Get response counts for each session
        const sessionsWithCounts = await Promise.all(
          sessionsData.map(async (session) => {
            const { data: responses } = await supabase
              .from('responses')
              .select('participant_id')
              .eq('session_id', session.id)

            const participantIds = new Set(responses?.map(r => r.participant_id) || [])
            return {
              ...session,
              response_count: responses?.length || 0,
              participant_count: participantIds.size,
            }
          })
        )
        setSessions(sessionsWithCounts)
      }
    }
    fetchSessions()
  }, [presentation.id])

  const selectedSlide = slides.find((s) => s.id === selectedSlideId)

  const startSession = async () => {
    if (slides.length === 0) {
      alert('Add at least one slide before starting a session')
      return
    }

    // Check if locked (free user at session limit)
    if (isLocked) {
      setShowUpgradeModal(true)
      return
    }

    setStartingSession(true)
    const supabase = createClient()

    const { data, error } = await supabase
      .from('sessions')
      .insert({
        presentation_id: presentation.id,
        active_slide_id: slides[0].id,
      })
      .select()
      .single()

    if (data && !error) {
      router.push(`/app/present/${data.id}`)
    } else {
      alert('Failed to start session')
      setStartingSession(false)
    }
  }

  const saveTitle = async () => {
    const supabase = createClient()
    await supabase
      .from('presentations')
      .update({ title, updated_at: new Date().toISOString() })
      .eq('id', presentation.id)
  }

  const addSlide = async (type: SlideType) => {
    setSaving(true)
    const supabase = createClient()

    const defaultSettings: Record<SlideType, Record<string, unknown>> = {
      welcome: {},
      multiple_choice: { options: ['Option 1', 'Option 2'], allow_multiple: false },
      scale: { min: 1, max: 5, min_label: '', max_label: '' },
      word_cloud: { max_words: 3 },
      open_ended: { max_length: 500 },
    }

    const { data, error } = await supabase
      .from('slides')
      .insert({
        presentation_id: presentation.id,
        type,
        title: 'New question',
        position: slides.length,
        settings: defaultSettings[type],
      })
      .select()
      .single()

    if (data && !error) {
      setSlides([...slides, data])
      setSelectedSlideId(data.id)
    }

    setShowAddModal(false)
    setSaving(false)
  }

  const updateSlide = async (updatedSlide: Partial<Slide>) => {
    if (!selectedSlideId) return

    const supabase = createClient()
    await supabase
      .from('slides')
      .update(updatedSlide)
      .eq('id', selectedSlideId)

    setSlides(slides.map((s) =>
      s.id === selectedSlideId ? { ...s, ...updatedSlide } : s
    ))

    // Update presentation's updated_at
    await supabase
      .from('presentations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', presentation.id)
  }

  const deleteSlide = async (slideId: string) => {
    const supabase = createClient()
    await supabase.from('slides').delete().eq('id', slideId)

    const newSlides = slides.filter((s) => s.id !== slideId)
    setSlides(newSlides)

    if (selectedSlideId === slideId) {
      setSelectedSlideId(newSlides[0]?.id || null)
    }
  }

  const moveSlide = async (slideId: string, direction: 'up' | 'down') => {
    const index = slides.findIndex((s) => s.id === slideId)
    const slide = slides[index]

    // Welcome slides cannot be moved
    if (slide.type === 'welcome') {
      return
    }

    // Check if first slide is welcome slide
    const hasWelcomeSlide = slides[0]?.type === 'welcome'
    const minMoveIndex = hasWelcomeSlide ? 1 : 0

    if (
      (direction === 'up' && index <= minMoveIndex) ||
      (direction === 'down' && index === slides.length - 1)
    ) {
      return
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1
    const newSlides = [...slides]
    const [removed] = newSlides.splice(index, 1)
    newSlides.splice(newIndex, 0, removed)

    // Update positions
    const updatedSlides = newSlides.map((s, i) => ({ ...s, position: i }))
    setSlides(updatedSlides)

    // Save to database
    const supabase = createClient()
    for (const slide of updatedSlides) {
      await supabase
        .from('slides')
        .update({ position: slide.position })
        .eq('id', slide.id)
    }
  }

  const duplicatePresentation = async () => {
    setDuplicating(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setDuplicating(false)
      return
    }

    // Check presentation limit for free users
    if (!isPro) {
      const { count } = await supabase
        .from('presentations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      if ((count || 0) >= FREE_TIER_LIMITS.maxPresentations) {
        // At presentation limit, show upgrade modal
        setDuplicating(false)
        setShowUpgradeModal(true)
        return
      }
    }

    // Create new presentation
    const { data: newPresentation, error: presentationError } = await supabase
      .from('presentations')
      .insert({
        user_id: user.id,
        title: `${title} (Copy)`,
      })
      .select()
      .single()

    if (presentationError || !newPresentation) {
      alert('Failed to duplicate presentation')
      setDuplicating(false)
      return
    }

    // Copy all slides
    const slidesToInsert = slides.map((slide) => ({
      presentation_id: newPresentation.id,
      type: slide.type,
      title: slide.title,
      description: slide.description,
      position: slide.position,
      settings: slide.settings,
    }))

    await supabase.from('slides').insert(slidesToInsert)

    // Navigate to the new presentation
    router.push(`/app/presentations/${newPresentation.id}`)
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col -m-8">
      {/* Locked banner */}
      {isLocked && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div>
                <span className="font-medium text-amber-800">This presentation is locked</span>
                <span className="text-amber-700 ml-2">
                  You&apos;ve used {completedSessionCount}/{maxSessions} sessions on the free plan.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={duplicatePresentation}
                disabled={duplicating}
                className="text-sm text-amber-700 hover:text-amber-900 font-medium"
              >
                {duplicating ? 'Duplicating...' : 'Duplicate to edit'}
              </button>
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="bg-primary hover:bg-primary-dark text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
              >
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-background border-b border-text-secondary/10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/app/presentations"
              className="text-text-secondary hover:text-text-primary"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            {isLocked ? (
              <span className="text-xl font-semibold px-2 py-1 -ml-2">{title}</span>
            ) : (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={saveTitle}
                className="text-xl font-semibold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-2 py-1 -ml-2"
              />
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-text-secondary">
              {slides.length} slide{slides.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={startSession}
              disabled={startingSession || slides.length === 0}
              className="bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {startingSession ? 'Starting...' : 'Start session'}
            </button>
          </div>
        </div>

        {/* Create / Results tabs */}
        <div className="px-6 flex gap-6">
          <button
            onClick={() => setActiveTab('create')}
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'create'
                ? 'text-primary border-primary'
                : 'text-text-secondary border-transparent hover:text-text-primary'
            }`}
          >
            Create
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'results'
                ? 'text-primary border-primary'
                : 'text-text-secondary border-transparent hover:text-text-primary'
            }`}
          >
            Results
            {sessions.length > 0 && (
              <span className="bg-text-secondary/10 text-text-secondary text-xs px-1.5 py-0.5 rounded">
                {sessions.length}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {activeTab === 'create' ? (
          <>
            {/* Slide list sidebar */}
            <div className="w-72 bg-background border-r border-text-secondary/10 flex flex-col">
              <div className="p-4 border-b border-text-secondary/10">
                <button
                  onClick={() => setShowAddModal(true)}
                  disabled={isLocked}
                  className="w-full bg-primary hover:bg-primary-dark disabled:bg-primary/50 disabled:cursor-not-allowed text-white py-2.5 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add slide
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    onClick={() => setSelectedSlideId(slide.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors group ${
                      selectedSlideId === slide.id
                        ? 'bg-primary/10 border-2 border-primary'
                        : 'bg-surface hover:bg-surface/80 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xs text-text-secondary font-medium mt-0.5">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-text-secondary">
                            {slideTypeIcons[slide.type]}
                          </span>
                          <span className="text-xs text-text-secondary">
                            {slideTypeLabels[slide.type]}
                          </span>
                        </div>
                        <p className="text-sm text-text-primary truncate">
                          {slide.title}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}

                {slides.length === 0 && (
                  <div className="text-center py-8 text-text-secondary text-sm">
                    No slides yet.
                    <br />
                    Click "Add slide" to get started.
                  </div>
                )}
              </div>
            </div>

            {/* Slide editor */}
            <div className="flex-1 bg-surface overflow-y-auto">
              {selectedSlide ? (
                <SlideEditor
                  slide={selectedSlide}
                  onUpdate={updateSlide}
                  onDelete={() => deleteSlide(selectedSlide.id)}
                  onMoveUp={() => moveSlide(selectedSlide.id, 'up')}
                  onMoveDown={() => moveSlide(selectedSlide.id, 'down')}
                  isFirst={
                    slides.findIndex((s) => s.id === selectedSlide.id) === 0 ||
                    (slides[0]?.type === 'welcome' && slides.findIndex((s) => s.id === selectedSlide.id) === 1)
                  }
                  isLast={slides.findIndex((s) => s.id === selectedSlide.id) === slides.length - 1}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-text-secondary">
                  <div className="text-center">
                    <p className="mb-4">Select a slide to edit or add a new one</p>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="text-primary hover:underline"
                    >
                      Add your first slide
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Results tab content */
          <div className="flex-1 bg-surface overflow-y-auto p-8">
            <div className="max-w-4xl mx-auto">
              {sessions.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-text-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-text-primary mb-2">No sessions yet</h3>
                  <p className="text-text-secondary mb-6">Start a session to collect responses from your audience</p>
                  <button
                    onClick={startSession}
                    disabled={startingSession || slides.length === 0}
                    className="bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
                  >
                    Start your first session
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-text-primary mb-6">Past Sessions</h2>
                  {sessions.map((session) => (
                    <Link
                      key={session.id}
                      href={`/app/history/${session.id}`}
                      className="block bg-background rounded-xl p-6 border border-text-secondary/10 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium">
                              {session.code}
                            </span>
                            {!session.ended_at && (
                              <span className="bg-success/10 text-success text-xs px-2 py-1 rounded-full font-medium">
                                Live
                              </span>
                            )}
                          </div>
                          <p className="text-text-secondary text-sm">
                            {new Date(session.started_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-text-primary">{session.participant_count || 0}</div>
                          <p className="text-text-secondary text-sm">participants</p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-text-secondary/10 flex items-center justify-between text-sm">
                        <span className="text-text-secondary">{session.response_count || 0} responses</span>
                        <span className="text-primary font-medium flex items-center gap-1">
                          View results
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add slide modal */}
      {showAddModal && (
        <AddSlideModal
          onAdd={addSlide}
          onClose={() => setShowAddModal(false)}
          saving={saving}
        />
      )}

      {/* Upgrade modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </div>
  )
}
