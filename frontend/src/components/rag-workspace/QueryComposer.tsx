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
  const [searchMode, setSearchMode] = useState<'hybrid' | 'semantic' | 'keyword'>('hybrid')

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
    <div className={cn('p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] hover:border-purple-500/30 transition-all duration-300 text-left space-y-4 select-none', className)}>
      {/* Studio Composer Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          <h3 className="text-xs font-bold text-[var(--heading)] uppercase tracking-wider">
            Flagship Neural Prompt Studio
          </h3>
        </div>

        {/* Quick Search Mode Selector */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--surface-hover)] border border-[var(--border)] text-[10px] font-semibold">
          <button
            type="button"
            onClick={() => setSearchMode('hybrid')}
            className={cn(
              'px-2 py-0.5 rounded-lg transition-all cursor-pointer border-none',
              searchMode === 'hybrid' ? 'bg-purple-600 text-white font-bold' : 'text-[var(--muted)] hover:text-[var(--heading)]'
            )}
          >
            Hybrid
          </button>
          <button
            type="button"
            onClick={() => setSearchMode('semantic')}
            className={cn(
              'px-2 py-0.5 rounded-lg transition-all cursor-pointer border-none',
              searchMode === 'semantic' ? 'bg-purple-600 text-white font-bold' : 'text-[var(--muted)] hover:text-[var(--heading)]'
            )}
          >
            Semantic
          </button>
          <button
            type="button"
            onClick={() => setSearchMode('keyword')}
            className={cn(
              'px-2 py-0.5 rounded-lg transition-all cursor-pointer border-none',
              searchMode === 'keyword' ? 'bg-purple-600 text-white font-bold' : 'text-[var(--muted)] hover:text-[var(--heading)]'
            )}
          >
            BM25
          </button>
        </div>
      </div>

      <div className="relative">
        <textarea
          rows={3}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything from your knowledge base (e.g., 'What is Retrieval-Augmented Generation?')..."
          aria-label="Query composer textarea"
          className="w-full bg-[var(--surface-hover)] border border-[var(--border)] focus:border-purple-500/50 rounded-xl p-3.5 text-xs sm:text-sm text-[var(--heading)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none font-sans custom-scrollbar"
        />
        <div className="absolute right-3 bottom-3 flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[10px] font-mono text-[var(--muted)] pointer-events-none select-none">
          <span>Ctrl + Enter</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleClear}
          disabled={!query}
          className="flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--heading)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer border-none bg-transparent"
        >
          <RotateCcw size={13} />
          <span>Clear Prompt</span>
        </button>

        <button
          type="button"
          onClick={() => query.trim() && onRunQuery(query)}
          disabled={!query.trim()}
          className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-900/40 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 min-h-[40px] border-none"
        >
          <Search size={15} />
          <span>Execute Neural Search</span>
        </button>
      </div>
    </div>
  )
}

export default QueryComposer

