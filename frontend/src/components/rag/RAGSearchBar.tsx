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
    <div className="relative w-full text-left">
      <form onSubmit={handleSubmit} className="relative flex items-center">
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
          className="w-full text-sm pl-12 pr-12 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 shadow-sm transition-all focus:shadow-md"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            aria-label="Clear query"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {/* History dropdown */}
      {showHistory && recentSearches.length > 0 && (
        <div className="absolute left-0 right-0 mt-1.5 bg-white dark:bg-slate-950 border border-slate-250/60 dark:border-slate-800 rounded-xl shadow-lg z-25 max-h-60 overflow-y-auto">
          <div className="p-2 border-b border-slate-100 dark:border-slate-900 flex items-center gap-1.5 text-[10px] text-slate-400 uppercase tracking-widest font-bold font-display pl-3">
            <History size={11} />
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
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-sans transition-colors cursor-pointer"
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
