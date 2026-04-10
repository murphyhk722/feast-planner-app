import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{background:'var(--cream)'}}>
      <div className="text-center max-w-lg">
        <div className="text-4xl mb-4">🍽</div>
        <h1 className="text-4xl font-bold mb-3" style={{color:'var(--charcoal)'}}>
          Feast<span style={{color:'var(--gold)'}}>Planner</span>
        </h1>
        <p className="text-lg mb-8" style={{color:'var(--muted)'}}>
          AI-powered meal planning for events of every size.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/login"
            className="px-6 py-3 rounded-lg font-semibold text-white transition-all hover:-translate-y-0.5"
            style={{background:'var(--charcoal)'}}
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="px-6 py-3 rounded-lg font-semibold text-white transition-all hover:-translate-y-0.5"
            style={{background:'var(--gold)'}}
          >
            Sign Up Free →
          </Link>
        </div>
      </div>
    </div>
  )
}
