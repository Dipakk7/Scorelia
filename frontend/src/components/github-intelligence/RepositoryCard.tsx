import React from 'react'
import { Code2, Star, GitFork, ExternalLink, Clock } from 'lucide-react'
import type { GitHubRepository } from '@/data/githubRepositoriesMockData'
import { RepositoryHealthBadge } from './RepositoryHealthBadge'
import { cn } from '@/lib/utils'

export interface RepositoryCardProps {
  repo: GitHubRepository
  onOpenRepo?: (repo: GitHubRepository) => void
  className?: string
}

export const RepositoryCard: React.FC<RepositoryCardProps> = ({
  repo,
  onOpenRepo,
  className,
}) => {
  return (
    <div
      tabIndex={0}
      className={cn(
        'group p-4 rounded-2xl border border-white/10 bg-[#121426]/90 backdrop-blur-md shadow-sm space-y-3 font-sans text-xs text-left',
        'hover:border-purple-500/40 hover:bg-[#15172a] hover:shadow-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 select-none',
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
            <Code2 size={16} />
          </div>
          <div className="min-w-0">
            <div className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors truncate">
              {repo.name}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono mt-0.5">
              <span>{repo.visibility}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: repo.languageColor }} />
                {repo.language}
              </span>
            </div>
          </div>
        </div>
        <RepositoryHealthBadge health={repo.health} />
      </div>

      <p className="text-[11px] text-slate-400 line-clamp-2 m-0 leading-relaxed font-sans">
        {repo.description}
      </p>

      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px]">
        <div className="flex items-center gap-3 font-semibold text-white font-mono">
          <span className="flex items-center gap-1">
            <Star size={12} className="text-amber-400 fill-amber-400/20" /> {repo.stars}
          </span>
          <span className="flex items-center gap-1">
            <GitFork size={12} className="text-sky-400" /> {repo.forks}
          </span>
          <span className="flex items-center gap-1 text-slate-400 font-normal text-[10px] font-sans">
            <Clock size={10} /> {repo.lastCommit}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onOpenRepo?.(repo)}
          aria-label={`Open ${repo.name}`}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg border border-slate-700/80 bg-slate-900/80 text-slate-200 hover:text-purple-300 hover:border-purple-500/40 hover:bg-slate-800 transition-all cursor-pointer"
        >
          <span>Open</span>
          <ExternalLink size={11} />
        </button>
      </div>
    </div>
  )
}

export default RepositoryCard
