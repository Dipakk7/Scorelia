import React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  containerClassName?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, containerClassName, id, required, ...props }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className={cn('w-full flex flex-col gap-1.5 text-left', containerClassName)}>
        {label && (
          <label
            htmlFor={textareaId}
            className="text-xs font-semibold font-display uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1"
          >
            <span>{label}</span>
            {required && <span className="text-rose-500 font-bold">*</span>}
          </label>
        )}
        <textarea
          id={textareaId}
          required={required}
          className={cn(
            'w-full min-h-[100px] px-3.5 py-2.5 border rounded-xl bg-white dark:bg-slate-900 text-slate-950 dark:text-slate-50 placeholder-slate-400/80 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 disabled:pointer-events-none disabled:opacity-50 transition-all duration-200 font-sans text-sm resize-y shadow-sm',
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10'
              : 'border-slate-300 dark:border-slate-700 focus:ring-brand-500/20 focus:border-brand-500 hover:border-slate-400 dark:hover:border-slate-600',
            className
          )}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? `${textareaId}-error` : undefined}
          {...props}
        />
        {error && (
          <span
            id={`${textareaId}-error`}
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

Textarea.displayName = 'Textarea'
