export interface IntegrationCardData {
  id: string
  name: string
  description: string
  iconName: string
  isConnected: boolean
  statusBadge: string
  lastSynced?: string
  accountIdentifier?: string
  maskedKey?: string
}

export interface BillingInvoiceData {
  id: string
  date: string
  amount: string
  status: 'Paid' | 'Pending' | 'Failed'
  downloadUrl: string
}

export interface LoginSessionData {
  id: string
  device: string
  ip: string
  location: string
  lastActive: string
  isCurrent: boolean
}

export interface SettingsCategoriesMockData {
  account: {
    personalInfo: {
      name: string
      jobTitle: string
      bio: string
      location: string
      visibility: string
    }
    contactDetails: {
      email: string
      phone: string
      secondaryEmail: string
    }
    preferences: {
      language: string
      timezone: string
    }
  }

  security: {
    twoFactorEnabled: boolean
    twoFactorMethod: string
    lastPasswordChange: string
    sessions: LoginSessionData[]
    trustedDevicesCount: number
  }

  notifications: {
    email: { id: string; title: string; description: string; checked: boolean }[]
    push: { id: string; title: string; description: string; checked: boolean }[]
    sms: { id: string; title: string; description: string; checked: boolean }[]
    inApp: { id: string; title: string; description: string; checked: boolean }[]
  }

  appearance: {
    currentTheme: 'dark' | 'light' | 'system'
    accentColor: string
    density: 'comfortable' | 'compact' | 'spacious'
    fontSize: 'sm' | 'md' | 'lg'
    dashboardLayout: 'executive' | 'compact' | 'analytical'
    accentColorsList: { name: string; hex: string; value: string }[]
  }

  integrations: IntegrationCardData[]

  privacy: {
    exportDataSize: string
    retentionPeriod: string
    consentMarketing: boolean
    consentAnalytics: boolean
    consentThirdParty: boolean
    activityLogEntries: number
  }

  billing: {
    planName: string
    planPrice: string
    billingCycle: string
    nextBillingDate: string
    paymentMethod: {
      cardBrand: string
      last4: string
      expiry: string
    }
    invoices: BillingInvoiceData[]
  }

  advanced: {
    developerMode: boolean
    featureFlags: { id: string; title: string; description: string; enabled: boolean }[]
    cacheSize: string
    diagnosticsStatus: string
  }
}

