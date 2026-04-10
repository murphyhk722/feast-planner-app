'use client'
import { useState } from 'react'
import { createClient } from '../../utils/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{background:'var(--cream)'}}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold" style={{color:'var(--charcoal)'}}>
            🍽 Feast<span style={{color:'var(--gold)'}}>Planner</span>
          </Link>
          <h1 className="text-3xl font-bold mt-4 mb-1" style={{color:'var(--charcoal)'}}>Create your account</h1>
          <p style={{color:'var(--muted)'}}>Start planning your first event in minutes.</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-black/5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{color:'var(--muted)'}}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-lg border text-sm outline-none focus:border-yellow-500 transition-colors"
                style={{borderColor:'rgba(26,26,26,0.15)', background:'var(--cream)'}}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{color:'var(--muted)'}}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                className="w-full px-4 py-3 rounded-lg border text-sm outline-none focus:border-yellow-500 transition-colors"
                style={{borderColor:'rgba(26,26,26,0.15)', background:'var(--cream)'}}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50 mt-2"
              style={{background:'var(--charcoal)'}}
            >
              {loading ? 'Creating account...' : 'Sign Up Free →'}
            </button>
          </form>
        </div>

        <p className="text-center mt-4 text-sm" style={{color:'var(--muted)'}}>
          Already have an account?{' '}
          <Link href="/login" className="font-semibold" style={{color:'var(--gold)'}}>Log in</Link>
        </p>
      </div>
    </div>
  )
}
