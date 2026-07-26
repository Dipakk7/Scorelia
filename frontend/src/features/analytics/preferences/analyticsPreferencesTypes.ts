export type WidgetCategory = 'Overview' | 'Charts' | 'Performance' | 'Intelligence' | 'Reports' | 'Utilities'
export type WidgetSize = 'small' | 'medium' | 'large' | 'full'

export interface WidgetItemPreference {
  id: string
  name: string
  category: WidgetCategory
  visible: boolean
  size: WidgetSize
  order: number
  pinned: boolean
}

export interface DashboardPresetItem {
  id: string
  name: string
  description: string
  isDefault: boolean
  widgetIds: string[]
}

export interface DisplayPreferences {
  theme: string
  compactMode: boolean
  autoRefreshInterval: number
  showSparklines: boolean
}

export interface UserAnalyticsPreferences {
  selectedPresetId: string
  widgets: WidgetItemPreference[]
  favoriteReportIds: string[]
  pinnedInsightIds: string[]
  collapsedSectionIds: string[]
  displayPreferences: DisplayPreferences
}

export interface ApiAnalyticsPreferencesResponse {
  success: boolean
  message: string
  data: UserAnalyticsPreferences
}
