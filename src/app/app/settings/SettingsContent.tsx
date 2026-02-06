'use client'

import { useLanguage } from '@/lib/i18n'
import { ManageSubscription } from './ManageSubscription'

interface SettingsContentProps {
  user: {
    email?: string
  } | null
  profile: {
    full_name?: string | null
    subscription_status?: string | null
    subscription_ends_at?: string | null
    stripe_customer_id?: string | null
  } | null
  subscription: {
    isPro: boolean
    status: string
    subscriptionEndsAt?: Date | null
  }
}

export function SettingsContent({ user, profile, subscription }: SettingsContentProps) {
  const { t, locale, setLocale } = useLanguage()

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-text-primary mb-2">{t.app.settings.title}</h1>
      <p className="text-text-secondary mb-8">{t.app.settings.subtitle}</p>

      {/* Account Info */}
      <section className="bg-white rounded-xl border border-text-secondary/10 p-6 mb-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">{t.app.settings.account}</h2>
        <div className="space-y-3">
          <div>
            <div className="text-sm text-text-secondary">{t.app.settings.name}</div>
            <div className="text-text-primary">{profile?.full_name || t.app.settings.notSet}</div>
          </div>
          <div>
            <div className="text-sm text-text-secondary">{t.app.settings.email}</div>
            <div className="text-text-primary">{user?.email}</div>
          </div>
        </div>
      </section>

      {/* Language */}
      <section className="bg-white rounded-xl border border-text-secondary/10 p-6 mb-6">
        <h2 className="text-lg font-semibold text-text-primary mb-2">{t.app.settings.language}</h2>
        <p className="text-sm text-text-secondary mb-4">{t.app.settings.languageDesc}</p>
        <div className="flex gap-3">
          <button
            onClick={() => setLocale('sv')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              locale === 'sv'
                ? 'bg-primary text-white'
                : 'bg-surface text-text-secondary hover:bg-primary/10 hover:text-primary'
            }`}
          >
            🇸🇪 {t.app.settings.swedish}
          </button>
          <button
            onClick={() => setLocale('en')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              locale === 'en'
                ? 'bg-primary text-white'
                : 'bg-surface text-text-secondary hover:bg-primary/10 hover:text-primary'
            }`}
          >
            🇬🇧 {t.app.settings.english}
          </button>
        </div>
      </section>

      {/* Subscription */}
      <section className="bg-white rounded-xl border border-text-secondary/10 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">{t.app.settings.subscription}</h2>
          {subscription.isPro && (
            <span className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
              {t.app.settings.proPlan}
            </span>
          )}
        </div>

        {subscription.status === 'free' && (
          <div className="mb-4">
            <p className="text-text-secondary mb-4">
              {t.app.settings.freeDesc}
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
              {t.app.settings.proDesc}
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
                {t.app.settings.cancelledDesc}{' '}
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
