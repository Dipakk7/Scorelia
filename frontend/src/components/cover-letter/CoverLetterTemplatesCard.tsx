import React, { useState } from 'react'
import { FileText, CheckCircle2, Sparkles } from 'lucide-react'
import SidebarCard from './SidebarCard'
import { mockTemplates } from '@/lib/cover-letter-mock-data'

export interface CoverLetterTemplatesCardProps {
  selectedTemplateId?: string
  onSelectTemplate?: (templateId: string) => void
}

export const CoverLetterTemplatesCard: React.FC<CoverLetterTemplatesCardProps> = ({
  selectedTemplateId = 'modern',
  onSelectTemplate,
}) => {
  const [selectedId, setSelectedId] = useState(selectedTemplateId)

  const handleSelect = (id: string) => {
    setSelectedId(id)
    onSelectTemplate?.(id)
  }

  return (
    <SidebarCard
      title={
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-purple-400" />
          <span className="font-extrabold text-sm text-white">Cover Letter Templates</span>
        </div>
      }
      action={
        <span className="text-[11px] font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
          5 Presets Available
        </span>
      }
    >
      <div className="space-y-2.5 text-left">
        {mockTemplates.map((tpl) => {
          const isSelected = tpl.id === selectedId

          return (
            <button
              key={tpl.id}
              type="button"
              onClick={() => handleSelect(tpl.id)}
              className={`w-full flex items-center justify-between gap-3 p-3 rounded-xl border transition-all text-left cursor-pointer focus:outline-none ${
                isSelected
                  ? 'border-purple-500 bg-purple-600/20 shadow-md ring-1 ring-purple-500/30'
                  : 'border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`p-2 rounded-lg border ${
                    isSelected
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white leading-tight truncate">
                      {tpl.name}
                    </span>
                    {tpl.badge && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                        {tpl.badge}
                      </span>
                    )}
                  </div>
                  <span className="block text-[11px] text-slate-400 font-medium leading-tight truncate mt-0.5">
                    {tpl.description}
                  </span>
                </div>
              </div>

              {isSelected ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <span className="text-[10px] font-bold text-slate-400 hover:text-white shrink-0">
                  Select
                </span>
              )}
            </button>
          )
        })}
      </div>
    </SidebarCard>
  )
}

export default CoverLetterTemplatesCard
