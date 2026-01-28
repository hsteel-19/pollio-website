import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { AudienceView } from './AudienceView'
import { getSubscriptionInfo, FREE_TIER_LIMITS } from '@/lib/subscription'

export default async function JoinSessionPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  const supabase = await createClient()

  // Look up session by code (active or ended)
  const { data: session, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('code', code.toUpperCase())
    .in('status', ['active', 'ended'])
    .order('started_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !session) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-text-primary mb-2">
          Session not found
        </h1>
        <p className="text-text-secondary mb-6">
          Code: <span className="font-mono font-bold">{code.toUpperCase()}</span>
        </p>
        <p className="text-sm text-text-secondary">
          The code may be incorrect. Please check and try again.
        </p>
        <a
          href="/join"
          className="inline-block mt-6 text-primary hover:underline"
        >
          Try a different code
        </a>
      </div>
    )
  }

  // Session has ended - show thank you message
  if (session.status === 'ended') {
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

        <Link
          href="https://pollio.se"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-medium transition-colors"
        >
          Create your own Pollio
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    )
  }

  // Check participant limit for free tier sessions
  const { data: presentation } = await supabase
    .from('presentations')
    .select('user_id')
    .eq('id', session.presentation_id)
    .single()

  if (presentation?.user_id) {
    const { data: ownerProfile } = await supabase
      .from('profiles')
      .select('subscription_status, subscription_ends_at')
      .eq('id', presentation.user_id)
      .single()

    const ownerSubscription = getSubscriptionInfo(ownerProfile)

    if (!ownerSubscription.isPro) {
      // Count current participants (responses in this session)
      const { count: participantCount } = await supabase
        .from('responses')
        .select('participant_id', { count: 'exact', head: true })
        .eq('session_id', session.id)

      // Use distinct participant count
      const { data: distinctParticipants } = await supabase
        .from('responses')
        .select('participant_id')
        .eq('session_id', session.id)

      const uniqueParticipants = new Set(distinctParticipants?.map(r => r.participant_id) || [])

      if (uniqueParticipants.size >= FREE_TIER_LIMITS.maxParticipantsPerSession) {
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-text-primary mb-2">
              Session is full
            </h1>
            <p className="text-text-secondary mb-6">
              This session has reached its maximum capacity of {FREE_TIER_LIMITS.maxParticipantsPerSession} participants.
            </p>
            <p className="text-sm text-text-secondary">
              Please ask the presenter for a new session code.
            </p>
            <a
              href="/join"
              className="inline-block mt-6 text-primary hover:underline"
            >
              Try a different code
            </a>
          </div>
        )
      }
    }
  }

  // Fetch the active slide
  const { data: activeSlide } = session.active_slide_id
    ? await supabase
        .from('slides')
        .select('*')
        .eq('id', session.active_slide_id)
        .single()
    : { data: null }

  return (
    <AudienceView
      session={session}
      initialSlide={activeSlide}
    />
  )
}
