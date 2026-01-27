'use client'

import { useState } from 'react'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
}

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const [loading, setLoading] = useState<'monthly' | 'yearly' | null>(null)

  if (!isOpen) return null

  const handleCheckout = async (priceType: 'monthly' | 'yearly') => {
    setLoading(priceType)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceType }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        console.error('Failed to create checkout session')
        setLoading(null)
      }
    } catch (error) {
      console.error('Checkout error:', error)
      setLoading(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-text-primary"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            Upgrade to Pro
          </h2>
          <p className="text-text-secondary">
            You've reached the free plan limit of 1 presentation.
            Upgrade to create unlimited presentations with unlimited participants.
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <button
            onClick={() => handleCheckout('yearly')}
            disabled={loading !== null}
            className="w-full bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white py-4 px-6 rounded-xl font-semibold transition-colors relative"
          >
            {loading === 'yearly' ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : (
              <>
                <span className="block">990 kr/year</span>
                <span className="block text-sm font-normal text-white/80">
                  Save 36% compared to monthly
                </span>
              </>
            )}
          </button>

          <button
            onClick={() => handleCheckout('monthly')}
            disabled={loading !== null}
            className="w-full bg-surface hover:bg-gray-100 disabled:bg-surface/50 text-text-primary py-4 px-6 rounded-xl font-semibold transition-colors border border-text-secondary/20"
          >
            {loading === 'monthly' ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : (
              <span>129 kr/month</span>
            )}
          </button>
        </div>

        <ul className="space-y-2 text-sm text-text-secondary">
          <li className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Unlimited presentations
          </li>
          <li className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Unlimited participants per session
          </li>
          <li className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Session history & analytics
          </li>
          <li className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Cancel anytime
          </li>
        </ul>
      </div>
    </div>
  )
}
