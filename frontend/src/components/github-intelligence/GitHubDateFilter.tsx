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
        className="inline-flex items-center gap-2 h-10 px-3.5 text-xs font-semibold rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
      >
        <Calendar className="h-4 w-4 text-purple-400 shrink-0" />
        <span className="whitespace-nowrap">{activeOption.label}</span>
        <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-[#121426] shadow-2xl shadow-purple-950/40 z-30 py-1.5 font-sans backdrop-blur-md">
            {DATE_RANGES.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelect(option.id)}
                className={cn(
                  'w-full text-left px-4 py-2 text-xs font-medium transition-colors cursor-pointer flex items-center justify-between',
                  option.id === activeOption.id
                    ? 'bg-purple-500/20 text-purple-300 font-semibold'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                )}
              >
                <span>{option.label}</span>
                {option.id === activeOption.id && <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
