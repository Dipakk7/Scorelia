import React, { useState, useRef, useEffect } from 'react'
import { X, ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'

export interface MultiSelectOption {
  value: string
  label: string
}

export interface MultiSelectProps {
  options: MultiSelectOption[]
  selectedValues: string[]
  onChange: (values: string[]) => void
  label?: string
  placeholder?: string
  error?: string
  containerClassName?: string
}

export function MultiSelect({
  options,
  selectedValues,
  onChange,
  label,
  placeholder = 'Select options...',
  error,
  containerClassName
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleRemove = (value: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(selectedValues.filter((v) => v !== value))
  }

  const handleSelect = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value))
    } else {
      onChange([...selectedValues, value])
    }
    setSearch('')
  }

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div ref={containerRef} className={cn('w-full flex flex-col gap-1.5 text-left relative', containerClassName)}>
      {label && (
        <label className="text-xs font-semibold font-display uppercase tracking-wider text-[var(--muted)] flex items-center gap-1">
          {label}
        </label>
      )}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'min-h-[40px] w-full px-3.5 py-1.5 border rounded-[var(--radius-input)] bg-[var(--surface)] text-[var(--body)] flex flex-wrap items-center gap-1.5 cursor-pointer transition-all duration-[var(--duration-normal)] shadow-[var(--shadow-sm)] border-[var(--border)] focus-within:ring-2 focus-within:ring-[var(--primary)]/20 focus-within:border-[var(--primary)] hover:border-[var(--primary)]/50 pr-8 relative',
          error && 'border-[var(--danger)]',
          isOpen && 'border-[var(--primary)] ring-2 ring-[var(--primary)]/20'
        )}
      >
        {selectedValues.length === 0 ? (
          <span className="text-sm text-[var(--muted)] font-sans select-none">{placeholder}</span>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {selectedValues.map((val) => {
              const opt = options.find((o) => o.value === val)
              return (
                <Badge
                  key={val}
                  variant="default"
                  className="normal-case tracking-normal py-0.5 pl-2 pr-1 flex items-center gap-1 bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/20 text-xs font-medium rounded-[var(--radius-sm)]"
                >
                  <span>{opt?.label || val}</span>
                  <button
                    type="button"
                    onClick={(e) => handleRemove(val, e)}
                    className="p-0.5 rounded-full hover:bg-[var(--primary)]/20 text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors cursor-pointer"
                  >
                    <X size={10} className="stroke-[3]" />
                  </button>
                </Badge>
              )
            })}
          </div>
        )}
        <div className="absolute right-3 top-3 text-[var(--muted)] pointer-events-none">
          <ChevronDown size={16} className={cn('transition-transform duration-200', isOpen && 'rotate-180')} />
        </div>
      </div>

      {isOpen && (
        <div
          data-state="open"
          className="absolute top-full left-0 w-full mt-1.5 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-input)] shadow-[var(--shadow-lg)] z-50 overflow-hidden max-h-60 flex flex-col backdrop-blur-md bg-white/95 dark:bg-slate-900/95 dropdown-content-anim"
        >
          <input
            type="text"
            placeholder="Search options..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className="w-full px-3.5 py-2.5 border-b border-[var(--border)] bg-transparent text-sm text-[var(--body)] focus:outline-none placeholder-[var(--muted)]/70"
          />
          <div className="overflow-y-auto divide-y divide-[var(--border)]/30 max-h-48">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-xs text-[var(--muted)] italic text-center">No options found.</div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = selectedValues.includes(opt.value)
                return (
                  <div
                    key={opt.value}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSelect(opt.value)
                    }}
                    className={cn(
                      'px-3.5 py-2.5 text-sm flex items-center justify-between cursor-pointer hover:bg-[var(--surface-hover)] transition-colors font-sans text-[var(--body)]',
                      isSelected && 'font-semibold text-[var(--primary)]'
                    )}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check size={14} className="text-[var(--primary)]" />}
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
      {error && <span className="text-xs text-[var(--danger)] font-medium animate-fadeIn">{error}</span>}
    </div>
  )
}
export default MultiSelect
