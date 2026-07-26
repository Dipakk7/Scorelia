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
      title="Cover Letter Templates"
      action={
        <span className="text-[11px] font-bold text-[var(--muted)]">
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
                  ? 'border-[var(--primary)] bg-[var(--primary)]/15 shadow-sm'
                  : 'border-[var(--border)] bg-[var(--surface-hover)]/30 hover:bg-[var(--surface-hover)]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`p-2 rounded-lg border ${
                    isSelected
                      ? 'bg-[var(--primary)]/20 text-[var(--primary)] border-[var(--primary)]/30'
                      : 'bg-[var(--surface-hover)] text-[var(--muted)] border-[var(--border)]'
                  }`}
                >
                  <FileText size={16} />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[var(--heading)] leading-tight truncate">
                      {tpl.name}
                    </span>
                    {tpl.badge && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        {tpl.badge}
                      </span>
                    )}
                  </div>
                  <span className="block text-[11px] text-[var(--muted)] font-medium leading-tight truncate mt-0.5">
                    {tpl.description}
                  </span>
                </div>
              </div>

              {isSelected ? (
                <CheckCircle2 size={16} className="text-[var(--primary)] shrink-0" />
              ) : (
                <span className="text-[10px] font-bold text-[var(--muted)] hover:text-[var(--heading)] shrink-0">
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
