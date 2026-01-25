'use client'

type SlideType = 'multiple_choice' | 'scale' | 'word_cloud' | 'open_ended'

interface Props {
  onAdd: (type: SlideType) => void
  onClose: () => void
  saving: boolean
}

const slideTypes: { type: SlideType; label: string; description: string; color: string; bgColor: string; icon: React.ReactNode }[] = [
  {
    type: 'multiple_choice',
    label: 'Multiple Choice',
    description: 'Let participants choose from options',
    color: 'text-rose-500',
    bgColor: 'bg-rose-50',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 5h16v2H4V5zm0 6h16v2H4v-2zm0 6h10v2H4v-2z" />
        <circle cx="19" cy="17" r="3" />
      </svg>
    ),
  },
  {
    type: 'scale',
    label: 'Scale',
    description: 'Rate on a numeric scale (1-5 or 1-10)',
    color: 'text-violet-500',
    bgColor: 'bg-violet-50',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <rect x="3" y="14" width="4" height="6" rx="1" />
        <rect x="10" y="10" width="4" height="10" rx="1" />
        <rect x="17" y="4" width="4" height="16" rx="1" />
      </svg>
    ),
  },
  {
    type: 'word_cloud',
    label: 'Word Cloud',
    description: 'Collect short words, display as a cloud',
    color: 'text-amber-500',
    bgColor: 'bg-amber-50',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
      </svg>
    ),
  },
  {
    type: 'open_ended',
    label: 'Open Ended',
    description: 'Collect longer text responses',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 6.5a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-11zm-3 3H6v-1h12v1zm0 3H6v-1h12v1zm-6 3H6v-1h6v1z"/>
      </svg>
    ),
  },
]

export function AddSlideModal({ onAdd, onClose, saving }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-2xl max-w-xl w-full p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Add a slide</h2>
            <p className="text-text-secondary text-sm mt-1">Choose a question type for your slide</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-surface rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {slideTypes.map(({ type, label, description, color, bgColor, icon }) => (
            <button
              key={type}
              onClick={() => onAdd(type)}
              disabled={saving}
              className="text-left p-5 rounded-xl border-2 border-text-secondary/10 hover:border-primary/50 hover:shadow-md transition-all group disabled:opacity-50"
            >
              <div className={`w-14 h-14 ${bgColor} rounded-xl flex items-center justify-center mb-4 ${color} group-hover:scale-110 transition-transform`}>
                {icon}
              </div>
              <h3 className="font-semibold text-text-primary mb-1">{label}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
