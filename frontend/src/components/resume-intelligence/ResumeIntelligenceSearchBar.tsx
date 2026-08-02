import React from 'react'
import { Search, X } from 'lucide-react'

interface ResumeIntelligenceSearchBarProps {
  value: string
  onChange: (val: string) => void
  onClear: () => void
  matchCount?: number
}

export const ResumeIntelligenceSearchBar: React.FC<ResumeIntelligenceSearchBarProps> = ({
  value,
  onChange,
  onClear,
  matchCount,
}) => {
  return (
    <div className="relative w-full max-w-md">
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 dark:text-slate-400 pointer-events-none z-10" />
        <input
          id="resume-search-bar"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search sections, keywords, or recommendations... (/)"
          className="w-full bg-[#f1f3f5] dark:bg-[#121422] border border-slate-300/90 dark:border-slate-800/80 rounded-xl pl-10 pr-20 py-2 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all shadow-sm dark:shadow-inner"
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 z-10">
          {value ? (
            <button
              onClick={onClear}
              className="p-1 rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Clear Search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-200/90 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-400 pointer-events-none shadow-xs">
              /
            </kbd>
          )}

          {typeof matchCount === 'number' && value && (
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-purple-600 text-white shadow-xs">
              {matchCount} matches
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResumeIntelligenceSearchBar
