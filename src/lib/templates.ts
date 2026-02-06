export interface TemplateSlide {
  type: 'welcome' | 'multiple_choice' | 'scale' | 'word_cloud' | 'open_ended';
  title: string;
  description: string | null;
  settings: Record<string, unknown>;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'meeting' | 'workshop' | 'feedback' | 'education';
  slides: TemplateSlide[];
}

export const templates: Template[] = [
  {
    id: 'team-checkin',
    name: 'Team Check-in',
    description: 'Start meetings with a quick pulse check on energy and mood',
    icon: '👋',
    category: 'meeting',
    slides: [
      {
        type: 'welcome',
        title: 'Team Check-in',
        description: 'Let\'s see how everyone is doing today',
        settings: {},
      },
      {
        type: 'scale',
        title: 'How is your energy level today?',
        description: null,
        settings: { min: 1, max: 5, min_label: '🪫 Low', max_label: '🔋 High' },
      },
      {
        type: 'word_cloud',
        title: 'Describe your mood in one word',
        description: null,
        settings: { max_words: 1 },
      },
      {
        type: 'open_ended',
        title: 'Anything you want to share with the team?',
        description: 'Optional - share wins, blockers, or updates',
        settings: { max_length: 500 },
      },
    ],
  },
  {
    id: 'meeting-feedback',
    name: 'Meeting Feedback',
    description: 'Get feedback at the end of any meeting',
    icon: '📊',
    category: 'feedback',
    slides: [
      {
        type: 'welcome',
        title: 'Quick Feedback',
        description: 'Help us make meetings better',
        settings: {},
      },
      {
        type: 'scale',
        title: 'How useful was this meeting?',
        description: null,
        settings: { min: 1, max: 5, min_label: 'Not useful', max_label: 'Very useful' },
      },
      {
        type: 'multiple_choice',
        title: 'Did we achieve the meeting goals?',
        description: null,
        settings: { 
          options: ['Yes, completely', 'Partially', 'No, not really', 'Goals were unclear'],
          option_colors: [5, 0, 6, 3],
        },
      },
      {
        type: 'open_ended',
        title: 'How could we improve our meetings?',
        description: 'Your honest feedback helps us get better',
        settings: { max_length: 500 },
      },
    ],
  },
  {
    id: 'brainstorm',
    name: 'Brainstorm Session',
    description: 'Collect ideas and prioritize together',
    icon: '💡',
    category: 'workshop',
    slides: [
      {
        type: 'welcome',
        title: 'Brainstorm Session',
        description: 'Let\'s generate and prioritize ideas together',
        settings: {},
      },
      {
        type: 'word_cloud',
        title: 'What challenges should we focus on?',
        description: 'Share the biggest challenges you see',
        settings: { max_words: 3 },
      },
      {
        type: 'open_ended',
        title: 'Share your ideas',
        description: 'Any idea is welcome - no judgement!',
        settings: { max_length: 500 },
      },
      {
        type: 'multiple_choice',
        title: 'Which area should we prioritize?',
        description: 'Vote for the most important focus area',
        settings: { 
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          option_colors: [0, 1, 2, 4],
        },
      },
    ],
  },
  {
    id: 'presentation-qa',
    name: 'Presentation Q&A',
    description: 'Engage your audience during and after presentations',
    icon: '🎤',
    category: 'education',
    slides: [
      {
        type: 'welcome',
        title: 'Welcome',
        description: 'Join to participate in today\'s session',
        settings: {},
      },
      {
        type: 'scale',
        title: 'How familiar are you with today\'s topic?',
        description: null,
        settings: { min: 1, max: 5, min_label: 'New to me', max_label: 'Expert' },
      },
      {
        type: 'multiple_choice',
        title: 'What interests you most about this topic?',
        description: null,
        settings: { 
          options: ['Practical applications', 'Theory & concepts', 'Best practices', 'Case studies'],
          option_colors: [0, 1, 5, 4],
        },
      },
      {
        type: 'open_ended',
        title: 'What questions do you have?',
        description: 'Ask anything about the presentation',
        settings: { max_length: 500 },
      },
      {
        type: 'scale',
        title: 'How clear was the presentation?',
        description: null,
        settings: { min: 1, max: 5, min_label: 'Confusing', max_label: 'Crystal clear' },
      },
    ],
  },
];

export function getTemplateById(id: string): Template | undefined {
  return templates.find(t => t.id === id);
}
