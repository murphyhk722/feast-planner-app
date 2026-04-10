'use client'
import { useEffect, useState } from 'react'
import { createClient } from '../../../utils/supabase'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

const BASE_GUESTS = 4
const styleMultipliers = { Plated: 1.0, Buffet: 1.25, Cocktail: 0.65, 'Family Style': 1.1 }

function formatQty(baseQty, unit, guests, multiplier) {
  const ratio = (guests / BASE_GUESTS) * multiplier
  const scaled = baseQty * ratio
  if (['pcs', 'pc', 'sprigs', 'cloves', 'box'].includes(unit)) return `${Math.ceil(scaled)} ${unit}`
  if (unit === 'lbs') return `${scaled.toFixed(1)} lbs`
  if (unit === 'tbsp') return scaled >= 16 ? `${(scaled / 16).toFixed(1)} cups` : `${scaled.toFixed(0)} tbsp`
  if (unit === 'cups' || unit === 'cup') return `${scaled.toFixed(1)} cups`
  if (unit === 'loaf') return `${Math.ceil(scaled)} loaf`
  return `${scaled.toFixed(1)} ${unit}`
}

export default function EventDetail() {
  const [event, setEvent] = useState(null)
  const [ingredients, setIngredients] = useState([])
  const [guests, setGuests] = useState(50)
  const [style, setStyle] = useState('Plated')
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [showAddForm, setShowAddForm] = useState(false)
  const [newIngredient, setNewIngredient] = useState({ name: '', base_qty: '', unit: '', unit_cost: '' })
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data: ev } = await supabase.from('events').select('*').eq('id', params.id).single()
      if (!ev) { router.push('/dashboard'); return }
      setEvent(ev)
      if (ev.guest_count) setGuests(ev.guest_count)
      if (ev.service_style) setStyle(ev.service_style)
      const { data: ings } = await supabase.from('event_ingredients').select('*').eq('event_id', params.id).order('created_at')
      setIngredients(ings || [])
      setLoading(false)
    }
    load()
  }, [])

  const multiplier = styleMultipliers[style] || 1.0
  const totalCost = ingredients.reduce((sum, ing) => {
    const ratio = (guests / BASE_GUESTS) * multiplier
    return sum + (ing.unit_cost || 0) * (ing.base_qty || 0) * ratio
  }, 0) * 1.2
  const perGuest = guests > 0 ? totalCost / guests : 0

  async function handleDelete() {
    if (!confirm('Delete this event?')) return
    await supabase.from('events').delete().eq('id', params.id)
    router.push('/dashboard')
  }

  async function deleteIngredient(id) {
    await supabase.from('event_ingredients').delete().eq('id', id)
    setIngredients(ingredients.filter(i => i.id !== id))
  }

  function startEdit(ing) {
    setEditingId(ing.id)
    setEditForm({ name: ing.name, base_qty: ing.base_qty, unit: ing.unit, unit_cost: ing.unit_cost })
  }

  async function saveEdit(id) {
    setSaving(true)
    const { data } = await supabase.from('event_ingredients').update({
      name: editForm.name,
      base_qty: parseFloat(editForm.base_qty) || 0,
      unit: editForm.unit,
      unit_cost: parseFloat(editForm.unit_cost) || 0
    }).eq('id', id).select().single()
    setIngredients(ingredients.map(i => i.id === id ? data : i))
    setEditingId(null)
    setSaving(false)
  }

  async function addIngredient(e) {
    e.preventDefault()
    setSaving(true)
    const { data } = await supabase.from('event_ingredients').insert({
      event_id: params.id,
      name: newIngredient.name,
      base_qty: parseFloat(newIngredient.base_qty) || 0,
      unit: newIngredient.unit,
      unit_cost: parseFloat(newIngredient.unit_cost) || 0
    }).select().single()
    setIngredients([...ingredients, data])
    setNewIngredient({ name: '', base_qty: '', unit: '', unit_cost: '' })
    setShowAddForm(false)
    setSaving(false)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{background:'var(--cream)'}}>
      <p style={{color:'var(--muted)'}}>Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen" style={{background:'var(--cream)'}}>
      <nav className="bg-white border-b border-black/5 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <Link href="/dashboard" className="font-bold text-xl" style={{color:'var(--charcoal)'}}>
          🍽 Feast<span style={{color:'var(--gold)'}}>Planner</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/recipes" className="text-sm font-semibold" style={{color:'var(--muted)'}}>My Recipes</Link>
          <Link href="/dashboard" className="text-sm font-semibold" style={{color:'var(--muted)'}}>← Dashboard</Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{color:'var(--charcoal)'}}>{event.name}</h1>
            <div className="flex gap-4 text-sm" style={{color:'var(--muted)'}}>
              {event.event_date && <span>📅 {new Date(event.event_date).toLocaleDateString()}</span>}
              <span>👥 {guests} guests</span>
              <span>🍽 {style}</span>
            </div>
          </div>
          <button onClick={handleDelete} className="text-sm px-3 py-2 rounded-lg text-red-400 hover:bg-red-50 transition-colors">Delete event</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-black/5 sticky top-24">
              <h2 className="font-bold text-lg mb-4" style={{color:'var(--charcoal)'}}>Adjust Parameters</h2>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{color:'var(--muted)'}}>Guest Count</label>
              <div className="text-4xl font-bold text-center mb-3" style={{color:'var(--gold)'}}>{guests}</div>
              <div className="flex items-center gap-2 mb-6">
                <button onClick={() => setGuests(Math.max(1, guests - 10))} className="w-9 h-9 rounded-full border flex items-center justify-center font-bold hover:bg-gray-50" style={{borderColor:'rgba(26,26,26,0.15)'}}>−</button>
                <input type="range" min="1" max="500" value={guests} onChange={e => setGuests(parseInt(e.target.value))} className="flex-1 accent-yellow-500" />
                <button onClick={() => setGuests(Math.min(500, guests + 10))} className="w-9 h-9 rounded-full border flex items-center justify-center font-bold hover:bg-gray-50" style={{borderColor:'rgba(26,26,26,0.15)'}}>+</button>
              </div>

              <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{color:'var(--muted)'}}>Service Style</label>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {['Plated', 'Buffet', 'Cocktail', 'Family Style'].map(s => (
                  <button key={s} onClick={() => setStyle(s)}
                    className="py-2 px-3 rounded-lg text-sm font-semibold border transition-all"
                    style={{
                      background: style === s ? 'var(--charcoal)' : 'white',
                      color: style === s ? 'white' : 'var(--muted)',
                      borderColor: style === s ? 'var(--charcoal)' : 'rgba(26,26,26,0.15)'
                    }}>{s}</button>
                ))}
              </div>

              <div className="rounded-xl overflow-hidden border border-black/5">
                <div className="px-4 py-3 border-b border-black/5">
                  <div className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{color:'var(--muted)'}}>Total Food Cost</div>
                  <div className="text-2xl font-bold" style={{color:'var(--charcoal)'}}>${totalCost.toFixed(0)}</div>
                </div>
                <div className="px-4 py-3">
                  <div className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{color:'var(--muted)'}}>Per Guest</div>
                  <div className="text-2xl font-bold" style={{color:'var(--gold)'}}>${perGuest.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
              <div className="px-6 py-4 flex items-center justify-between" style={{background:'var(--charcoal)'}}>
                <h2 className="font-bold" style={{color:'var(--cream)'}}>Ingredients</h2>
                <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{background:'rgba(201,151,58,0.2)', color:'#E8B95A'}}>
                  {guests} guests · {style}
                </span>
              </div>

              {/* Header row */}
              <div className="grid px-6 py-3 text-xs font-bold uppercase tracking-wider border-b border-black/5"
                style={{gridTemplateColumns:'1fr 90px 90px 110px 80px', color:'var(--muted)'}}>
                <span>Ingredient</span>
                <span>Base (4)</span>
                <span>Unit</span>
                <span style={{color:'var(--gold)'}}>Scaled ({guests})</span>
                <span></span>
              </div>

              {ingredients.length === 0 && (
                <div className="px-6 py-8 text-center" style={{color:'var(--muted)'}}>
                  No ingredients yet. Add one below.
                </div>
              )}

              {ingredients.map(ing => (
                <div key={ing.id} className="border-b border-black/5 last:border-0">
                  {editingId === ing.id ? (
                    <div className="grid gap-2 px-6 py-3 items-center" style={{gridTemplateColumns:'1fr 90px 90px 110px 80px'}}>
                      <input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})}
                        className="px-2 py-1 rounded border text-sm" style={{borderColor:'rgba(26,26,26,0.2)'}} />
                      <input value={editForm.base_qty} onChange={e => setEditForm({...editForm, base_qty: e.target.value})}
                        type="number" className="px-2 py-1 rounded border text-sm" style={{borderColor:'rgba(26,26,26,0.2)'}} />
                      <input value={editForm.unit} onChange={e => setEditForm({...editForm, unit: e.target.value})}
                        className="px-2 py-1 rounded border text-sm" style={{borderColor:'rgba(26,26,26,0.2)'}} />
                      <span className="text-sm font-bold" style={{color:'var(--gold)'}}>
                        {formatQty(parseFloat(editForm.base_qty)||0, editForm.unit, guests, multiplier)}
                      </span>
                      <div className="flex gap-1">
                        <button onClick={() => saveEdit(ing.id)} disabled={saving}
                          className="text-xs px-2 py-1 rounded font-semibold text-white" style={{background:'var(--sage)'}}>
                          Save
                        </button>
                        <button onClick={() => setEditingId(null)} className="text-xs px-2 py-1 rounded font-semibold" style={{background:'var(--cream)'}}>✕</button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid px-6 py-3 items-center hover:bg-yellow-50/20 transition-colors"
                      style={{gridTemplateColumns:'1fr 90px 90px 110px 80px'}}>
                      <span className="font-medium text-sm" style={{color:'var(--charcoal)'}}>{ing.name}</span>
                      <span className="text-sm" style={{color:'var(--muted)'}}>{ing.base_qty}</span>
                      <span className="text-sm" style={{color:'var(--muted)'}}>{ing.unit}</span>
                      <span className="text-sm font-bold" style={{color:'var(--gold)'}}>
                        {formatQty(ing.base_qty, ing.unit, guests, multiplier)}
                      </span>
                      <div className="flex gap-1">
                        <button onClick={() => startEdit(ing)} className="text-xs px-2 py-1 rounded hover:bg-gray-100 transition-colors" style={{color:'var(--muted)'}}>Edit</button>
                        <button onClick={() => deleteIngredient(ing.id)} className="text-xs px-2 py-1 rounded hover:bg-red-50 transition-colors text-red-400">Del</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Add ingredient */}
              {showAddForm ? (
                <form onSubmit={addIngredient} className="px-6 py-4 border-t border-black/5" style={{background:'var(--cream)'}}>
                  <div className="grid gap-2 mb-3" style={{gridTemplateColumns:'1fr 90px 90px 100px'}}>
                    <input value={newIngredient.name} onChange={e => setNewIngredient({...newIngredient, name: e.target.value})}
                      placeholder="Ingredient name" required
                      className="px-3 py-2 rounded-lg border text-sm" style={{borderColor:'rgba(26,26,26,0.15)'}} />
                    <input value={newIngredient.base_qty} onChange={e => setNewIngredient({...newIngredient, base_qty: e.target.value})}
                      placeholder="Qty (4)" type="number" required
                      className="px-3 py-2 rounded-lg border text-sm" style={{borderColor:'rgba(26,26,26,0.15)'}} />
                    <input value={newIngredient.unit} onChange={e => setNewIngredient({...newIngredient, unit: e.target.value})}
                      placeholder="Unit" required
                      className="px-3 py-2 rounded-lg border text-sm" style={{borderColor:'rgba(26,26,26,0.15)'}} />
                    <input value={newIngredient.unit_cost} onChange={e => setNewIngredient({...newIngredient, unit_cost: e.target.value})}
                      placeholder="$/unit" type="number" step="0.01"
                      className="px-3 py-2 rounded-lg border text-sm" style={{borderColor:'rgba(26,26,26,0.15)'}} />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" disabled={saving}
                      className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{background:'var(--charcoal)'}}>
                      {saving ? 'Adding...' : 'Add Ingredient'}
                    </button>
                    <button type="button" onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 rounded-lg text-sm font-semibold" style={{background:'white', color:'var(--muted)'}}>
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="px-6 py-3 border-t border-black/5">
                  <button onClick={() => setShowAddForm(true)}
                    className="text-sm font-semibold px-4 py-2 rounded-lg border transition-all hover:bg-gray-50"
                    style={{borderColor:'rgba(26,26,26,0.15)', color:'var(--charcoal)'}}>
                    + Add Ingredient
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
