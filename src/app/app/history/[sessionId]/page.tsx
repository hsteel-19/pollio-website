import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SessionResults } from './SessionResults'

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ sessionId: string }>
}) {
  const { sessionId } = await params
  const supabase = await createClient()

  // Fetch session with presentation
  const { data: session, error } = await supabase
    .from('sessions')
    .select(`
      *,
      presentations (
        id,
        title,
        user_id
      )
    `)
    .eq('id', sessionId)
    .single()

  if (error || !session) {
    notFound()
  }

  // Fetch slides
  const { data: slides } = await supabase
    .from('slides')
    .select('*')
    .eq('presentation_id', session.presentation_id)
    .order('position', { ascending: true })

  // Fetch all responses for this session
  const { data: responses } = await supabase
    .from('responses')
    .select('*')
    .eq('session_id', sessionId)

  // Count unique participants
  const uniqueParticipants = new Set(responses?.map((r) => r.participant_id)).size

  return (
    <div>
      <Link
        href="/app/history"
        className="inline-flex items-center text-text-secondary hover:text-text-primary mb-6"
      >
        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to history
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          {session.presentations?.title || 'Session Results'}
        </h1>
        <div className="flex items-center gap-4 text-text-secondary">
          <span className="font-mono bg-surface px-2 py-1 rounded text-sm">
            {session.code}
          </span>
          <span>
            {new Date(session.started_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          <span>{uniqueParticipants} participants</span>
          <span>{responses?.length || 0} responses</span>
        </div>
      </div>

      <SessionResults 
        slides={slides || []} 
        responses={responses || []} 
        sessionCode={session.code}
        presentationTitle={session.presentations?.title}
      />
    </div>
  )
}
