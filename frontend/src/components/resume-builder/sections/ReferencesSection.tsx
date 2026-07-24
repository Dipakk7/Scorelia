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
  onToggleAvailable,
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
            <UserCheck size={14} />
            <span>Professional References</span>
          </div>
          <h3 className="text-lg font-bold text-white font-display mt-0.5 m-0">
            References &amp; Endorsements
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Add contacts who can vouch for your professional work or toggle &quot;Available upon request&quot;.
          </p>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600/80 hover:bg-purple-600 border border-purple-500/40 shadow-sm cursor-pointer transition-all active:scale-95 shrink-0"
        >
          <Plus size={14} />
          <span>Add Reference</span>
        </button>
      </div>

      {/* Available Upon Request Toggle Card */}
      <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 flex items-center justify-between gap-3 shadow-sm">
        <div>
          <h4 className="text-xs font-bold text-white m-0">Available Upon Request Mode</h4>
          <p className="text-[11px] text-slate-400 m-0">Displays a clean &quot;References available upon request&quot; line in paper layout.</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            defaultChecked={availableUponRequest}
            onChange={(e) => onToggleAvailable?.(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
        </label>
      </div>

      {/* Empty State */}
      {items.length === 0 && !availableUponRequest && (
        <div className="bg-slate-900/40 border border-dashed border-white/15 rounded-xl p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto border border-purple-500/20">
            <UserCheck size={20} />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white m-0">No Individual References Added</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto m-0">
              Add manager or academic contacts or enable &quot;Available upon request&quot;.
            </p>
          </div>
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 cursor-pointer transition-all"
          >
            <Plus size={13} />
            <span>Add Reference</span>
          </button>
        </div>
      )}

      {/* References List */}
      <div className="space-y-4">
        {items.map((refItem, idx) => {
          const isExpanded = expandedId === refItem.id
          return (
            <div
              key={refItem.id}
              className="bg-slate-900/60 border border-white/10 rounded-xl overflow-hidden shadow-sm transition-all"
            >
              {/* Header Bar */}
              <div
                onClick={() => toggleExpand(refItem.id)}
                className="flex items-center justify-between p-4 bg-slate-950/40 cursor-pointer hover:bg-white/5 transition-colors border-b border-white/5"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300 font-mono font-extrabold text-xs">
                    #{idx + 1}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate m-0">
                      {refItem.name || 'Untitled Reference'}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate m-0 font-sans">
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
                    className="p-1.5 rounded-lg text-slate-400 hover:text-pink-400 hover:bg-white/10 cursor-pointer"
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
                <div className="p-4 md:p-5 space-y-4 border-t border-white/5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Reference Full Name *</label>
                      <input
                        type="text"
                        defaultValue={refItem.name}
                        placeholder="e.g. Dr. Jane Smith"
                        className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-100 focus:outline-none focus:border-purple-500/80"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Job Title / Relationship *</label>
                      <input
                        type="text"
                        defaultValue={refItem.title}
                        placeholder="e.g. Engineering Director / Former Manager"
                        className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-100 focus:outline-none focus:border-purple-500/80"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Company / Institution *</label>
                      <input
                        type="text"
                        defaultValue={refItem.company}
                        placeholder="e.g. Google"
                        className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-100 focus:outline-none focus:border-purple-500/80"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Email Address</label>
                      <input
                        type="email"
                        defaultValue={refItem.email}
                        placeholder="janesmith@example.com"
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
