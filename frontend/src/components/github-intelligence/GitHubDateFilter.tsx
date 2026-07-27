import React, { useState } from 'react'
import { Calendar, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface GitHubDateFilterProps {
  value?: string
  onChange?: (val: string) => void
  className?: string
}

const DATE_RANGES = [
  { id: '30d', label: 'Last 30 Days' },
  { id: '7d', label: 'Last 7 Days' },
  { id: '90d', label: 'Last 90 Days' },
  { id: 'ytd', label: 'Year to Date' },
]

export const GitHubDateFilter: React.FC<GitHubDateFilterProps> = ({
  value = '30d',
  onChange,
  className,
}) => {
  const [internalVal, setInternalVal] = useState(value)
  const [isOpen, setIsOpen] = useState(false)

  const activeOption = DATE_RANGES.find((r) => r.id === (value || internalVal)) || DATE_RANGES[0]

  const handleSelect = (id: string) => {
    setInternalVal(id)
    setIsOpen(false)
    if (onChange) {
      onChange(id)
    }
  }

  return (
    <div className={cn('relative inline-block text-left', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Select date range"
        className="inline-flex items-center gap-2 h-10 px-3.5 text-xs font-semibold rounded-xl bg-[var(--surface-hover)]/80 hover:bg-[var(--border)]/50 text-[var(--heading)] border border-[var(--border)] transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
      >
        <Calendar className="h-4 w-4 text-[var(--muted)]" />
        <span className="whitespace-nowrap">{activeOption.label}</span>
        <ChevronDown className="h-3.5 w-3.5 text-[var(--muted)]" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-44 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-lg z-30 py-1 font-sans">
            {DATE_RANGES.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelect(option.id)}
                className={cn(
                  'w-full text-left px-4 py-2 text-xs font-medium transition-colors cursor-pointer flex items-center justify-between',
                  option.id === activeOption.id
                    ? 'bg-purple-500/10 text-purple-400 font-semibold'
                    : 'text-[var(--body)] hover:bg-[var(--surface-hover)]'
                )}
              >
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
