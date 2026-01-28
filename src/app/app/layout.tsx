import { getUserWithProfile } from '@/lib/supabase/server'
import { Sidebar } from './Sidebar'
import { getSubscriptionInfo } from '@/lib/subscription'

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, profile } = await getUserWithProfile()
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
