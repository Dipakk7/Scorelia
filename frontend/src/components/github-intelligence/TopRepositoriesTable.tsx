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
    <div className={cn('w-full overflow-x-auto rounded-2xl border border-white/10 bg-[#121426]/90 backdrop-blur-md shadow-xl shadow-purple-950/10 select-none text-left', className)}>
      <table className="w-full text-left border-collapse font-sans text-xs min-w-[760px]">
        <thead className="bg-[#0e101f] text-slate-400 text-[10px] uppercase font-mono tracking-wider sticky top-0 z-10 backdrop-blur-md border-b border-white/10 select-none">
          <tr>
            <th className="py-3 px-4 font-bold text-slate-300">Repository</th>
            <th className="py-3 px-3 font-bold text-left text-slate-300">Language</th>
            <th className="py-3 px-3 font-bold text-center text-slate-300">Stars</th>
            <th className="py-3 px-3 font-bold text-center text-slate-300">Forks</th>
            <th className="py-3 px-3 font-bold text-center text-slate-300">Issues</th>
            <th className="py-3 px-3 font-bold text-center text-slate-300">PRs</th>
            <th className="py-3 px-3 font-bold text-center text-slate-300">Last Commit</th>
            <th className="py-3 px-3 font-bold text-center text-slate-300">Health</th>
            <th className="py-3 px-4 font-bold text-right text-slate-300">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {(repositories ?? []).map((repo) => (
            <RepositoryTableRow key={repo.id} repo={repo} onOpenRepo={onOpenRepo} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TopRepositoriesTable
