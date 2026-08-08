import React from 'react'
import { GitCommit, GitPullRequest, Eye, AlertCircle, Tag, Clock } from 'lucide-react'
import type { ActivityFeedItemData } from '@/data/githubAIInsightsMockData'
import { cn } from '@/lib/utils'

export interface ActivityTimelineItemProps {
  item: ActivityFeedItemData
  className?: string
}

export const ActivityTimelineItem: React.FC<ActivityTimelineItemProps> = ({ item, className }) => {
  const iconConfig = {
    commit: { icon: GitCommit, color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
    pull_request: { icon: GitPullRequest, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    review: { icon: Eye, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
    issue: { icon: AlertCircle, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    release: { icon: Tag, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
  }[item.type] || { icon: GitCommit, color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' }

  const Icon = iconConfig.icon

  return (
    <div className={cn('relative flex items-start gap-3 font-sans text-xs text-left group p-2.5 rounded-xl hover:bg-slate-900/60 transition-colors', className)}>
      <div className={cn('p-2 rounded-xl border shrink-0 z-10 mt-0.5', iconConfig.color)}>
        <Icon size={14} />
      </div>

      <div className="flex-1 space-y-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <span className="font-bold text-white group-hover:text-purple-300 transition-colors leading-snug">
            {item.title}
          </span>
          <span className="text-[10px] text-slate-400 shrink-0 flex items-center gap-1 font-medium font-mono whitespace-nowrap">
            <Clock size={10} /> {item.timestamp}
          </span>
        </div>

        <p className="text-xs text-slate-300 m-0 leading-relaxed font-sans">
          {item.description}
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[10px]">
          <span className="px-1.5 py-0.5 rounded border border-slate-700/80 bg-slate-900 text-slate-300 font-mono">
            {item.repository}
          </span>
          <span className="text-slate-400 font-medium">by {item.author}</span>
        </div>
      </div>
    </div>
  )
}

export default ActivityTimelineItem
