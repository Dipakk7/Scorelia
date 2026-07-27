import React from 'react'
import { Code2, Star, GitFork, AlertCircle, GitPullRequest, ExternalLink } from 'lucide-react'
import type { GitHubRepository } from '@/data/githubRepositoriesMockData'
import { RepositoryHealthBadge } from './RepositoryHealthBadge'
import { cn } from '@/lib/utils'

export interface RepositoryTableRowProps {
  repo: GitHubRepository
  onOpenRepo?: (repo: GitHubRepository) => void
  className?: string
}

export const RepositoryTableRow: React.FC<RepositoryTableRowProps> = ({
  repo,
  onOpenRepo,
  className,
}) => {
  return (
    <tr
      tabIndex={0}
      className={cn(
        'group hover:bg-[var(--surface-hover)]/70 transition-colors duration-150 border-b border-[var(--border)]/60 text-xs font-sans',
        'focus-visible:outline-none focus-visible:bg-[var(--surface-hover)]',
        className
      )}
    >
      {/* Repo Details */}
      <td className="py-3 px-4 text-left">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
            <Code2 size={16} />
          </div>
          <div className="min-w-0">
            <div className="font-bold text-sm text-[var(--heading)] flex items-center gap-2">
              <span className="truncate group-hover:text-purple-400 transition-colors">{repo.name}</span>
              <span
                className={cn(
                  'text-[9px] font-mono px-1.5 py-0.2 rounded border uppercase tracking-wider',
                  repo.visibility === 'Public'
                    ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                    : 'border-sky-500/30 text-sky-400 bg-sky-500/10'
                )}
              >
                {repo.visibility}
              </span>
            </div>
            <div className="text-[11px] text-[var(--muted)] truncate max-w-xs sm:max-w-sm mt-0.5">
              {repo.description}
            </div>
          </div>
        </div>
      </td>

      {/* Language */}
      <td className="py-3 px-3 text-left">
        <span className="inline-flex items-center gap-1.5 font-medium text-[var(--heading)]">
          <span
            className="h-2.5 w-2.5 rounded-full shrink-0"
            style={{ backgroundColor: repo.languageColor }}
          />
          {repo.language}
        </span>
      </td>

      {/* Stars */}
      <td className="py-3 px-3 text-center font-bold text-[var(--heading)]">
        <span className="inline-flex items-center gap-1">
          <Star size={13} className="text-amber-400 fill-amber-400/20" />
          {repo.stars}
        </span>
      </td>

      {/* Forks */}
      <td className="py-3 px-3 text-center font-bold text-[var(--heading)]">
        <span className="inline-flex items-center gap-1">
          <GitFork size={13} className="text-sky-400" />
          {repo.forks}
        </span>
      </td>

      {/* Issues */}
      <td className="py-3 px-3 text-center font-bold text-[var(--heading)]">
        <span className="inline-flex items-center gap-1">
          <AlertCircle size={13} className="text-amber-400" />
          {repo.issues}
        </span>
      </td>

      {/* PRs */}
      <td className="py-3 px-3 text-center font-bold text-[var(--heading)]">
        <span className="inline-flex items-center gap-1">
          <GitPullRequest size={13} className="text-emerald-400" />
          {repo.pullRequests}
        </span>
      </td>

      {/* Last Commit */}
      <td className="py-3 px-3 text-center text-[var(--muted)] font-medium">
        {repo.lastCommit}
      </td>

      {/* Health */}
      <td className="py-3 px-3 text-center">
        <RepositoryHealthBadge health={repo.health} />
      </td>

      {/* Actions */}
      <td className="py-3 px-4 text-right">
        <button
          type="button"
          onClick={() => onOpenRepo?.(repo)}
          aria-label={`Open repository ${repo.name}`}
          className="p-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] text-[var(--muted)] hover:text-purple-400 hover:border-purple-500/40 transition-all cursor-pointer"
        >
          <ExternalLink size={14} />
        </button>
      </td>
    </tr>
  )
}
