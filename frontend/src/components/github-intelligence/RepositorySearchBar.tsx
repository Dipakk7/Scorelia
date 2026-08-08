import React from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface RepositorySearchBarProps {
  value?: string
  onChange?: (val: string) => void
  placeholder?: string
  className?: string
}

export const RepositorySearchBar: React.FC<RepositorySearchBarProps> = ({
  value = '',
  onChange,
  placeholder = 'Search by repository name, language, or description...',
  className,
}) => {
  return (
    <div className={cn('relative flex items-center w-full min-w-[240px]', className)}>
      <Search className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        aria-label="Search repositories"
        className="w-full h-10 pl-10 pr-9 text-xs font-medium rounded-xl border border-slate-700/80 bg-slate-900/80 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all duration-200 shadow-sm"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange?.('')}
          aria-label="Clear search query"
          className="absolute right-3 text-slate-400 hover:text-white cursor-pointer"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}

export default RepositorySearchBar
