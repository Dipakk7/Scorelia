import React, { useState } from 'react'
import { UserCheck, Plus, Trash2, ChevronDown, ChevronUp, Mail, Phone } from 'lucide-react'

export interface ReferenceItem {
  id: string
  name: string
  title: string
  company: string
  email?: string
  phone?: string
}

interface ReferencesSectionProps {
  items?: ReferenceItem[]
  availableUponRequest?: boolean
  onAdd?: () => void
  onDelete?: (id: string) => void
  onUpdate?: (id: string, updated: ReferenceItem) => void
  onToggleAvailable?: (val: boolean) => void
}

export const ReferencesSection: React.FC<ReferencesSectionProps> = ({
  items = [
    {
      id: 'ref-1',
      name: 'Dr. Rajesh Sharma',
      title: 'Head of AI Research Department',
      company: 'Savitribai Phule Pune University',
      email: 'rsharma@sppu.ac.in',
      phone: '+91 98230 11223',
    },
  ],
  availableUponRequest = true,
  onAdd,
  onDelete,
  onUpdate,
  onToggleAvailable,
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
            <UserCheck size={14} />
            <span>Professional References</span>
          </div>
          <h3 className="text-base md:text-lg font-extrabold text-white font-display mt-0.5 m-0">
            References &amp; Recommendations
          </h3>
          <p className="text-xs text-slate-300 mt-1 font-sans font-medium">
            Add professional contacts who can vouch for your work performance.
          </p>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 border border-purple-400/30 shadow-sm cursor-pointer transition-all active:scale-95 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
        >
          <Plus size={14} />
          <span>Add Reference</span>
        </button>
      </div>

      {/* Available Upon Request Toggle Card */}
      <div className="p-4 bg-[#121424]/95 border border-purple-500/30 rounded-2xl flex items-center justify-between gap-3 shadow-sm">
        <div>
          <h4 className="text-xs font-bold text-white m-0">
            Show "References Available Upon Request" banner
          </h4>
          <p className="text-[11px] text-slate-300 m-0 font-sans font-medium">
            Hides detailed contact info on public resumes and prints a clean standard line.
          </p>
        </div>

        <label className="relative inline-flex items-center cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={availableUponRequest}
            onChange={(e) => onToggleAvailable?.(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-700 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
        </label>
      </div>

      {/* Items List */}
      <div className="space-y-4">
        {items.map((refItem) => {
          const isExpanded = expandedId === refItem.id
          return (
            <div
              key={refItem.id}
              className="bg-[#121424]/95 border border-slate-800/90 rounded-2xl overflow-hidden shadow-sm group"
            >
              {/* Card Header */}
              <div
                onClick={() => toggleExpand(refItem.id)}
                className="flex items-center justify-between p-4 bg-[#0e101c] cursor-pointer hover:bg-slate-900/90 transition-colors border-b border-slate-800/80"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-purple-600/20 text-purple-300 font-mono font-extrabold text-xs border border-purple-500/30">
                    <UserCheck size={16} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate m-0">
                      {refItem.name || 'Untitled Reference'}
                    </h4>
                    <p className="text-[11px] font-medium text-slate-300 truncate m-0 font-sans">
                      {refItem.title} • {refItem.company}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete?.(refItem.id)
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-pink-400 hover:bg-slate-800/80 cursor-pointer focus:outline-none transition-colors"
                    title="Delete Reference"
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
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-200">Reference Full Name *</label>
                      <input
                        type="text"
                        value={refItem.name}
                        onChange={(e) => onUpdate?.(refItem.id, { ...refItem, name: e.target.value })}
                        placeholder="e.g. Dr. Jane Smith"
                        className="w-full h-10 bg-[#0e101c] border border-slate-800/90 hover:border-slate-700/80 rounded-xl px-3.5 text-xs font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-200">Job Title / Relationship *</label>
                      <input
                        type="text"
                        value={refItem.title}
                        onChange={(e) => onUpdate?.(refItem.id, { ...refItem, title: e.target.value })}
                        placeholder="e.g. Engineering Director / Former Manager"
                        className="w-full h-10 bg-[#0e101c] border border-slate-800/90 hover:border-slate-700/80 rounded-xl px-3.5 text-xs font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-200">Company / Institution *</label>
                      <input
                        type="text"
                        value={refItem.company}
                        onChange={(e) => onUpdate?.(refItem.id, { ...refItem, company: e.target.value })}
                        placeholder="e.g. Google"
                        className="w-full h-10 bg-[#0e101c] border border-slate-800/90 hover:border-slate-700/80 rounded-xl px-3.5 text-xs font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-200">Email Address</label>
                      <input
                        type="email"
                        value={refItem.email || ''}
                        onChange={(e) => onUpdate?.(refItem.id, { ...refItem, email: e.target.value })}
                        placeholder="janesmith@example.com"
                        className="w-full h-10 bg-[#0e101c] border border-slate-800/90 hover:border-slate-700/80 rounded-xl px-3.5 text-xs font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
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
