import React, { useState } from 'react'
import { Sliders, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'

export interface CustomSectionItem {
  id: string
  sectionTitle: string
  items: { id: string; title: string; subtitle?: string; description?: string }[]
}

interface CustomSectionsSectionProps {
  sections?: CustomSectionItem[]
  onAddSection?: () => void
  onDeleteSection?: (id: string) => void
}

export const CustomSectionsSection: React.FC<CustomSectionsSectionProps> = ({
  sections = [
    {
      id: 'cust-1',
      sectionTitle: 'Volunteer & Leadership',
      items: [
        {
          id: 'cust-item-1',
          title: 'Lead AI Workshop Mentor',
          subtitle: 'Student Developer Club (2024 - 2025)',
          description: 'Organized hands-on Python and PyTorch bootcamps for 200+ engineering students.',
        },
      ],
    },
  ],
  onAddSection,
  onDeleteSection,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(sections[0]?.id || null)

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="space-y-5 animate-fade-in text-left">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-border-subtle pb-3 transition-colors">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider font-mono">
            <Sliders size={14} />
            <span>Custom Sections</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display mt-0.5 m-0">
            User-Defined Resume Sections
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-sans">
            Add custom sections such as Publications, Speaking Engagements, Volunteering, or Hobbies.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddSection}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 border border-purple-400/30 shadow-sm cursor-pointer transition-all active:scale-95 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80"
        >
          <Plus size={14} />
          <span>Add Custom Section</span>
        </button>
      </div>

      {/* Empty State */}
      {sections.length === 0 && (
        <div className="bg-slate-50 dark:bg-surface-l3 border border-dashed border-slate-300 dark:border-border-subtle rounded-xl p-8 text-center space-y-3 transition-colors">
          <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto border border-purple-200 dark:border-purple-500/20">
            <Sliders size={20} />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white m-0">No Custom Sections Created</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto m-0">
              Create tailored sections to highlight unique experience or specialized activities.
            </p>
          </div>
          <button
            type="button"
            onClick={onAddSection}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80"
          >
            <Plus size={13} />
            <span>Create Custom Section</span>
          </button>
        </div>
      )}

      {/* Sections List */}
      <div className="space-y-4">
        {sections.map((sec, idx) => {
          const isExpanded = expandedId === sec.id
          return (
            <div
              key={sec.id}
              className="bg-slate-50 dark:bg-surface-l3 border border-slate-200 dark:border-border-subtle rounded-xl overflow-hidden shadow-sm transition-colors"
            >
              {/* Header Bar */}
              <div
                onClick={() => toggleExpand(sec.id)}
                className="flex items-center justify-between p-4 bg-white/80 dark:bg-surface-l2 cursor-pointer hover:bg-slate-100 dark:hover:bg-surface-l4 transition-colors border-b border-slate-200/80 dark:border-border-subtle"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 font-mono font-extrabold text-xs">
                    #{idx + 1}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate m-0">
                      {sec.sectionTitle || 'Untitled Custom Section'}
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate m-0 font-sans">
                      {sec.items.length} {sec.items.length === 1 ? 'entry' : 'entries'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteSection?.(sec.id)
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-slate-200 dark:hover:bg-white/10 cursor-pointer focus:outline-none"
                    title="Delete Custom Section"
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
                <div className="p-4 md:p-5 space-y-4 border-t border-slate-200/80 dark:border-border-subtle">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Custom Section Title *</label>
                    <input
                      type="text"
                      defaultValue={sec.sectionTitle}
                      placeholder="e.g. Publications &amp; Speaking"
                      className="w-full bg-[#F3F4F6] dark:bg-surface-l4/90 border border-[#D1D5DB] dark:border-border-subtle/50 hover:border-[#9CA3AF] dark:hover:border-slate-600 rounded-xl px-3.5 py-2 text-xs font-medium text-[#111827] dark:text-slate-100 placeholder:text-[#9CA3AF] dark:placeholder:text-slate-500 focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 transition-colors disabled:bg-[#E5E7EB] dark:disabled:bg-surface-l2 disabled:text-[#9CA3AF] disabled:cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-3 pt-2 border-t border-slate-200/80 dark:border-border-subtle">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Section Entries</label>
                    {sec.items.map((item, itemIdx) => (
                      <div key={item.id} className="p-3 bg-[#F3F4F6] dark:bg-surface-l4/90 border border-[#D1D5DB] dark:border-border-subtle/50 rounded-xl space-y-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            defaultValue={item.title}
                            placeholder="Entry Title / Role"
                            className="bg-[#F3F4F6] dark:bg-surface-l4/90 border border-[#D1D5DB] dark:border-border-subtle/50 hover:border-[#9CA3AF] dark:hover:border-slate-600 rounded-lg px-3 py-1.5 text-xs font-bold text-[#111827] dark:text-slate-100 placeholder:text-[#9CA3AF] dark:placeholder:text-slate-500 focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 transition-colors disabled:bg-[#E5E7EB] dark:disabled:bg-surface-l2 disabled:text-[#9CA3AF] disabled:cursor-not-allowed"
                          />
                          <input
                            type="text"
                            defaultValue={item.subtitle}
                            placeholder="Subtitle / Date / Organization"
                            className="bg-[#F3F4F6] dark:bg-surface-l4/90 border border-[#D1D5DB] dark:border-border-subtle/50 hover:border-[#9CA3AF] dark:hover:border-slate-600 rounded-lg px-3 py-1.5 text-xs font-medium text-[#111827] dark:text-slate-100 placeholder:text-[#9CA3AF] dark:placeholder:text-slate-500 focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 transition-colors disabled:bg-[#E5E7EB] dark:disabled:bg-surface-l2 disabled:text-[#9CA3AF] disabled:cursor-not-allowed"
                          />
                        </div>
                        <textarea
                          rows={2}
                          defaultValue={item.description}
                          placeholder="Entry details / bullet summary"
                          className="w-full bg-[#F3F4F6] dark:bg-surface-l4/90 border border-[#D1D5DB] dark:border-border-subtle/50 hover:border-[#9CA3AF] dark:hover:border-slate-600 rounded-lg p-2.5 text-xs font-medium text-[#111827] dark:text-slate-100 placeholder:text-[#9CA3AF] dark:placeholder:text-slate-500 focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 resize-none transition-colors disabled:bg-[#E5E7EB] dark:disabled:bg-surface-l2 disabled:text-[#9CA3AF] disabled:cursor-not-allowed"
                        />
                      </div>
                    ))}

                    <button
                      type="button"
                      className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-1 cursor-pointer pt-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80 rounded"
                    >
                      <Plus size={13} /> Add Custom Entry
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
