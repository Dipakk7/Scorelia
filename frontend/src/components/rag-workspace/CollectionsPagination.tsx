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
        'flex flex-col sm:flex-row items-center justify-between gap-4 p-5 sm:p-5.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-purple-500/30 transition-all duration-300 text-xs text-[var(--muted)] select-none shadow-[var(--shadow-sm)]',
        className
      )}
    >
      {/* Items Count Summary */}
      <div className="flex items-center gap-3">
        <span>
          Showing <strong className="text-[var(--heading)] font-mono">{startItem}–{endItem}</strong> of{' '}
          <strong className="text-[var(--heading)] font-mono">{totalItems}</strong> Collections
        </span>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 ml-2 border-l border-[var(--border)] pl-3">
            <span className="text-[11px]">Per page</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              aria-label="Items per page"
              className="bg-[var(--surface-hover)] border border-[var(--border)] text-xs text-[var(--heading)] px-2 py-1 rounded-lg focus:outline-none cursor-pointer"
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
          className="p-1.5 rounded-xl border border-[var(--border)] text-[var(--muted)] hover:text-[var(--heading)] hover:bg-[var(--surface-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
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
                ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40 border-none'
                : 'border border-[var(--border)] hover:bg-[var(--surface-hover)] text-[var(--heading)]'
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
          className="p-1.5 rounded-xl border border-[var(--border)] text-[var(--muted)] hover:text-[var(--heading)] hover:bg-[var(--surface-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  )
}

export default CollectionsPagination

