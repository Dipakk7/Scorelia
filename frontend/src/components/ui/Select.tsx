import React from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
  containerClassName?: string
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, containerClassName, id, required, children, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className={cn('w-full flex flex-col gap-1.5 text-left', containerClassName)}>
        {label && (
          <label
            htmlFor={selectId}
            className="text-label text-[var(--muted)] flex items-center gap-1"
          >
            <span>{label}</span>
            {required && <span className="text-[var(--danger)] font-bold">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            id={selectId}
            required={required}
            className={cn(
              'w-full h-10 pl-3.5 pr-10 border rounded-[var(--radius-input)] bg-[var(--surface)] text-[var(--body)] placeholder-[var(--muted)]/80 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] disabled:pointer-events-none disabled:opacity-[var(--opacity-disabled)] transition-all duration-[var(--duration-normal)] font-sans text-sm appearance-none cursor-pointer shadow-[var(--shadow-sm)]',
              error
                ? 'border-[var(--danger)] focus:border-[var(--danger)] focus:ring-[var(--danger)]/10'
                : 'border-[var(--border)] focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] hover:border-[var(--primary)]/50',
              className
            )}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={error ? `${selectId}-error` : undefined}
            {...props}
          >
            {children}
          </select>
          <div className="absolute right-3 pointer-events-none text-[var(--muted)]">
            <ChevronDown size={16} />
          </div>
        </div>
        {error && (
          <span
            id={`${selectId}-error`}
            className="text-caption text-[var(--danger)] font-medium animate-fade-in"
          >
            {error}
          </span>
        )}
        {helperText && !error && (
          <span className="text-caption text-[var(--muted)] font-sans">
            {helperText}
          </span>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'
