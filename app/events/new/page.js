'use client'
import { useState } from 'react'
import { createClient } from '../../../utils/supabase'
import { PRESET_MENUS } from '../../../utils/presets'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewEvent() {
  const [form, setForm] = useState({ name: '', event_date: '', guest_count: '', service_style: 'Plated' })
  const [selectedPreset, setSelectedPreset] = useState('herb-chicken')
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

    const { data: event, error: eventError } = await supabase.from('events').insert({
      name: form.name,
      event_date: form.event_date || null,
      guest_count: parseInt(form.guest_count) || null,
      service_style: form.service_style,
      user_id: user.id
    }).select().single()

    if (eventError) { setError(eventError.message); setLoading(false); return }

    const preset = PRESET_MENUS.find(p => p.id === selectedPreset)
    if (preset && preset.ingredients.length > 0) {
      await supabase.from('event_ingredients').insert(
        preset.ingredients.map(ing => ({ ...ing, event_id: event.id }))
      )
    }

    router.push(`/events/${event.id}`)
  }

  return (
    <div className="min-h-screen" style={{background:'var(--cream)'}}>
      <nav className="bg-white border-b border-black/5 px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="font-bold text-xl" style={{color:'var(--charcoal)'}}>
          🍽 Feast<span style={{color:'var(--gold)'}}>Planner</span>
        </Link>
        <Link href="/dashboard" className="text-sm font-semibold" style={{color:'var(--muted)'}}>← Back to dashboard</Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-2" style={{color:'var(--charcoal)'}}>Create New Event</h1>
        <p className="mb-8" style={{color:'var(--muted)'}}>Fill in your event details and pick a starting menu.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Event details */}
          <div className="bg-white rounded-2xl p-8 border border-black/5">
            <h2 className="font-bold text-lg mb-5" style={{color:'var(--charcoal)'}}>Event Details</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{color:'var(--muted)'}}>Event Name *</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Johnson Wedding Reception" required
                  className="w-full px-4 py-3 rounded-lg border text-sm outline-none transition-colors"
                  style={{borderColor:'rgba(26,26,26,0.15)', background:'var(--cream)'}} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{color:'var(--muted)'}}>Event Date</label>
                  <input name="event_date" type="date" value={form.event_date} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border text-sm outline-none transition-colors"
                    style={{borderColor:'rgba(26,26,26,0.15)', background:'var(--cream)'}} />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{color:'var(--muted)'}}>Guest Count</label>
                  <input name="guest_count" type="number" value={form.guest_count} onChange={handleChange} placeholder="e.g. 150" min="1"
                    className="w-full px-4 py-3 rounded-lg border text-sm outline-none transition-colors"
                    style={{borderColor:'rgba(26,26,26,0.15)', background:'var(--cream)'}} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{color:'var(--muted)'}}>Service Style</label>
                <select name="service_style" value={form.service_style} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border text-sm outline-none transition-colors"
                  style={{borderColor:'rgba(26,26,26,0.15)', background:'var(--cream)'}}>
                  <option>Plated</option>
                  <option>Buffet</option>
                  <option>Cocktail</option>
                  <option>Family Style</option>
                </select>
              </div>
            </div>
          </div>

          {/* Preset picker */}
          <div className="bg-white rounded-2xl p-8 border border-black/5">
            <h2 className="font-bold text-lg mb-2" style={{color:'var(--charcoal)'}}>Choose a Starting Menu</h2>
            <p className="text-sm mb-5" style={{color:'var(--muted)'}}>Pick a preset to start from — you can edit every ingredient on the next page.</p>
            <div className="grid grid-cols-2 gap-3">
              {PRESET_MENUS.map(preset => (
                <button key={preset.id} type="button" onClick={() => setSelectedPreset(preset.id)}
                  className="text-left p-4 rounded-xl border-2 transition-all"
                  style={{
                    borderColor: selectedPreset === preset.id ? 'var(--gold)' : 'rgba(26,26,26,0.1)',
                    background: selectedPreset === preset.id ? 'rgba(201,151,58,0.06)' : 'var(--cream)'
                  }}>
                  <div className="text-2xl mb-1">{preset.emoji}</div>
                  <div className="font-bold text-sm mb-0.5" style={{color:'var(--charcoal)'}}>{preset.name}</div>
                  <div className="text-xs" style={{color:'var(--muted)'}}>{preset.description}</div>
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-lg font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50"
            style={{background:'var(--charcoal)'}}>
            {loading ? 'Creating...' : 'Create Event & Start Planning →'}
          </button>
        </form>
      </div>
    </div>
  )
}
