import React from 'react'
import { ChevronDown } from 'lucide-react'
import type { SelectOption } from './generalPreferencesMockData'
import { cn } from '@/lib/utils'

export interface SettingsSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'options'> {
  options: SelectOption[]
  label?: string
  error?: string
  helperText?: string
  placeholder?: string
  containerClassName?: string
}

export const SettingsSelect = React.forwardRef<HTMLSelectElement, SettingsSelectProps>(
  (
    {
      options,
      label,
      error,
      helperText,
      placeholder,
      containerClassName,
      className,
      id,
      disabled,
      required,
      value,
      defaultValue,
      onChange,
      ...props
    },
    ref
  ) => {
    const selectId = id || `settings-select-${Math.random().toString(36).substring(2, 9)}`

    return (
      <div className={cn('w-full flex flex-col gap-1 text-left font-sans', containerClassName)}>
        {label && (
          <label
            htmlFor={selectId}
            className="text-[11px] font-medium text-[var(--muted)] flex items-center gap-1"
          >
            <span>{label}</span>
            {required && <span className="text-[var(--danger)] font-bold">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            required={required}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            aria-invalid={!!error}
            aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
            className={cn(
              'w-full min-h-[40px] h-10 pl-3 pr-8 border border-white/10 rounded-xl bg-[#0d0f1e]/80 text-slate-100 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-500 disabled:pointer-events-none disabled:opacity-50 transition-all duration-200 appearance-none cursor-pointer shadow-inner',
              error
                ? 'border-red-500/80 focus:border-red-500 focus:ring-red-500/20'
                : 'hover:border-purple-500/40',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
                className="bg-[#121426] text-white py-1.5"
              >
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-2.5 pointer-events-none text-slate-400 flex items-center justify-center">
            <ChevronDown className="w-4 h-4 opacity-80" />
          </div>
        </div>
        {error && (
          <span
            id={`${selectId}-error`}
            className="text-[10px] text-[var(--danger)] font-medium animate-fade-in pl-0.5"
          >
            {error}
          </span>
        )}
        {helperText && !error && (
          <span id={`${selectId}-helper`} className="text-[10px] text-[var(--muted)] pl-0.5">
            {helperText}
          </span>
        )}
      </div>
    )
  }
)

SettingsSelect.displayName = 'SettingsSelect'
export default SettingsSelect
