'use client'

import { useState } from 'react'
import type { SubscriptionStatus } from '@/lib/subscription'

interface ManageSubscriptionProps {
  status: SubscriptionStatus
  hasStripeCustomer: boolean
}

export function ManageSubscription({ status, hasStripeCustomer }: ManageSubscriptionProps) {
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async (priceType: 'monthly' | 'yearly') => {
    setLoading(true)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceType }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleManage = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Portal error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'free') {
    return (
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => handleUpgrade('yearly')}
          disabled={loading}
          className="bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white py-2.5 px-5 rounded-lg font-medium transition-colors"
        >
          {loading ? 'Loading...' : 'Upgrade to Pro - 990 kr/year'}
        </button>
        <button
          onClick={() => handleUpgrade('monthly')}
          disabled={loading}
          className="bg-surface hover:bg-gray-100 disabled:bg-surface/50 text-text-primary py-2.5 px-5 rounded-lg font-medium transition-colors border border-text-secondary/20"
        >
          {loading ? 'Loading...' : '129 kr/month'}
        </button>
      </div>
    )
  }

  // Pro or cancelled - show manage button
  if (hasStripeCustomer) {
    return (
      <button
        onClick={handleManage}
        disabled={loading}
        className="bg-surface hover:bg-gray-100 disabled:bg-surface/50 text-text-primary py-2.5 px-5 rounded-lg font-medium transition-colors border border-text-secondary/20"
      >
        {loading ? 'Loading...' : 'Manage subscription'}
      </button>
    )
  }

  return null
}
