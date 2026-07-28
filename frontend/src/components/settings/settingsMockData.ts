export interface SettingTab {
  id: string
  label: string
  badge?: string
}

export interface GeneralPreferenceItem {
  id: string
  title: string
  description: string
  iconName: string
  options: { label: string; value: string }[]
  defaultValue: string
}

export interface TogglePreferenceItem {
  id: string
  title: string
  description: string
  iconName: string
  defaultChecked: boolean
}

export interface SystemPreferenceSection {
  id: string
  title: string
  iconName: string
  items: TogglePreferenceItem[]
  note: string
  linkText?: string
}

export interface QuickSettingCard {
  id: string
  title: string
  description: string
  iconName: string
  actionLabel: string
  variant?: 'primary' | 'secondary' | 'danger'
}

export interface AccountHealthItem {
  label: string
  value: string
  status: 'success' | 'warning' | 'info'
}

export interface UsageMetricItem {
  label: string
  used: string
  total: string
  percentage: number
  colorClass: string
  iconName: string
}

export interface RecentActivityItem {
  id: string
  title: string
  timestamp: string
  badge?: string
  iconName: string
}

export interface SettingsMockData {
  pageTitle: string
  pageSubtitle: string
  searchPlaceholder: string
  tabs: SettingTab[]
  generalPreferences: GeneralPreferenceItem[]
  systemPreferences: SystemPreferenceSection[]
  quickSettings: QuickSettingCard[]
  accountOverview: {
    name: string
    email: string
    plan: string
    memberSince: string
    isVerified: boolean
    avatarUrl: string
  }
  accountHealth: {
    score: number
    maxScore: number
    statusLabel: string
    description: string
    checklist: AccountHealthItem[]
  }
  usageSummary: {
    resetDaysText: string
    metrics: UsageMetricItem[]
  }
  recentActivities: RecentActivityItem[]
}

