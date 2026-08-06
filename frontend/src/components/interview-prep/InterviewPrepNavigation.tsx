import React, { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Video,
  FileText,
  Edit3,
  TrendingUp,
  FileSpreadsheet,
  Bot,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface TabItem {
  id: string
  label: string
  icon: React.ElementType
  available?: boolean
}

const TABS: TabItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, available: true },
  { id: 'mock-interviews', label: 'Mock Interviews', icon: Video, available: true },
  { id: 'question-bank', label: 'Question Bank', icon: FileText, available: true },
  { id: 'my-answers', label: 'My Answers', icon: Edit3, available: true },
  { id: 'performance', label: 'Performance', icon: TrendingUp, available: true },
  { id: 'feedback', label: 'Feedback & Reports', icon: FileSpreadsheet, available: true },
  { id: 'copilot', label: 'Interview Copilot', icon: Bot, available: true },
]

export interface InterviewPrepNavigationProps {
  activeTab?: string
  onTabChange?: (tabId: string) => void
}

export function InterviewPrepNavigation({
  activeTab = 'overview',
  onTabChange,
}: InterviewPrepNavigationProps) {
  const activeTabRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
  }, [activeTab])

  return (
    <div className="sticky top-2 z-30 backdrop-blur-md bg-slate-950/85 border border-slate-800/80 p-1.5 rounded-2xl shadow-xl transition-all overflow-x-auto scrollbar-none text-left">
      <nav
        role="tablist"
        aria-label="Interview Prep Workspace Sections"
        className="flex items-center gap-1.5 p-1 bg-slate-900/70 border border-slate-800/80 rounded-xl w-max min-w-full sm:min-w-0"
      >
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = tab.id === activeTab
          const isAvailable = tab.available ?? false

          return (
            <button
              key={tab.id}
              ref={isActive ? activeTabRef : null}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-controls={`panel-${tab.id}`}
              aria-selected={isActive}
              disabled={!isAvailable}
              onClick={() => isAvailable && onTabChange && onTabChange(tab.id)}
              className={cn(
                'relative flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-lg text-xs transition-all duration-200 focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none whitespace-nowrap cursor-pointer select-none z-10',
                isActive
                  ? 'text-white font-bold bg-purple-600/40 border border-purple-500/50 shadow-md shadow-purple-950/20'
                  : isAvailable
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 font-medium'
                  : 'text-slate-600 cursor-not-allowed border border-transparent opacity-60'
              )}
            >
              <Icon
                className={cn(
                  'w-4 h-4 relative z-10 transition-colors duration-200 pointer-events-none shrink-0',
                  isActive ? 'text-purple-200' : isAvailable ? 'text-slate-400' : 'text-slate-600'
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
                  layoutId="activeTabIndicator"
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
export default InterviewPrepNavigation
