import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface CollectionsPaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
  className?: string
}

export function CollectionsPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  className
}: CollectionsPaginationProps) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div
      aria-label="Collections Pagination Controls"
      className={cn(
        'flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#0e0f1a]/90 border border-white/10 text-xs text-slate-400 select-none',
        className
      )}
    >
      {/* Items Count Summary */}
      <div className="flex items-center gap-3">
        <span>
          Showing <strong className="text-slate-200 font-mono">{startItem}–{endItem}</strong> of{' '}
          <strong className="text-slate-200 font-mono">{totalItems}</strong> Collections
        </span>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 ml-2 border-l border-white/10 pl-3">
            <span className="text-[11px]">Per page</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              aria-label="Items per page"
              className="bg-[#121320] border border-white/10 text-xs text-slate-200 px-2 py-1 rounded-lg focus:outline-none cursor-pointer"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </div>
        )}
      </div>

      {/* Pagination Page Buttons */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
          className="p-1.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ChevronLeft size={15} />
        </button>

        {pages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={cn(
              'px-3 py-1 rounded-xl text-xs font-bold font-mono transition-colors cursor-pointer',
              page === currentPage
                ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                : 'border border-white/10 hover:bg-white/5 text-slate-300'
            )}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
          className="p-1.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  )
}

export default CollectionsPagination
