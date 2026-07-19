import React from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useScoreliaReducedMotion } from '@/lib/motion'

export const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)]/30">
      <table
        ref={ref}
        className={cn('w-full caption-bottom text-xs border-collapse text-left select-none', className)}
        {...props}
      />
    </div>
  )
)
Table.displayName = 'Table'

export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn('bg-[var(--divider)]/35 border-b border-[var(--border)]', className)} {...props} />
  )
)
TableHeader.displayName = 'TableHeader'

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
  )
)
TableBody.displayName = 'TableBody'

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  motion?: boolean
}

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, motion: isMotion = false, ...props }, ref) => {
    const shouldReduceMotion = useScoreliaReducedMotion()

    const resolvedClassName = cn(
      'border-b border-[var(--border)]/50 transition-all duration-[var(--duration-fast)] hover:bg-[var(--surface-hover)] data-[state=selected]:bg-[var(--divider)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/20',
      className
    )

    if (isMotion && !shouldReduceMotion) {
      return (
        <motion.tr
          ref={ref as any}
          className={resolvedClassName}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          {...(props as any)}
        />
      )
    }

    return (
      <tr
        ref={ref}
        className={resolvedClassName}
        {...props}
      />
    )
  }
)
TableRow.displayName = 'TableRow'

export const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        'h-10 px-4 align-middle font-medium font-display text-[var(--muted)] [&:has([role=checkbox])]:pr-0 text-xs uppercase tracking-wider sticky top-0 bg-[var(--surface)]/90 backdrop-blur-md z-10 border-b border-[var(--border)]/50',
        className
      )}
      {...props}
    />
  )
)
TableHead.displayName = 'TableHead'

export const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0 text-[var(--muted)] font-sans', className)}
      {...props}
    />
  )
)
TableCell.displayName = 'TableCell'
