'use client'

import { useState, useEffect } from 'react'

type SlideType = 'welcome' | 'multiple_choice' | 'scale' | 'word_cloud' | 'open_ended'

interface Slide {
  id: string
  type: SlideType
  title: string
  description: string | null
  settings: Record<string, unknown>
}

interface Props {
  slide: Slide
  onUpdate: (updates: Partial<Slide>) => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  isFirst: boolean
  isLast: boolean
}

export function SlideEditor({
  slide,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: Props) {
  const [title, setTitle] = useState(slide.title)
  const [description, setDescription] = useState(slide.description || '')
  const [settings, setSettings] = useState(slide.settings)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Update local state when slide changes
  useEffect(() => {
    setTitle(slide.title)
    setDescription(slide.description || '')
    setSettings(slide.settings)
  }, [slide.id, slide.title, slide.description, slide.settings])

  const handleTitleBlur = () => {
    if (title !== slide.title) {
      onUpdate({ title })
    }
  }

  const handleDescriptionBlur = () => {
    if (description !== slide.description) {
      onUpdate({ description: description || null })
    }
  }

  const updateSettings = (newSettings: Record<string, unknown>) => {
    setSettings(newSettings)
    onUpdate({ settings: newSettings })
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Header with actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {/* Welcome slides cannot be moved (always first) */}
          {slide.type !== 'welcome' && (
            <>
              <button
                onClick={onMoveUp}
                disabled={isFirst}
                className="p-2 text-text-secondary hover:text-text-primary hover:bg-background rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                title="Move up"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button
                onClick={onMoveDown}
                disabled={isLast}
                className="p-2 text-text-secondary hover:text-text-primary hover:bg-background rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                title="Move down"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </>
          )}
        </div>
        {/* Welcome slides cannot be deleted */}
        {slide.type !== 'welcome' ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 text-text-secondary hover:text-error hover:bg-error/10 rounded-lg"
            title="Delete slide"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        ) : (
          <span className="text-xs text-text-secondary">Welcome slide</span>
        )}
      </div>

      {/* Welcome slide has different UI */}
      {slide.type === 'welcome' ? (
        <>
          {/* Page title for welcome slide */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Page title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
              className="w-full px-4 py-3 text-xl font-medium bg-background border border-text-secondary/20 rounded-lg focus:border-primary focus:outline-none"
              placeholder="Welcome to our session"
            />
          </div>

          {/* Description */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleDescriptionBlur}
              className="w-full px-4 py-3 bg-background border border-text-secondary/20 rounded-lg focus:border-primary focus:outline-none resize-none"
              placeholder="Add a short message for your audience"
              rows={2}
            />
          </div>

          {/* How your audience join section */}
          <div className="bg-background rounded-xl p-6 border border-text-secondary/10">
            <h3 className="text-sm font-medium text-text-primary mb-4">
              How your audience join
            </h3>

            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 bg-surface rounded-lg">
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="w-4 h-4 rounded border-text-secondary/20 text-primary"
                />
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  <span className="text-sm text-text-primary">QR code</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-surface rounded-lg">
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="w-4 h-4 rounded border-text-secondary/20 text-primary"
                />
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span className="text-sm text-text-primary">URL with join code</span>
                </div>
              </label>
            </div>

            <p className="text-xs text-text-secondary mt-4">
              These will be displayed on screen when you start the session so your audience can join.
            </p>
          </div>
        </>
      ) : (
        <>
          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Question
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
              className="w-full px-4 py-3 text-xl font-medium bg-background border border-text-secondary/20 rounded-lg focus:border-primary focus:outline-none"
              placeholder="Enter your question"
            />
          </div>

          {/* Description (optional) */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleDescriptionBlur}
              className="w-full px-4 py-3 bg-background border border-text-secondary/20 rounded-lg focus:border-primary focus:outline-none resize-none"
              placeholder="Add more context for participants"
              rows={2}
            />
          </div>

          {/* Type-specific settings */}
          <div className="bg-background rounded-xl p-6 border border-text-secondary/10">
            <h3 className="text-sm font-medium text-text-secondary mb-4">
              {slide.type === 'multiple_choice' && 'Answer options'}
              {slide.type === 'scale' && 'Scale settings'}
              {slide.type === 'word_cloud' && 'Word cloud settings'}
              {slide.type === 'open_ended' && 'Response settings'}
            </h3>

            {slide.type === 'multiple_choice' && (
              <MultipleChoiceSettings settings={settings} onUpdate={updateSettings} />
            )}
            {slide.type === 'scale' && (
              <ScaleSettings settings={settings} onUpdate={updateSettings} />
            )}
            {slide.type === 'word_cloud' && (
              <WordCloudSettings settings={settings} onUpdate={updateSettings} />
            )}
            {slide.type === 'open_ended' && (
              <OpenEndedSettings settings={settings} onUpdate={updateSettings} />
            )}
          </div>
        </>
      )}

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-text-primary mb-2">Delete slide?</h3>
            <p className="text-text-secondary mb-6">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-text-secondary/20 rounded-lg text-text-primary hover:bg-surface"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  onDelete()
                }}
                className="flex-1 px-4 py-2 bg-error text-white rounded-lg hover:bg-error/90"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Multiple Choice Settings
function MultipleChoiceSettings({
  settings,
  onUpdate,
}: {
  settings: Record<string, unknown>
  onUpdate: (settings: Record<string, unknown>) => void
}) {
  const initialOptions = (settings.options as string[]) || ['Option 1', 'Option 2']
  const allowMultiple = (settings.allow_multiple as boolean) || false
  const [localOptions, setLocalOptions] = useState<string[]>(initialOptions)

  // Sync local options when settings change from outside (e.g., slide switch)
  useEffect(() => {
    setLocalOptions((settings.options as string[]) || ['Option 1', 'Option 2'])
  }, [settings.options])

  const updateLocalOption = (index: number, value: string) => {
    const newOptions = [...localOptions]
    newOptions[index] = value
    setLocalOptions(newOptions)
  }

  const saveOption = (index: number) => {
    // Only save if the value actually changed
    if (localOptions[index] !== initialOptions[index]) {
      onUpdate({ ...settings, options: localOptions })
    }
  }

  const addOption = () => {
    const newOptions = [...localOptions, `Option ${localOptions.length + 1}`]
    setLocalOptions(newOptions)
    onUpdate({ ...settings, options: newOptions })
  }

  const removeOption = (index: number) => {
    if (localOptions.length <= 2) return
    const newOptions = localOptions.filter((_, i) => i !== index)
    setLocalOptions(newOptions)
    onUpdate({ ...settings, options: newOptions })
  }

  return (
    <div className="space-y-4">
      {localOptions.map((option, index) => (
        <div key={index} className="flex items-center gap-2">
          <span className="w-6 h-6 bg-primary/10 text-primary text-sm font-medium rounded flex items-center justify-center">
            {String.fromCharCode(65 + index)}
          </span>
          <input
            type="text"
            value={option}
            onChange={(e) => updateLocalOption(index, e.target.value)}
            onBlur={() => saveOption(index)}
            className="flex-1 px-3 py-2 border border-text-secondary/20 rounded-lg focus:border-primary focus:outline-none"
            placeholder={`Option ${index + 1}`}
          />
          {localOptions.length > 2 && (
            <button
              onClick={() => removeOption(index)}
              className="p-2 text-text-secondary hover:text-error"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      ))}

      <button
        onClick={addOption}
        className="text-primary hover:text-primary-dark text-sm font-medium flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add option
      </button>

      <label className="flex items-center gap-2 pt-4 border-t border-text-secondary/10">
        <input
          type="checkbox"
          checked={allowMultiple}
          onChange={(e) => onUpdate({ ...settings, allow_multiple: e.target.checked })}
          className="w-4 h-4 rounded border-text-secondary/20 text-primary focus:ring-primary"
        />
        <span className="text-sm text-text-primary">Allow selecting multiple options</span>
      </label>
    </div>
  )
}

// Scale Settings
function ScaleSettings({
  settings,
  onUpdate,
}: {
  settings: Record<string, unknown>
  onUpdate: (settings: Record<string, unknown>) => void
}) {
  const min = (settings.min as number) || 1
  const max = (settings.max as number) || 5
  const minLabel = (settings.min_label as string) || ''
  const maxLabel = (settings.max_label as string) || ''

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="block text-sm text-text-secondary mb-1">From</label>
          <select
            value={min}
            onChange={(e) => onUpdate({ ...settings, min: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-text-secondary/20 rounded-lg focus:border-primary focus:outline-none"
          >
            <option value={0}>0</option>
            <option value={1}>1</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm text-text-secondary mb-1">To</label>
          <select
            value={max}
            onChange={(e) => onUpdate({ ...settings, max: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-text-secondary/20 rounded-lg focus:border-primary focus:outline-none"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="block text-sm text-text-secondary mb-1">Low label (optional)</label>
          <input
            type="text"
            value={minLabel}
            onChange={(e) => onUpdate({ ...settings, min_label: e.target.value })}
            className="w-full px-3 py-2 border border-text-secondary/20 rounded-lg focus:border-primary focus:outline-none"
            placeholder="e.g., Poor"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm text-text-secondary mb-1">High label (optional)</label>
          <input
            type="text"
            value={maxLabel}
            onChange={(e) => onUpdate({ ...settings, max_label: e.target.value })}
            className="w-full px-3 py-2 border border-text-secondary/20 rounded-lg focus:border-primary focus:outline-none"
            placeholder="e.g., Excellent"
          />
        </div>
      </div>

      {/* Preview */}
      <div className="pt-4 border-t border-text-secondary/10">
        <p className="text-sm text-text-secondary mb-3">Preview:</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">{minLabel || min}</span>
          <div className="flex gap-2">
            {Array.from({ length: max - min + 1 }, (_, i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-lg border-2 border-text-secondary/20 flex items-center justify-center text-sm font-medium text-text-secondary"
              >
                {min + i}
              </div>
            ))}
          </div>
          <span className="text-sm text-text-secondary">{maxLabel || max}</span>
        </div>
      </div>
    </div>
  )
}

// Word Cloud Settings
function WordCloudSettings({
  settings,
  onUpdate,
}: {
  settings: Record<string, unknown>
  onUpdate: (settings: Record<string, unknown>) => void
}) {
  const maxWords = (settings.max_words as number) || 3

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-text-secondary mb-1">
          Maximum words per response
        </label>
        <select
          value={maxWords}
          onChange={(e) => onUpdate({ ...settings, max_words: parseInt(e.target.value) })}
          className="w-full px-3 py-2 border border-text-secondary/20 rounded-lg focus:border-primary focus:outline-none"
        >
          <option value={1}>1 word</option>
          <option value={2}>2 words</option>
          <option value={3}>3 words</option>
          <option value={5}>5 words</option>
        </select>
      </div>
      <p className="text-sm text-text-secondary">
        Participants will enter short words or phrases that form a word cloud.
        More popular answers appear larger.
      </p>
    </div>
  )
}

// Open Ended Settings
function OpenEndedSettings({
  settings,
  onUpdate,
}: {
  settings: Record<string, unknown>
  onUpdate: (settings: Record<string, unknown>) => void
}) {
  const maxLength = (settings.max_length as number) || 500

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-text-secondary mb-1">
          Maximum response length
        </label>
        <select
          value={maxLength}
          onChange={(e) => onUpdate({ ...settings, max_length: parseInt(e.target.value) })}
          className="w-full px-3 py-2 border border-text-secondary/20 rounded-lg focus:border-primary focus:outline-none"
        >
          <option value={100}>100 characters</option>
          <option value={250}>250 characters</option>
          <option value={500}>500 characters</option>
          <option value={1000}>1000 characters</option>
        </select>
      </div>
      <p className="text-sm text-text-secondary">
        Participants will type longer text responses. Responses are displayed in a list format.
      </p>
    </div>
  )
}
