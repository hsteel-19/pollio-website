'use client'

import { useState } from 'react'

type SlideType = 'welcome' | 'multiple_choice' | 'scale' | 'word_cloud' | 'open_ended'

interface Slide {
  id: string
  type: SlideType
  title: string
  description: string | null
  position: number
  settings: Record<string, unknown>
}

interface Response {
  id: string
  slide_id: string
  participant_id: string
  answer: Record<string, unknown>
}

interface Props {
  slides: Slide[]
  responses: Response[]
  sessionCode?: string
  presentationTitle?: string
}

const slideTypeLabels: Record<SlideType, string> = {
  welcome: 'Welcome',
  multiple_choice: 'Multiple Choice',
  scale: 'Scale',
  word_cloud: 'Word Cloud',
  open_ended: 'Open Ended',
}

// Export responses to CSV
function exportToCSV(slides: Slide[], responses: Response[], presentationTitle?: string) {
  const rows: string[][] = []
  
  // Header row
  rows.push(['Question', 'Type', 'Participant ID', 'Answer', 'Timestamp'])
  
  // Filter out welcome slides
  const questionSlides = slides.filter(s => s.type !== 'welcome')
  
  // Process each slide
  questionSlides.forEach((slide) => {
    const slideResponses = responses.filter((r) => r.slide_id === slide.id)
    
    slideResponses.forEach((response) => {
      let answerText = ''
      
      switch (slide.type) {
        case 'multiple_choice': {
          const selected = (response.answer as { selected?: number[] }).selected || []
          const options = (slide.settings.options as string[]) || []
          answerText = selected.map((i) => options[i] || `Option ${i + 1}`).join(', ')
          break
        }
        case 'scale': {
          const value = (response.answer as { value?: number }).value
          answerText = value?.toString() || ''
          break
        }
        case 'word_cloud': {
          const words = (response.answer as { words?: string[] }).words || []
          answerText = words.join(', ')
          break
        }
        case 'open_ended': {
          answerText = (response.answer as { text?: string }).text || ''
          break
        }
      }
      
      rows.push([
        slide.title,
        slideTypeLabels[slide.type],
        response.participant_id.slice(0, 8), // Shortened for privacy
        answerText,
        new Date().toISOString(), // We don't have timestamp in response, use now
      ])
    })
  })
  
  // Convert to CSV string
  const csvContent = rows
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
    .join('\n')
  
  // Create download
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${presentationTitle || 'pollio-results'}-${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function SessionResults({ slides, responses, sessionCode, presentationTitle }: Props) {
  // Filter out welcome slides for display
  const questionSlides = slides.filter(s => s.type !== 'welcome')
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0)
  const selectedSlide = questionSlides[selectedSlideIndex]
  const slideResponses = responses.filter((r) => r.slide_id === selectedSlide?.id)

  if (questionSlides.length === 0) {
    return (
      <div className="text-center py-12 bg-surface rounded-xl">
        <p className="text-text-secondary">No question slides in this session</p>
      </div>
    )
  }

  return (
    <div>
      {/* Export button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => exportToCSV(slides, responses, presentationTitle)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Exportera till CSV
        </button>
      </div>

      <div className="flex gap-6">
      {/* Slide navigation */}
      <div className="w-64 flex-shrink-0">
        <div className="bg-background border border-text-secondary/10 rounded-xl p-4">
          <h3 className="text-sm font-medium text-text-secondary mb-3">Slides</h3>
          <div className="space-y-2">
            {questionSlides.map((slide, index) => {
              const count = responses.filter((r) => r.slide_id === slide.id).length
              return (
                <button
                  key={slide.id}
                  onClick={() => setSelectedSlideIndex(index)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    index === selectedSlideIndex
                      ? 'bg-primary/10 border-2 border-primary'
                      : 'bg-surface hover:bg-surface/80 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-text-secondary">
                      {slideTypeLabels[slide.type]}
                    </span>
                    <span className="text-xs text-text-secondary">
                      {count} responses
                    </span>
                  </div>
                  <p className="text-sm text-text-primary truncate">{slide.title}</p>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Results display */}
      <div className="flex-1">
        <div className="bg-background border border-text-secondary/10 rounded-xl p-6">
          <div className="mb-6">
            <span className="text-sm text-text-secondary">
              {slideTypeLabels[selectedSlide.type]}
            </span>
            <h2 className="text-xl font-semibold text-text-primary">
              {selectedSlide.title}
            </h2>
            {selectedSlide.description && (
              <p className="text-text-secondary mt-1">{selectedSlide.description}</p>
            )}
          </div>

          <div className="border-t border-text-secondary/10 pt-6">
            <div className="text-sm text-text-secondary mb-4">
              {slideResponses.length} response{slideResponses.length !== 1 ? 's' : ''}
            </div>

            {slideResponses.length === 0 ? (
              <p className="text-text-secondary py-8 text-center">No responses for this slide</p>
            ) : (
              <>
                {selectedSlide.type === 'multiple_choice' && (
                  <MultipleChoiceResults slide={selectedSlide} responses={slideResponses} />
                )}
                {selectedSlide.type === 'scale' && (
                  <ScaleResults slide={selectedSlide} responses={slideResponses} />
                )}
                {selectedSlide.type === 'word_cloud' && (
                  <WordCloudResults responses={slideResponses} />
                )}
                {selectedSlide.type === 'open_ended' && (
                  <OpenEndedResults responses={slideResponses} />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

function MultipleChoiceResults({ slide, responses }: { slide: Slide; responses: Response[] }) {
  const options = (slide.settings.options as string[]) || []
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
          <div key={index}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-text-primary font-medium">{option}</span>
              <span className="text-text-secondary">{count} ({percentage}%)</span>
            </div>
            <div className="h-8 bg-surface rounded-lg overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${width}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ScaleResults({ slide, responses }: { slide: Slide; responses: Response[] }) {
  const min = (slide.settings.min as number) || 1
  const max = (slide.settings.max as number) || 5
  const minLabel = (slide.settings.min_label as string) || ''
  const maxLabel = (slide.settings.max_label as string) || ''

  const values = responses.map((r) => (r.answer as { value?: number }).value || min)
  const average = values.reduce((a, b) => a + b, 0) / values.length

  const distribution = Array.from({ length: max - min + 1 }, (_, i) => {
    const value = min + i
    return values.filter((v) => v === value).length
  })
  const maxCount = Math.max(...distribution, 1)

  return (
    <div>
      <div className="text-center mb-8">
        <div className="text-5xl font-bold text-primary mb-1">{average.toFixed(1)}</div>
        <p className="text-text-secondary">average rating</p>
      </div>

      <div className="flex items-end justify-center gap-3 h-32 mb-4">
        {distribution.map((count, i) => {
          const height = (count / maxCount) * 100
          return (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-12 bg-surface rounded-t relative" style={{ height: '100px' }}>
                <div
                  className="absolute bottom-0 left-0 right-0 bg-primary rounded-t transition-all"
                  style={{ height: `${height}%` }}
                />
              </div>
              <span className="text-text-secondary text-sm">{min + i}</span>
            </div>
          )
        })}
      </div>

      <div className="flex justify-between text-text-secondary text-sm">
        <span>{minLabel || min}</span>
        <span>{maxLabel || max}</span>
      </div>
    </div>
  )
}

function WordCloudResults({ responses }: { responses: Response[] }) {
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

  const sortedWords = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)

  const maxCount = sortedWords[0]?.[1] || 1

  return (
    <div className="flex flex-wrap gap-3 justify-center py-4">
      {sortedWords.map(([word, count]) => {
        const scale = count / maxCount
        const fontSize = 1 + scale * 1.5

        return (
          <span
            key={word}
            className="text-primary"
            style={{
              fontSize: `${fontSize}rem`,
              opacity: 0.5 + scale * 0.5,
            }}
          >
            {word}
          </span>
        )
      })}
    </div>
  )
}

function OpenEndedResults({ responses }: { responses: Response[] }) {
  const answers = responses
    .map((r) => ({
      text: (r.answer as { text?: string }).text || '',
      id: r.id,
    }))
    .filter((a) => a.text.trim())

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {answers.map((answer) => (
        <div key={answer.id} className="bg-surface rounded-lg p-4 text-text-primary">
          {answer.text}
        </div>
      ))}
    </div>
  )
}
