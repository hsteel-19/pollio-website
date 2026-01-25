'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function JoinPage() {
  const [code, setCode] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (code.trim()) {
      router.push(`/join/${code.trim().toUpperCase()}`)
    }
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-bold text-text-primary text-center mb-2">
        Join a session
      </h1>
      <p className="text-text-secondary text-center mb-8">
        Enter the code shown on the presenter's screen
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter code"
          className="w-full px-4 py-4 text-2xl text-center font-mono tracking-widest border-2 border-text-secondary/20 rounded-xl focus:border-primary focus:outline-none"
          maxLength={6}
          autoFocus
        />
        <button
          type="submit"
          disabled={!code.trim()}
          className="w-full bg-primary hover:bg-primary-dark disabled:bg-text-secondary/20 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold text-lg transition-colors"
        >
          Join
        </button>
      </form>
    </div>
  )
}
