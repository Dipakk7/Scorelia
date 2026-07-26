import React from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface GlobalSearchProps {
  className?: string
  placeholder?: string
}

export function GlobalSearch({
  className,
  placeholder = 'Search your knowledge...'
}: GlobalSearchProps) {
  return (
    <div className={cn('relative w-full max-w-xs sm:max-w-sm', className)}>
      <div className="relative flex items-center">
        <Search
          size={15}
          className="absolute left-3 text-slate-400 pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="text"
          readOnly
          placeholder={placeholder}
          aria-label="Search your knowledge base"
          className="w-full bg-[#121320]/80 border border-white/10 hover:border-white/20 text-xs text-slate-200 placeholder-slate-400 pl-9 pr-14 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 cursor-pointer transition-colors shadow-inner"
        />
        <div className="absolute right-2.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-slate-400 pointer-events-none select-none">
          <span>⌘</span>
          <span>K</span>
        </div>
      </div>
    </div>
  )
}

export default GlobalSearch
