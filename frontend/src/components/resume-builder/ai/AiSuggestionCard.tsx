import React, { useState } from 'react'
import { Sparkles, X, Plus, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AiSuggestionItem {
  id: string
  title: string
  description: string
  detailText: string
  priority: 'High' | 'Medium' | 'Low'
  category: string
  scoreImprovement: string
}

interface AiSuggestionCardProps {
  suggestion: AiSuggestionItem
  onApply?: (id: string) => void
  onDismiss?: (id: string) => void
}

export const AiSuggestionCard: React.FC<AiSuggestionCardProps> = ({
  suggestion,
  onApply,
  onDismiss,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const [isApplied, setIsApplied] = useState<boolean>(false)

  const priorityColors = {
    High: 'bg-pink-100 dark:bg-pink-500/20 text-pink-800 dark:text-pink-300 border-pink-300 dark:border-pink-500/30',
    Medium: 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-500/30',
    Low: 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-500/30',
  }

  const handleApply = () => {
    setIsApplied(true)
    onApply?.(suggestion.id)
  }

  if (isApplied) {
    return (
      <div className="p-3 rounded-[10px] bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-500/30 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 transition-colors">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="font-semibold font-mono">Applied: {suggestion.title}</span>
        </div>
        <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">{suggestion.scoreImprovement} Applied</span>
      </div>
    )
  }

  return (
    <div className="p-3.5 rounded-[10px] bg-slate-50 dark:bg-surface-l3 border border-slate-200 dark:border-border-subtle hover:border-purple-500/40 transition-all space-y-2.5 text-left">
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className={cn('px-2 py-0.2 rounded text-[9px] font-bold border font-mono', priorityColors[suggestion.priority])}>
            {suggestion.priority} Priority
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
            {suggestion.category}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
            {suggestion.scoreImprovement}
          </span>
          <button
            type="button"
            onClick={() => onDismiss?.(suggestion.id)}
            className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer p-0.5 focus:outline-none"
            title="Dismiss Suggestion"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-1">
        <h4 className="text-xs font-bold text-slate-900 dark:text-white font-display m-0">
          {suggestion.title}
        </h4>
        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug m-0 font-sans">
          {suggestion.description}
        </p>
      </div>

      {/* Expand Details Trigger */}
      {isExpanded && (
        <div className="p-2.5 rounded-lg bg-white dark:bg-surface-l4 border border-slate-200 dark:border-border-subtle text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed space-y-1 transition-colors">
          <span className="text-[10px] font-bold uppercase font-mono text-purple-600 dark:text-purple-400">AI Rationale:</span>
          <p className="m-0 font-sans">{suggestion.detailText}</p>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-200/80 dark:border-white/5">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 flex items-center gap-1 cursor-pointer font-mono focus:outline-none"
        >
          <span>{isExpanded ? 'Hide Rationale' : 'View Details'}</span>
          {isExpanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
        </button>

        <button
          type="button"
          onClick={handleApply}
          className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 border border-purple-400/30 cursor-pointer transition-all active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80"
        >
          <Plus size={12} />
          <span>Apply Suggestion</span>
        </button>
      </div>
    </div>
  )
}
