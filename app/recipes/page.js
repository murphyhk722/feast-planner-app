'use client'
import { useEffect, useState } from 'react'
import { createClient } from '../../utils/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Recipes() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('recipes').select('*, recipe_ingredients(count)').order('created_at', { ascending: false })
      setRecipes(data || [])
      setLoading(false)
    }
    load()
  }, [])

  async function deleteRecipe(id) {
    if (!confirm('Delete this recipe?')) return
    await supabase.from('recipes').delete().eq('id', id)
    setRecipes(recipes.filter(r => r.id !== id))
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
        <Link href="/dashboard" className="text-sm font-semibold" style={{color:'var(--muted)'}}>← Dashboard</Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1" style={{color:'var(--charcoal)'}}>My Recipes</h1>
            <p style={{color:'var(--muted)'}}>Save custom recipes to reuse across events.</p>
          </div>
          <Link href="/recipes/new"
            className="px-5 py-3 rounded-lg font-semibold text-white transition-all hover:-translate-y-0.5"
            style={{background:'var(--charcoal)'}}>
            + New Recipe
          </Link>
        </div>

        {recipes.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-black/5">
            <div className="text-5xl mb-4">📋</div>
            <h2 className="text-xl font-bold mb-2" style={{color:'var(--charcoal)'}}>No saved recipes yet</h2>
            <p className="mb-6" style={{color:'var(--muted)'}}>Create a custom recipe to reuse it across multiple events.</p>
            <Link href="/recipes/new"
              className="inline-block px-6 py-3 rounded-lg font-semibold text-white"
              style={{background:'var(--gold)'}}>
              Create First Recipe →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {recipes.map(recipe => (
              <div key={recipe.id} className="bg-white rounded-2xl p-6 border border-black/5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold mb-1" style={{color:'var(--charcoal)'}}>{recipe.name}</h2>
                  {recipe.description && <p className="text-sm mb-1" style={{color:'var(--muted)'}}>{recipe.description}</p>}
                  <span className="text-xs" style={{color:'var(--muted)'}}>
                    {recipe.recipe_ingredients?.[0]?.count || 0} ingredients
                  </span>
                </div>
                <div className="flex gap-2">
                  <Link href={`/recipes/${recipe.id}`}
                    className="px-4 py-2 rounded-lg text-sm font-semibold border transition-all hover:bg-gray-50"
                    style={{borderColor:'rgba(26,26,26,0.15)', color:'var(--charcoal)'}}>
                    View
                  </Link>
                  <button onClick={() => deleteRecipe(recipe.id)}
                    className="px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors text-red-400">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
