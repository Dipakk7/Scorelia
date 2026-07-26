import React from 'react'
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
  return (
    <div className="border-b border-white/10 pb-1 text-left">
      <nav className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar no-scrollbar py-1">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = tab.id === activeTab
          const isAvailable = tab.available ?? false

          return (
            <button
              key={tab.id}
              onClick={() => isAvailable && onTabChange && onTabChange(tab.id)}
              disabled={!isAvailable}
              className={cn(
                'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer select-none',
                isActive
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-sm shadow-purple-900/20'
                  : isAvailable
                  ? 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                  : 'text-slate-600 cursor-not-allowed border border-transparent opacity-60'
              )}
            >
              <Icon className={cn('h-4 w-4', isActive ? 'text-purple-400' : isAvailable ? 'text-slate-400' : 'text-slate-600')} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
export default InterviewPrepNavigation
