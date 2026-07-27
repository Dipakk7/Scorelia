import React, { useState } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface GitHubSearchProps {
  value?: string
  onChange?: (val: string) => void
  placeholder?: string
  className?: string
}

export const GitHubSearch: React.FC<GitHubSearchProps> = ({
  value = '',
  onChange,
  placeholder = 'Search repositories, commits, issues...',
  className,
}) => {
  const [internalValue, setInternalValue] = useState(value)
  const isControlled = value !== undefined && onChange !== undefined
  const currentValue = isControlled ? value : internalValue

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (!isControlled) {
      setInternalValue(val)
    }
    if (onChange) {
      onChange(val)
    }
  }

  return (
    <div className={cn('relative flex items-center min-w-[240px] sm:min-w-[300px] lg:w-[360px]', className)}>
      <Search className="absolute left-3.5 h-4 w-4 text-[var(--muted)] pointer-events-none" />
      <input
        type="text"
        value={currentValue}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label="Search repositories, commits, and issues"
        className="w-full h-10 pl-10 pr-14 text-xs font-medium rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/80 text-[var(--heading)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 focus:border-[var(--primary)] transition-all duration-200 shadow-sm"
      />
      <div className="absolute right-3 flex items-center gap-1 pointer-events-none select-none px-1.5 py-0.5 rounded border border-[var(--border)] bg-[var(--surface)] text-[10px] font-mono text-[var(--muted)]">
        <span className="text-[9px]">⌘</span>K
      </div>
    </div>
  )
}
