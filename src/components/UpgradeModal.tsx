'use client'

import { useState } from 'react'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
}

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'yearly' | 'monthly'>('yearly')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleContinue = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceType: selectedPlan }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        console.error('Failed to create checkout session')
        setLoading(false)
      }
    } catch (error) {
      console.error('Checkout error:', error)
      setLoading(false)
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

        {/* Plan selection */}
        <div className="space-y-3 mb-6">
          <button
            onClick={() => setSelectedPlan('yearly')}
            className={`w-full py-4 px-5 rounded-xl text-left transition-all border-2 ${
              selectedPlan === 'yearly'
                ? 'border-primary bg-primary/5'
                : 'border-text-secondary/20 hover:border-text-secondary/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-text-primary">990 kr/year</div>
                <div className="text-sm text-text-secondary">Save 36% compared to monthly</div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedPlan === 'yearly' ? 'border-primary' : 'border-text-secondary/40'
              }`}>
                {selectedPlan === 'yearly' && (
                  <div className="w-3 h-3 rounded-full bg-primary" />
                )}
              </div>
            </div>
          </button>

          <button
            onClick={() => setSelectedPlan('monthly')}
            className={`w-full py-4 px-5 rounded-xl text-left transition-all border-2 ${
              selectedPlan === 'monthly'
                ? 'border-primary bg-primary/5'
                : 'border-text-secondary/20 hover:border-text-secondary/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-text-primary">129 kr/month</div>
                <div className="text-sm text-text-secondary">Flexible monthly billing</div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedPlan === 'monthly' ? 'border-primary' : 'border-text-secondary/40'
              }`}>
                {selectedPlan === 'monthly' && (
                  <div className="w-3 h-3 rounded-full bg-primary" />
                )}
              </div>
            </div>
          </button>
        </div>

        {/* Features */}
        <ul className="space-y-2 text-sm text-text-secondary mb-6">
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

        {/* CTA Button */}
        <button
          onClick={handleContinue}
          disabled={loading}
          className="w-full bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white py-4 px-6 rounded-xl font-semibold transition-colors"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing...
            </span>
          ) : (
            'Continue'
          )}
        </button>
      </div>
    </div>
  )
}
