import React, { useState } from 'react'
import { Search, Plus, Check, Filter, Sparkles, AlertTriangle } from 'lucide-react'
import { mockKeywords, type KeywordItem } from '@/lib/ats-mock-data'
import { cn } from '@/lib/utils'

type FilterTab = 'all' | 'matched' | 'missing' | 'suggested'

export const KeywordAnalysisCard: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [addedKeywords, setAddedKeywords] = useState<Set<string>>(new Set())

  const handleAddKeyword = (id: string) => {
    setAddedKeywords((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const filteredKeywords = mockKeywords.filter((k) => {
    const matchesFilter = activeFilter === 'all' || k.status === activeFilter
    const matchesSearch = k.keyword.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const matchedCount = mockKeywords.filter((k) => k.status === 'matched').length
  const missingCount = mockKeywords.filter((k) => k.status === 'missing').length
  const suggestedCount = mockKeywords.filter((k) => k.status === 'suggested').length

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800/90 p-5 shadow-lg space-y-5">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <Search className="w-4 h-4 text-purple-400" />
            Keyword Match & Density Analysis
          </h3>
          <p className="text-xs text-slate-400">
            Compare target job description keywords against your resume text.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-56">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50"
          />
        </div>
      </div>

      {/* Top Visual Summary Row: Donut Chart & Counters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
        {/* Donut Graphic Visual */}
        <div className="md:col-span-5 flex items-center justify-center gap-4">
          <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="10" className="text-slate-800" fill="transparent" />
              <circle
                cx="50"
                cy="50"
                r="38"
                stroke="currentColor"
                strokeWidth="10"
                strokeDasharray="238"
                strokeDashoffset="52"
                className="text-emerald-400"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="38"
                stroke="currentColor"
                strokeWidth="10"
                strokeDasharray="238"
                strokeDashoffset="200"
                className="text-rose-400"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center leading-none">
              <span className="text-xl font-bold font-mono text-white">78%</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Match</span>
            </div>
          </div>

          <div className="space-y-1 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-slate-300">Matched: 78% (10)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <span className="text-slate-300">Missing: 18% (6)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
              <span className="text-slate-400">Irrelevant: 4% (4)</span>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="md:col-span-7 flex flex-wrap items-center gap-2 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-4">
          <span className="text-xs font-medium text-slate-400 flex items-center gap-1 w-full sm:w-auto mb-1 sm:mb-0">
            <Filter className="w-3.5 h-3.5 text-purple-400" /> Filter:
          </span>
          {[
            { id: 'all', label: `All (${mockKeywords.length})` },
            { id: 'matched', label: `Matched (${matchedCount})` },
            { id: 'missing', label: `Missing (${missingCount})` },
            { id: 'suggested', label: `Suggested (${suggestedCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as FilterTab)}
              className={cn(
                'px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer',
                activeFilter === tab.id
                  ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40 shadow-sm font-semibold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Keywords Chips Container */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
          <span>Keywords List ({filteredKeywords.length})</span>
          <span className="text-[11px] text-slate-500">Click &apos;+ Add&apos; to include missing keyword in resume draft</span>
        </div>

        <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto p-1 scrollbar-none">
          {filteredKeywords.map((k) => {
            const isAdded = addedKeywords.has(k.id)
            const isMatched = k.status === 'matched'
            const isMissing = k.status === 'missing'

            return (
              <div
                key={k.id}
                className={cn(
                  'inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all duration-200',
                  isMatched
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25'
                    : isMissing
                    ? 'bg-rose-500/10 text-rose-300 border-rose-500/25'
                    : 'bg-purple-500/10 text-purple-300 border-purple-500/25'
                )}
              >
                <span className="font-semibold">{k.keyword}</span>

                {isMatched && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-sans">
                    {k.frequency}x
                  </span>
                )}

                {k.importance === 'High' && (
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-sans px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-400 border border-amber-500/20">
                    <AlertTriangle className="w-2.5 h-2.5" /> High
                  </span>
                )}

                {!isMatched && (
                  <button
                    onClick={() => handleAddKeyword(k.id)}
                    className={cn(
                      'inline-flex items-center gap-1 text-[11px] font-sans font-semibold px-2 py-0.5 rounded-lg transition-all cursor-pointer',
                      isAdded
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/30'
                    )}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3 h-3" /> Added
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3" /> Add
                      </>
                    )}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
