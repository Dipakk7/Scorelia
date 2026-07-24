import React, { useState } from 'react'
import {
  Briefcase,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  GripVertical,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'

export interface ExperienceItem {
  id: string
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  bullets: string[]
}

interface ExperienceSectionProps {
  items?: ExperienceItem[]
  onAdd?: () => void
  onDelete?: (id: string) => void
  onUpdate?: (id: string, updated: ExperienceItem) => void
  onReorder?: (items: ExperienceItem[]) => void
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  items = [
    {
      id: 'exp-1',
      title: 'AI Intern',
      company: 'RaiTalk',
      location: 'Remote',
      startDate: 'Jan 2026',
      endDate: 'May 2026',
      current: false,
      bullets: [
        'Collected, cleaned, and analyzed data to extract actionable insights.',
        'Built dashboards and reports to track user behavior and engagement.',
        'Conducted A/B testing and experiments to optimize product performance.',
        'Collaborated with AI and product teams to improve features and user experience.',
      ],
    },
  ],
  onAdd,
  onDelete,
  onUpdate,
  onReorder,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(items[0]?.id || null)

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= items.length) return

    const newItems = [...items]
    const temp = newItems[index]
    newItems[index] = newItems[targetIndex]
    newItems[targetIndex] = temp
    onReorder?.(newItems)
  }

  return (
    <div className="space-y-5 animate-fade-in text-left">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider font-mono">
            <Briefcase size={14} />
            <span>Work History</span>
          </div>
          <h3 className="text-lg font-bold text-white font-display mt-0.5 m-0">
            Professional Experience
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Add relevant work experiences in reverse chronological order. Use drag handles or arrow controls to reorder.
          </p>
        </div>

        {/* Add Experience Button */}
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600/80 hover:bg-purple-600 border border-purple-500/40 shadow-sm cursor-pointer transition-all active:scale-95 shrink-0"
        >
          <Plus size={14} />
          <span>Add Position</span>
        </button>
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="bg-slate-900/40 border border-dashed border-white/15 rounded-xl p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto border border-purple-500/20">
            <Briefcase size={20} />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white m-0">No Work Experience Added Yet</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto m-0">
              Highlight your career trajectory, responsibilities, and measurable achievements.
            </p>
          </div>
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 cursor-pointer transition-all"
          >
            <Plus size={13} />
            <span>Add First Position</span>
          </button>
        </div>
      )}

      {/* Items List */}
      <div className="space-y-3">
        {items.map((exp, idx) => {
          const isExpanded = expandedId === exp.id
          return (
            <div
              key={exp.id}
              className="bg-slate-900/60 border border-white/10 rounded-xl overflow-hidden shadow-sm transition-all group"
            >
              {/* Card Header Bar */}
              <div
                onClick={() => toggleExpand(exp.id)}
                className="flex items-center justify-between p-3.5 bg-slate-950/40 cursor-pointer hover:bg-white/5 transition-colors border-b border-white/5"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Drag Handle Icon & Reorder Up/Down Controls */}
                  <div
                    className="flex items-center gap-0.5 text-slate-500 group-hover:text-slate-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <GripVertical size={16} className="cursor-grab active:cursor-grabbing" />
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, 'up')}
                      className="p-0.5 hover:text-purple-400 disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                      aria-label="Move position up"
                    >
                      <ArrowUp size={12} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === items.length - 1}
                      onClick={() => handleMove(idx, 'down')}
                      className="p-0.5 hover:text-purple-400 disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                      aria-label="Move position down"
                    >
                      <ArrowDown size={12} />
                    </button>
                  </div>

                  <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300 font-mono font-extrabold text-xs">
                    #{idx + 1}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate m-0">
                      {exp.title || 'Untitled Position'}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate m-0 font-sans">
                      {exp.company} • {exp.startDate} - {exp.current ? 'Present' : exp.endDate} ({exp.location})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete?.(exp.id)
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-pink-400 hover:bg-white/10 cursor-pointer"
                    title="Delete Position"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="p-1.5 text-slate-400">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>
              </div>

              {/* Card Form Body */}
              {isExpanded && (
                <div className="p-4 md:p-5 space-y-4 border-t border-white/5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Job Title *</label>
                      <input
                        type="text"
                        value={exp.title}
                        onChange={(e) =>
                          onUpdate?.(exp.id, { ...exp, title: e.target.value })
                        }
                        placeholder="e.g. Senior Software Engineer"
                        className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-100 focus:outline-none focus:border-purple-500/80"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Company Name *</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) =>
                          onUpdate?.(exp.id, { ...exp, company: e.target.value })
                        }
                        placeholder="e.g. Google"
                        className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-100 focus:outline-none focus:border-purple-500/80"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Location</label>
                      <input
                        type="text"
                        value={exp.location}
                        onChange={(e) =>
                          onUpdate?.(exp.id, { ...exp, location: e.target.value })
                        }
                        placeholder="e.g. San Francisco, CA or Remote"
                        className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-100 focus:outline-none focus:border-purple-500/80"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Start Date</label>
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={(e) =>
                            onUpdate?.(exp.id, { ...exp, startDate: e.target.value })
                          }
                          placeholder="e.g. Jan 2024"
                          className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-100 focus:outline-none focus:border-purple-500/80"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">End Date</label>
                        <input
                          type="text"
                          value={exp.endDate}
                          onChange={(e) =>
                            onUpdate?.(exp.id, { ...exp, endDate: e.target.value })
                          }
                          disabled={exp.current}
                          placeholder="e.g. Present"
                          className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-100 focus:outline-none focus:border-purple-500/80 disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bullet Points List */}
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-300">Key Responsibilities &amp; Achievements</label>
                      <button
                        type="button"
                        className="text-[11px] font-bold text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles size={11} /> AI Action Verbs
                      </button>
                    </div>

                    {exp.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-2">
                        <span className="text-slate-500 font-mono text-xs">•</span>
                        <input
                          type="text"
                          value={bullet}
                          onChange={(e) => {
                            const newBullets = [...exp.bullets]
                            newBullets[bIdx] = e.target.value
                            onUpdate?.(exp.id, { ...exp, bullets: newBullets })
                          }}
                          placeholder="Action verb + Context + Measurable Result (e.g. Increased API throughput by 40%)"
                          className="flex-1 bg-slate-950/80 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-200 focus:outline-none focus:border-purple-500/80"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newBullets = exp.bullets.filter((_, i) => i !== bIdx)
                            onUpdate?.(exp.id, { ...exp, bullets: newBullets })
                          }}
                          className="p-1 text-slate-500 hover:text-pink-400 cursor-pointer"
                          title="Remove Bullet"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => {
                        onUpdate?.(exp.id, {
                          ...exp,
                          bullets: [...exp.bullets, 'New responsibility or key achievement.'],
                        })
                      }}
                      className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer pt-1"
                    >
                      <Plus size={13} /> Add Bullet Point
                    </button>
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
