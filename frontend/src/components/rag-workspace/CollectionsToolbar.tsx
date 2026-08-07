import React from 'react'
import { Search, LayoutGrid, List, SlidersHorizontal } from 'lucide-react'
import type { CollectionStatus } from '@/data/ragWorkspaceMockData'
import { cn } from '@/lib/utils'

export type SortOption =
  | 'updated'
  | 'newest'
  | 'oldest'
  | 'name-asc'
  | 'name-desc'
  | 'documents'
  | 'size'

export type ViewMode = 'table' | 'grid'

export interface CollectionsToolbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  statusFilter: CollectionStatus | 'all'
  onStatusFilterChange: (status: CollectionStatus | 'all') => void
  sortOption: SortOption
  onSortOptionChange: (sort: SortOption) => void
  viewMode: ViewMode
  onViewModeChange: (view: ViewMode) => void
  className?: string
}

export function CollectionsToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortOption,
  onSortOptionChange,
  viewMode,
  onViewModeChange,
  className
}: CollectionsToolbarProps) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] text-left select-none',
        className
      )}
    >
      {/* Left: Search Input */}
      <div className="relative flex-1 max-w-sm">
        <Search
          size={15}
          className="absolute left-3 top-2.5 text-[var(--muted)] pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search collections..."
          aria-label="Search knowledge collections"
          className="w-full bg-[var(--surface-hover)] border border-[var(--border)] hover:border-purple-500/30 focus:border-purple-500/50 text-xs text-[var(--heading)] placeholder-[var(--muted)] pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-colors"
        />
      </div>

      {/* Right: Status Filter, Sort Dropdown & View Mode Switcher */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Status Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-medium text-[var(--muted)] hidden md:inline">Status</span>
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as CollectionStatus | 'all')}
            aria-label="Filter collections by status"
            className="bg-[var(--surface-hover)] border border-[var(--border)] hover:border-purple-500/30 text-xs text-[var(--heading)] px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="ready">Ready</option>
            <option value="processing">Processing</option>
            <option value="indexing">Indexing</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-medium text-[var(--muted)] hidden md:inline">Sort</span>
          <select
            value={sortOption}
            onChange={(e) => onSortOptionChange(e.target.value as SortOption)}
            aria-label="Sort collections"
            className="bg-[var(--surface-hover)] border border-[var(--border)] hover:border-purple-500/30 text-xs text-[var(--heading)] px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 cursor-pointer"
          >
            <option value="updated">Recently Updated</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name-asc">Name A–Z</option>
            <option value="name-desc">Name Z–A</option>
            <option value="documents">Document Count</option>
            <option value="size">Storage Size</option>
          </select>
        </div>

        {/* Table / Grid View Toggle */}
        <div className="flex items-center p-1 rounded-xl bg-[var(--surface-hover)] border border-[var(--border)]">
          <button
            type="button"
            onClick={() => onViewModeChange('table')}
            className={cn(
              'p-1.5 rounded-lg transition-colors cursor-pointer focus:outline-none border-none',
              viewMode === 'table' ? 'bg-purple-600 text-white font-bold' : 'text-[var(--muted)] hover:text-[var(--heading)]'
            )}
            aria-label="Table view"
            aria-pressed={viewMode === 'table'}
          >
            <List size={15} />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('grid')}
            className={cn(
              'p-1.5 rounded-lg transition-colors cursor-pointer focus:outline-none border-none',
              viewMode === 'grid' ? 'bg-purple-600 text-white font-bold' : 'text-[var(--muted)] hover:text-[var(--heading)]'
            )}
            aria-label="Grid view"
            aria-pressed={viewMode === 'grid'}
          >
            <LayoutGrid size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default CollectionsToolbar

