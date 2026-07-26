import React, { useState } from 'react'
import { Send, RotateCcw, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface QueryComposerProps {
  onRunQuery: (query: string) => void
  initialQuery?: string
  className?: string
}

export function QueryComposer({
  onRunQuery,
  initialQuery = '',
  className
}: QueryComposerProps) {
  const [query, setQuery] = useState(initialQuery)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      if (query.trim()) onRunQuery(query)
    }
  }

  const handleClear = () => {
    setQuery('')
  }

  return (
    <div className={cn('p-5 rounded-2xl bg-[#0e0f1a]/90 border border-white/10 shadow-lg text-left space-y-3', className)}>
      <div className="relative">
        <textarea
          rows={3}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your knowledge base..."
          aria-label="Query composer textarea"
          className="w-full bg-[#121320] border border-white/10 focus:border-purple-500/50 rounded-xl p-3.5 text-xs sm:text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none font-sans custom-scrollbar"
        />
        <div className="absolute right-3 bottom-3 flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-slate-400 pointer-events-none select-none">
          <span>⌘</span>
          <span>Enter</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleClear}
          disabled={!query}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <RotateCcw size={13} />
          <span>Clear</span>
        </button>

        <button
          type="button"
          onClick={() => query.trim() && onRunQuery(query)}
          disabled={!query.trim()}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-900/40 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 min-h-[44px]"
        >
          <Search size={15} />
          <span>Run Query</span>
        </button>
      </div>
    </div>
  )
}

export default QueryComposer
