import React from 'react'
import { cn } from '@/lib/utils'

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
  containerClassName?: string
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, error, containerClassName, id, required, checked, onChange, ...props }, ref) => {
    const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className={cn('flex flex-col gap-1 text-left', containerClassName)}>
        <label htmlFor={switchId} className="flex items-center gap-3 cursor-pointer select-none group">
          <div className="relative flex items-center">
            <input
              id={switchId}
              type="checkbox"
              checked={checked}
              onChange={onChange}
              className="sr-only peer"
              required={required}
              ref={ref}
              {...props}
            />
            <div
              className={cn(
                'w-9 h-5 rounded-full bg-[var(--border)] transition-colors duration-[var(--duration-normal)] ease-in-out peer-checked:bg-[var(--primary)] group-hover:opacity-95 peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--primary)] peer-focus-visible:ring-offset-2 peer-disabled:opacity-[var(--opacity-disabled)] peer-disabled:cursor-not-allowed shadow-inner relative flex items-center px-0.5 peer-checked:[&>div]:translate-x-4',
                error && 'border border-[var(--danger)]'
              )}
            >
              <div
                className={cn(
                  'h-4 w-4 rounded-full bg-white shadow-[var(--shadow-sm)] transition-transform duration-[var(--duration-normal)] ease-in-out transform',
                  checked === undefined ? 'translate-x-0' : (checked ? 'translate-x-4' : 'translate-x-0')
                )}
              />
            </div>
          </div>
          {label && (
            <span className="text-body-sm text-[var(--body)] font-medium font-sans">
              {label}
              {required && <span className="text-[var(--danger)] ml-0.5 font-bold">*</span>}
            </span>
          )}
        </label>
        {error && (
          <span className="text-caption text-[var(--danger)] font-medium animate-fade-in pl-12">
            {error}
          </span>
        )}
      </div>
    )
  }
)

Switch.displayName = 'Switch'
export default Switch
