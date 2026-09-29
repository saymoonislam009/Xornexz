'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminGatePage() {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(false)

    const res = await fetch('/api/admin-gate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: value }),
    })

    if (res.ok) {
      router.replace('/admin/login')
    } else {
      setError(true)
      setValue('')
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  return (
    <main className="min-h-screen bg-[#05060A] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <span className="text-3xl font-black font-display tracking-tighter text-white">
            X<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">ornexz</span>
          </span>
          <p className="mt-3 text-sm text-gray-500">Restricted Area</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="token" className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
              Access Key
            </label>
            <input
              id="token"
              ref={inputRef}
              type="password"
              autoComplete="off"
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter access key"
              className={`w-full rounded-xl border px-4 py-3 bg-white/[0.03] text-white placeholder-gray-600 text-sm outline-none transition-all focus:ring-2 ${
                error
                  ? 'border-red-500/50 focus:ring-red-500/30'
                  : 'border-white/10 focus:ring-violet-500/40 focus:border-violet-500/50'
              }`}
            />
            {error && (
              <p className="mt-2 text-xs text-red-400">Incorrect access key. Try again.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !value}
            className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 py-3 text-sm font-semibold text-white transition-all hover:from-violet-500 hover:to-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying…' : 'Continue'}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-gray-700">
          Unauthorized access is prohibited.
        </p>
      </div>
    </main>
  )
}
