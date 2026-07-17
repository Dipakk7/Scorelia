import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  containerClassName?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, helperText, leftIcon, rightIcon, containerClassName, id, required, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'
    
    const handleTogglePassword = () => {
      setShowPassword(!showPassword)
    }

    const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className={cn('w-full flex flex-col gap-1.5 text-left', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-label text-muted flex items-center gap-1"
          >
            <span>{label}</span>
            {required && <span className="text-[var(--danger)] font-bold">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-muted pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            type={resolvedType}
            required={required}
            className={cn(
              'w-full h-10 px-3.5 py-2 border rounded-[var(--radius-input)] bg-input-bg text-body placeholder-input-placeholder focus:outline-none focus:ring-2 focus:ring-brand-focus-ring/20 focus:border-input-border-focus disabled:pointer-events-none disabled:opacity-[var(--opacity-disabled)] transition-all duration-[var(--duration-normal)] font-sans text-body-sm shadow-[var(--shadow-sm)]',
              leftIcon ? 'pl-10' : '',
              rightIcon || isPassword ? 'pr-10' : '',
              error
                ? 'border-[var(--danger)] focus:border-[var(--danger)] focus:ring-[var(--danger)]/10'
                : 'border-input-border focus:ring-brand-focus-ring/20 focus:border-input-border-focus hover:border-input-border-focus/50',
              className
            )}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
          {isPassword ? (
            <button
              type="button"
              onClick={handleTogglePassword}
              tabIndex={-1}
              className="absolute right-3 text-muted hover:text-secondary cursor-pointer focus:outline-none"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          ) : rightIcon ? (
            <div className="absolute right-3 text-muted pointer-events-none">
              {rightIcon}
            </div>
          ) : null}
        </div>
        {error && (
          <span
            id={`${inputId}-error`}
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

Input.displayName = 'Input'
