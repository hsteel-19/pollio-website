import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { PresenterView } from './PresenterView'

export default async function PresentSessionPage({
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

  // Fetch existing responses
  const { data: responses } = await supabase
    .from('responses')
    .select('*')
    .eq('session_id', sessionId)

  return (
    <PresenterView
      session={session}
      slides={slides || []}
      initialResponses={responses || []}
    />
  )
}
