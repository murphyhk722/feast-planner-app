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
  return `${scaled.toFixed(1)} ${unit}`
}

export default function RecipeDetail() {
  const [recipe, setRecipe] = useState(null)
  const [ingredients, setIngredients] = useState([])
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
      const { data: rec } = await supabase.from('recipes').select('*').eq('id', params.id).single()
      if (!rec) { router.push('/recipes'); return }
      setRecipe(rec)
      const { data: ings } = await supabase.from('recipe_ingredients').select('*').eq('recipe_id', params.id)
      setIngredients(ings || [])
      setLoading(false)
    }
    load()
  }, [])

  const multiplier = styleMultipliers[style] || 1.0
  const totalCost = ingredients.reduce((sum, ing) => {
    return sum + (ing.unit_cost || 0) * (ing.base_qty || 0) * (guests / BASE_GUESTS) * multiplier
  }, 0) * 1.2
  const perGuest = guests > 0 ? totalCost / guests : 0

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
        <Link href="/recipes" className="text-sm font-semibold" style={{color:'var(--muted)'}}>← My Recipes</Link>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1" style={{color:'var(--charcoal)'}}>{recipe.name}</h1>
          {recipe.description && <p style={{color:'var(--muted)'}}>{recipe.description}</p>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-black/5 sticky top-24">
              <h2 className="font-bold text-lg mb-4" style={{color:'var(--charcoal)'}}>Scale Preview</h2>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{color:'var(--muted)'}}>Guest Count</label>
              <div className="text-4xl font-bold text-center mb-3" style={{color:'var(--gold)'}}>{guests}</div>
              <div className="flex items-center gap-2 mb-6">
                <button onClick={() => setGuests(Math.max(1, guests - 10))} className="w-9 h-9 rounded-full border flex items-center justify-center font-bold" style={{borderColor:'rgba(26,26,26,0.15)'}}>−</button>
                <input type="range" min="1" max="500" value={guests} onChange={e => setGuests(parseInt(e.target.value))} className="flex-1 accent-yellow-500" />
                <button onClick={() => setGuests(Math.min(500, guests + 10))} className="w-9 h-9 rounded-full border flex items-center justify-center font-bold" style={{borderColor:'rgba(26,26,26,0.15)'}}>+</button>
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
                  <div className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{color:'var(--muted)'}}>Total Cost</div>
                  <div className="text-2xl font-bold" style={{color:'var(--charcoal)'}}>${totalCost.toFixed(0)}</div>
                </div>
                <div className="px-4 py-3">
                  <div className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{color:'var(--muted)'}}>Per Guest</div>
                  <div className="text-2xl font-bold" style={{color:'var(--gold)'}}>${perGuest.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
              <div className="px-6 py-4" style={{background:'var(--charcoal)'}}>
                <h2 className="font-bold" style={{color:'var(--cream)'}}>Ingredients — scaled to {guests} guests</h2>
              </div>
              <div className="grid px-6 py-3 text-xs font-bold uppercase tracking-wider border-b border-black/5"
                style={{gridTemplateColumns:'1fr 100px 100px', color:'var(--muted)'}}>
                <span>Ingredient</span><span>Base (4)</span><span style={{color:'var(--gold)'}}>Scaled</span>
              </div>
              {ingredients.map(ing => (
                <div key={ing.id} className="grid px-6 py-3 border-b border-black/5 last:border-0 text-sm hover:bg-yellow-50/20"
                  style={{gridTemplateColumns:'1fr 100px 100px'}}>
                  <span className="font-medium" style={{color:'var(--charcoal)'}}>{ing.name}</span>
                  <span style={{color:'var(--muted)'}}>{ing.base_qty} {ing.unit}</span>
                  <span className="font-bold" style={{color:'var(--gold)'}}>
                    {formatQty(ing.base_qty, ing.unit, guests, multiplier)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
