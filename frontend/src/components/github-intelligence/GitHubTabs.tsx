import React, { useState } from 'react'
import {
  LayoutDashboard,
  FolderGit2,
  Activity,
  ShieldCheck,
  GitPullRequest,
  Sparkles,
  Award,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export type GitHubTabId =
  | 'overview'
  | 'repositories'
  | 'activity'
  | 'code_quality'
  | 'pull_requests'
  | 'contributions'
  | 'deep_insights'
  | 'settings'

export interface GitHubTabsProps {
  activeTab?: GitHubTabId
  onTabChange?: (tab: GitHubTabId) => void
  className?: string
}

export const GITHUB_TABS: { id: GitHubTabId; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'repositories', label: 'Repositories', icon: FolderGit2 },
  { id: 'activity', label: 'Activity', icon: Activity },
  { id: 'code_quality', label: 'Code Quality', icon: ShieldCheck },
  { id: 'pull_requests', label: 'Pull Requests', icon: GitPullRequest },
  { id: 'contributions', label: 'Contributions', icon: Award },
  { id: 'deep_insights', label: 'Deep Insights', icon: Sparkles },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export const GitHubTabs: React.FC<GitHubTabsProps> = ({
  activeTab = 'overview',
  onTabChange,
  className,
}) => {
  const [internalTab, setInternalTab] = useState<GitHubTabId>(activeTab)
  const currentTab = onTabChange ? activeTab : internalTab

  const handleSelect = (tabId: GitHubTabId) => {
    if (!onTabChange) {
      setInternalTab(tabId)
    } else {
      onTabChange(tabId)
    }
  }

  return (
    <div className={cn('w-full border-b border-[var(--border)] overflow-x-auto scrollbar-none', className)}>
      <nav aria-label="GitHub Intelligence Navigation" className="flex items-center gap-1 min-w-max pb-px">
        {GITHUB_TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = tab.id === currentTab
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleSelect(tab.id)}
              aria-selected={isActive}
              role="tab"
              className={cn(
                'relative flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer border',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500',
                isActive
                  ? 'bg-purple-500/10 text-purple-400 border-purple-500/30 shadow-sm'
                  : 'text-[var(--muted)] hover:text-[var(--heading)] hover:bg-[var(--surface-hover)] border-transparent'
              )}
            >
              <Icon size={14} className={isActive ? 'text-purple-400' : 'text-[var(--muted)]'} />
              <span>{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
