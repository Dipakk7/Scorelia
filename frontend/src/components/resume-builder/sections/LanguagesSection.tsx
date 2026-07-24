import React from 'react'
import { Languages, Plus, Trash2 } from 'lucide-react'

export interface LanguageItem {
  id: string
  name: string
  proficiency: 'Native' | 'Fluent' | 'Advanced' | 'Intermediate' | 'Basic'
}

interface LanguagesSectionProps {
  items?: LanguageItem[]
  onAdd?: () => void
  onDelete?: (id: string) => void
}

export const LanguagesSection: React.FC<LanguagesSectionProps> = ({
  items = [
    { id: 'lang-1', name: 'English', proficiency: 'Fluent' },
    { id: 'lang-2', name: 'Hindi', proficiency: 'Native' },
    { id: 'lang-3', name: 'Marathi', proficiency: 'Native' },
  ],
  onAdd,
  onDelete,
}) => {
  return (
    <div className="space-y-5 animate-fade-in text-left">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider font-mono">
            <Languages size={14} />
            <span>Linguistic Proficiency</span>
          </div>
          <h3 className="text-lg font-bold text-white font-display mt-0.5 m-0">
            Languages Spoken
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Add foreign and native languages along with your fluency level.
          </p>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600/80 hover:bg-purple-600 border border-purple-500/40 shadow-sm cursor-pointer transition-all active:scale-95 shrink-0"
        >
          <Plus size={14} />
          <span>Add Language</span>
        </button>
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="bg-slate-900/40 border border-dashed border-white/15 rounded-xl p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto border border-purple-500/20">
            <Languages size={20} />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white m-0">No Languages Added Yet</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto m-0">
              Multilingual skills are valuable for global engineering teams.
            </p>
          </div>
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 cursor-pointer transition-all"
          >
            <Plus size={13} />
            <span>Add First Language</span>
          </button>
        </div>
      )}

      {/* Language Items List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((lang) => (
          <div
            key={lang.id}
            className="bg-slate-900/60 border border-white/10 rounded-xl p-3.5 flex items-center justify-between gap-3 shadow-sm hover:border-purple-500/30 transition-colors"
          >
            <div className="flex-1 space-y-1">
              <input
                type="text"
                defaultValue={lang.name}
                placeholder="e.g. German"
                className="w-full bg-slate-950/80 border border-white/10 rounded-lg px-2.5 py-1 text-xs font-bold text-white focus:outline-none focus:border-purple-500/80"
              />
              <select
                defaultValue={lang.proficiency}
                className="w-full bg-slate-950/80 border border-white/10 rounded-lg px-2 py-1 text-[11px] font-medium text-slate-300 focus:outline-none focus:border-purple-500/80"
              >
                <option value="Native">Native / Bilingual</option>
                <option value="Fluent">Fluent / Full Professional</option>
                <option value="Advanced">Advanced / Professional</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Basic">Elementary / Basic</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => onDelete?.(lang.id)}
              className="p-1.5 text-slate-500 hover:text-pink-400 cursor-pointer rounded-lg hover:bg-white/5"
              title="Remove Language"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
