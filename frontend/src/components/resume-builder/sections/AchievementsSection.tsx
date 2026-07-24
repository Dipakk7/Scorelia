import React, { useState } from 'react'
import { Sparkles, Plus, Trash2, ChevronDown, ChevronUp, Award } from 'lucide-react'

export interface AchievementItem {
  id: string
  title: string
  issuer?: string
  date?: string
  impactMetric?: string
  description: string
}

interface AchievementsSectionProps {
  items?: AchievementItem[]
  onAdd?: () => void
  onDelete?: (id: string) => void
}

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({
  items = [
    {
      id: 'ach-1',
      title: 'Top 1% Rank in National AI Hackathon',
      issuer: 'Tech Excellence Council',
      date: '2025',
      impactMetric: 'Rank 4 / 3,500 Teams',
      description: 'Built a real-time deepfake audio detector with sub-100ms inference latency.',
    },
  ],
  onAdd,
  onDelete,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(items[0]?.id || null)

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="space-y-5 animate-fade-in text-left">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider font-mono">
            <Sparkles size={14} />
            <span>Honors &amp; Awards</span>
          </div>
          <h3 className="text-lg font-bold text-white font-display mt-0.5 m-0">
            Key Achievements &amp; Awards
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Highlight hackathon wins, company awards, patents, or notable competitions.
          </p>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600/80 hover:bg-purple-600 border border-purple-500/40 shadow-sm cursor-pointer transition-all active:scale-95 shrink-0"
        >
          <Plus size={14} />
          <span>Add Achievement</span>
        </button>
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="bg-slate-900/40 border border-dashed border-white/15 rounded-xl p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto border border-purple-500/20">
            <Sparkles size={20} />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white m-0">No Achievements Added Yet</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto m-0">
              Quantified accomplishments distinguish your profile from traditional candidates.
            </p>
          </div>
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 cursor-pointer transition-all"
          >
            <Plus size={13} />
            <span>Add First Achievement</span>
          </button>
        </div>
      )}

      {/* Items List */}
      <div className="space-y-4">
        {items.map((ach, idx) => {
          const isExpanded = expandedId === ach.id
          return (
            <div
              key={ach.id}
              className="bg-slate-900/60 border border-white/10 rounded-xl overflow-hidden shadow-sm transition-all"
            >
              {/* Header Bar */}
              <div
                onClick={() => toggleExpand(ach.id)}
                className="flex items-center justify-between p-4 bg-slate-950/40 cursor-pointer hover:bg-white/5 transition-colors border-b border-white/5"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300 font-mono font-extrabold text-xs">
                    #{idx + 1}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate m-0">
                      {ach.title || 'Untitled Achievement'}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate m-0 font-sans">
                      {ach.issuer} • {ach.impactMetric || ach.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete?.(ach.id)
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-pink-400 hover:bg-white/10 cursor-pointer"
                    title="Delete Entry"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="p-1.5 text-slate-400">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>
              </div>

              {/* Form Body */}
              {isExpanded && (
                <div className="p-4 md:p-5 space-y-4 border-t border-white/5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Achievement Title *</label>
                      <input
                        type="text"
                        defaultValue={ach.title}
                        placeholder="e.g. Winner of National Open AI Hackathon"
                        className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-100 focus:outline-none focus:border-purple-500/80"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Issuing Organization / Event</label>
                      <input
                        type="text"
                        defaultValue={ach.issuer}
                        placeholder="e.g. IEEE / Microsoft"
                        className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-100 focus:outline-none focus:border-purple-500/80"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Impact Metric Tag (Optional)</label>
                      <input
                        type="text"
                        defaultValue={ach.impactMetric}
                        placeholder="e.g. 1st Place / 500 Submissions"
                        className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-100 focus:outline-none focus:border-purple-500/80"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Description</label>
                      <textarea
                        rows={3}
                        defaultValue={ach.description}
                        placeholder="Describe the context, competitive scale, and measurable impact."
                        className="w-full bg-slate-950/80 border border-white/10 rounded-xl p-3 text-xs font-medium text-slate-200 focus:outline-none focus:border-purple-500/80 resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
