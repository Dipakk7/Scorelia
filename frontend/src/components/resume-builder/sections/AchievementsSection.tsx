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
  onUpdate?: (id: string, updated: AchievementItem) => void
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
  onUpdate,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(items[0]?.id || null)

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="space-y-5 animate-fade-in text-left">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold text-purple-400 uppercase tracking-wider font-mono">
            <Sparkles size={14} />
            <span>Honors &amp; Awards</span>
          </div>
          <h3 className="text-base md:text-lg font-extrabold text-white font-display mt-0.5 m-0">
            Key Achievements &amp; Awards
          </h3>
          <p className="text-xs text-slate-300 mt-1 font-sans font-medium">
            Highlight hackathon wins, awards, publications, and competitive rankings.
          </p>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 border border-purple-400/30 shadow-sm cursor-pointer transition-all active:scale-95 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
        >
          <Plus size={14} />
          <span>Add Achievement</span>
        </button>
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="bg-[#121424]/95 border border-dashed border-slate-800/90 rounded-2xl p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-purple-600/20 text-purple-400 flex items-center justify-center mx-auto border border-purple-500/30">
            <Sparkles size={20} />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white m-0">No Achievements Added Yet</h4>
            <p className="text-xs text-slate-300 max-w-sm mx-auto m-0 font-medium">
              Quantified accomplishments distinguish your profile from traditional candidates.
            </p>
          </div>
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          >
            <Plus size={13} />
            <span>Add First Achievement</span>
          </button>
        </div>
      )}

      {/* Achievements Accordion List */}
      <div className="space-y-3">
        {items.map((ach) => {
          const isExpanded = expandedId === ach.id
          return (
            <div
              key={ach.id}
              className="bg-[#121424]/95 border border-slate-800/90 rounded-2xl overflow-hidden shadow-sm group"
            >
              {/* Card Header */}
              <div
                onClick={() => toggleExpand(ach.id)}
                className="p-4 flex items-center justify-between gap-3 bg-[#0e101c] cursor-pointer hover:bg-slate-900/90 transition-colors border-b border-slate-800/80"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="p-2 rounded-lg bg-purple-600/20 text-purple-300 shrink-0 border border-purple-500/30">
                    <Award size={16} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate m-0">
                      {ach.title || 'Untitled Achievement'}
                    </h4>
                    <p className="text-[11px] font-medium text-slate-300 truncate m-0">
                      {ach.issuer || 'Issuing Organization'} • {ach.impactMetric || 'Metric'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete?.(ach.id)
                    }}
                    className="p-1.5 text-slate-400 hover:text-pink-400 cursor-pointer rounded-lg hover:bg-slate-800/80 focus:outline-none"
                    title="Delete Achievement"
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
                <div className="p-4 md:p-5 space-y-4 border-t border-slate-800/80">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-xs font-bold text-slate-200">Achievement Title *</label>
                      <input
                        type="text"
                        value={ach.title}
                        onChange={(e) => onUpdate?.(ach.id, { ...ach, title: e.target.value })}
                        placeholder="e.g. Winner of National Open AI Hackathon"
                        className="w-full h-10 bg-[#0e101c] border border-slate-800/90 hover:border-slate-700/80 rounded-xl px-3.5 text-xs font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-200">Issuing Organization / Event</label>
                      <input
                        type="text"
                        value={ach.issuer || ''}
                        onChange={(e) => onUpdate?.(ach.id, { ...ach, issuer: e.target.value })}
                        placeholder="e.g. IEEE / Microsoft"
                        className="w-full h-10 bg-[#0e101c] border border-slate-800/90 hover:border-slate-700/80 rounded-xl px-3.5 text-xs font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-200">Impact Metric Tag (Optional)</label>
                      <input
                        type="text"
                        value={ach.impactMetric || ''}
                        onChange={(e) => onUpdate?.(ach.id, { ...ach, impactMetric: e.target.value })}
                        placeholder="e.g. 1st Place / 500 Submissions"
                        className="w-full h-10 bg-[#0e101c] border border-slate-800/90 hover:border-slate-700/80 rounded-xl px-3.5 text-xs font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-xs font-bold text-slate-200">Description</label>
                      <textarea
                        rows={3}
                        value={ach.description}
                        onChange={(e) => onUpdate?.(ach.id, { ...ach, description: e.target.value })}
                        placeholder="Describe the context, competitive scale, and measurable impact."
                        className="w-full bg-[#0e101c] border border-slate-800/90 hover:border-slate-700/80 rounded-xl p-3 text-xs font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none transition-all"
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
