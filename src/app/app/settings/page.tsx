import { createClient } from '@/lib/supabase/server'
import { getSubscriptionInfo } from '@/lib/subscription'
import { ManageSubscription } from './ManageSubscription'

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
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-text-primary mb-2">Settings</h1>
      <p className="text-text-secondary mb-8">Manage your account and subscription</p>

      {/* Account Info */}
      <section className="bg-white rounded-xl border border-text-secondary/10 p-6 mb-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Account</h2>
        <div className="space-y-3">
          <div>
            <div className="text-sm text-text-secondary">Name</div>
            <div className="text-text-primary">{profile?.full_name || 'Not set'}</div>
          </div>
          <div>
            <div className="text-sm text-text-secondary">Email</div>
            <div className="text-text-primary">{user?.email}</div>
          </div>
        </div>
      </section>

      {/* Subscription */}
      <section className="bg-white rounded-xl border border-text-secondary/10 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Subscription</h2>
          {subscription.isPro && (
            <span className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
              Pro
            </span>
          )}
        </div>

        {subscription.status === 'free' && (
          <div className="mb-4">
            <p className="text-text-secondary mb-4">
              You're on the <span className="font-medium text-text-primary">Free</span> plan.
              Limited to 1 presentation with 10 participants per session.
            </p>
            <ManageSubscription
              status={subscription.status}
              hasStripeCustomer={!!profile?.stripe_customer_id}
            />
          </div>
        )}

        {subscription.status === 'pro' && (
          <div className="mb-4">
            <p className="text-text-secondary mb-4">
              You're on the <span className="font-medium text-text-primary">Pro</span> plan.
              Unlimited presentations and participants.
            </p>
            <ManageSubscription
              status={subscription.status}
              hasStripeCustomer={!!profile?.stripe_customer_id}
            />
          </div>
        )}

        {subscription.status === 'cancelled' && subscription.subscriptionEndsAt && (
          <div className="mb-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <p className="text-amber-800">
                Your subscription is cancelled but you have Pro access until{' '}
                <span className="font-medium">
                  {subscription.subscriptionEndsAt.toLocaleDateString('sv-SE')}
                </span>.
              </p>
            </div>
            <ManageSubscription
              status={subscription.status}
              hasStripeCustomer={!!profile?.stripe_customer_id}
            />
          </div>
        )}
      </section>
    </div>
  )
}
