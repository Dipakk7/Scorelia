import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface RepositoryPaginationProps {
  currentPage?: number
  totalPages?: number
  totalItems?: number
  pageSize?: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (size: number) => void
  className?: string
}

export const RepositoryPagination: React.FC<RepositoryPaginationProps> = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 8,
  pageSize = 5,
  onPageChange,
  onPageSizeChange,
  className,
}) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border border-white/10 bg-[#121426]/90 backdrop-blur-md font-sans text-xs select-none shadow-sm',
        className
      )}
    >
      <div className="flex items-center gap-3 text-slate-400 font-medium">
        <span>
          Showing <strong className="text-white font-bold font-mono">{startItem}–{endItem}</strong> of{' '}
          <strong className="text-white font-bold font-mono">{totalItems}</strong> repositories
        </span>

        <div className="flex items-center gap-1.5 pl-3 border-l border-white/10">
          <label htmlFor="repo-page-size" className="text-[11px] text-slate-400">Per page:</label>
          <select
            id="repo-page-size"
            value={pageSize}
            onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
            className="h-8 px-2 text-xs font-bold rounded-lg border border-slate-700/80 bg-slate-900/80 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange?.(currentPage - 1)}
          aria-label="Previous Page"
          className="inline-flex items-center justify-center h-8 px-3 rounded-lg border border-slate-700/80 bg-slate-900/80 text-slate-200 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer text-xs font-semibold"
        >
          <ChevronLeft size={14} />
          <span>Prev</span>
        </button>

        {Array.from({ length: totalPages }).map((_, idx) => {
          const pageNum = idx + 1
          const isActive = pageNum === currentPage
          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange?.(pageNum)}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'inline-flex items-center justify-center h-8 w-8 text-xs font-bold font-mono rounded-lg transition-all cursor-pointer border',
                isActive
                  ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-950/30'
                  : 'border-slate-700/80 bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              )}
            >
              {pageNum}
            </button>
          )
        })}

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange?.(currentPage + 1)}
          aria-label="Next Page"
          className="inline-flex items-center justify-center h-8 px-3 rounded-lg border border-slate-700/80 bg-slate-900/80 text-slate-200 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer text-xs font-semibold"
        >
          <span>Next</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}

export default RepositoryPagination
