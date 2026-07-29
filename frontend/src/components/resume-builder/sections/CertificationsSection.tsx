import React, { useState } from 'react'
import { Award, Plus, Trash2, ChevronDown, ChevronUp, GripVertical, ArrowUp, ArrowDown } from 'lucide-react'

export interface CertificationItem {
  id: string
  name: string
  issuer: string
  date: string
  credentialUrl?: string
}

interface CertificationsSectionProps {
  items?: CertificationItem[]
  onAdd?: () => void
  onDelete?: (id: string) => void
  onUpdate?: (id: string, updated: CertificationItem) => void
  onReorder?: (items: CertificationItem[]) => void
}

export const CertificationsSection: React.FC<CertificationsSectionProps> = ({
  items = [
    {
      id: 'cert-1',
      name: 'AWS Certified Machine Learning – Specialty',
      issuer: 'Amazon Web Services (AWS)',
      date: '2025',
      credentialUrl: 'https://aws.amazon.com/verification',
    },
    {
      id: 'cert-2',
      name: 'TensorFlow Developer Certificate',
      issuer: 'Google',
      date: '2024',
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
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/[0.08] pb-3.5 transition-colors">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider font-mono">
            <Award size={14} />
            <span>Accreditations</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display mt-0.5 m-0">
            Certifications &amp; Licenses
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-sans">
            Add industry certifications, cloud accreditations, and verified training credentials. Drag to reorder.
          </p>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 border border-purple-400/30 shadow-sm cursor-pointer transition-all active:scale-95 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80"
        >
          <Plus size={14} />
          <span>Add Certification</span>
        </button>
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="bg-slate-50/80 dark:bg-[#171a2b]/60 border border-dashed border-slate-300 dark:border-white/[0.1] rounded-xl p-8 text-center space-y-3 transition-colors">
          <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto border border-purple-200 dark:border-purple-500/20">
            <Award size={20} />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white m-0">No Certifications Added Yet</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto m-0">
              Certifications validate technical competency and boost resume credibility.
            </p>
          </div>
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80"
          >
            <Plus size={13} />
            <span>Add First Certification</span>
          </button>
        </div>
      )}

      {/* Items List */}
      <div className="space-y-3">
        {items.map((cert, idx) => {
          const isExpanded = expandedId === cert.id
          return (
            <div
              key={cert.id}
              className="bg-slate-50/80 dark:bg-[#171a2b] border border-slate-200/70 dark:border-white/[0.08] rounded-xl overflow-hidden shadow-sm dark:shadow-[0_4px_16px_-2px_rgba(0,0,0,0.35)] transition-colors group"
            >
              {/* Header Bar */}
              <div
                onClick={() => toggleExpand(cert.id)}
                className="flex items-center justify-between p-3.5 bg-white/90 dark:bg-[#171a2b] cursor-pointer hover:bg-slate-100/90 dark:hover:bg-[#1f2238] transition-colors border-b border-slate-200/80 dark:border-white/[0.08]"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Reorder Controls */}
                  <div
                    className="flex items-center gap-0.5 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <GripVertical size={16} className="cursor-grab active:cursor-grabbing" />
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, 'up')}
                      className="p-0.5 hover:text-purple-600 dark:hover:text-purple-400 disabled:opacity-30 cursor-pointer focus:outline-none"
                      title="Move Up"
                      aria-label="Move certification up"
                    >
                      <ArrowUp size={12} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === items.length - 1}
                      onClick={() => handleMove(idx, 'down')}
                      className="p-0.5 hover:text-purple-600 dark:hover:text-purple-400 disabled:opacity-30 cursor-pointer focus:outline-none"
                      title="Move Down"
                      aria-label="Move certification down"
                    >
                      <ArrowDown size={12} />
                    </button>
                  </div>

                  <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 font-mono font-extrabold text-xs">
                    #{idx + 1}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate m-0">
                      {cert.name || 'Untitled Certification'}
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate m-0 font-sans">
                      {cert.issuer} • {cert.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete?.(cert.id)
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-slate-200/80 dark:hover:bg-[#1f2238] cursor-pointer focus:outline-none"
                    title="Delete Certification"
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
                <div className="p-4 md:p-5 space-y-4 border-t border-slate-200/80 dark:border-white/[0.08]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Certification Name *</label>
                      <input
                        type="text"
                        value={cert.name}
                        onChange={(e) =>
                          onUpdate?.(cert.id, { ...cert, name: e.target.value })
                        }
                        placeholder="e.g. AWS Certified Solutions Architect"
                        className="w-full bg-white dark:bg-[#1f2238] border border-slate-200/80 dark:border-white/[0.1] rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-purple-500/80 focus:dark:border-purple-500/80 focus-visible:ring-2 focus-visible:ring-purple-500/80 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Issuing Organization *</label>
                      <input
                        type="text"
                        value={cert.issuer}
                        onChange={(e) =>
                          onUpdate?.(cert.id, { ...cert, issuer: e.target.value })
                        }
                        placeholder="e.g. Amazon Web Services"
                        className="w-full bg-white dark:bg-[#1f2238] border border-slate-200/80 dark:border-white/[0.1] rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-purple-500/80 focus:dark:border-purple-500/80 focus-visible:ring-2 focus-visible:ring-purple-500/80 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Issue Date</label>
                      <input
                        type="text"
                        value={cert.date}
                        onChange={(e) =>
                          onUpdate?.(cert.id, { ...cert, date: e.target.value })
                        }
                        placeholder="e.g. May 2025"
                        className="w-full bg-white dark:bg-[#1f2238] border border-slate-200/80 dark:border-white/[0.1] rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-purple-500/80 focus:dark:border-purple-500/80 focus-visible:ring-2 focus-visible:ring-purple-500/80 transition-all"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Verification URL</label>
                      <input
                        type="text"
                        value={cert.credentialUrl || ''}
                        onChange={(e) =>
                          onUpdate?.(cert.id, { ...cert, credentialUrl: e.target.value })
                        }
                        placeholder="https://credly.com/badges/..."
                        className="w-full bg-white dark:bg-[#1f2238] border border-slate-200/80 dark:border-white/[0.1] rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-purple-500/80 focus:dark:border-purple-500/80 focus-visible:ring-2 focus-visible:ring-purple-500/80 transition-all"
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
