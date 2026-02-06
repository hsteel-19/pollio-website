import { createClient, getUser } from '@/lib/supabase/server'
import { HomeContent } from './HomeContent'

export default async function HomePage() {
  const [user, supabase] = await Promise.all([
    getUser(),
    createClient()
  ])

  // Fetch recent presentations
  const { data: presentations } = await supabase
    .from('presentations')
    .select('*')
    .eq('user_id', user?.id)
    .order('updated_at', { ascending: false })
    .limit(3)

  return <HomeContent presentations={presentations} />
}
