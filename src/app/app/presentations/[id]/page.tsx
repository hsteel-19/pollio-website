import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { PresentationEditor } from './PresentationEditor'
import { getSubscriptionInfo, FREE_TIER_LIMITS } from '@/lib/subscription'

export default async function EditPresentationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: presentation, error } = await supabase
    .from('presentations')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !presentation) {
    notFound()
  }

  const { data: slides } = await supabase
    .from('slides')
    .select('*')
    .eq('presentation_id', id)
    .order('position', { ascending: true })

  // Fetch completed sessions count (sessions with status = 'ended')
  const { data: sessions } = await supabase
    .from('sessions')
    .select('id, status')
    .eq('presentation_id', id)

  const completedSessionCount = sessions?.filter(s => s.status === 'ended').length || 0

  // Fetch user's subscription status
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status, subscription_ends_at')
    .eq('id', presentation.user_id)
    .single()

  const subscription = getSubscriptionInfo(profile)

  // Presentation is locked if free user has reached session limit
  const isLocked = !subscription.isPro && completedSessionCount >= FREE_TIER_LIMITS.maxSessionsPerPresentation

  return (
    <PresentationEditor
      presentation={presentation}
      initialSlides={slides || []}
      isLocked={isLocked}
      isPro={subscription.isPro}
      completedSessionCount={completedSessionCount}
      maxSessions={FREE_TIER_LIMITS.maxSessionsPerPresentation}
    />
  )
}
