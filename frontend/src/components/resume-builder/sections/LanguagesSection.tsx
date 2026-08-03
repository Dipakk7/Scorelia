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
  onUpdate?: (id: string, updated: LanguageItem) => void
}

export const LanguagesSection: React.FC<LanguagesSectionProps> = ({
  items = [
    { id: 'lang-1', name: 'English', proficiency: 'Fluent' },
    { id: 'lang-2', name: 'Hindi', proficiency: 'Native' },
    { id: 'lang-3', name: 'Marathi', proficiency: 'Native' },
  ],
  onAdd,
  onDelete,
  onUpdate,
}) => {
  return (
    <div className="space-y-5 animate-fade-in text-left">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold text-purple-400 uppercase tracking-wider font-mono">
            <Languages size={14} />
            <span>Linguistic Proficiency</span>
          </div>
          <h3 className="text-base md:text-lg font-extrabold text-white font-display mt-0.5 m-0">
            Languages Spoken
          </h3>
          <p className="text-xs text-slate-300 mt-1 font-sans font-medium">
            Add foreign and native languages along with your fluency level.
          </p>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 border border-purple-400/30 shadow-sm cursor-pointer transition-all active:scale-95 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
        >
          <Plus size={14} />
          <span>Add Language</span>
        </button>
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="bg-[#121424]/95 border border-dashed border-slate-800/90 rounded-2xl p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-purple-600/20 text-purple-400 flex items-center justify-center mx-auto border border-purple-500/30">
            <Languages size={20} />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white m-0">No Languages Added Yet</h4>
            <p className="text-xs text-slate-300 max-w-sm mx-auto m-0 font-medium">
              Multilingual skills are valuable for global engineering teams.
            </p>
          </div>
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
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
            className="bg-[#121424]/95 border border-slate-800/90 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-sm hover:border-slate-700/80 transition-all"
          >
            <div className="flex-1 space-y-1">
              <input
                type="text"
                value={lang.name}
                onChange={(e) => onUpdate?.(lang.id, { ...lang, name: e.target.value })}
                placeholder="e.g. German"
                className="w-full bg-[#0e101c] border border-slate-800/90 hover:border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
              <select
                value={lang.proficiency}
                onChange={(e) => onUpdate?.(lang.id, { ...lang, proficiency: e.target.value as any })}
                className="w-full bg-[#0e101c] border border-slate-800/90 hover:border-slate-700/80 rounded-lg px-2 py-1.5 text-[11px] font-semibold text-slate-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all cursor-pointer"
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
              className="p-1.5 text-slate-400 hover:text-pink-400 cursor-pointer rounded-lg hover:bg-slate-800/80 focus:outline-none"
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