export const settingsCategoriesMockData: SettingsCategoriesMockData = {
  account: {
    personalInfo: {
      name: 'Dipak Khandagale',
      jobTitle: 'AI / ML Engineer & Full Stack Architect',
      bio: 'Building next-generation career intelligence applications, LLM agents, and web systems.',
      location: 'Pune, Maharashtra, India',
      visibility: 'public',
    },
    contactDetails: {
      email: 'dipakkhandagale7@gmail.com',
      phone: '+91 98765 43210',
      secondaryEmail: 'dipak.dev@scorelia.ai',
    },
    preferences: {
      language: 'en-US',
      timezone: 'Asia/Kolkata',
    },
  },

  security: {
    twoFactorEnabled: true,
    twoFactorMethod: 'Authenticator App (TOTP)',
    lastPasswordChange: '2 hours ago',
    sessions: [
      {
        id: 'sess-1',
        device: 'Chrome on Windows 11',
        ip: '103.45.12.89',
        location: 'Pune, India',
        lastActive: 'Active now',
        isCurrent: true,
      },
      {
        id: 'sess-2',
        device: 'Scorelia Mobile App (iOS)',
        ip: '49.36.21.102',
        location: 'Mumbai, India',
        lastActive: '5 hours ago',
        isCurrent: false,
      },
      {
        id: 'sess-3',
        device: 'Safari on macOS Sonoma',
        ip: '157.245.89.12',
        location: 'Bangalore, India',
        lastActive: '2 days ago',
        isCurrent: false,
      },
    ],
    trustedDevicesCount: 3,
  },

  notifications: {
    email: [
      { id: 'n-em-1', title: 'Account Security Alerts', description: 'Immediate notifications for new logins and password changes.', checked: true },
      { id: 'n-em-2', title: 'Weekly Career Insights Digest', description: 'Curated weekly AI career recommendations and market trends.', checked: true },
      { id: 'n-em-3', title: 'Product Updates & Release Notes', description: 'News about Scorelia V3 new features and tools.', checked: false },
    ],
    push: [
      { id: 'n-ph-1', title: 'Real-time Agent Console Alerts', description: 'Instant push alerts when AI subagents complete execution tasks.', checked: true },
      { id: 'n-ph-2', title: 'Interview Session Reminders', description: 'Reminders 15 minutes before scheduled AI mock interviews.', checked: true },
    ],
    sms: [
      { id: 'n-sms-1', title: 'Critical Security Authentication', description: 'SMS verification codes for urgent login attempts.', checked: true },
    ],
    inApp: [
      { id: 'n-app-1', title: 'Workspace Notifications', description: 'Badge counters for background syncs and notifications.', checked: true },
      { id: 'n-app-2', title: 'Sound Alerts', description: 'Play subtle audio sounds for completed tasks.', checked: false },
    ],
  },

  appearance: {
    currentTheme: 'dark',
    accentColor: 'indigo',
    density: 'comfortable',
    fontSize: 'md',
    dashboardLayout: 'executive',
    accentColorsList: [
      { name: 'Indigo (Default)', hex: '#6366F1', value: 'indigo' },
      { name: 'Emerald Green', hex: '#10B981', value: 'emerald' },
      { name: 'Ocean Blue', hex: '#3B82F6', value: 'blue' },
      { name: 'Cyan Tech', hex: '#06B6D4', value: 'cyan' },
      { name: 'Amber Sunset', hex: '#F59E0B', value: 'amber' },
      { name: 'Rose Red', hex: '#F43F5E', value: 'rose' },
    ],
  },

  integrations: [
    {
      id: 'github',
      name: 'GitHub Intelligence',
      description: 'Sync repositories, contribution heatmaps, commit frequency, and developer code quality scores.',
      iconName: 'Github',
      isConnected: true,
      statusBadge: 'Connected',
      lastSynced: '10 minutes ago',
    },
    {
      id: 'linkedin',
      name: 'LinkedIn Career Connect',
      description: 'Import professional experience, endorsements, skills, and industry network connections.',
      iconName: 'Linkedin',
      isConnected: true,
      statusBadge: 'Connected',
      lastSynced: '1 hour ago',
    },
    {
      id: 'google',
      name: 'Google Workspace Sync',
      description: 'Sync Google Calendar interview reminders and Drive document uploads.',
      iconName: 'Globe',
      isConnected: false,
      statusBadge: 'Not Connected',
    },
    {
      id: 'openai',
      name: 'OpenAI API Bridge',
      description: 'Connect custom OpenAI API keys for extended LLM model processing throughput.',
      iconName: 'Cpu',
      isConnected: true,
      statusBadge: 'Active API',
      lastSynced: 'Active key',
    },
    {
      id: 'slack',
      name: 'Slack Notification Bot',
      description: 'Send AI daily career briefs and subagent status updates directly to your Slack channel.',
      iconName: 'MessageSquare',
      isConnected: false,
      statusBadge: 'Not Connected',
    },
  ],

  privacy: {
    exportDataSize: '48.6 MB (JSON / ZIP)',
    retentionPeriod: '365 Days',
    consentMarketing: false,
    consentAnalytics: true,
    consentThirdParty: false,
    activityLogEntries: 142,
  },

  billing: {
    planName: 'Scorelia V3 Premium Pro',
    planPrice: '$29 / month',
    billingCycle: 'Annual (Billed Yearly)',
    nextBillingDate: 'Nov 15, 2026',
    paymentMethod: {
      cardBrand: 'Visa',
      last4: '4242',
      expiry: '12 / 2028',
    },
    invoices: [
      { id: 'INV-2026-003', date: 'Nov 15, 2025', amount: '$348.00', status: 'Paid', downloadUrl: '#' },
      { id: 'INV-2025-002', date: 'Nov 15, 2024', amount: '$348.00', status: 'Paid', downloadUrl: '#' },
      { id: 'INV-2024-001', date: 'Nov 15, 2023', amount: '$290.00', status: 'Paid', downloadUrl: '#' },
    ],
  },

  advanced: {
    developerMode: true,
    featureFlags: [
      { id: 'ff-1', title: 'LLM Multi-Agent CoT Reasoning', description: 'Enable deep chain-of-thought agent console logs.', enabled: true },
      { id: 'ff-2', title: 'WebGL 3D Career Graph Visualizer', description: 'Experimental GPU-accelerated career roadmap graph.', enabled: false },
      { id: 'ff-3', title: 'Streaming WebRTC Audio Interview AI', description: 'Ultra-low latency real-time voice synthesis.', enabled: true },
    ],
    cacheSize: '124.8 MB',
    diagnosticsStatus: 'All Systems Optimal',
  },
}
