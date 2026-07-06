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
      <div className="absolute left-3 text-slate-400 pointer-events-none">
        <Search size={18} />
      </div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 pl-10 pr-9 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-950 dark:text-slate-50 placeholder-slate-400 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-sans"
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer focus:outline-none"
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}
