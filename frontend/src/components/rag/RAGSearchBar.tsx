import { useState } from 'react'
import { Search, Loader2, X, History } from 'lucide-react'

interface RAGSearchBarProps {
  onSearch: (query: string) => void
  isLoading?: boolean
  recentSearches: string[]
  onSelectRecent: (query: string) => void
}

export function RAGSearchBar({
  onSearch,
  isLoading = false,
  recentSearches,
  onSelectRecent
}: RAGSearchBarProps) {
  const [query, setQuery] = useState('')
  const [showHistory, setShowHistory] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
      setShowHistory(false)
    }
  }

  const handleClear = () => {
    setQuery('')
  }

  return (
    <div className="relative w-full text-left font-sans text-xs">
      <form onSubmit={handleSubmit} className="relative flex items-center m-0">
        <span className="absolute left-4 text-slate-400">
          {isLoading ? (
            <Loader2 className="animate-spin h-5 w-5" />
          ) : (
            <Search className="h-5 w-5" />
          )}
        </span>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            if (e.target.value.trim() === '') {
              setShowHistory(false)
            }
          }}
          onFocus={() => {
            if (recentSearches.length > 0) {
              setShowHistory(true);
            }
          }}
          onBlur={() => {
            // Delay closing to allow click event on history dropdown item to fire
            setTimeout(() => setShowHistory(false), 200)
          }}
          placeholder="Ask a career question (e.g., 'What skills are needed for a Kubernetes engineer?')..."
          className="w-full text-xs pl-12 pr-12 py-3 border border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--surface-hover)]/30 text-slate-900 dark:text-slate-100 placeholder-slate-405 focus:outline-none focus:ring-1 focus:ring-brand-500 shadow-sm transition-all focus:shadow-md h-12 font-medium"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer border-none bg-transparent flex items-center"
            aria-label="Clear query"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {/* History dropdown */}
      {showHistory && recentSearches.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-card/95 border border-[var(--border)] rounded-[var(--radius-md)] shadow-xl z-25 max-h-60 overflow-y-auto backdrop-blur-md text-left">
          <div className="p-2 border-b border-[var(--border)]/60 flex items-center gap-1.5 text-[9px] text-muted-foreground uppercase tracking-widest font-black font-display pl-3">
            <History size={11} className="text-slate-400" />
            <span>Recent Queries</span>
          </div>
          <div className="py-1">
            {recentSearches.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuery(item)
                  onSelectRecent(item)
                  onSearch(item)
                  setShowHistory(false)
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs hover:bg-[var(--surface-hover)]/30 text-slate-705 dark:text-slate-300 font-sans transition-colors cursor-pointer border-none bg-transparent font-medium"
              >
                <History size={13} className="text-slate-400" />
                <span className="truncate">{item}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
export default RAGSearchBar
