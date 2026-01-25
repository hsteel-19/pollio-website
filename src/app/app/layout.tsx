import { createClient } from '@/lib/supabase/server'
import { Sidebar } from './Sidebar'

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch profile for full name
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user?.id)
    .single()

  return (
    <div className="min-h-screen bg-surface">
      <div className="flex">
        <Sidebar
          userEmail={user?.email || ''}
          userName={profile?.full_name || null}
        />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
