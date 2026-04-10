'use client'
import { useState } from 'react'
import { createClient } from '../../../utils/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewRecipe() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [ingredients, setIngredients] = useState([
    { name: '', base_qty: '', unit: '', unit_cost: '' }
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  function updateIngredient(index, field, value) {
    const updated = [...ingredients]
    updated[index][field] = value
    setIngredients(updated)
  }

  function addRow() {
    setIngredients([...ingredients, { name: '', base_qty: '', unit: '', unit_cost: '' }])
  }

  function removeRow(index) {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { data: recipe, error: recipeError } = await supabase.from('recipes').insert({
      name, description, user_id: user.id
    }).select().single()

    if (recipeError) { setError(recipeError.message); setLoading(false); return }

    const validIngredients = ingredients.filter(i => i.name.trim())
    if (validIngredients.length > 0) {
      await supabase.from('recipe_ingredients').insert(
        validIngredients.map(ing => ({
          recipe_id: recipe.id,
          name: ing.name,
          base_qty: parseFloat(ing.base_qty) || 0,
          unit: ing.unit,
          unit_cost: parseFloat(ing.unit_cost) || 0
        }))
      )
    }

    router.push(`/recipes/${recipe.id}`)
  }

  return (
    <div className="min-h-screen" style={{background:'var(--cream)'}}>
      <nav className="bg-white border-b border-black/5 px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="font-bold text-xl" style={{color:'var(--charcoal)'}}>
          🍽 Feast<span style={{color:'var(--gold)'}}>Planner</span>
        </Link>
        <Link href="/recipes" className="text-sm font-semibold" style={{color:'var(--muted)'}}>← My Recipes</Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-2" style={{color:'var(--charcoal)'}}>Create New Recipe</h1>
        <p className="mb-8" style={{color:'var(--muted)'}}>Build a custom recipe to reuse across your events. Base quantities are for 4 people.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-8 border border-black/5">
            <h2 className="font-bold text-lg mb-4" style={{color:'var(--charcoal)'}}>Recipe Info</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{color:'var(--muted)'}}>Recipe Name *</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Grandma's Lasagna" required
                  className="w-full px-4 py-3 rounded-lg border text-sm outline-none"
                  style={{borderColor:'rgba(26,26,26,0.15)', background:'var(--cream)'}} />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{color:'var(--muted)'}}>Description</label>
                <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description of the dish"
                  className="w-full px-4 py-3 rounded-lg border text-sm outline-none"
                  style={{borderColor:'rgba(26,26,26,0.15)', background:'var(--cream)'}} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-black/5">
            <h2 className="font-bold text-lg mb-2" style={{color:'var(--charcoal)'}}>Ingredients</h2>
            <p className="text-xs mb-4" style={{color:'var(--muted)'}}>Enter quantities for 4 people — the app scales everything automatically.</p>

            <div className="grid gap-2 mb-2 text-xs font-bold uppercase tracking-wider px-1" style={{gridTemplateColumns:'1fr 80px 80px 90px 32px', color:'var(--muted)'}}>
              <span>Ingredient</span><span>Qty (4)</span><span>Unit</span><span>$/unit</span><span></span>
            </div>

            {ingredients.map((ing, i) => (
              <div key={i} className="grid gap-2 mb-2 items-center" style={{gridTemplateColumns:'1fr 80px 80px 90px 32px'}}>
                <input value={ing.name} onChange={e => updateIngredient(i, 'name', e.target.value)} placeholder="e.g. Flour"
                  className="px-3 py-2 rounded-lg border text-sm" style={{borderColor:'rgba(26,26,26,0.15)'}} />
                <input value={ing.base_qty} onChange={e => updateIngredient(i, 'base_qty', e.target.value)} placeholder="2" type="number"
                  className="px-3 py-2 rounded-lg border text-sm" style={{borderColor:'rgba(26,26,26,0.15)'}} />
                <input value={ing.unit} onChange={e => updateIngredient(i, 'unit', e.target.value)} placeholder="cups"
                  className="px-3 py-2 rounded-lg border text-sm" style={{borderColor:'rgba(26,26,26,0.15)'}} />
                <input value={ing.unit_cost} onChange={e => updateIngredient(i, 'unit_cost', e.target.value)} placeholder="0.50" type="number" step="0.01"
                  className="px-3 py-2 rounded-lg border text-sm" style={{borderColor:'rgba(26,26,26,0.15)'}} />
                <button type="button" onClick={() => removeRow(i)} className="text-red-400 hover:text-red-600 text-lg leading-none">×</button>
              </div>
            ))}

            <button type="button" onClick={addRow}
              className="mt-2 text-sm font-semibold px-4 py-2 rounded-lg border transition-all hover:bg-gray-50"
              style={{borderColor:'rgba(26,26,26,0.15)', color:'var(--charcoal)'}}>
              + Add Row
            </button>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-lg font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50"
            style={{background:'var(--charcoal)'}}>
            {loading ? 'Saving...' : 'Save Recipe →'}
          </button>
        </form>
      </div>
    </div>
  )
}
