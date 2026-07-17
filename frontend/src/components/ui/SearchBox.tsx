import React, { useRef } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchBoxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string
  onChange: (value: string) => void
  onClear?: () => void
  className?: string
}

export function SearchBox({ value, onChange, onClear, className, placeholder = 'Search...', ...props }: SearchBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClear = () => {
    onChange('')
    if (onClear) onClear()
    inputRef.current?.focus()
  }

  return (
    <div className={cn('relative w-full max-w-sm flex items-center', className)}>
      <div className="absolute left-3 text-muted pointer-events-none">
        <Search size={18} />
      </div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 pl-10 pr-9 border border-input-border bg-input-bg text-body placeholder-input-placeholder rounded-[var(--radius-input)] text-body-sm focus:outline-none focus:ring-2 focus:ring-brand-focus-ring/20 focus:border-input-border-focus hover:border-input-border-focus/50 shadow-sm transition-all duration-[var(--duration-normal)] font-sans"
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 text-muted hover:text-heading cursor-pointer focus:outline-none transition-colors"
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}
