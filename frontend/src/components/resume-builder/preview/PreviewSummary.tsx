import React from 'react'
import { PreviewEmptyState } from './PreviewEmptyState'

interface PreviewSummaryProps {
  summary: string
  accentColor?: string
}

export const PreviewSummary: React.FC<PreviewSummaryProps> = ({ summary }) => {
  if (!summary) {
    return <PreviewEmptyState sectionTitle="Professional Summary" />
  }

  return (
    <div className="space-y-1">
      <h2 className="text-[11px] font-bold tracking-widest font-display uppercase border-b border-slate-200/80 pb-0.5 m-0 text-slate-900">
        PROFESSIONAL SUMMARY
      </h2>
      <p className="text-slate-700 text-[10.5px] leading-relaxed font-sans m-0">
        {summary}
      </p>
    </div>
  )
}
