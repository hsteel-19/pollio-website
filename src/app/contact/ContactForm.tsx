'use client'

import { useState } from 'react'

export function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })

      if (response.ok) {
        setStatus('success')
        setName('')
        setEmail('')
        setMessage('')
      } else {
        const data = await response.json()
        setErrorMessage(data.error || 'Something went wrong')
        setStatus('error')
      }
    } catch {
      setErrorMessage('Failed to send message. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-success/10 border border-success/20 rounded-xl p-8 text-center">
        <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">Message sent!</h3>
        <p className="text-text-secondary mb-4">
          Thanks for reaching out. We&apos;ll get back to you soon.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="text-primary hover:underline"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-3 border border-text-secondary/20 rounded-lg focus:border-primary focus:outline-none"
          placeholder="Your name"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 border border-text-secondary/20 rounded-lg focus:border-primary focus:outline-none"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-2">
          Message
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          className="w-full px-4 py-3 border border-text-secondary/20 rounded-lg focus:border-primary focus:outline-none resize-none"
          placeholder="How can we help?"
        />
      </div>

      {status === 'error' && (
        <div className="p-3 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white py-3 rounded-lg font-semibold transition-colors"
      >
        {status === 'loading' ? 'Sending...' : 'Send message'}
      </button>
    </form>
  )
}
