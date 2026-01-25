import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch recent presentations
  const { data: presentations } = await supabase
    .from('presentations')
    .select('*')
    .eq('user_id', user?.id)
    .order('updated_at', { ascending: false })
    .limit(3)

  const isNewUser = !presentations || presentations.length === 0

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Home</h1>
        <p className="text-text-secondary">
          {isNewUser
            ? "Welcome! Let's create your first Pollio!"
            : "Welcome back, what do you want to do today?"}
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid md:grid-cols-2 gap-4 mb-10">
        <Link
          href="/app/presentations/new"
          className="flex items-center gap-4 p-4 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
        >
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <div className="font-semibold">New Presentation</div>
            <div className="text-sm text-white/80">Create an interactive presentation</div>
          </div>
        </Link>

        <Link
          href="/app/presentations"
          className="flex items-center gap-4 p-4 bg-surface border border-text-secondary/10 rounded-xl hover:border-primary/50 transition-colors"
        >
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <div className="font-semibold text-text-primary">All Presentations</div>
            <div className="text-sm text-text-secondary">View and manage your presentations</div>
          </div>
        </Link>
      </div>

      {/* Recent presentations */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Recent Presentations</h2>
          <Link href="/app/presentations" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>

        {presentations && presentations.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-4">
            {presentations.map((presentation) => (
              <Link
                key={presentation.id}
                href={`/app/presentations/${presentation.id}`}
                className="p-4 bg-background border border-text-secondary/10 rounded-xl hover:border-primary/50 transition-colors"
              >
                <h3 className="font-medium text-text-primary mb-1 truncate">
                  {presentation.title}
                </h3>
                <p className="text-sm text-text-secondary">
                  Updated {new Date(presentation.updated_at).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-surface rounded-xl">
            <p className="text-text-secondary mb-4">No presentations yet</p>
            <Link
              href="/app/presentations/new"
              className="text-primary hover:underline"
            >
              Create your first presentation
            </Link>
          </div>
        )}
      </div>

      {/* Templates */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Templates</h2>
        <div className="text-center py-12 bg-surface rounded-xl border border-text-secondary/10">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </div>
          <p className="text-text-secondary font-medium">Coming soon</p>
          <p className="text-text-secondary/70 text-sm mt-1">
            Pre-built templates to get you started quickly
          </p>
        </div>
      </div>
    </div>
  )
}
