'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/i18n'

interface Session {
  id: string
  status: string
}

interface Presentation {
  id: string
  title: string
  updated_at: string
  sessions: Session[] | null
}

interface PresentationsContentProps {
  presentations: Presentation[] | null
}

export function PresentationsContent({ presentations }: PresentationsContentProps) {
  const { t } = useLanguage()

  // Split presentations into drafts and completed
  const drafts = presentations?.filter(p => {
    const endedSessions = p.sessions?.filter((s) => s.status === 'ended') || []
    return endedSessions.length === 0
  }) || []

  const completed = presentations?.filter(p => {
    const endedSessions = p.sessions?.filter((s) => s.status === 'ended') || []
    return endedSessions.length > 0
  }) || []

  const PresentationCard = ({ presentation }: { presentation: Presentation }) => (
    <Link
      href={`/app/presentations/${presentation.id}`}
      className="bg-background border border-text-secondary/10 rounded-xl p-6 hover:border-primary/50 hover:shadow-lg transition-all group"
    >
      <h3 className="font-semibold text-text-primary group-hover:text-primary mb-2 truncate">
        {presentation.title}
      </h3>
      <p className="text-sm text-text-secondary">
        {t.app.presentations.updated} {new Date(presentation.updated_at).toLocaleDateString()}
      </p>
    </Link>
  )

  const hasNoPresentations = !presentations || presentations.length === 0

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-text-primary">{t.app.presentations.title}</h1>
        <Link
          href="/app/presentations/new"
          className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          {t.app.presentations.newPresentation}
        </Link>
      </div>

      {hasNoPresentations ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">{t.app.presentations.noPresentationsYet}</h2>
          <p className="text-text-secondary mb-6">{t.app.presentations.createFirstDesc}</p>
          <Link
            href="/app/presentations/new"
            className="inline-block bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {t.app.presentations.createPresentation}
          </Link>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Drafts Section */}
          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-4">{t.app.presentations.drafts}</h2>
            {drafts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {drafts.map((presentation) => (
                  <PresentationCard key={presentation.id} presentation={presentation} />
                ))}
                {/* New presentation card */}
                <Link
                  href="/app/presentations/new"
                  className="border-2 border-dashed border-text-secondary/20 rounded-xl p-6 hover:border-primary hover:bg-primary/5 transition-colors group flex flex-col items-center justify-center min-h-[120px]"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary/20">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <span className="text-sm text-text-secondary group-hover:text-primary">{t.app.presentations.newPresentation}</span>
                </Link>
              </div>
            ) : (
              <div className="bg-surface rounded-xl p-8 text-center">
                <p className="text-text-secondary mb-4">{t.app.presentations.noDrafts}</p>
                <Link
                  href="/app/presentations/new"
                  className="inline-flex items-center text-primary hover:underline"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {t.app.presentations.createNew}
                </Link>
              </div>
            )}
          </section>

          {/* Completed Section */}
          {completed.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-4">{t.app.presentations.completed}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completed.map((presentation) => (
                  <PresentationCard key={presentation.id} presentation={presentation} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
