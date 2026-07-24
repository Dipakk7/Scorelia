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
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          id="resume-search-bar"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search sections, keywords, or recommendations... (/)"
          className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-20 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all shadow-inner"
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {value ? (
            <button
              onClick={onClear}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Clear Search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 border border-slate-700 text-slate-400 pointer-events-none">
              /
            </kbd>
          )}

          {typeof matchCount === 'number' && value && (
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {matchCount} matches
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResumeIntelligenceSearchBar
