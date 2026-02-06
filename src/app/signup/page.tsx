'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '@/lib/i18n'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const { t } = useLanguage()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">{t.app.auth.checkEmail}</h1>
          <p className="text-text-secondary">
            {t.app.auth.confirmationSent} <strong>{email}</strong>. {t.app.auth.clickToActivate}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image src="/logo.svg" alt="Pollio" width={120} height={40} priority />
          </Link>
          <h1 className="text-2xl font-bold text-text-primary mt-6 mb-2">{t.app.auth.createAccount}</h1>
          <p className="text-text-secondary">{t.app.auth.createAccountDesc}</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-text-primary mb-1">
              {t.app.auth.fullName}
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 border border-text-secondary/20 rounded-lg focus:border-primary focus:outline-none"
              placeholder={t.app.auth.fullNamePlaceholder}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1">
              {t.app.auth.email}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-text-secondary/20 rounded-lg focus:border-primary focus:outline-none"
              placeholder={t.app.auth.emailPlaceholder}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-1">
              {t.app.auth.password}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-text-secondary/20 rounded-lg focus:border-primary focus:outline-none"
              placeholder={t.app.auth.passwordPlaceholder}
              minLength={6}
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            {loading ? t.app.auth.signingUp : t.app.auth.signupButton}
          </button>
        </form>

        <p className="text-center text-text-secondary mt-6">
          {t.app.auth.alreadyHaveAccount}{' '}
          <Link href="/login" className="text-primary hover:underline font-medium">
            {t.app.auth.logIn}
          </Link>
        </p>
      </div>
    </div>
  )
}
