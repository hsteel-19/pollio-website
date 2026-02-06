'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'
import Image from 'next/image'
import { ResultsDisplay } from './ResultsDisplay'

type SlideType = 'welcome' | 'content' | 'multiple_choice' | 'scale' | 'word_cloud' | 'open_ended'

interface Slide {
  id: string
  type: SlideType
  title: string
  description: string | null
  position: number
  settings: Record<string, unknown>
}

interface Session {
  id: string
  code: string
  status: string
  active_slide_id: string | null
  presentation_id: string
  participant_count: number
  presentations: {
    id: string
    title: string
  }
}

interface Response {
  id: string
  slide_id: string
  participant_id: string
  answer: Record<string, unknown>
}

interface Props {
  session: Session
  slides: Slide[]
  initialResponses: Response[]
}

export function PresenterView({ session, slides, initialResponses }: Props) {
  const [activeSlideId, setActiveSlideId] = useState(session.active_slide_id)
  const [responses, setResponses] = useState<Response[]>(initialResponses)
  const [sessionStatus, setSessionStatus] = useState(session.status)
  
  // Calculate unique participant count from responses
  const participantCount = new Set(responses.map(r => r.participant_id)).size
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const activeSlide = slides.find((s) => s.id === activeSlideId)
  const activeSlideIndex = slides.findIndex((s) => s.id === activeSlideId)
  const slideResponses = responses.filter((r) => r.slide_id === activeSlideId)
  const isWelcomeSlide = activeSlide?.type === 'welcome'

  // Request fullscreen on mount and hide sidebar
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        if (containerRef.current && document.fullscreenEnabled) {
          await containerRef.current.requestFullscreen()
          setIsFullscreen(true)
          setShowSidebar(false) // Hide sidebar when entering fullscreen
        }
      } catch {
        // Fullscreen request failed or was denied, continue without it
      }
    }
    enterFullscreen()

    // Listen for fullscreen changes
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement
      setIsFullscreen(isNowFullscreen)
      if (isNowFullscreen) {
        setShowSidebar(false)
      }
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
        setShowSidebar(true)
      } else if (containerRef.current) {
        await containerRef.current.requestFullscreen()
        setShowSidebar(false)
      }
    } catch {
      // Fullscreen toggle failed
    }
  }

  // Subscribe to realtime updates
  useEffect(() => {
    const supabase = createClient()

    // Subscribe to new responses
    const responsesChannel = supabase
      .channel('responses')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'responses',
          filter: `session_id=eq.${session.id}`,
        },
        (payload) => {
          setResponses((prev) => [...prev, payload.new as Response])
        }
      )
      .subscribe()

    // Subscribe to session updates (participant count, status)
    const sessionChannel = supabase
      .channel('session')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'sessions',
          filter: `id=eq.${session.id}`,
        },
        (payload) => {
          const updated = payload.new as Session
          setSessionStatus(updated.status)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(responsesChannel)
      supabase.removeChannel(sessionChannel)
    }
  }, [session.id])

  const goToSlide = async (slideId: string) => {
    const supabase = createClient()
    await supabase
      .from('sessions')
      .update({ active_slide_id: slideId })
      .eq('id', session.id)
    setActiveSlideId(slideId)
  }

  const nextSlide = () => {
    if (activeSlideIndex < slides.length - 1) {
      goToSlide(slides[activeSlideIndex + 1].id)
    }
  }

  const prevSlide = () => {
    if (activeSlideIndex > 0) {
      goToSlide(slides[activeSlideIndex - 1].id)
    }
  }

  const endSession = async () => {
    const supabase = createClient()
    await supabase
      .from('sessions')
      .update({ status: 'ended', ended_at: new Date().toISOString() })
      .eq('id', session.id)
    router.push(`/app/presentations/${session.presentation_id}`)
  }

  if (sessionStatus === 'ended') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-3xl font-bold mb-4">Session ended</h1>
          <button
            onClick={() => router.push(`/app/presentations/${session.presentation_id}`)}
            className="text-white/80 hover:text-white underline"
          >
            Back to presentation
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-50 flex flex-col -m-8"
    >
      {/* Top bar with join info */}
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Left: QR code (small) + join info */}
        <div className="flex items-center gap-4">
          {!isWelcomeSlide && (
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <QRCodeSVG
                value={`https://pollio.se/join/${session.code}`}
                size={48}
                level="M"
              />
            </div>
          )}
          <div className="flex items-center gap-2 text-slate-600">
            <span className="text-sm">Join at</span>
            <span className="font-medium">pollio.se/join</span>
            <span className="text-slate-400">|</span>
            <span className="text-sm">code</span>
            <span className="font-mono font-bold text-primary text-lg">{session.code}</span>
          </div>
        </div>

        {/* Center: Participant count */}
        <div className="flex items-center gap-2 text-slate-600">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="font-medium">{participantCount}</span>
        </div>

        {/* Right: Pollio logo + controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={endSession}
            className="text-slate-500 hover:text-slate-700 text-sm flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            End
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 text-slate-500 hover:text-slate-700 transition-colors"
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
            )}
          </button>
          <Image src="/logo.svg" alt="Pollio" width={80} height={27} />
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main content */}
        <div className="flex-1 flex flex-col px-8 pb-8">
          {isWelcomeSlide ? (
            /* Welcome slide - prominent QR code and join info */
            <div className="flex-1 flex flex-col items-center justify-center">
              <h1 className="text-5xl font-bold text-slate-800 text-center mb-3 max-w-4xl">
                {activeSlide?.title}
              </h1>
              {activeSlide?.description && (
                <p className="text-2xl text-slate-500 text-center mb-12 max-w-2xl">
                  {activeSlide.description}
                </p>
              )}

              <div className="flex items-center gap-16">
                <div className="bg-white p-8 rounded-3xl shadow-xl">
                  <QRCodeSVG
                    value={`https://pollio.se/join/${session.code}`}
                    size={240}
                    level="M"
                  />
                </div>
                <div className="text-center">
                  <p className="text-slate-400 text-xl mb-3">Go to</p>
                  <div className="bg-white text-slate-700 px-8 py-4 rounded-2xl shadow-lg mb-8">
                    <span className="text-3xl font-medium">pollio.se/join</span>
                  </div>
                  <p className="text-slate-400 text-xl mb-3">Enter code</p>
                  <div className="bg-primary text-white px-12 py-6 rounded-2xl shadow-lg inline-block">
                    <span className="text-5xl font-mono font-bold tracking-widest">
                      {session.code}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-16 flex items-center gap-3 text-slate-500">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-lg font-medium">{participantCount} participant{participantCount !== 1 ? 's' : ''} joined</span>
                </div>
              </div>
            </div>
          ) : activeSlide?.type === 'content' ? (
            /* Content slides - no interaction, just display */
            <div className="flex-1 flex flex-col items-center justify-center">
              {activeSlide && (
                <>
                  <h1 className="text-5xl font-bold text-slate-800 text-center mb-6 max-w-4xl">
                    {activeSlide.title}
                  </h1>
                  {activeSlide.description && (
                    <p className="text-2xl text-slate-500 text-center mb-8 max-w-2xl">
                      {activeSlide.description}
                    </p>
                  )}
                  
                  {/* Content body */}
                  {(activeSlide.settings.body as string) && (
                    <div className="text-xl text-slate-600 text-center max-w-3xl mb-8 whitespace-pre-wrap leading-relaxed">
                      {activeSlide.settings.body as string}
                    </div>
                  )}

                  {/* Content image */}
                  {(activeSlide.settings.image_url as string) && (
                    <div className="max-w-4xl w-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={activeSlide.settings.image_url as string} 
                        alt={activeSlide.title}
                        className="w-full h-auto max-h-[50vh] object-contain rounded-2xl shadow-lg"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            /* Question slides */
            <div className="flex-1 flex flex-col items-center justify-center">
              {activeSlide && (
                <>
                  <h1 className="text-4xl font-bold text-slate-800 text-center mb-4 max-w-4xl">
                    {activeSlide.title}
                  </h1>
                  {activeSlide.description && (
                    <p className="text-xl text-slate-500 text-center mb-10 max-w-2xl">
                      {activeSlide.description}
                    </p>
                  )}

                  {/* Results */}
                  <div className="w-full max-w-4xl">
                    <ResultsDisplay
                      slide={activeSlide}
                      responses={slideResponses}
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 pt-6">
            <button
              onClick={prevSlide}
              disabled={activeSlideIndex <= 0}
              className="p-3 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl text-slate-600 transition-colors shadow-sm"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="px-4 py-2 bg-white rounded-xl shadow-sm text-slate-600 font-medium">
              {activeSlideIndex + 1} / {slides.length}
            </div>
            <button
              onClick={nextSlide}
              disabled={activeSlideIndex >= slides.length - 1}
              className="p-3 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl text-slate-600 transition-colors shadow-sm"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Slide list sidebar - only shown when NOT in fullscreen */}
        {showSidebar && !isFullscreen && (
          <div className="w-56 bg-white/80 backdrop-blur border-l border-slate-200 p-4 overflow-y-auto">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-3">Slides</p>
            <div className="space-y-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => goToSlide(slide.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all ${
                    slide.id === activeSlideId
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span className="text-xs opacity-70">{index + 1}.</span>{' '}
                  <span className="text-sm font-medium truncate">{slide.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
