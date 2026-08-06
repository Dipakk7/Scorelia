import React, { useState, useMemo, useCallback, memo } from 'react'
import { Search, Plus, Check } from 'lucide-react'
import type { SectionKeywordItem } from '@/lib/ats-section-mock-data'
import { cn } from '@/lib/utils'

interface SectionKeywordCoverageCardProps {
  keywords?: SectionKeywordItem[]
}

export const SectionKeywordCoverageCard: React.FC<SectionKeywordCoverageCardProps> = memo(({
  keywords = [],
}) => {
  const safeKeywords = Array.isArray(keywords) ? keywords : []
  const [filterTab, setFilterTab] = useState<'all' | 'matched' | 'missing' | 'suggested'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set())

  const toggleAdd = useCallback((id: string) => {
    setAddedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const filtered = useMemo(() => {
    return safeKeywords.filter((k) => {
      const matchesCategory = filterTab === 'all' || k.category === filterTab
      const matchesSearch = (k.keyword || '').toLowerCase().includes((searchQuery || '').toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [safeKeywords, filterTab, searchQuery])

  return (
    <div className="rounded-2xl bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-slate-800/90 p-3.5 sm:p-4 shadow-xl space-y-3 h-full flex flex-col justify-between">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 shadow-sm shrink-0 flex items-center justify-center">
            <Search className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-100 tracking-tight">
              Section Keyword Coverage
            </h3>
            <p className="text-xs text-slate-400 font-normal mt-0.5">
              Keyword density and token coverage specifically for this section.
            </p>
          </div>
        </div>

        <div className="relative w-full sm:w-48">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 shadow-inner"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800/90 shadow-inner">
        {[
          { id: 'all', label: `All (${safeKeywords.length})` },
          { id: 'matched', label: 'Matched' },
          { id: 'missing', label: 'Missing' },
          { id: 'suggested', label: 'Suggested' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterTab(tab.id as any)}
            className={cn(
              'px-3 py-1 text-xs font-mono rounded-lg transition-colors cursor-pointer',
              filterTab === tab.id
                ? 'bg-purple-500/20 text-purple-200 font-bold border border-purple-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 font-medium'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chips Feed */}
      <div className="flex flex-wrap gap-2 min-h-[140px] max-h-72 overflow-y-auto p-3 bg-slate-950/80 rounded-xl border border-slate-800/90 shadow-inner scrollbar-none flex-1">
        {filtered.map((item) => {
          const isAdded = addedIds.has(item.id)
          const isMatched = item.category === 'matched'
          const isMissing = item.category === 'missing'

          return (
            <div
              key={item.id}
              className={cn(
                'inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all duration-200 shadow-sm',
                isMatched
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  : isMissing
                  ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                  : 'bg-purple-500/15 text-purple-300 border-purple-500/30'
              )}
            >
              <span className="font-bold">{item.keyword}</span>

              {isMatched && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-sans font-bold">
                  {item.frequency}x
                </span>
              )}

              {!isMatched && (
                <button
                  type="button"
                  onClick={() => toggleAdd(item.id)}
                  className={cn(
                    'inline-flex items-center gap-1 text-[11px] font-sans font-bold px-2 py-0.5 rounded-md transition-all cursor-pointer',
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
  )
})

SectionKeywordCoverageCard.displayName = 'SectionKeywordCoverageCard'
