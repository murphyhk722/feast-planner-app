'use client'
import { useEffect, useState } from 'react'
import { createClient } from '../../../utils/supabase'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

const BASE_GUESTS = 4
const ingredients = [
  { name: 'Chicken breasts', base: 4, baseUnit: 'pcs', unitCost: 3.5 },
  { name: 'Olive oil', base: 3, baseUnit: 'tbsp', unitCost: 0.12 },
  { name: 'Garlic cloves', base: 4, baseUnit: 'cloves', unitCost: 0.08 },
  { name: 'Russet potatoes', base: 2, baseUnit: 'lbs', unitCost: 0.7 },
  { name: 'Heavy cream', base: 0.5, baseUnit: 'cups', unitCost: 0.45 },
  { name: 'Unsalted butter', base: 4, baseUnit: 'tbsp', unitCost: 0.15 },
  { name: 'Mixed vegetables', base: 1.5, baseUnit: 'lbs', unitCost: 1.2 },
  { name: 'Chicken broth', base: 1, baseUnit: 'cup', unitCost: 0.35 },
  { name: 'Fresh thyme', base: 4, baseUnit: 'sprigs', unitCost: 0.25 },
  { name: 'Lemon', base: 1, baseUnit: 'pc', unitCost: 0.5 },
]

const styleMultipliers = { Plated: 1.0, Buffet: 1.25, Cocktail: 0.65, 'Family Style': 1.1 }

function formatQty(item, guests, multiplier) {
  const ratio = (guests / BASE_GUESTS) * multiplier
  const scaled = item.base * ratio
  if (['pcs', 'pc', 'sprigs', 'cloves'].includes(item.baseUnit)) return `${Math.ceil(scaled)} ${item.baseUnit}`
  if (item.baseUnit === 'lbs') return `${scaled.toFixed(1)} lbs`
  if (item.baseUnit === 'tbsp') return scaled >= 16 ? `${(scaled / 16).toFixed(1)} cups` : `${scaled.toFixed(0)} tbsp`
  if (item.baseUnit === 'cups' || item.baseUnit === 'cup') return `${scaled.toFixed(1)} cups`
  return `${scaled.toFixed(1)} ${item.baseUnit}`
}

function calcCost(guests, multiplier) {
  let total = ingredients.reduce((sum, item) => sum + item.unitCost * item.base * (guests / BASE_GUESTS) * multiplier, 0)
  return total * 1.2
}

