import React, { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  FolderGit2,
  Activity,
  ShieldCheck,
  GitPullRequest,
  Award,
  Sparkles,
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

export interface TabItem {
  id: GitHubTabId
  label: string
  icon: React.ElementType
}

export interface GitHubTabsProps {
  activeTab?: GitHubTabId
  onTabChange?: (tab: GitHubTabId) => void
  className?: string
}

export const GITHUB_TABS: TabItem[] = [
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
  const activeTabRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
  }, [activeTab])

  return (
    <div
      className={cn(
        'sticky top-2 z-30 backdrop-blur-md bg-[#111322]/85 border border-white/10 p-1.5 rounded-2xl shadow-xl transition-all overflow-x-auto scrollbar-none text-left',
        className
      )}
    >
      <nav
        role="tablist"
        aria-label="GitHub Intelligence Workspace Sections"
        className="flex items-center gap-1.5 p-1 bg-[#0b0c14]/70 border border-white/5 rounded-xl w-max min-w-full sm:min-w-0 select-none"
      >
        {GITHUB_TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = tab.id === activeTab

          return (
            <button
              key={tab.id}
              ref={isActive ? activeTabRef : null}
              type="button"
              role="tab"
              id={`github-tab-${tab.id}`}
              aria-controls={`github-tabpanel-${tab.id}`}
              aria-selected={isActive}
              onClick={() => onTabChange && onTabChange(tab.id)}
              className={cn(
                'relative flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-lg text-xs transition-all duration-200 focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none whitespace-nowrap cursor-pointer select-none z-10',
                isActive
                  ? 'text-white font-bold bg-purple-600/40 border border-purple-500/50 shadow-md shadow-purple-950/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 font-medium border border-transparent'
              )}
            >
              <Icon
                className={cn(
                  'w-4 h-4 relative z-10 transition-colors duration-200 pointer-events-none shrink-0',
                  isActive ? 'text-purple-200' : 'text-slate-400'
                )}
              />
              <span
                className={cn(
                  'relative z-10 transition-colors duration-200 pointer-events-none',
                  isActive ? 'text-white font-bold' : 'text-slate-400'
                )}
              >
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="githubActiveTabIndicator"
                  className="absolute inset-0 bg-purple-500/20 rounded-lg border border-purple-400/50 pointer-events-none z-0"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}

export default GitHubTabs
