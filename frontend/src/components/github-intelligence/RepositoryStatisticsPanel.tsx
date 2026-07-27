import React from 'react'
import {
  FolderGit2,
  Lock,
  Globe,
  Archive,
  GitFork,
  Heart,
  Star,
  Activity,
} from 'lucide-react'
import { githubRepositoriesMockData, type RepositoryStatsSummary } from '@/data/githubRepositoriesMockData'
import { cn } from '@/lib/utils'

export interface RepositoryStatisticsPanelProps {
  summary?: RepositoryStatsSummary
  className?: string
}

export const RepositoryStatisticsPanel: React.FC<RepositoryStatisticsPanelProps> = ({
  summary = githubRepositoriesMockData.summary,
  className,
}) => {
  const statCards = [
    { label: 'Total Repos', value: summary.totalRepositories, icon: FolderGit2, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { label: 'Public', value: summary.publicRepositories, icon: Globe, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Private', value: summary.privateRepositories, icon: Lock, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20' },
    { label: 'Archived', value: summary.archivedRepositories, icon: Archive, color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20' },
    { label: 'Forked', value: summary.forkedRepositories, icon: GitFork, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
    { label: 'Avg Health', value: `${summary.averageHealthScore}%`, icon: Heart, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
    { label: 'Total Stars', value: summary.totalStars, icon: Star, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'Total Forks', value: summary.totalForks, icon: Activity, color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20' },
  ]

  return (
    <div className={cn('grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 font-sans select-none', className)}>
      {statCards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.label}
            className="p-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md shadow-sm hover:border-purple-500/40 transition-all text-left flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-[10px] font-semibold text-[var(--muted)] truncate">{card.label}</span>
              <div className={cn('p-1 rounded-lg border', card.bg)}>
                <Icon size={12} className={card.color} />
              </div>
            </div>
            <div className="text-lg font-extrabold font-display text-[var(--heading)] tracking-tight">
              {card.value}
            </div>
          </div>
        )
      })}
    </div>
  )
}
