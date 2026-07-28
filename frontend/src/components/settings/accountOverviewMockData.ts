export interface AccountUserProfile {
  name: string
  email: string
  avatarUrl: string
  plan: string
  accountId: string
  memberSince: string
  isVerified: boolean
  profileCompletion: number
}

export interface SecurityChecklistItem {
  label: string
  value: string
  status: 'success' | 'warning' | 'info'
}

export interface AccountHealthData {
  score: number
  maxScore: number
  statusLabel: string
  description: string
  checklist: SecurityChecklistItem[]
  recommendations: string[]
}

export interface UsageMetric {
  id: string
  label: string
  used: string
  total: string
  percentage: number
  colorClass: string
  iconName: string
}

export interface UsageSummaryData {
  resetDaysText: string
  metrics: UsageMetric[]
}

export interface TimelineActivityItem {
  id: string
  title: string
  description: string
  timestamp: string
  iconName: string
  badge?: string
  status?: 'success' | 'info' | 'warning' | 'default'
}

export interface AccountOverviewMockData {
  userProfile: AccountUserProfile
  health: AccountHealthData
  usage: UsageSummaryData
  activities: TimelineActivityItem[]
}

export const accountOverviewMockData: AccountOverviewMockData = {
  userProfile: {
    name: 'Dipak Khandagale',
    email: 'dipakkhandagale7@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    plan: 'Premium Plan',
    accountId: 'SCR-884920',
    memberSince: 'Member since Nov 2023',
    isVerified: true,
    profileCompletion: 95,
  },

  health: {
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
    recommendations: [
      'Enable 2FA backup codes',
      'Complete profile details',
      'Review privacy settings',
    ],
  },

  usage: {
    resetDaysText: 'Resets in 14 days',
    metrics: [
      {
        id: 'ai-credits',
        label: 'AI Credits',
        used: '2,450',
        total: '5,000',
        percentage: 49,
        colorClass: 'bg-indigo-500',
        iconName: 'Sparkles',
      },
      {
        id: 'storage',
        label: 'Storage Usage',
        used: '12.4 GB',
        total: '50 GB',
        percentage: 25,
        colorClass: 'bg-blue-500',
        iconName: 'HardDrive',
      },
      {
        id: 'api-requests',
        label: 'API Requests',
        used: '18,250',
        total: '50,000',
        percentage: 36,
        colorClass: 'bg-cyan-500',
        iconName: 'Cpu',
      },
      {
        id: 'resumes',
        label: 'Resume Analyses',
        used: '42',
        total: '100',
        percentage: 42,
        colorClass: 'bg-emerald-500',
        iconName: 'FileText',
      },
    ],
  },

  activities: [
    {
      id: 'act-1',
      title: 'Password updated',
      description: 'Account password changed successfully.',
      timestamp: '2 hours ago',
      iconName: 'Key',
      status: 'success',
    },
    {
      id: 'act-2',
      title: 'Logged in from Chrome',
      description: 'Session initiated on Windows OS.',
      timestamp: '5 hours ago',
      badge: 'New device',
      iconName: 'Globe',
      status: 'info',
    },
    {
      id: 'act-3',
      title: 'Email updated',
      description: 'Primary email address verified.',
      timestamp: '1 day ago',
      iconName: 'Mail',
      status: 'success',
    },
    {
      id: 'act-4',
      title: 'Two-factor authentication enabled',
      description: 'Authenticator app added as primary 2FA.',
      timestamp: '2 days ago',
      iconName: 'Shield',
      status: 'success',
    },
    {
      id: 'act-5',
      title: 'Resume analyzed',
      description: 'ATS report generated for Senior Software Engineer.',
      timestamp: '3 days ago',
      iconName: 'FileText',
      status: 'info',
    },
    {
      id: 'act-6',
      title: 'Preferences changed',
      description: 'Updated general landing module settings.',
      timestamp: '4 days ago',
      iconName: 'Sliders',
      status: 'success',
    },
    {
      id: 'act-7',
      title: 'Account created',
      description: 'Welcome to Scorelia V3 Intelligence Platform.',
      timestamp: 'Nov 15, 2023',
      iconName: 'UserCheck',
      status: 'default',
    },
  ],
}
