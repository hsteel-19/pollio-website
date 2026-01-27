import { createClient } from '@/lib/supabase/server'
import { Sidebar } from './Sidebar'
import { getSubscriptionInfo } from '@/lib/subscription'

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch profile for full name and subscription status
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, subscription_status, subscription_ends_at')
    .eq('id', user?.id)
    .single()

  const subscription = getSubscriptionInfo(profile)

  return (
    <div className="min-h-screen bg-surface">
      <div className="flex">
        <Sidebar
          userEmail={user?.email || ''}
          userName={profile?.full_name || null}
          isPro={subscription.isPro}
        />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
