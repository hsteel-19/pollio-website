import { createClient } from '@/lib/supabase/server'
import { AudienceView } from './AudienceView'

export default async function JoinSessionPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  const supabase = await createClient()

  // Look up session by code
  const { data: session, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('status', 'active')
    .single()

  if (error || !session) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-text-primary mb-2">
          Session not found
        </h1>
        <p className="text-text-secondary mb-6">
          Code: <span className="font-mono font-bold">{code.toUpperCase()}</span>
        </p>
        <p className="text-sm text-text-secondary">
          This session may have ended or the code is incorrect.
        </p>
        <a
          href="/join"
          className="inline-block mt-6 text-primary hover:underline"
        >
          Try a different code
        </a>
      </div>
    )
  }

  // Fetch the active slide
  const { data: activeSlide } = session.active_slide_id
    ? await supabase
        .from('slides')
        .select('*')
        .eq('id', session.active_slide_id)
        .single()
    : { data: null }

  return (
    <AudienceView
      session={session}
      initialSlide={activeSlide}
    />
  )
}
