import React from 'react'
import { Filter, SlidersHorizontal } from 'lucide-react'
import { GitHubSearch } from './GitHubSearch'
import { GitHubSyncButton } from './GitHubSyncButton'
import { GitHubDateFilter } from './GitHubDateFilter'
import { cn } from '@/lib/utils'

export interface GitHubToolbarProps {
  className?: string
  searchQuery?: string
  onSearchChange?: (val: string) => void
  dateRange?: string
  onDateRangeChange?: (val: string) => void
  onSync?: () => void
  onFilterClick?: () => void
}

export const GitHubToolbar: React.FC<GitHubToolbarProps> = ({
  className,
  searchQuery,
  onSearchChange,
  dateRange,
  onDateRangeChange,
  onSync,
  onFilterClick,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col md:flex-row md:items-center justify-between gap-3 w-full p-2.5 sm:p-3 rounded-2xl bg-[#121426]/90 backdrop-blur-md border border-white/10 shadow-sm transition-all duration-200',
        className
      )}
    >
      {/* Left: Compact V3 Search Field */}
      <div className="flex-1 w-full md:max-w-md lg:max-w-lg">
        <GitHubSearch value={searchQuery} onChange={onSearchChange} />
      </div>

      {/* Right: Operational Controls Row */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 flex-wrap justify-end">
        <GitHubDateFilter value={dateRange} onChange={onDateRangeChange} />
        <GitHubSyncButton onSync={onSync} />

        {/* Quick Filter Toggle Button */}
        <button
          type="button"
          onClick={onFilterClick}
          aria-label="Filter repositories"
          className="inline-flex items-center justify-center gap-1.5 h-10 px-3 rounded-xl border border-slate-700/80 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 text-xs font-semibold"
        >
          <Filter className="h-3.5 w-3.5 text-purple-400 shrink-0" />
          <span className="hidden sm:inline">Filter</span>
        </button>

        {/* Settings/Preferences Icon Button */}
        <button
          type="button"
          aria-label="Toolbar Settings"
          className="inline-flex items-center justify-center h-10 w-10 rounded-xl border border-slate-700/80 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
        >
          <SlidersHorizontal className="h-4 w-4 text-slate-400 hover:text-purple-400 transition-colors" />
        </button>
      </div>
    </div>
  )
}

export default GitHubToolbar
