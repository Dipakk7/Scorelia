import React from 'react'
import type { GitHubRepository } from '@/data/githubRepositoriesMockData'
import { RepositoryTableRow } from './RepositoryTableRow'
import { cn } from '@/lib/utils'

export interface TopRepositoriesTableProps {
  repositories: GitHubRepository[]
  onOpenRepo?: (repo: GitHubRepository) => void
  className?: string
}

export const TopRepositoriesTable: React.FC<TopRepositoriesTableProps> = ({
  repositories,
  onOpenRepo,
  className,
}) => {
  return (
    <div className={cn('w-full overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md shadow-sm', className)}>
      <table className="w-full text-left border-collapse font-sans text-xs">
        <thead className="bg-[var(--surface-hover)]/80 text-[var(--muted)] text-[10px] uppercase tracking-wider sticky top-0 z-10 backdrop-blur-md border-b border-[var(--border)] select-none">
          <tr>
            <th className="py-3 px-4 font-bold">Repository</th>
            <th className="py-3 px-3 font-bold text-left">Language</th>
            <th className="py-3 px-3 font-bold text-center">Stars</th>
            <th className="py-3 px-3 font-bold text-center">Forks</th>
            <th className="py-3 px-3 font-bold text-center">Issues</th>
            <th className="py-3 px-3 font-bold text-center">PRs</th>
            <th className="py-3 px-3 font-bold text-center">Last Commit</th>
            <th className="py-3 px-3 font-bold text-center">Health</th>
            <th className="py-3 px-4 font-bold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]/50">
          {repositories.map((repo) => (
            <RepositoryTableRow key={repo.id} repo={repo} onOpenRepo={onOpenRepo} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
