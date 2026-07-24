import React, { useState } from 'react'
import { GraduationCap, Plus, Trash2, ChevronDown, ChevronUp, GripVertical, ArrowUp, ArrowDown } from 'lucide-react'

export interface EducationItem {
  id: string
  degree: string
  institution: string
  location: string
  startDate: string
  endDate: string
  gpa?: string
  description?: string
}

interface EducationSectionProps {
  items?: EducationItem[]
  onAdd?: () => void
  onDelete?: (id: string) => void
  onUpdate?: (id: string, updated: EducationItem) => void
  onReorder?: (items: EducationItem[]) => void
}

export const EducationSection: React.FC<EducationSectionProps> = ({
  items = [
    {
      id: 'edu-1',
      degree: 'Bachelor of Technology (B.Tech) in Artificial Intelligence & Data Science',
      institution: 'Savitribai Phule Pune University',
      location: 'Pune, India',
      startDate: '2022',
      endDate: '2026',
      gpa: '8.8 / 10.0',
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
            <GraduationCap size={14} />
            <span>Academic Background</span>
          </div>
          <h3 className="text-lg font-bold text-white font-display mt-0.5 m-0">
            Education &amp; Qualifications
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Add degrees, diplomas, academic honors, or relevant university coursework. Reorder entries easily.
          </p>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600/80 hover:bg-purple-600 border border-purple-500/40 shadow-sm cursor-pointer transition-all active:scale-95 shrink-0"
        >
          <Plus size={14} />
          <span>Add Education</span>
        </button>
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="bg-slate-900/40 border border-dashed border-white/15 rounded-xl p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto border border-purple-500/20">
            <GraduationCap size={20} />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white m-0">No Education Entries Added Yet</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto m-0">
              Include your degree, major, university, and academic distinctions.
            </p>
          </div>
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 cursor-pointer transition-all"
          >
            <Plus size={13} />
            <span>Add First Education Entry</span>
          </button>
        </div>
      )}

      {/* Items List */}
      <div className="space-y-3">
        {items.map((edu, idx) => {
          const isExpanded = expandedId === edu.id
          return (
            <div
              key={edu.id}
              className="bg-slate-900/60 border border-white/10 rounded-xl overflow-hidden shadow-sm transition-all group"
            >
              {/* Card Header Bar */}
              <div
                onClick={() => toggleExpand(edu.id)}
                className="flex items-center justify-between p-3.5 bg-slate-950/40 cursor-pointer hover:bg-white/5 transition-colors border-b border-white/5"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Reorder Handle & Arrow Controls */}
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
                      aria-label="Move education up"
                    >
                      <ArrowUp size={12} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === items.length - 1}
                      onClick={() => handleMove(idx, 'down')}
                      className="p-0.5 hover:text-purple-400 disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                      aria-label="Move education down"
                    >
                      <ArrowDown size={12} />
                    </button>
                  </div>

                  <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300 font-mono font-extrabold text-xs">
                    #{idx + 1}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate m-0">
                      {edu.degree || 'Untitled Degree'}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate m-0 font-sans">
                      {edu.institution} • {edu.startDate} - {edu.endDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete?.(edu.id)
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
                      <label className="text-xs font-semibold text-slate-300">Degree / Qualification *</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) =>
                          onUpdate?.(edu.id, { ...edu, degree: e.target.value })
                        }
                        placeholder="e.g. B.S. in Computer Science"
                        className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-100 focus:outline-none focus:border-purple-500/80"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">School / University *</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) =>
                          onUpdate?.(edu.id, { ...edu, institution: e.target.value })
                        }
                        placeholder="e.g. Stanford University"
                        className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-100 focus:outline-none focus:border-purple-500/80"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Location</label>
                      <input
                        type="text"
                        value={edu.location}
                        onChange={(e) =>
                          onUpdate?.(edu.id, { ...edu, location: e.target.value })
                        }
                        placeholder="e.g. Stanford, CA"
                        className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-100 focus:outline-none focus:border-purple-500/80"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Dates Attended</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={edu.startDate}
                          onChange={(e) =>
                            onUpdate?.(edu.id, { ...edu, startDate: e.target.value })
                          }
                          placeholder="e.g. 2022"
                          className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs font-medium text-slate-100 focus:outline-none focus:border-purple-500/80"
                        />
                        <input
                          type="text"
                          value={edu.endDate}
                          onChange={(e) =>
                            onUpdate?.(edu.id, { ...edu, endDate: e.target.value })
                          }
                          placeholder="e.g. 2026"
                          className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs font-medium text-slate-100 focus:outline-none focus:border-purple-500/80"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">GPA / Honors (Optional)</label>
                      <input
                        type="text"
                        value={edu.gpa || ''}
                        onChange={(e) =>
                          onUpdate?.(edu.id, { ...edu, gpa: e.target.value })
                        }
                        placeholder="e.g. 3.9 / 4.0 or First Class with Distinction"
                        className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-100 focus:outline-none focus:border-purple-500/80"
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
