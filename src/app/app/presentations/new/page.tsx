'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { UpgradeModal } from '@/components/UpgradeModal'
import { getSubscriptionInfo, FREE_TIER_LIMITS } from '@/lib/subscription'

export default function NewPresentationPage() {
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const router = useRouter()

  // Check limits on page load
  useEffect(() => {
    const checkLimits = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setChecking(false)
        return
      }

      // Fetch subscription status
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status, subscription_ends_at')
        .eq('id', user.id)
        .single()

      const subscription = getSubscriptionInfo(profile)

      if (!subscription.isPro) {
        // Count existing presentations
        const { count } = await supabase
          .from('presentations')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)

        if ((count || 0) >= FREE_TIER_LIMITS.maxPresentations) {
          setShowUpgradeModal(true)
        }
      }

      setChecking(false)
    }

    checkLimits()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setError('You must be logged in')
      setLoading(false)
      return
    }

    // Re-check limits before creating
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status, subscription_ends_at')
      .eq('id', user.id)
      .single()

    const subscription = getSubscriptionInfo(profile)

    if (!subscription.isPro) {
      const { count } = await supabase
        .from('presentations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      if ((count || 0) >= FREE_TIER_LIMITS.maxPresentations) {
        setShowUpgradeModal(true)
        setLoading(false)
        return
      }
    }

    const presentationTitle = title.trim() || 'Untitled Presentation'

    const { data, error: createError } = await supabase
      .from('presentations')
      .insert({
        user_id: user.id,
        title: presentationTitle,
      })
      .select()
      .single()

    if (createError) {
      setError(createError.message)
      setLoading(false)
      return
    }

    // Create a default welcome slide
    await supabase
      .from('slides')
      .insert({
        presentation_id: data.id,
        type: 'welcome',
        title: presentationTitle,
        description: 'Scan the QR code or enter the code to join',
        position: 0,
        settings: {},
      })

    router.push(`/app/presentations/${data.id}`)
  }

  if (checking) {
    return (
      <div className="max-w-lg mx-auto flex items-center justify-center min-h-[200px]">
        <div className="text-text-secondary">Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto">
      <Link
        href="/app/presentations"
        className="inline-flex items-center text-text-secondary hover:text-text-primary mb-6"
      >
        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to presentations
      </Link>

      <h1 className="text-3xl font-bold text-text-primary mb-2">New presentation</h1>
      <p className="text-text-secondary mb-8">Give your presentation a name to get started</p>

      <form onSubmit={handleCreate} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-text-primary mb-2">
            Presentation title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-text-secondary/20 rounded-lg focus:border-primary focus:outline-none text-lg"
            placeholder="e.g., Team Feedback Session"
            autoFocus
          />
        </div>

        {error && (
          <div className="p-3 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            {loading ? 'Creating...' : 'Create presentation'}
          </button>
        </div>
      </form>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => {
          setShowUpgradeModal(false)
          router.push('/app/presentations')
        }}
      />
    </div>
  )
}
