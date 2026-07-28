export interface SelectOption {
  label: string
  value: string
  disabled?: boolean
}

export interface GeneralPreferenceItemData {
  id: string
  title: string
  description: string
  iconName: string
  defaultValue: string
  options: SelectOption[]
  placeholder?: string
}

export interface GeneralPreferencesMockData {
  sectionTitle: string
  sectionSubtitle: string
  resetButtonLabel: string
  items: GeneralPreferenceItemData[]
}

export const generalPreferencesMockData: GeneralPreferencesMockData = {
  sectionTitle: 'General Preferences',
  sectionSubtitle: 'Manage your core application settings and preferences.',
  resetButtonLabel: 'Reset to Defaults',

  items: [
    {
      id: 'language',
      title: 'Language',
      description: 'Choose your preferred language',
      iconName: 'Globe',
      defaultValue: 'en-US',
      options: [
        { label: 'English (US)', value: 'en-US' },
        { label: 'English (UK)', value: 'en-GB' },
        { label: 'Spanish (Español)', value: 'es' },
        { label: 'French (Français)', value: 'fr' },
        { label: 'German (Deutsch)', value: 'de' },
        { label: 'Japanese (日本語)', value: 'ja' },
        { label: 'Chinese (中文)', value: 'zh' },
      ],
    },
    {
      id: 'timezone',
      title: 'Timezone',
      description: 'Set your local timezone',
      iconName: 'Clock',
      defaultValue: 'Asia/Kolkata',
      options: [
        { label: '(GMT+5:30) Asia/Kolkata', value: 'Asia/Kolkata' },
        { label: '(GMT+0:00) UTC', value: 'UTC' },
        { label: '(GMT-5:00) EST / New York', value: 'EST' },
        { label: '(GMT-8:00) PST / Los Angeles', value: 'PST' },
        { label: '(GMT+1:00) CET / London', value: 'CET' },
        { label: '(GMT+9:00) JST / Tokyo', value: 'JST' },
      ],
    },
    {
      id: 'dateFormat',
      title: 'Date Format',
      description: 'Select your preferred date format',
      iconName: 'Calendar',
      defaultValue: 'DD MMM YYYY',
      options: [
        { label: 'DD MMM YYYY', value: 'DD MMM YYYY' },
        { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
        { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
        { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
        { label: 'MMM DD, YYYY', value: 'MMM DD, YYYY' },
      ],
    },
    {
      id: 'timeFormat',
      title: 'Time Format',
      description: 'Choose 12 or 24 hour format',
      iconName: 'Clock3',
      defaultValue: '12h',
      options: [
        { label: '12 Hour (AM/PM)', value: '12h' },
        { label: '24 Hour (HH:mm)', value: '24h' },
      ],
    },
    {
      id: 'defaultModule',
      title: 'Default Module',
      description: 'Set default landing module',
      iconName: 'LayoutGrid',
      defaultValue: 'dashboard',
      options: [
        { label: 'Dashboard', value: 'dashboard' },
        { label: 'Resume Builder', value: 'resumes' },
        { label: 'ATS Analysis', value: 'ats' },
        { label: 'Career Roadmap', value: 'roadmap' },
        { label: 'RAG Workspace', value: 'rag' },
        { label: 'Agent Console', value: 'agents' },
        { label: 'GitHub Intelligence', value: 'github' },
        { label: 'Analytics Center', value: 'analytics' },
      ],
    },
    {
      id: 'itemsPerPage',
      title: 'Items Per Page',
      description: 'Set default number of items',
      iconName: 'ListFilter',
      defaultValue: '20',
      options: [
        { label: '10', value: '10' },
        { label: '20', value: '20' },
        { label: '50', value: '50' },
        { label: '100', value: '100' },
      ],
    },
  ],
}
