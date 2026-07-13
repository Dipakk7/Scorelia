import React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
  containerClassName?: string
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, containerClassName, id, required, checked, onChange, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className={cn('flex flex-col gap-1 text-left', containerClassName)}>
        <label htmlFor={checkboxId} className="flex items-center gap-2.5 cursor-pointer select-none group">
          <div className="relative flex items-center justify-center">
            <input
              id={checkboxId}
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
                'h-5 w-5 rounded-[4px] border border-[var(--border)] bg-[var(--surface)] text-white flex items-center justify-center transition-all duration-[var(--duration-normal)] ease-in-out peer-checked:bg-[var(--primary)] peer-checked:border-[var(--primary)] group-hover:border-[var(--primary)] peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--primary)] peer-focus-visible:ring-offset-2 peer-disabled:opacity-[var(--opacity-disabled)] peer-disabled:cursor-not-allowed shadow-[var(--shadow-sm)] [&_svg]:scale-0 peer-checked:[&_svg]:scale-100',
                error && 'border-[var(--danger)] group-hover:border-[var(--danger)]'
              )}
            >
              <Check
                size={14}
                className="stroke-[3] transition-transform duration-[var(--duration-normal)]"
                style={{
                  transform: checked === undefined ? undefined : (checked ? 'scale(1)' : 'scale(0)')
                }}
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
          <span className="text-caption text-[var(--danger)] font-medium animate-fade-in pl-7">
            {error}
          </span>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'
export default Checkbox
