'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { UpgradeModal } from '@/components/UpgradeModal'
import { getSubscriptionInfo, FREE_TIER_LIMITS } from '@/lib/subscription'
import { templates, Template } from '@/lib/templates'

export default function NewPresentationPage() {
  const [title, setTitle] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
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

    const presentationTitle = title.trim() || selectedTemplate?.name || 'Untitled Presentation'

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

    // Create slides from template or default welcome slide
    if (selectedTemplate) {
      // Create all slides from template
      const slidesToInsert = selectedTemplate.slides.map((slide, index) => ({
        presentation_id: data.id,
        type: slide.type,
        title: index === 0 ? presentationTitle : slide.title, // Use custom title for welcome slide
        description: slide.description,
        position: index,
        settings: slide.settings,
      }))

      await supabase.from('slides').insert(slidesToInsert)
    } else {
      // Create default welcome slide
      await supabase.from('slides').insert({
        presentation_id: data.id,
        type: 'welcome',
        title: presentationTitle,
        description: 'Scan the QR code or enter the code to join',
        position: 0,
        settings: {},
      })
    }

    router.push(`/app/presentations/${data.id}`)
  }

  if (checking) {
    return (
      <div className="max-w-3xl mx-auto flex items-center justify-center min-h-[200px]">
        <div className="text-text-secondary">Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
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
      <p className="text-text-secondary mb-8">Start from scratch or use a template</p>

      {/* Templates */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Templates</h2>
        <div className="grid grid-cols-2 gap-4">
          {/* Blank option */}
          <button
            onClick={() => setSelectedTemplate(null)}
            className={`text-left p-4 rounded-xl border-2 transition-all ${
              selectedTemplate === null
                ? 'border-primary bg-primary/5'
                : 'border-text-secondary/20 hover:border-primary/50'
            }`}
          >
            <div className="text-2xl mb-2">📝</div>
            <div className="font-semibold text-text-primary">Blank</div>
            <div className="text-sm text-text-secondary">Start from scratch</div>
          </button>

          {/* Templates */}
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template)}
              className={`text-left p-4 rounded-xl border-2 transition-all ${
                selectedTemplate?.id === template.id
                  ? 'border-primary bg-primary/5'
                  : 'border-text-secondary/20 hover:border-primary/50'
              }`}
            >
              <div className="text-2xl mb-2">{template.icon}</div>
              <div className="font-semibold text-text-primary">{template.name}</div>
              <div className="text-sm text-text-secondary">{template.description}</div>
              <div className="text-xs text-text-secondary/70 mt-2">
                {template.slides.length} slides
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Template preview */}
      {selectedTemplate && (
        <div className="mb-8 p-4 bg-surface rounded-xl">
          <h3 className="text-sm font-medium text-text-secondary mb-3">
            {selectedTemplate.name} includes:
          </h3>
          <div className="space-y-2">
            {selectedTemplate.slides.map((slide, index) => (
              <div key={index} className="flex items-center gap-3 text-sm">
                <span className="w-6 h-6 bg-primary/10 text-primary rounded flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </span>
                <span className="text-text-secondary capitalize">
                  {slide.type.replace('_', ' ')}:
                </span>
                <span className="text-text-primary truncate">{slide.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

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
            placeholder={selectedTemplate ? selectedTemplate.name : "e.g., Team Feedback Session"}
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
