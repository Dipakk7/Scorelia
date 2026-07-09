import React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  isLoading?: boolean
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, asChild = false, children, disabled, ...props }, ref) => {
    const Component = asChild ? Slot : 'button'

    const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.97]'
    
    const variants = {
      primary: 'bg-brand-500 text-white shadow-sm hover:bg-brand-600 hover:-translate-y-[1px] hover:shadow-[0_4px_20px_rgba(15,157,154,0.25)] focus-visible:ring-brand-500 active:translate-y-0',
      secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 hover:-translate-y-[1px] dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700/80 focus-visible:ring-slate-500/55 active:translate-y-0',
      outline: 'border border-slate-200/85 bg-transparent text-slate-700 hover:bg-slate-50 hover:-translate-y-[1px] dark:border-slate-800/85 dark:text-slate-300 dark:hover:bg-slate-900 focus-visible:ring-slate-500/55 active:translate-y-0',
      ghost: 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900/80 dark:hover:text-slate-550 focus-visible:ring-slate-500/55 active:scale-[0.98]',
      danger: 'bg-rose-600 text-white shadow-sm hover:bg-rose-700 hover:-translate-y-[1px] hover:shadow-[0_4px_20px_rgba(225,29,72,0.25)] focus-visible:ring-rose-500 active:translate-y-0',
      link: 'text-brand-500 underline-offset-4 hover:underline bg-transparent p-0 h-auto active:scale-100 focus-visible:ring-brand-500/30',
    }

    const sizes = {
      sm: 'h-9 px-3.5 text-xs font-semibold rounded-lg',
      md: 'h-10 px-4 py-2.5 text-sm font-semibold rounded-xl',
      lg: 'h-12 px-6 py-3.5 text-base font-semibold rounded-xl',
      icon: 'h-10 w-10 p-0 rounded-xl',
    }

    return (
      <Component
        className={cn(baseStyles, variants[variant], variant !== 'link' && sizes[size], className)}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="h-4 w-4 animate-spin text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {size !== 'icon' && variant !== 'link' && 'Loading...'}
          </span>
        ) : (
          children
        )}
      </Component>
    )
  }
)

Button.displayName = 'Button'
