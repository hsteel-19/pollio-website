export type SubscriptionStatus = 'free' | 'pro' | 'cancelled'

export interface SubscriptionInfo {
  status: SubscriptionStatus
  isPro: boolean
  subscriptionEndsAt: Date | null
}

export function getSubscriptionInfo(profile: {
  subscription_status?: string | null
  subscription_ends_at?: string | null
} | null): SubscriptionInfo {
  const status = (profile?.subscription_status as SubscriptionStatus) || 'free'
  const subscriptionEndsAt = profile?.subscription_ends_at
    ? new Date(profile.subscription_ends_at)
    : null

  // User is Pro if they have active subscription OR cancelled but not yet expired
  const isPro =
    status === 'pro' ||
    (status === 'cancelled' &&
      subscriptionEndsAt !== null &&
      subscriptionEndsAt > new Date())

  return {
    status,
    isPro,
    subscriptionEndsAt,
  }
}

// Free tier limits
export const FREE_TIER_LIMITS = {
  maxPresentations: 1,
  maxSessionsPerPresentation: 2,
  maxParticipantsPerSession: 10,
}
