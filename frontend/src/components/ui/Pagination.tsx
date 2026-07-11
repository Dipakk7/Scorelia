import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages = []
    const range = 2 // Number of pages to show around current page

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - range && i <= currentPage + range)
      ) {
        pages.push(i)
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...')
      }
    }
    return pages
  }

  return (
    <nav
      role="navigation"
      aria-label="Pagination Navigation"
      className={cn('flex items-center justify-center gap-1.5 py-4', className)}
    >
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1"
      >
        <ChevronLeft size={16} />
        <span>Prev</span>
      </Button>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-1.5 text-sm text-[var(--muted)] select-none font-sans"
              >
                ...
              </span>
            )
          }

          const pageNum = page as number
          return (
            <Button
              key={`page-${pageNum}`}
              variant={currentPage === pageNum ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onPageChange(pageNum)}
              className={cn(
                'w-9 h-9 p-0 font-display text-sm',
                currentPage === pageNum
                  ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                  : 'hover:bg-[var(--surface-hover)]'
              )}
            >
              {pageNum}
            </Button>
          )
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1"
      >
        <span>Next</span>
        <ChevronRight size={16} />
      </Button>
    </nav>
  )
}