export default function EventDetail() {
  const [event, setEvent] = useState(null)
  const [guests, setGuests] = useState(50)
  const [style, setStyle] = useState('Plated')
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('events').select('*').eq('id', params.id).single()
      if (!data) { router.push('/dashboard'); return }
      setEvent(data)
      if (data.guest_count) setGuests(data.guest_count)
      if (data.service_style) setStyle(data.service_style)
      setLoading(false)
    }
    load()
  }, [])

  async function handleDelete() {
    if (!confirm('Delete this event?')) return
    await supabase.from('events').delete().eq('id', params.id)
    router.push('/dashboard')
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{background:'var(--cream)'}}>
      <p style={{color:'var(--muted)'}}>Loading...</p>
    </div>
  )

  const multiplier = styleMultipliers[style] || 1.0
  const totalCost = calcCost(guests, multiplier)
  const perGuest = totalCost / guests

  return (
    <div className="min-h-screen" style={{background:'var(--cream)'}}>
      <nav className="bg-white border-b border-black/5 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <Link href="/dashboard" className="font-bold text-xl" style={{color:'var(--charcoal)'}}>
          🍽 Feast<span style={{color:'var(--gold)'}}>Planner</span>
        </Link>
        <Link href="/dashboard" className="text-sm font-semibold" style={{color:'var(--muted)'}}>← Dashboard</Link>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Event header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{color:'var(--charcoal)'}}>{event.name}</h1>
            <div className="flex gap-4 text-sm" style={{color:'var(--muted)'}}>
              {event.event_date && <span>📅 {new Date(event.event_date).toLocaleDateString()}</span>}
              <span>👥 {guests} guests</span>
              <span>🍽 {style}</span>
            </div>
          </div>
          <button onClick={handleDelete} className="text-sm px-3 py-2 rounded-lg text-red-400 hover:bg-red-50 transition-colors">
            Delete event
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-black/5 sticky top-24">
              <h2 className="font-bold text-lg mb-4" style={{color:'var(--charcoal)'}}>Adjust Parameters</h2>

              <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{color:'var(--muted)'}}>Guest Count</label>
              <div className="text-4xl font-bold text-center mb-3" style={{color:'var(--gold)'}}>{guests}</div>
              <div className="flex items-center gap-2 mb-6">
                <button onClick={() => setGuests(Math.max(1, guests - 10))} className="w-9 h-9 rounded-full border flex items-center justify-center font-bold hover:bg-gray-50 transition-colors" style={{borderColor:'rgba(26,26,26,0.15)'}}>−</button>
                <input type="range" min="1" max="500" value={guests} onChange={e => setGuests(parseInt(e.target.value))} className="flex-1 accent-yellow-500" />
                <button onClick={() => setGuests(Math.min(500, guests + 10))} className="w-9 h-9 rounded-full border flex items-center justify-center font-bold hover:bg-gray-50 transition-colors" style={{borderColor:'rgba(26,26,26,0.15)'}}>+</button>
              </div>

              <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{color:'var(--muted)'}}>Service Style</label>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {['Plated', 'Buffet', 'Cocktail', 'Family Style'].map(s => (
                  <button
                    key={s}
                    onClick={() => setStyle(s)}
                    className="py-2 px-3 rounded-lg text-sm font-semibold border transition-all"
                    style={{
                      background: style === s ? 'var(--charcoal)' : 'white',
                      color: style === s ? 'white' : 'var(--muted)',
                      borderColor: style === s ? 'var(--charcoal)' : 'rgba(26,26,26,0.15)'
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Cost summary */}
              <div className="rounded-xl overflow-hidden border border-black/5">
                <div className="px-4 py-3 border-b border-black/5">
                  <div className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{color:'var(--muted)'}}>Total Food Cost</div>
                  <div className="text-2xl font-bold" style={{fontFamily:'var(--font-playfair)', color:'var(--charcoal)'}}>${totalCost.toFixed(0)}</div>
                </div>
                <div className="px-4 py-3">
                  <div className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{color:'var(--muted)'}}>Per Guest</div>
                  <div className="text-2xl font-bold" style={{fontFamily:'var(--font-playfair)', color:'var(--gold)'}}>${perGuest.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Ingredient table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
              <div className="px-6 py-4 flex items-center justify-between" style={{background:'var(--charcoal)'}}>
                <h2 className="font-bold" style={{fontFamily:'var(--font-playfair)', color:'var(--cream)'}}>Herb Roasted Chicken Dinner</h2>
                <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{background:'rgba(201,151,58,0.2)', color:'#E8B95A'}}>
                  {guests} guests · {style}
                </span>
              </div>
              <div className="divide-y divide-black/5">
                <div className="grid grid-cols-3 px-6 py-3 text-xs font-bold uppercase tracking-wider" style={{color:'var(--muted)'}}>
                  <span>Ingredient</span>
                  <span>Base (4 people)</span>
                  <span style={{color:'var(--gold)'}}>Scaled ({guests})</span>
                </div>
                {ingredients.map(item => (
                  <div key={item.name} className="grid grid-cols-3 px-6 py-3 text-sm hover:bg-yellow-50/30 transition-colors">
                    <span className="font-medium" style={{color:'var(--charcoal)'}}>{item.name}</span>
                    <span style={{color:'var(--muted)'}}>{item.base} {item.baseUnit}</span>
                    <span className="font-bold" style={{color:'var(--gold)'}}>{formatQty(item, guests, multiplier)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shopping list */}
            <div className="bg-white rounded-2xl border border-black/5 mt-4 p-6">
              <h2 className="font-bold text-lg mb-4" style={{color:'var(--charcoal)'}}>Shopping List Categories</h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { emoji: '🥩', label: 'Proteins', items: ['Chicken breasts', 'Chicken broth'] },
                  { emoji: '🥦', label: 'Produce', items: ['Mixed vegetables', 'Russet potatoes', 'Lemon', 'Fresh thyme', 'Garlic'] },
                  { emoji: '🫙', label: 'Pantry', items: ['Olive oil', 'Unsalted butter', 'Heavy cream'] },
                ].map(cat => (
                  <div key={cat.label} className="rounded-xl p-4" style={{background:'var(--cream)'}}>
                    <div className="text-2xl mb-1">{cat.emoji}</div>
                    <div className="font-bold text-sm mb-2" style={{color:'var(--charcoal)'}}>{cat.label}</div>
                    {cat.items.map(i => <div key={i} className="text-xs mb-0.5" style={{color:'var(--muted)'}}>{i}</div>)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
