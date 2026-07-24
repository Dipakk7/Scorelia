import React from 'react'
import { Link } from 'react-router-dom'
import {
  FileText,
  Scan,
  MessageSquareCode,
  Briefcase,
  Mail,
  Compass,
  Plus,
} from 'lucide-react'
import { Github } from '@/components/ui/GithubIcon'

export interface QuickActionItem {
  label: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  color: string
  to: string
}

const DEFAULT_QUICK_ACTIONS: QuickActionItem[] = [
  { label: 'Improve My Resume', icon: FileText, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', to: '/resumes' },
  { label: 'Optimize ATS Score', icon: Scan, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20', to: '/ats' },
  { label: 'Practice Interview', icon: MessageSquareCode, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20', to: '/interview' },
  { label: 'Find Matching Jobs', icon: Briefcase, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', to: '/roadmap' },
  { label: 'Generate Cover Letter', icon: Mail, color: 'text-pink-400 bg-pink-500/10 border-pink-500/20', to: '/cover-letter' },
  { label: 'Analyze GitHub', icon: Github, color: 'text-orange-400 bg-orange-500/10 border-orange-500/20', to: '/github-intelligence' },
  { label: 'Build Roadmap', icon: Compass, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20', to: '/roadmap' },
]

interface QuickActionsRowProps {
  actions?: QuickActionItem[]
  onCustomClick?: () => void
}

export const QuickActionsRow: React.FC<QuickActionsRowProps> = React.memo(({
  actions = DEFAULT_QUICK_ACTIONS,
  onCustomClick,
}) => {
  return (
    <div className="space-y-2 select-none">
      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Quick Actions</h2>
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 custom-scrollbar">
        {actions.map((act, i) => {
          const Icon = act.icon
          return (
            <Link
              key={i}
              to={act.to}
              aria-label={act.label}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0f101d] border border-white/10 hover:border-white/20 hover:bg-white/[0.07] active:scale-[0.98] transition-all shrink-0 group text-xs font-semibold text-slate-200 shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07080e]"
            >
              <div className={`p-1 rounded-lg border ${act.color}`}>
                <Icon size={14} />
              </div>
              <span>{act.label}</span>
            </Link>
          )
        })}
        <button
          onClick={onCustomClick}
          aria-label="Add custom action"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-transparent border border-dashed border-white/20 hover:border-purple-400/50 hover:bg-white/[0.04] active:scale-[0.98] text-slate-400 hover:text-purple-300 transition-all shrink-0 text-xs font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07080e]"
        >
          <Plus size={14} />
          <span>Custom</span>
        </button>
      </div>
    </div>
  )
})
export default QuickActionsRow
