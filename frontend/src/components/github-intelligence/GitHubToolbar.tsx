import React from 'react'
import { Bell, SlidersHorizontal } from 'lucide-react'
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
}

export const GitHubToolbar: React.FC<GitHubToolbarProps> = ({
  className,
  searchQuery,
  onSearchChange,
  dateRange,
  onDateRangeChange,
  onSync,
}) => {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 w-full p-2 sm:p-3 rounded-2xl bg-[var(--surface)]/70 backdrop-blur-md border border-[var(--border)] shadow-sm',
        className
      )}
    >
      <div className="flex-1 min-w-[240px]">
        <GitHubSearch value={searchQuery} onChange={onSearchChange} />
      </div>

      <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
        <GitHubSyncButton onSync={onSync} />
        <GitHubDateFilter value={dateRange} onChange={onDateRangeChange} />

        {/* Notification Icon Placeholder */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative inline-flex items-center justify-center h-10 w-10 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/80 hover:bg-[var(--border)]/50 text-[var(--muted)] hover:text-[var(--heading)] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-purple-500 ring-2 ring-[var(--surface)]" />
        </button>

        {/* Settings/Theme Icon Placeholder */}
        <button
          type="button"
          aria-label="Toolbar Settings"
          className="inline-flex items-center justify-center h-10 w-10 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/80 hover:bg-[var(--border)]/50 text-[var(--muted)] hover:text-[var(--heading)] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
