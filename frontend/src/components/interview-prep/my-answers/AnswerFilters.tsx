import React from 'react'
import { Filter, Search, RotateCcw, X } from 'lucide-react'
import type { AnswerFilterState } from '@/types/interviewPrep'

export interface AnswerFiltersProps {
  filters: AnswerFilterState
  onChangeFilter: (updated: Partial<AnswerFilterState>) => void
  onResetFilters: () => void
}

export function AnswerFilters({
  filters,
  onChangeFilter,
  onResetFilters,
}: AnswerFiltersProps) {
  const sources = ['All', 'Mock Interview', 'Question Bank']
  const questionTypes = ['All', 'Technical', 'Behavioral', 'HR']
  const difficulties = ['All', 'Easy', 'Medium', 'Hard']
  const results = ['All', 'Excellent', 'Good', 'Needs Improvement']

  return (
    <div className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-4 space-y-3">
      {/* Search Input */}
      <div className="relative w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={filters.searchQuery}
          onChange={(e) => onChangeFilter({ searchQuery: e.target.value })}
          placeholder="Filter answers by question title, target company, or skill..."
          className="w-full bg-[#141627] border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/40 transition-all"
        />
        {filters.searchQuery && (
          <button
            type="button"
            onClick={() => onChangeFilter({ searchQuery: '' })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-purple-500/40 rounded"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Filter Dropdowns */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
          <Filter className="h-3.5 w-3.5 text-purple-400" />
          <span>Filters:</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1 max-w-2xl">
          {/* Source */}
          <select
            value={filters.source}
            onChange={(e) => onChangeFilter({ source: e.target.value })}
            className="bg-[#141627] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/40 transition-all cursor-pointer"
          >
            {sources.map((s) => (
              <option key={s} value={s} className="bg-[#141627] text-white">
                {s === 'All' ? 'All Sources' : s}
              </option>
            ))}
          </select>

          {/* Question Type */}
          <select
            value={filters.questionType}
            onChange={(e) => onChangeFilter({ questionType: e.target.value })}
            className="bg-[#141627] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/40 transition-all cursor-pointer"
          >
            {questionTypes.map((t) => (
              <option key={t} value={t} className="bg-[#141627] text-white">
                {t === 'All' ? 'All Types' : t}
              </option>
            ))}
          </select>

          {/* Difficulty */}
          <select
            value={filters.difficulty}
            onChange={(e) => onChangeFilter({ difficulty: e.target.value })}
            className="bg-[#141627] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/40 transition-all cursor-pointer"
          >
            {difficulties.map((d) => (
              <option key={d} value={d} className="bg-[#141627] text-white">
                {d === 'All' ? 'All Difficulties' : d}
              </option>
            ))}
          </select>

          {/* Performance Result */}
          <select
            value={filters.result}
            onChange={(e) => onChangeFilter({ result: e.target.value })}
            className="bg-[#141627] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500/50 cursor-pointer"
          >
            {results.map((r) => (
              <option key={r} value={r} className="bg-[#141627] text-white">
                {r === 'All' ? 'All Results' : r}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={onResetFilters}
          className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-purple-300 transition-colors cursor-pointer"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  )
}
export default AnswerFilters
