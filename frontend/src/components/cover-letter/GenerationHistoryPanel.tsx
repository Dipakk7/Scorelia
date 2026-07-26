import React, { useState } from 'react'
import { Clock, RotateCcw } from 'lucide-react'
import SidebarCard from './SidebarCard'
import { mockGenerationLogs, type GenerationHistoryLog } from '@/lib/cover-letter-mock-data'

export interface GenerationHistoryPanelProps {
  onRestoreGeneration?: (log: GenerationHistoryLog) => void
}

export const GenerationHistoryPanel: React.FC<GenerationHistoryPanelProps> = ({
  onRestoreGeneration,
}) => {
  const [logs] = useState<GenerationHistoryLog[]>(mockGenerationLogs)

  return (
    <SidebarCard
      title={
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-purple-400" />
          <span className="font-extrabold text-sm text-[var(--heading)]">Generation History</span>
        </div>
      }
    >
      <div className="space-y-2.5 text-left">
        {logs.map((log) => (
          <div
            key={log.id}
            className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/30 hover:bg-[var(--surface-hover)] transition-colors space-y-1.5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-xs text-[var(--heading)] truncate">
                {log.jobTitle} at {log.companyName}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ATS {log.atsScore}%
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[var(--muted)] font-medium">
              <span>
                {log.templateName} • {log.tone}
              </span>

              <button
                type="button"
                onClick={() => onRestoreGeneration?.(log)}
                className="flex items-center gap-1 text-[11px] font-bold text-[var(--primary)] hover:underline cursor-pointer border-none bg-transparent p-0"
              >
                <RotateCcw size={10} />
                <span>Restore {log.versionLabel}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </SidebarCard>
  )
}

export default GenerationHistoryPanel
