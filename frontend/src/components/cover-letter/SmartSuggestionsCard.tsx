import React, { useState } from 'react'
import { Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react'
import SidebarCard from './SidebarCard'
import { mockSmartSuggestions, type MockSmartSuggestion } from '@/lib/cover-letter-mock-data'

export const SmartSuggestionsCard: React.FC = () => {
  const [suggestions, setSuggestions] = useState<MockSmartSuggestion[]>(mockSmartSuggestions)

  const handleToggleApply = (id: string) => {
    setSuggestions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, applied: !item.applied } : item))
    )
  }

  const handleApplyAll = () => {
    setSuggestions((prev) => prev.map((item) => ({ ...item, applied: true })))
  }

  const allApplied = suggestions.every((s) => s.applied)

  return (
    <SidebarCard
      title={
        <div className="flex items-center gap-2">
          <Sparkles size={15} className="text-purple-400" />
          <span className="font-extrabold text-sm text-[var(--heading)]">Smart Suggestions</span>
        </div>
      }
      action={
        <span className="text-[11px] font-bold text-[var(--muted)]">
          {suggestions.filter((s) => s.applied).length} / {suggestions.length} Applied
        </span>
      }
    >
      <div className="space-y-3.5 text-left">
        {suggestions.map((item, index) => (
          <div
            key={item.id}
            className={`p-3 rounded-xl border transition-all space-y-1.5 ${
              item.applied
                ? 'bg-emerald-500/10 border-emerald-500/20 opacity-90'
                : 'bg-[var(--surface-hover)]/30 border-[var(--border)] hover:bg-[var(--surface-hover)]'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold shrink-0 ${
                    item.applied ? 'bg-emerald-500 text-white' : 'bg-[var(--primary)]/15 text-[var(--primary)]'
                  }`}
                >
                  {item.applied ? '✓' : index + 1}
                </span>
                <span className="font-bold text-xs text-[var(--heading)] truncate">{item.title}</span>
              </div>

              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 ${
                  item.applied
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}
              >
                {item.impactBadge}
              </span>
            </div>

            <p className="text-[11px] text-[var(--muted)] font-medium m-0 pl-7 leading-relaxed">
              {item.description}
            </p>

            <div className="pl-7 pt-1">
              <button
                type="button"
                onClick={() => handleToggleApply(item.id)}
                className={`text-[10px] font-extrabold cursor-pointer border-none bg-transparent p-0 flex items-center gap-1 ${
                  item.applied ? 'text-emerald-400' : 'text-[var(--primary)] hover:underline'
                }`}
              >
                {item.applied ? (
                  <>
                    <CheckCircle2 size={11} />
                    <span>Applied to Letter Draft</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={11} />
                    <span>Apply Suggestion</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleApplyAll}
          disabled={allApplied}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm hover:opacity-90 transition-all cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          <span>{allApplied ? 'All Suggestions Applied' : 'Apply All Suggestions'}</span>
          <Sparkles size={13} />
        </button>
      </div>
    </SidebarCard>
  )
}

export default SmartSuggestionsCard
