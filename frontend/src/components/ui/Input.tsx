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
            className="text-xs font-semibold font-display uppercase tracking-wider text-muted-foreground flex items-center gap-1"
          >
            <span>{label}</span>
            {required && <span className="text-rose-500 font-bold">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-slate-400 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            type={resolvedType}
            required={required}
            className={cn(
              'w-full h-10 px-3.5 py-2 border rounded-xl bg-card text-foreground placeholder-muted-foreground/80 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 disabled:pointer-events-none disabled:opacity-50 transition-all duration-200 font-sans text-sm shadow-sm',
              leftIcon ? 'pl-10' : '',
              rightIcon || isPassword ? 'pr-10' : '',
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10'
                : 'border-slate-300 dark:border-slate-700 focus:ring-brand-500/20 focus:border-brand-500 hover:border-slate-400 dark:hover:border-slate-600',
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
              className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer focus:outline-none"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          ) : rightIcon ? (
            <div className="absolute right-3 text-slate-400 pointer-events-none">
              {rightIcon}
            </div>
          ) : null}
        </div>
        {error && (
          <span
            id={`${inputId}-error`}
            className="text-xs text-red-500 font-medium animate-fadeIn"
          >
            {error}
          </span>
        )}
        {helperText && !error && (
          <span className="text-[10px] text-muted-foreground font-sans">
            {helperText}
          </span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
