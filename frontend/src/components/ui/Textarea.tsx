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
            className="text-label text-[var(--muted)] flex items-center gap-1"
          >
            <span>{label}</span>
            {required && <span className="text-[var(--danger)] font-bold">*</span>}
          </label>
        )}
        <textarea
          id={textareaId}
          required={required}
          className={cn(
            'w-full min-h-[100px] px-3.5 py-2.5 border rounded-[var(--radius-input)] bg-[var(--surface)] text-[var(--body)] placeholder-[var(--muted)]/80 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] disabled:pointer-events-none disabled:opacity-[var(--opacity-disabled)] transition-all duration-[var(--duration-normal)] font-sans text-sm resize-y shadow-[var(--shadow-sm)]',
            error
              ? 'border-[var(--danger)] focus:border-[var(--danger)] focus:ring-[var(--danger)]/10'
              : 'border-[var(--border)] focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] hover:border-[var(--primary)]/50',
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

Textarea.displayName = 'Textarea'
