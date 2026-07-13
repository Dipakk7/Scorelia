import React from 'react'
import { cn } from '@/lib/utils'

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
  containerClassName?: string
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, error, containerClassName, id, required, checked, onChange, ...props }, ref) => {
    const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className={cn('flex flex-col gap-1 text-left', containerClassName)}>
        <label htmlFor={radioId} className="flex items-center gap-2.5 cursor-pointer select-none group">
          <div className="relative flex items-center justify-center">
            <input
              id={radioId}
              type="radio"
              checked={checked}
              onChange={onChange}
              className="sr-only peer"
              required={required}
              ref={ref}
              {...props}
            />
            <div
              className={cn(
                'h-5 w-5 rounded-full border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center transition-all duration-[var(--duration-normal)] ease-in-out peer-checked:border-[var(--primary)] group-hover:border-[var(--primary)] peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--primary)] peer-focus-visible:ring-offset-2 peer-disabled:opacity-[var(--opacity-disabled)] peer-disabled:cursor-not-allowed shadow-[var(--shadow-sm)] peer-checked:[&>div]:scale-100',
                error && 'border-[var(--danger)] group-hover:border-[var(--danger)]'
              )}
            >
              <div
                className={cn(
                  'h-2.5 w-2.5 rounded-full bg-[var(--primary)] transition-transform duration-[var(--duration-normal)] ease-in-out transform',
                  checked === undefined ? 'scale-0' : (checked ? 'scale-100' : 'scale-0')
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
          <span className="text-caption text-[var(--danger)] font-medium animate-fadeIn animate-duration-[var(--duration-fast)] pl-7">
            {error}
          </span>
        )}
      </div>
    )
  }
)

Radio.displayName = 'Radio'
export default Radio
