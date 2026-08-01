import React, { useState } from 'react'
import { Sliders, Plus, Trash2, ChevronDown, ChevronUp, Pencil, Check } from 'lucide-react'

export interface CustomSectionItem {
  id: string
  sectionTitle: string
  items: { id: string; title: string; subtitle?: string; description?: string }[]
}

interface CustomSectionsSectionProps {
  sections?: CustomSectionItem[]
  onAddSection?: () => void
  onDeleteSection?: (id: string) => void
  onUpdateSection?: (id: string, updated: CustomSectionItem) => void
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
  onUpdateSection,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(sections[0]?.id || null)
  const [editingItemId, setEditingItemId] = useState<string | null>(null)

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
            Add non-standard sections such as Publications, Speaking Engagements, Patents, or Volunteer Work.
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

      {/* Sections Accordion List */}
      <div className="space-y-4">
        {sections.map((sec) => {
          const isExpanded = expandedId === sec.id

          const handleAddItem = () => {
            const newItem = {
              id: `cust-item-${Date.now()}`,
              title: 'New Achievement Title',
              subtitle: 'Organization / Date',
              description: 'Brief description of achievements or impact.',
            }
            onUpdateSection?.(sec.id, { ...sec, items: [...sec.items, newItem] })
            setEditingItemId(newItem.id)
          }

          return (
            <div
              key={sec.id}
              className="bg-slate-50 dark:bg-surface-l3 border border-slate-200 dark:border-border-subtle rounded-xl overflow-hidden shadow-sm transition-colors"
            >
              {/* Header Bar */}
              <div
                onClick={() => toggleExpand(sec.id)}
                className="flex items-center justify-between p-3.5 bg-[#DFDFE3] dark:bg-surface-l2 cursor-pointer hover:bg-[#D5D5DA] dark:hover:bg-surface-l4 transition-colors border-b border-slate-300 dark:border-border-subtle"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 font-mono font-extrabold text-xs">
                    <Sliders size={14} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#3A3A41] dark:text-[#ECECF0] truncate m-0">
                      {sec.sectionTitle || 'Custom Section'}
                    </h4>
                    <p className="text-[11px] font-medium text-[#696E78] dark:text-[#A0A5B2] truncate m-0 font-sans">
                      {sec.items.length} {sec.items.length === 1 ? 'entry' : 'entries'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteSection?.(sec.id)
                    }}
                    className="p-1.5 rounded-lg text-[#9196A0] dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-slate-300/60 dark:hover:bg-white/10 cursor-pointer focus:outline-none transition-colors"
                    title="Delete Section"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="p-1.5 text-[#9196A0] dark:text-slate-400">
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
                      value={sec.sectionTitle}
                      onChange={(e) => onUpdateSection?.(sec.id, { ...sec, sectionTitle: e.target.value })}
                      placeholder="e.g. Publications &amp; Speaking"
                      aria-label="Custom Section Title"
                      className="w-full h-9 bg-[#F3F4F6] dark:bg-surface-l4/90 border border-[#D1D5DB] dark:border-border-subtle/50 hover:border-[#9CA3AF] dark:hover:border-slate-600 rounded-xl px-3.5 text-xs font-medium text-[#111827] dark:text-slate-100 placeholder:text-[#9CA3AF] dark:placeholder:text-slate-500 focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 transition-colors disabled:bg-[#E5E7EB] dark:disabled:bg-surface-l2 disabled:text-[#9CA3AF] disabled:cursor-not-allowed box-border"
                    />
                  </div>

                  {/* Section Entries Cards List */}
                  <div className="space-y-3 pt-2 border-t border-slate-200/80 dark:border-border-subtle">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Section Entries</label>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-sans font-medium">
                        {sec.items.length} {sec.items.length === 1 ? 'item' : 'items'}
                      </span>
                    </div>

                    {/* Empty State inside section */}
                    {sec.items.length === 0 && (
                      <div className="bg-purple-50/50 dark:bg-purple-950/20 border border-dashed border-purple-200 dark:border-purple-500/30 rounded-xl p-5 text-center space-y-2 transition-colors">
                        <p className="text-xs text-slate-600 dark:text-slate-400 m-0">No entries in this section yet.</p>
                        <button
                          type="button"
                          onClick={handleAddItem}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-100/80 dark:bg-purple-500/20 hover:bg-purple-200/80 dark:hover:bg-purple-500/30 cursor-pointer transition-colors"
                        >
                          <Plus size={13} />
                          <span>Add your first custom achievement</span>
                        </button>
                      </div>
                    )}

                    {/* Individual Entry Cards */}
                    {sec.items.map((item) => {
                      const isEditing = editingItemId === item.id

                      return (
                        <div
                          key={item.id}
                          className="bg-white dark:bg-surface-l2/90 border border-slate-200 dark:border-border-subtle/70 hover:border-purple-300 dark:hover:border-purple-500/40 rounded-xl p-4 space-y-3 transition-colors shadow-sm relative group/card"
                        >
                          {isEditing ? (
                            /* Editing Inputs Mode */
                            <div className="space-y-3">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Entry Title / Role *</label>
                                  <input
                                    type="text"
                                    value={item.title}
                                    onChange={(e) => {
                                      const updatedItems = sec.items.map((it) =>
                                        it.id === item.id ? { ...it, title: e.target.value } : it
                                      )
                                      onUpdateSection?.(sec.id, { ...sec, items: updatedItems })
                                    }}
                                    placeholder="Lead AI Workshop Mentor"
                                    aria-label="Entry Title"
                                    className="w-full h-8 bg-[#F3F4F6] dark:bg-surface-l4/90 border border-[#D1D5DB] dark:border-border-subtle/50 rounded-lg px-3 text-xs font-semibold text-[#111827] dark:text-slate-100 placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 transition-colors"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Organization / Date</label>
                                  <input
                                    type="text"
                                    value={item.subtitle || ''}
                                    onChange={(e) => {
                                      const updatedItems = sec.items.map((it) =>
                                        it.id === item.id ? { ...it, subtitle: e.target.value } : it
                                      )
                                      onUpdateSection?.(sec.id, { ...sec, items: updatedItems })
                                    }}
                                    placeholder="Student Developer Club"
                                    aria-label="Organization"
                                    className="w-full h-8 bg-[#F3F4F6] dark:bg-surface-l4/90 border border-[#D1D5DB] dark:border-border-subtle/50 rounded-lg px-3 text-xs font-medium text-[#111827] dark:text-slate-100 placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 transition-colors"
                                  />
                                </div>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Description / Details</label>
                                <textarea
                                  rows={2}
                                  value={item.description || ''}
                                  onChange={(e) => {
                                    const updatedItems = sec.items.map((it) =>
                                      it.id === item.id ? { ...it, description: e.target.value } : it
                                    )
                                    onUpdateSection?.(sec.id, { ...sec, items: updatedItems })
                                  }}
                                  placeholder="Organized hands-on bootcamps for 200+ engineering students."
                                  aria-label="Description"
                                  className="w-full bg-[#F3F4F6] dark:bg-surface-l4/90 border border-[#D1D5DB] dark:border-border-subtle/50 rounded-lg p-2.5 text-xs font-medium text-[#111827] dark:text-slate-100 placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 resize-none transition-colors"
                                />
                              </div>
                              <div className="flex items-center justify-end gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={() => setEditingItemId(null)}
                                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 cursor-pointer transition-colors"
                                >
                                  <Check size={12} />
                                  <span>Done</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            /* Structured Display Mode */
                            <div className="flex items-start justify-between gap-4">
                              <div className="space-y-1 flex-1 min-w-0">
                                <h5 className="text-xs font-semibold text-[#111827] dark:text-slate-100 truncate m-0">
                                  {item.title || 'Untitled Entry'}
                                </h5>
                                {item.subtitle && (
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium m-0 truncate">
                                    {item.subtitle}
                                  </p>
                                )}
                                {item.description && (
                                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans mt-2 m-0">
                                    {item.description}
                                  </p>
                                )}
                              </div>

                              {/* Ghost Action Buttons at Bottom-Right */}
                              <div className="flex items-center gap-1 shrink-0 self-end">
                                <button
                                  type="button"
                                  onClick={() => setEditingItemId(item.id)}
                                  className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer focus:outline-none transition-colors"
                                  title="Edit Entry"
                                >
                                  <Pencil size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updatedItems = sec.items.filter((it) => it.id !== item.id)
                                    onUpdateSection?.(sec.id, { ...sec, items: updatedItems })
                                  }}
                                  className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer focus:outline-none transition-colors"
                                  title="Delete Entry"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}

                    {sec.items.length > 0 && (
                      <button
                        type="button"
                        onClick={handleAddItem}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 cursor-pointer transition-colors pt-1"
                      >
                        <Plus size={13} />
                        <span>Add Custom Entry</span>
                      </button>
                    )}
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
