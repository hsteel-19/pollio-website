import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function SessionHistoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch user's presentations to filter sessions
  const { data: presentations } = await supabase
    .from('presentations')
    .select('id')
    .eq('user_id', user?.id)

  const presentationIds = presentations?.map((p) => p.id) || []

  // Fetch all sessions for user's presentations
  const { data: sessions } = presentationIds.length > 0
    ? await supabase
        .from('sessions')
        .select(`
          *,
          presentations (
            id,
            title
          )
        `)
        .in('presentation_id', presentationIds)
        .order('started_at', { ascending: false })
    : { data: [] }

  // Get response counts for each session
  const sessionIds = sessions?.map((s) => s.id) || []
  const { data: responseCounts } = sessionIds.length > 0
    ? await supabase
        .from('responses')
        .select('session_id')
        .in('session_id', sessionIds)
    : { data: [] }

  // Count responses per session
  const responseCountMap: Record<string, number> = {}
  responseCounts?.forEach((r) => {
    responseCountMap[r.session_id] = (responseCountMap[r.session_id] || 0) + 1
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Session History</h1>
        <p className="text-text-secondary">
          View all your past and active sessions with their results.
        </p>
      </div>

      {sessions && sessions.length > 0 ? (
        <div className="bg-background border border-text-secondary/10 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-surface">
              <tr>
                <th className="text-left text-sm font-medium text-text-secondary px-4 py-3">Presentation</th>
                <th className="text-left text-sm font-medium text-text-secondary px-4 py-3">Code</th>
                <th className="text-left text-sm font-medium text-text-secondary px-4 py-3">Status</th>
                <th className="text-left text-sm font-medium text-text-secondary px-4 py-3">Responses</th>
                <th className="text-left text-sm font-medium text-text-secondary px-4 py-3">Started</th>
                <th className="text-left text-sm font-medium text-text-secondary px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-text-secondary/10">
              {sessions.map((session) => (
                <tr key={session.id} className="hover:bg-surface/50">
                  <td className="px-4 py-4">
                    <Link
                      href={`/app/presentations/${session.presentation_id}`}
                      className="text-text-primary hover:text-primary font-medium"
                    >
                      {session.presentations?.title || 'Unknown'}
                    </Link>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-mono text-sm bg-surface px-2 py-1 rounded">
                      {session.code}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-sm px-2.5 py-1 rounded-full ${
                      session.status === 'active'
                        ? 'bg-success/10 text-success'
                        : 'bg-text-secondary/10 text-text-secondary'
                    }`}>
                      {session.status === 'active' ? 'Live' : 'Ended'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-text-secondary">
                    {responseCountMap[session.id] || 0} responses
                  </td>
                  <td className="px-4 py-4 text-sm text-text-secondary">
                    {new Date(session.started_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-4 py-4">
                    {session.status === 'active' ? (
                      <Link
                        href={`/app/present/${session.id}`}
                        className="text-sm text-primary hover:underline font-medium"
                      >
                        Resume
                      </Link>
                    ) : (
                      <Link
                        href={`/app/history/${session.id}`}
                        className="text-sm text-primary hover:underline"
                      >
                        View results
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16 bg-surface rounded-xl">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">No sessions yet</h2>
          <p className="text-text-secondary mb-6">
            Start a session from any presentation to see it here.
          </p>
          <Link
            href="/app/presentations"
            className="inline-block bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Go to presentations
          </Link>
        </div>
      )}
    </div>
  )
}
