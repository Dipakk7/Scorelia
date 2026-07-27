import React, { useState } from 'react'
import { ArrowUpDown, ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export type SortField = 'stars' | 'forks' | 'issues' | 'pullRequests' | 'updatedAt' | 'name' | 'health'
export type SortOrder = 'asc' | 'desc'

export interface RepositorySortMenuProps {
  sortField?: SortField
  sortOrder?: SortOrder
  onSortChange?: (field: SortField, order: SortOrder) => void
  className?: string
}

const SORT_OPTIONS: { field: SortField; label: string }[] = [
  { field: 'stars', label: 'Stars' },
  { field: 'forks', label: 'Forks' },
  { field: 'issues', label: 'Issues' },
  { field: 'pullRequests', label: 'Pull Requests' },
  { field: 'updatedAt', label: 'Recently Updated' },
  { field: 'name', label: 'Repository Name' },
  { field: 'health', label: 'Health Rating' },
]

export const RepositorySortMenu: React.FC<RepositorySortMenuProps> = ({
  sortField = 'stars',
  sortOrder = 'desc',
  onSortChange,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const activeOption = SORT_OPTIONS.find((o) => o.field === sortField) || SORT_OPTIONS[0]

  const handleSelect = (field: SortField) => {
    const nextOrder = field === sortField && sortOrder === 'desc' ? 'asc' : 'desc'
    onSortChange?.(field, nextOrder)
    setIsOpen(false)
  }

  const toggleOrder = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSortChange?.(sortField, sortOrder === 'asc' ? 'desc' : 'asc')
  }

  return (
    <div className={cn('relative inline-block text-left select-none', className)}>
      <div className="inline-flex items-center rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/80">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Sort repositories"
          className="inline-flex items-center gap-1.5 h-10 px-3 text-xs font-semibold text-[var(--heading)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-l-xl"
        >
          <ArrowUpDown size={13} className="text-[var(--muted)]" />
          <span className="whitespace-nowrap">Sort: {activeOption.label}</span>
          <ChevronDown size={13} className="text-[var(--muted)]" />
        </button>

        <button
          type="button"
          onClick={toggleOrder}
          title={`Order: ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
          aria-label={`Toggle sort direction to ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
          className="h-10 px-2 text-xs font-bold text-purple-400 border-l border-[var(--border)] hover:bg-[var(--border)]/40 cursor-pointer rounded-r-xl"
        >
          {sortOrder === 'asc' ? '↑ ASC' : '↓ DESC'}
        </button>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-lg z-30 py-1 font-sans">
            {SORT_OPTIONS.map((opt) => {
              const isSelected = opt.field === sortField
              return (
                <button
                  key={opt.field}
                  type="button"
                  onClick={() => handleSelect(opt.field)}
                  className={cn(
                    'w-full text-left px-3.5 py-2 text-xs font-medium cursor-pointer flex items-center justify-between transition-colors',
                    isSelected ? 'bg-purple-500/10 text-purple-400 font-semibold' : 'text-[var(--body)] hover:bg-[var(--surface-hover)]'
                  )}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check size={13} className="text-purple-400" />}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
