import React, { useState } from 'react'
import SidebarCard from './SidebarCard'
import { Target, CheckCircle2, AlertCircle } from 'lucide-react'
import { mockKeywordItems } from '@/lib/cover-letter-mock-data'

export const KeywordsMatchedCardComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'matched' | 'missing'>('all')

  const matchedCount = mockKeywordItems.filter((k) => k.status === 'matched').length
  const missingCount = mockKeywordItems.filter((k) => k.status === 'missing').length
  const totalCount = mockKeywordItems.length
  const matchPercentage = Math.round((matchedCount / totalCount) * 100)

  const filteredKeywords = mockKeywordItems.filter((k) => {
    if (activeTab === 'matched') return k.status === 'matched'
    if (activeTab === 'missing') return k.status === 'missing'
    return true
  })

  return (
    <SidebarCard
      title={
        <div className="flex items-center gap-2">
          <Target size={16} className="text-emerald-400" />
          <span className="font-extrabold text-sm text-[var(--heading)]">Matched & Missing Keywords</span>
        </div>
      }
      action={
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          {matchPercentage}% Coverage
        </span>
      }
    >
      <div className="space-y-3.5 text-left">
        {/* Coverage Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-[var(--heading)]">Keyword Alignment</span>
            <span className="text-emerald-400">
              {matchedCount} matched / {missingCount} missing
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-[var(--surface-hover)] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
              style={{ width: `${matchPercentage}%` }}
            />
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1 bg-[var(--surface-hover)]/60 p-1 rounded-xl border border-[var(--border)] text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-1 rounded-lg text-center transition-colors cursor-pointer border-none ${
              activeTab === 'all'
                ? 'bg-[var(--primary)] text-white shadow-sm'
                : 'text-[var(--muted)] hover:text-[var(--heading)] bg-transparent'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('matched')}
            className={`flex-1 py-1 rounded-lg text-center transition-colors cursor-pointer border-none ${
              activeTab === 'matched'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-[var(--muted)] hover:text-[var(--heading)] bg-transparent'
            }`}
          >
            Matched ({matchedCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('missing')}
            className={`flex-1 py-1 rounded-lg text-center transition-colors cursor-pointer border-none ${
              activeTab === 'missing'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-[var(--muted)] hover:text-[var(--heading)] bg-transparent'
            }`}
          >
            Missing ({missingCount})
          </button>
        </div>

        {/* Keywords Pill Grid */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {filteredKeywords.map((kw) => (
            <span
              key={kw.name}
              className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-full border transition-all ${
                kw.status === 'matched'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}
            >
              {kw.status === 'matched' ? (
                <CheckCircle2 size={11} className="text-emerald-400" />
              ) : (
                <AlertCircle size={11} className="text-rose-400" />
              )}
              <span>{kw.name}</span>
            </span>
          ))}
        </div>
      </div>
    </SidebarCard>
  )
}

export const KeywordsMatchedCard = React.memo(KeywordsMatchedCardComponent)
export default KeywordsMatchedCard
