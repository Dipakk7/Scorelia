import React, { useState } from 'react'
import { CheckCircle2, Circle, CheckSquare, Sparkles } from 'lucide-react'
import { mockAtsChecklist, type ReadinessChecklistItem } from '@/lib/ats-ai-mock-data'
import { cn } from '@/lib/utils'

export const ATSChecklistCard: React.FC = () => {
  const [items, setItems] = useState<ReadinessChecklistItem[]>(mockAtsChecklist)

  const toggleCheck = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    )
  }

  const completedCount = items.filter((i) => i.completed).length
  const progressPercent = Math.round((completedCount / items.length) * 100)

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800/90 p-5 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-purple-400" />
            ATS Readiness Master Checklist
          </h3>
          <p className="text-xs text-slate-400">
            Interactive readiness verification across key formatting and content requirements.
          </p>
        </div>

        {/* Progress Counter Pill */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            {completedCount} / {items.length} Completed ({progressPercent}%)
          </span>
        </div>
      </div>

      {/* Master Progress Bar */}
      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Interactive Checklist Items */}
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleCheck(item.id)}
            className={cn(
              'p-3.5 rounded-xl border transition-all duration-150 cursor-pointer flex items-center justify-between gap-3 select-none',
              item.completed
                ? 'bg-slate-950/70 border-slate-800/80 text-slate-300'
                : 'bg-purple-950/20 border-purple-500/30 text-white shadow-sm'
            )}
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label={`Toggle checklist item ${item.label}`}
                className="text-purple-400 focus:outline-none"
              >
                {item.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-purple-400 shrink-0" />
                )}
              </button>
              <div>
                <div className={cn('text-xs font-semibold', item.completed && 'line-through text-slate-400')}>
                  {item.label}
                </div>
                <div className="text-[11px] text-slate-400">{item.description}</div>
              </div>
            </div>

            <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 shrink-0">
              {item.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
