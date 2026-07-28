export interface PreferenceToggleItem {
  id: string
  title: string
  description: string
  iconName: string
  defaultChecked: boolean
}

export interface PreferenceCategory {
  id: string
  title: string
  description: string
  iconName: string
  note: string
  linkText?: string
  items: PreferenceToggleItem[]
}

export interface QuickActionItem {
  id: string
  title: string
  subtitle: string
  iconName: string
  actionLabel: string
  variant?: 'secondary' | 'danger'
}

export interface SystemPreferencesMockData {
  sectionTitle: string
  sectionSubtitle: string
  manageAllText: string
  categories: PreferenceCategory[]
  quickSettingsTitle: string
  quickSettingsSubtitle: string
  quickActions: QuickActionItem[]
}

export const systemPreferencesMockData: SystemPreferencesMockData = {
  sectionTitle: 'System Preferences',
  sectionSubtitle: 'Customize how Scorelia works for you.',
  manageAllText: 'Manage all preferences →',

  categories: [
    {
      id: 'privacy',
      title: 'Privacy & Data',
      description: 'Manage data saving, cloud sync, and usage analytics.',
      iconName: 'ShieldCheck',
      note: 'We respect your privacy. Your data is encrypted and never shared with third parties.',
      linkText: 'Learn more →',
      items: [
        {
          id: 'autoSave',
          title: 'Auto Save',
          description: 'Automatically save changes while editing.',
          iconName: 'Save',
          defaultChecked: true,
        },
        {
          id: 'cloudSync',
          title: 'Cloud Sync',
          description: 'Synchronize your preferences across all devices.',
          iconName: 'RefreshCw',
          defaultChecked: true,
        },
        {
          id: 'analyticsTracking',
          title: 'Analytics Tracking',
          description: 'Help improve Scorelia by sharing anonymous usage analytics.',
          iconName: 'Activity',
          defaultChecked: false,
        },
      ],
    },
    {
      id: 'performance',
      title: 'Performance & Interface',
      description: 'Optimize responsiveness, density, and preview features.',
      iconName: 'Gauge',
      note: 'Performance Mode is optimized for speed and responsiveness on all devices.',
      items: [
        {
          id: 'performanceMode',
          title: 'Performance Mode',
          description: 'Optimize the application for maximum responsiveness.',
          iconName: 'Zap',
          defaultChecked: true,
        },
        {
          id: 'compactLayout',
          title: 'Compact Layout',
          description: 'Reduce spacing for a denser workspace.',
          iconName: 'Maximize2',
          defaultChecked: false,
        },
        {
          id: 'betaFeatures',
          title: 'Beta Features',
          description: 'Access experimental features before public release.',
          iconName: 'FlaskConical',
          defaultChecked: false,
        },
      ],
    },
    {
      id: 'notifications',
      title: 'Notifications & Alerts',
      description: 'Control email notifications, AI recommendations, and audio.',
      iconName: 'Bell',
      note: 'Control how you receive important updates and system notifications.',
      items: [
        {
          id: 'emailNotifications',
          title: 'Email Notifications',
          description: 'Receive important account and platform updates.',
          iconName: 'Mail',
          defaultChecked: true,
        },
        {
          id: 'smartSuggestions',
          title: 'Smart Suggestions',
          description: 'Receive AI-powered recommendations and reminders.',
          iconName: 'Sparkles',
          defaultChecked: true,
        },
        {
          id: 'soundEffects',
          title: 'Sound Effects',
          description: 'Play subtle sounds for completed actions and alerts.',
          iconName: 'Volume2',
          defaultChecked: false,
        },
      ],
    },
  ],

  quickSettingsTitle: 'Quick Settings',
  quickSettingsSubtitle: 'Essential settings you might need to change quickly.',
  quickActions: [
    {
      id: 'changePassword',
      title: 'Change Password',
      subtitle: 'Update your account password.',
      iconName: 'KeyRound',
      actionLabel: 'Update Password →',
      variant: 'secondary',
    },
    {
      id: 'twoFactorAuth',
      title: 'Two-Factor Authentication',
      subtitle: 'Enhance account security.',
      iconName: 'Lock',
      actionLabel: 'Manage 2FA →',
      variant: 'secondary',
    },
    {
      id: 'connectedDevices',
      title: 'Connected Devices',
      subtitle: 'View and manage active sessions.',
      iconName: 'Laptop',
      actionLabel: 'View Devices →',
      variant: 'secondary',
    },
    {
      id: 'exportData',
      title: 'Export Data',
      subtitle: 'Download your account information.',
      iconName: 'Download',
      actionLabel: 'Export Now →',
      variant: 'secondary',
    },
    {
      id: 'deleteAccount',
      title: 'Delete Account',
      subtitle: 'Permanently remove your account.',
      iconName: 'Trash2',
      actionLabel: 'Delete Account →',
      variant: 'danger',
    },
  ],
}
