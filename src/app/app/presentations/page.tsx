import { createClient, getUser } from '@/lib/supabase/server'
import { PresentationsContent } from './PresentationsContent'

export default async function PresentationsPage() {
  const [user, supabase] = await Promise.all([
    getUser(),
    createClient()
  ])

  // Fetch presentations with their sessions
  const { data: presentations } = await supabase
    .from('presentations')
    .select(`
      *,
      sessions (
        id,
        status
      )
    `)
    .eq('user_id', user?.id)
    .order('updated_at', { ascending: false })

  return <PresentationsContent presentations={presentations} />
}
