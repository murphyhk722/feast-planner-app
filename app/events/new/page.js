'use client'
import { useState } from 'react'
import { createClient } from '../../../utils/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewEvent() {
  const [form, setForm] = useState({ name: '', event_date: '', guest_count: '', service_style: 'Plated' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { data, error } = await supabase.from('events').insert({
      name: form.name,
      event_date: form.event_date || null,
      guest_count: parseInt(form.guest_count) || null,
      service_style: form.service_style,
      user_id: user.id
    }).select().single()

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push(`/events/${data.id}`)
    }
  }

  return (
    <div className="min-h-screen" style={{background:'var(--cream)'}}>
      <nav className="bg-white border-b border-black/5 px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="font-bold text-xl" style={{color:'var(--charcoal)'}}>
          🍽 Feast<span style={{color:'var(--gold)'}}>Planner</span>
        </Link>
        <Link href="/dashboard" className="text-sm font-semibold" style={{color:'var(--muted)'}}>← Back to dashboard</Link>
      </nav>

      <div className="max-w-lg mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-2" style={{color:'var(--charcoal)'}}>Create New Event</h1>
        <p className="mb-8" style={{color:'var(--muted)'}}>Tell us about your event and we'll set up your planning workspace.</p>

        <div className="bg-white rounded-2xl p-8 border border-black/5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{color:'var(--muted)'}}>Event Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Johnson Wedding Reception"
                required
                className="w-full px-4 py-3 rounded-lg border text-sm outline-none transition-colors"
                style={{borderColor:'rgba(26,26,26,0.15)', background:'var(--cream)'}}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{color:'var(--muted)'}}>Event Date</label>
              <input
                name="event_date"
                type="date"
                value={form.event_date}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border text-sm outline-none transition-colors"
                style={{borderColor:'rgba(26,26,26,0.15)', background:'var(--cream)'}}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{color:'var(--muted)'}}>Guest Count</label>
              <input
                name="guest_count"
                type="number"
                value={form.guest_count}
                onChange={handleChange}
                placeholder="e.g. 150"
                min="1"
                className="w-full px-4 py-3 rounded-lg border text-sm outline-none transition-colors"
                style={{borderColor:'rgba(26,26,26,0.15)', background:'var(--cream)'}}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{color:'var(--muted)'}}>Service Style</label>
              <select
                name="service_style"
                value={form.service_style}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border text-sm outline-none transition-colors"
                style={{borderColor:'rgba(26,26,26,0.15)', background:'var(--cream)'}}
              >
                <option>Plated</option>
                <option>Buffet</option>
                <option>Cocktail</option>
                <option>Family Style</option>
              </select>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50 mt-2"
              style={{background:'var(--charcoal)'}}
            >
              {loading ? 'Creating...' : 'Create Event & Start Planning →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
