import React, { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SearchAgentsProps {
  value: string
  onChange: (val: string) => void
  placeholder?: string
  className?: string
}

export function SearchAgents({
  value,
  onChange,
  placeholder = 'Search agents, tags, categories...',
  className,
}: SearchAgentsProps) {
  const [searchTerm, setSearchTerm] = useState(value)

  useEffect(() => {
    setSearchTerm(value)
  }, [value])

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(searchTerm)
    }, 200)

    return () => clearTimeout(handler)
  }, [searchTerm, onChange])

  return (
    <div className={cn('relative flex-1 w-full min-w-0 sm:min-w-[200px]', className)}>
      <Search
        size={14}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
      />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        aria-label="Search Agents"
        className="w-full pl-8 pr-8 py-1.5 rounded-xl bg-[#0b0c14] border border-white/10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all font-sans"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={() => {
            setSearchTerm('')
            onChange('')
          }}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded-md cursor-pointer"
        >
          <X size={13} />
        </button>
      )}
    </div>
  )
}

export function HighlightText({ text, highlight }: { text: string; highlight: string }) {
  if (!highlight.trim()) return <>{text}</>

  const regex = new RegExp(`(${highlight.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-purple-500/30 text-purple-200 px-0.5 rounded font-semibold">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  )
}

export default SearchAgents
