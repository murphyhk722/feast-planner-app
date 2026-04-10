'use client'
import { useEffect, useState } from 'react'
import { createClient } from '../../utils/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Dashboard() {
  const [events, setEvents] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      const { data } = await supabase.from('events').select('*').order('created_at', { ascending: false })
      setEvents(data || [])
      setLoading(false)
    }
    load()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{background:'var(--cream)'}}>
      <p style={{color:'var(--muted)'}}>Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen" style={{background:'var(--cream)'}}>
      {/* Nav */}
      <nav className="bg-white border-b border-black/5 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <Link href="/dashboard" className="font-bold text-xl" style={{color:'var(--charcoal)'}}>
          🍽 Feast<span style={{color:'var(--gold)'}}>Planner</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm" style={{color:'var(--muted)'}}>{user?.email}</span>
          <button onClick={handleLogout} className="text-sm font-semibold px-4 py-2 rounded-lg border transition-all hover:bg-black hover:text-white" style={{borderColor:'rgba(26,26,26,0.15)'}}>
            Log out
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1" style={{color:'var(--charcoal)'}}>Your Events</h1>
            <p style={{color:'var(--muted)'}}>Plan and manage your event menus.</p>
          </div>
          <Link
            href="/events/new"
            className="px-5 py-3 rounded-lg font-semibold text-white transition-all hover:-translate-y-0.5"
            style={{background:'var(--charcoal)'}}
          >
            + New Event
          </Link>
        </div>

        {/* Events list */}
        {events.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-black/5">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-xl font-bold mb-2" style={{color:'var(--charcoal)'}}>No events yet</h2>
            <p className="mb-6" style={{color:'var(--muted)'}}>Create your first event to start planning your menu.</p>
            <Link
              href="/events/new"
              className="inline-block px-6 py-3 rounded-lg font-semibold text-white"
              style={{background:'var(--gold)'}}
            >
              Create First Event →
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {events.map(event => (
              <Link key={event.id} href={`/events/${event.id}`}>
                <div className="bg-white rounded-2xl p-6 border border-black/5 hover:shadow-md transition-all hover:-translate-y-0.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold mb-1" style={{color:'var(--charcoal)'}}>{event.name}</h2>
                      <div className="flex gap-4 text-sm" style={{color:'var(--muted)'}}>
                        {event.event_date && <span>📅 {new Date(event.event_date).toLocaleDateString()}</span>}
                        {event.guest_count && <span>👥 {event.guest_count} guests</span>}
                        {event.service_style && <span>🍽 {event.service_style}</span>}
                      </div>
                    </div>
                    <span className="text-2xl">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
