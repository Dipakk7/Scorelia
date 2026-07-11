import React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link' | 'upgrade' | 'success'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  isLoading?: boolean
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, asChild = false, children, disabled, ...props }, ref) => {
    const Component = asChild ? Slot : 'button'

    const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-[var(--duration-normal)] ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[var(--background)] disabled:opacity-[var(--opacity-disabled)] disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer active:scale-[0.97]'
    
    const variants = {
      primary: 'bg-[var(--primary)] text-white shadow-[var(--shadow-sm)] hover:bg-[var(--primary-hover)] hover:-translate-y-[1px] hover:shadow-[var(--shadow-md)] focus-visible:ring-[var(--primary)] active:translate-y-0',
      secondary: 'bg-[var(--divider)] text-[var(--heading)] hover:bg-[var(--border)]/70 hover:-translate-y-[1px] focus-visible:ring-[var(--primary)] active:translate-y-0',
      outline: 'border border-[var(--border)] bg-transparent text-[var(--body)] hover:bg-[var(--surface-hover)] hover:-translate-y-[1px] focus-visible:ring-[var(--primary)] active:translate-y-0',
      ghost: 'text-[var(--body)] hover:bg-[var(--surface-hover)] hover:text-[var(--heading)] focus-visible:ring-[var(--primary)] active:scale-[0.98]',
      danger: 'bg-[var(--danger)] text-white shadow-[var(--shadow-sm)] hover:bg-[var(--danger)]/90 hover:-translate-y-[1px] hover:shadow-[var(--shadow-md)] focus-visible:ring-[var(--danger)] active:translate-y-0',
      link: 'text-[var(--primary)] underline-offset-4 hover:underline bg-transparent p-0 h-auto active:scale-100 focus-visible:ring-[var(--primary)]/30',
      upgrade: 'bg-[var(--accent)] text-white shadow-[var(--shadow-sm)] hover:bg-[var(--accent-hover)] hover:-translate-y-[1px] hover:shadow-[var(--shadow-md)] focus-visible:ring-[var(--accent)] active:translate-y-0',
      success: 'bg-[var(--success)] text-white shadow-[var(--shadow-sm)] hover:bg-[var(--success)]/90 hover:-translate-y-[1px] hover:shadow-[var(--shadow-md)] focus-visible:ring-[var(--success)] active:translate-y-0',
    }

    const sizes = {
      sm: 'h-9 px-3.5 text-caption rounded-[var(--radius-button)]',
      md: 'h-10 px-4 py-2.5 text-body-sm rounded-[var(--radius-button)]',
      lg: 'h-12 px-6 py-3.5 text-body-md rounded-[var(--radius-button)]',
      icon: 'h-10 w-10 p-0 rounded-[var(--radius-button)]',
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
