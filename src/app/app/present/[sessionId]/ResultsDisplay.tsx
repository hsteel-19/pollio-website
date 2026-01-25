'use client'

type SlideType = 'welcome' | 'multiple_choice' | 'scale' | 'word_cloud' | 'open_ended'

interface Slide {
  id: string
  type: SlideType
  settings: Record<string, unknown>
}

interface Response {
  id: string
  answer: Record<string, unknown>
}

interface Props {
  slide: Slide
  responses: Response[]
}

// Single consistent color for all results (primary teal)
// Future: Add per-option colors and color themes
const CHART_COLOR = { bg: 'bg-primary', text: 'text-primary', light: 'bg-primary/10' }

// Word cloud uses primary color
const WORD_COLOR = 'text-primary'

export function ResultsDisplay({ slide, responses }: Props) {
  // Welcome slides don't have responses
  if (slide.type === 'welcome') {
    return null
  }

  if (responses.length === 0) {
    return (
      <div className="text-center text-slate-400 py-16">
        <svg className="w-16 h-16 mx-auto mb-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-lg">Waiting for responses...</p>
      </div>
    )
  }

  switch (slide.type) {
    case 'multiple_choice':
      return <MultipleChoiceResults slide={slide} responses={responses} />
    case 'scale':
      return <ScaleResults slide={slide} responses={responses} />
    case 'word_cloud':
      return <WordCloudResults responses={responses} />
    case 'open_ended':
      return <OpenEndedResults responses={responses} />
    default:
      return null
  }
}

function MultipleChoiceResults({ slide, responses }: { slide: Slide; responses: Response[] }) {
  const options = (slide.settings.options as string[]) || []

  // Count votes for each option
  const voteCounts = options.map((_, index) => {
    return responses.filter((r) => {
      const selected = (r.answer as { selected?: number[] }).selected || []
      return selected.includes(index)
    }).length
  })

  const totalVotes = responses.length
  const maxVotes = Math.max(...voteCounts, 1)

  return (
    <div className="space-y-4">
      {options.map((option, index) => {
        const count = voteCounts[index]
        const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0
        const width = (count / maxVotes) * 100

        return (
          <div key={index} className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 ${CHART_COLOR.bg} rounded-lg flex items-center justify-center text-white font-bold text-sm`}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="text-slate-700 font-medium text-lg">{option}</span>
              </div>
              <span className="text-slate-500 font-medium">
                {count} <span className="text-slate-400">({percentage}%)</span>
              </span>
            </div>
            <div className={`h-3 ${CHART_COLOR.light} rounded-full overflow-hidden`}>
              <div
                className={`h-full ${CHART_COLOR.bg} rounded-full transition-all duration-700 ease-out`}
                style={{ width: `${width}%` }}
              />
            </div>
          </div>
        )
      })}
      <p className="text-center text-slate-400 text-sm pt-4">
        {totalVotes} response{totalVotes !== 1 ? 's' : ''}
      </p>
    </div>
  )
}

function ScaleResults({ slide, responses }: { slide: Slide; responses: Response[] }) {
  const min = (slide.settings.min as number) || 1
  const max = (slide.settings.max as number) || 5
  const minLabel = (slide.settings.min_label as string) || ''
  const maxLabel = (slide.settings.max_label as string) || ''

  // Calculate average and distribution
  const values = responses.map((r) => (r.answer as { value?: number }).value || min)
  const average = values.length > 0
    ? values.reduce((a, b) => a + b, 0) / values.length
    : 0

  // Count votes per value
  const distribution = Array.from({ length: max - min + 1 }, (_, i) => {
    const value = min + i
    return values.filter((v) => v === value).length
  })
  const maxCount = Math.max(...distribution, 1)

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm">
      {/* Average display */}
      <div className="text-center mb-10">
        <div className="text-7xl font-bold text-primary mb-2">
          {average.toFixed(1)}
        </div>
        <p className="text-slate-400 text-lg">average rating</p>
      </div>

      {/* Distribution bars */}
      <div className="flex items-end justify-center gap-3 h-40 mb-4">
        {distribution.map((count, i) => {
          const height = (count / maxCount) * 100
          return (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-14 bg-slate-100 rounded-t-xl relative" style={{ height: '120px' }}>
                <div
                  className={`absolute bottom-0 left-0 right-0 ${CHART_COLOR.bg} rounded-t-xl transition-all duration-700`}
                  style={{ height: `${height}%` }}
                />
                {count > 0 && (
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-slate-500 font-medium text-sm">
                    {count}
                  </span>
                )}
              </div>
              <span className="text-slate-600 font-medium">{min + i}</span>
            </div>
          )
        })}
      </div>

      {/* Labels */}
      <div className="flex justify-between text-slate-400 text-sm px-4">
        <span>{minLabel || min}</span>
        <span>{maxLabel || max}</span>
      </div>

      <p className="text-center text-slate-400 text-sm pt-6">
        {responses.length} response{responses.length !== 1 ? 's' : ''}
      </p>
    </div>
  )
}

function WordCloudResults({ responses }: { responses: Response[] }) {
  // Count word frequencies
  const wordCounts: Record<string, number> = {}
  responses.forEach((r) => {
    const words = (r.answer as { words?: string[] }).words || []
    words.forEach((word) => {
      const normalized = word.toLowerCase().trim()
      if (normalized) {
        wordCounts[normalized] = (wordCounts[normalized] || 0) + 1
      }
    })
  })

  // Sort by frequency
  const sortedWords = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)

  const maxCount = sortedWords[0]?.[1] || 1

  if (sortedWords.length === 0) {
    return (
      <div className="text-center text-slate-400 py-12">
        <p>Waiting for responses...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm">
      <div className="flex flex-wrap justify-center gap-4 py-8">
        {sortedWords.map(([word, count]) => {
          // Calculate font size based on frequency (1-3rem)
          const scale = count / maxCount
          const fontSize = 1.2 + scale * 2

          return (
            <span
              key={word}
              className={`${WORD_COLOR} font-semibold transition-all hover:scale-110`}
              style={{
                fontSize: `${fontSize}rem`,
                opacity: 0.6 + scale * 0.4,
              }}
            >
              {word}
            </span>
          )
        })}
      </div>
      <p className="text-center text-slate-400 text-sm pt-4">
        {responses.length} response{responses.length !== 1 ? 's' : ''}
      </p>
    </div>
  )
}

function OpenEndedResults({ responses }: { responses: Response[] }) {
  const answers = responses
    .map((r) => (r.answer as { text?: string }).text || '')
    .filter((text) => text.trim())

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {answers.map((text, index) => (
          <div
            key={index}
            className={`${CHART_COLOR.light} rounded-xl p-4 border-l-4 ${CHART_COLOR.text}`}
          >
            <p className="text-slate-700">{text}</p>
          </div>
        ))}
      </div>
      <p className="text-center text-slate-400 text-sm pt-4">
        {responses.length} response{responses.length !== 1 ? 's' : ''}
      </p>
    </div>
  )
}
