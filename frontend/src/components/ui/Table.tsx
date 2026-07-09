import React from 'react'
import { cn } from '@/lib/utils'

export const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/30 dark:bg-slate-900/10">
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
    <thead ref={ref} className={cn('bg-slate-50/75 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800/60', className)} {...props} />
  )
)
TableHeader.displayName = 'TableHeader'

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
  )
)
TableBody.displayName = 'TableBody'

export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'border-b border-slate-100 dark:border-slate-800/50 transition-colors duration-150 hover:bg-slate-50/70 dark:hover:bg-slate-900/50 data-[state=selected]:bg-slate-100/50 dark:data-[state=selected]:bg-slate-800/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/20',
        className
      )}
      {...props}
    />
  )
)
TableRow.displayName = 'TableRow'

export const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        'h-10 px-4 align-middle font-medium font-display text-slate-500 dark:text-slate-400 [&:has([role=checkbox])]:pr-0 text-xs uppercase tracking-wider',
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
      className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0 text-slate-700 dark:text-slate-300 font-sans', className)}
      {...props}
    />
  )
)
TableCell.displayName = 'TableCell'
