import React from 'react'
import { Filter, RotateCcw } from 'lucide-react'
import { RepositorySortMenu, type SortField, type SortOrder } from './RepositorySortMenu'
import type { RepositoryHealthLevel, RepositoryVisibility } from '@/data/githubRepositoriesMockData'
import { cn } from '@/lib/utils'

export interface RepositoryFilterBarProps {
  visibilityFilter?: string
  onVisibilityChange?: (val: string) => void
  languageFilter?: string
  onLanguageChange?: (val: string) => void
  healthFilter?: string
  onHealthChange?: (val: string) => void
  sortField?: SortField
  sortOrder?: SortOrder
  onSortChange?: (field: SortField, order: SortOrder) => void
  onResetFilters?: () => void
  className?: string
}

export const RepositoryFilterBar: React.FC<RepositoryFilterBarProps> = ({
  visibilityFilter = 'all',
  onVisibilityChange,
  languageFilter = 'all',
  onLanguageChange,
  healthFilter = 'all',
  onHealthChange,
  sortField = 'stars',
  sortOrder = 'desc',
  onSortChange,
  onResetFilters,
  className,
}) => {
  const isFiltered = visibilityFilter !== 'all' || languageFilter !== 'all' || healthFilter !== 'all'

  return (
    <div className={cn('flex flex-wrap items-center justify-between gap-3 w-full font-sans select-none', className)}>
      <div className="flex flex-wrap items-center gap-2.5 flex-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--muted)] shrink-0 pr-1">
          <Filter size={14} />
          <span>Filters:</span>
        </div>

        {/* Visibility Filter */}
        <select
          value={visibilityFilter}
          onChange={(e) => onVisibilityChange?.(e.target.value)}
          aria-label="Filter by visibility"
          className="h-10 px-3 text-xs font-semibold rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/80 text-[var(--heading)] focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
        >
          <option value="all">All Visibilities</option>
          <option value="Public">Public Only</option>
          <option value="Private">Private Only</option>
        </select>

        {/* Language Filter */}
        <select
          value={languageFilter}
          onChange={(e) => onLanguageChange?.(e.target.value)}
          aria-label="Filter by language"
          className="h-10 px-3 text-xs font-semibold rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/80 text-[var(--heading)] focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
        >
          <option value="all">All Languages</option>
          <option value="TypeScript">TypeScript</option>
          <option value="Python">Python</option>
          <option value="Go">Go</option>
          <option value="JavaScript">JavaScript</option>
          <option value="Markdown">Markdown</option>
        </select>

        {/* Health Filter */}
        <select
          value={healthFilter}
          onChange={(e) => onHealthChange?.(e.target.value)}
          aria-label="Filter by health rating"
          className="h-10 px-3 text-xs font-semibold rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/80 text-[var(--heading)] focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
        >
          <option value="all">All Health Ratings</option>
          <option value="Excellent">Excellent</option>
          <option value="Good">Good</option>
          <option value="Needs Work">Needs Work</option>
          <option value="Poor">Poor</option>
          <option value="Archived">Archived</option>
        </select>

        {/* Reset Filters */}
        {isFiltered && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 h-10 px-3 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer"
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Sort Selector */}
      <RepositorySortMenu
        sortField={sortField}
        sortOrder={sortOrder}
        onSortChange={onSortChange}
      />
    </div>
  )
}
