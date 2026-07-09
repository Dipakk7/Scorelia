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
            className="text-xs font-semibold font-display uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1"
          >
            <span>{label}</span>
            {required && <span className="text-rose-500 font-bold">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            id={selectId}
            required={required}
            className={cn(
              'w-full h-10 pl-3.5 pr-10 border rounded-xl bg-white dark:bg-slate-900 text-slate-950 dark:text-slate-50 placeholder-slate-400/80 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 disabled:pointer-events-none disabled:opacity-50 transition-all duration-200 font-sans text-sm appearance-none cursor-pointer shadow-sm',
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10'
                : 'border-slate-300 dark:border-slate-700 focus:ring-brand-500/20 focus:border-brand-500 hover:border-slate-400 dark:hover:border-slate-600',
              className
            )}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={error ? `${selectId}-error` : undefined}
            {...props}
          >
            {children}
          </select>
          <div className="absolute right-3 pointer-events-none text-slate-400">
            <ChevronDown size={16} />
          </div>
        </div>
        {error && (
          <span
            id={`${selectId}-error`}
            className="text-xs text-red-500 font-medium animate-fadeIn"
          >
            {error}
          </span>
        )}
        {helperText && !error && (
          <span className="text-[10px] text-slate-450 dark:text-slate-500 font-sans">
            {helperText}
          </span>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'
