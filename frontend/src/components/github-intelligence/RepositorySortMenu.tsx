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
      <div className="inline-flex items-center rounded-xl border border-slate-700/80 bg-slate-900/80">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Sort repositories"
          className="inline-flex items-center gap-1.5 h-10 px-3 text-xs font-semibold text-slate-200 hover:text-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded-l-xl"
        >
          <ArrowUpDown size={13} className="text-slate-400" />
          <span className="whitespace-nowrap">Sort: {activeOption.label}</span>
          <ChevronDown size={13} className="text-slate-400" />
        </button>

        <button
          type="button"
          onClick={toggleOrder}
          title={`Order: ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
          aria-label={`Toggle sort direction to ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
          className="h-10 px-2 text-xs font-bold font-mono text-purple-400 border-l border-slate-700/80 hover:bg-slate-800 cursor-pointer rounded-r-xl"
        >
          {sortOrder === 'asc' ? '↑ ASC' : '↓ DESC'}
        </button>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-[#121426] shadow-2xl shadow-purple-950/40 z-30 py-1 font-sans">
            {SORT_OPTIONS.map((opt) => {
              const isSelected = opt.field === sortField
              return (
                <button
                  key={opt.field}
                  type="button"
                  onClick={() => handleSelect(opt.field)}
                  className={cn(
                    'w-full text-left px-3.5 py-2 text-xs font-medium cursor-pointer flex items-center justify-between transition-colors',
                    isSelected ? 'bg-purple-500/10 text-purple-300 font-semibold' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
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

export default RepositorySortMenu