export const settingsMockData: SettingsMockData = {
  pageTitle: 'Settings',
  pageSubtitle: 'Manage your account, preferences, security, and system configuration.',
  searchPlaceholder: 'Search settings...',

  tabs: [
    { id: 'general', label: 'General' },
    { id: 'account', label: 'Account' },
    { id: 'security', label: 'Security' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'appearance', label: 'Appearance' },
    { id: 'integrations', label: 'Integrations' },
    { id: 'privacy', label: 'Data & Privacy' },
    { id: 'billing', label: 'Billing' },
    { id: 'advanced', label: 'Advanced' },
  ],

  generalPreferences: [
    {
      id: 'language',
      title: 'Language',
      description: 'Choose your preferred language',
      iconName: 'Globe',
      defaultValue: 'en-US',
      options: [
        { label: 'English (US)', value: 'en-US' },
        { label: 'English (UK)', value: 'en-GB' },
        { label: 'Spanish', value: 'es' },
        { label: 'French', value: 'fr' },
        { label: 'German', value: 'de' },
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
        { label: '(GMT-5:00) EST', value: 'EST' },
        { label: '(GMT-8:00) PST', value: 'PST' },
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
        { label: '24 Hour', value: '24h' },
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

  systemPreferences: [
    {
      id: 'privacy',
      title: 'Privacy & Data',
      iconName: 'ShieldCheck',
      note: 'We respect your privacy. Your data is encrypted and never shared with third parties.',
      linkText: 'Learn more →',
      items: [
        {
          id: 'autoSave',
          title: 'Auto Save',
          description: 'Automatically save changes',
          iconName: 'Save',
          defaultChecked: true,
        },
        {
          id: 'dataSync',
          title: 'Data Sync',
          description: 'Sync data across all devices',
          iconName: 'RefreshCw',
          defaultChecked: true,
        },
        {
          id: 'analyticsTracking',
          title: 'Analytics Tracking',
          description: 'Allow usage analytics',
          iconName: 'Activity',
          defaultChecked: true,
        },
      ],
    },
    {
      id: 'performance',
      title: 'Performance & Interface',
      iconName: 'Gauge',
      note: 'Performance Mode is optimized for speed and responsiveness on all devices.',
      items: [
        {
          id: 'performanceMode',
          title: 'Performance Mode',
          description: 'Optimize for better performance',
          iconName: 'Zap',
          defaultChecked: true,
        },
        {
          id: 'compactMode',
          title: 'Compact Mode',
          description: 'Reduce spacing and padding',
          iconName: 'Maximize2',
          defaultChecked: false,
        },
        {
          id: 'betaFeatures',
          title: 'Beta Features',
          description: 'Access experimental features',
          iconName: 'FlaskConical',
          defaultChecked: false,
        },
      ],
    },
    {
      id: 'notifications',
      title: 'Notifications & Alerts',
      iconName: 'Bell',
      note: 'Control how you receive important updates and system notifications.',
      items: [
        {
          id: 'emailNotifications',
          title: 'Email Notifications',
          description: 'Receive email updates',
          iconName: 'Mail',
          defaultChecked: true,
        },
        {
          id: 'smartSuggestions',
          title: 'Smart Suggestions',
          description: 'Show AI-powered suggestions',
          iconName: 'Sparkles',
          defaultChecked: true,
        },
        {
          id: 'soundEffects',
          title: 'Sound Effects',
          description: 'Enable notification sounds',
          iconName: 'Volume2',
          defaultChecked: true,
        },
      ],
    },
  ],

  quickSettings: [
    {
      id: 'changePassword',
      title: 'Change Password',
      description: 'Update your account password',
      iconName: 'KeyRound',
      actionLabel: 'Update Password →',
      variant: 'secondary',
    },
    {
      id: 'twoFactorAuth',
      title: 'Two-Factor Auth',
      description: 'Add an extra layer of security',
      iconName: 'Lock',
      actionLabel: 'Manage 2FA →',
      variant: 'secondary',
    },
    {
      id: 'connectedDevices',
      title: 'Connected Devices',
      description: 'Manage your active sessions',
      iconName: 'Laptop',
      actionLabel: 'View Devices →',
      variant: 'secondary',
    },
    {
      id: 'exportData',
      title: 'Export Data',
      description: 'Download your data',
      iconName: 'Download',
      actionLabel: 'Export Now →',
      variant: 'secondary',
    },
    {
      id: 'deleteAccount',
      title: 'Delete Account',
      description: 'Permanently delete account',
      iconName: 'Trash2',
      actionLabel: 'Delete Account →',
      variant: 'danger',
    },
  ],

  accountOverview: {
    name: 'Dipak Khandagale',
    email: 'dipakkhandagale7@gmail.com',
    plan: 'Premium Plan',
    memberSince: 'Member since Nov 2023',
    isVerified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
  },

  accountHealth: {
    score: 96,
    maxScore: 100,
    statusLabel: 'Excellent',
    description: 'Measures the security and completeness of your account settings.',
    checklist: [
      { label: 'Password Strength', value: 'Strong', status: 'success' },
      { label: 'Two-Factor Authentication', value: 'Enabled', status: 'success' },
      { label: 'Email Verification', value: 'Verified', status: 'success' },
      { label: 'Profile Completeness', value: '95%', status: 'success' },
      { label: 'Security Questions', value: 'Set', status: 'success' },
    ],
  },

  usageSummary: {
    resetDaysText: 'Resets in 14 days',
    metrics: [
      {
        label: 'AI Credits',
        used: '2,450',
        total: '5,000',
        percentage: 49,
        colorClass: 'bg-indigo-500',
        iconName: 'Sparkles',
      },
      {
        label: 'Storage',
        used: '12.4 GB',
        total: '50 GB',
        percentage: 25,
        colorClass: 'bg-blue-500',
        iconName: 'HardDrive',
      },
      {
        label: 'API Requests',
        used: '18,250',
        total: '50,000',
        percentage: 36,
        colorClass: 'bg-cyan-500',
        iconName: 'Cpu',
      },
    ],
  },

  recentActivities: [
    {
      id: 'act-1',
      title: 'Password changed',
      timestamp: '2 hours ago',
      iconName: 'Key',
    },
    {
      id: 'act-2',
      title: 'Logged in from Chrome',
      timestamp: '5 hours ago',
      badge: 'New device',
      iconName: 'Globe',
    },
    {
      id: 'act-3',
      title: 'Email updated',
      timestamp: '1 day ago',
      iconName: 'Mail',
    },
    {
      id: 'act-4',
      title: 'Two-factor authentication enabled',
      timestamp: '2 days ago',
      iconName: 'Shield',
    },
    {
      id: 'act-5',
      title: 'Settings updated',
      timestamp: '2 days ago',
      iconName: 'Sliders',
    },
  ],
}
