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
    <div className={cn('relative flex items-start gap-3 font-sans text-xs text-left group', className)}>
      <div className={cn('p-2 rounded-xl border shrink-0 z-10', iconConfig.color)}>
        <Icon size={14} />
      </div>

      <div className="flex-1 space-y-1 min-w-0 py-0.5">
        <div className="flex items-center justify-between gap-2">
          <span className="font-bold text-[var(--heading)] group-hover:text-purple-400 transition-colors truncate">
            {item.title}
          </span>
          <span className="text-[10px] text-[var(--muted)] shrink-0 flex items-center gap-1 font-medium">
            <Clock size={10} /> {item.timestamp}
          </span>
        </div>

        <p className="text-[11px] text-[var(--muted)] m-0 truncate leading-normal">
          {item.description}
        </p>

        <div className="flex items-center gap-2 pt-0.5 text-[10px]">
          <span className="px-1.5 py-0.2 rounded border border-[var(--border)] bg-[var(--surface-hover)] text-[var(--heading)] font-mono">
            {item.repository}
          </span>
          <span className="text-[var(--muted)] font-medium">by {item.author}</span>
        </div>
      </div>
    </div>
  )
}
