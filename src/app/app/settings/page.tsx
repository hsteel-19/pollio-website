import { createClient } from '@/lib/supabase/server'
import { getSubscriptionInfo } from '@/lib/subscription'
import { SettingsContent } from './SettingsContent'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, subscription_status, subscription_ends_at, stripe_customer_id')
    .eq('id', user?.id)
    .single()

  const subscription = getSubscriptionInfo(profile)

  return (
    <SettingsContent 
      user={user}
      profile={profile}
      subscription={subscription}
    />
  )
}
