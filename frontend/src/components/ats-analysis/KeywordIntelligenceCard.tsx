import React, { useState } from 'react'
import { Search, Sparkles, Filter, Plus, Check, TrendingUp, AlertCircle } from 'lucide-react'
import { mockKeywordIntelligence, type KeywordIntelligenceItem } from '@/lib/ats-ai-mock-data'
import { cn } from '@/lib/utils'

type CategoryFilter = 'all' | 'matched' | 'missing' | 'high-priority' | 'industry' | 'trending'

export const KeywordIntelligenceCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CategoryFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set())

  const toggleAdd = (id: string) => {
    setAddedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const filtered = mockKeywordIntelligence.filter((k) => {
    const matchesCategory = activeTab === 'all' || k.category === activeTab
    const matchesSearch = k.keyword.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800/90 p-4 sm:p-5 shadow-lg space-y-3.5">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            AI Missing Keyword Intelligence
          </h3>
          <p className="text-xs text-slate-400">
            Categorized keyword match intelligence, high-priority missing skills, and industry trends.
          </p>
        </div>

        <div className="relative w-full md:w-56">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search AI keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
        {[
          { id: 'all', label: 'All Keywords' },
          { id: 'matched', label: 'Matched' },
          { id: 'missing', label: 'Missing' },
          { id: 'high-priority', label: 'High Priority' },
          { id: 'industry', label: 'Industry' },
          { id: 'trending', label: 'Trending AI' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as CategoryFilter)}
            className={cn(
              'px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer',
              activeTab === tab.id
                ? 'bg-purple-600/30 text-purple-200 font-semibold border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-200'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Keyword Chips Feed */}
      <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto p-3 bg-slate-950/90 border border-slate-800/80 rounded-xl shadow-inner scrollbar-none">
        {filtered.map((item) => {
          const isAdded = addedIds.has(item.id)
          const isMatched = item.category === 'matched'
          const isMissing = item.category === 'missing'

          return (
            <div
              key={item.id}
              className={cn(
                'inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all duration-200',
                isMatched
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25'
                  : isMissing
                  ? 'bg-rose-500/10 text-rose-300 border-rose-500/25'
                  : 'bg-purple-500/10 text-purple-300 border-purple-500/25'
              )}
            >
              <span className="font-semibold">{item.keyword}</span>

              <span className="text-[10px] text-slate-400 font-sans">
                {item.relevance}% relevance
              </span>

              {!isMatched && (
                <button
                  type="button"
                  onClick={() => toggleAdd(item.id)}
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
  )
}
