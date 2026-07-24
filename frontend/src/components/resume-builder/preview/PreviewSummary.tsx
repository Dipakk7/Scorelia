import React from 'react'
import { PreviewEmptyState } from './PreviewEmptyState'

interface PreviewSummaryProps {
  summary: string
  accentColor?: string
}

export const PreviewSummary: React.FC<PreviewSummaryProps> = ({ summary, accentColor = '#1e40af' }) => {
  if (!summary) {
    return <PreviewEmptyState sectionTitle="Professional Summary" />
  }

  return (
    <div className="space-y-1">
      <h2
        className="text-xs font-bold tracking-wider font-display uppercase border-b pb-0.5 m-0"
        style={{ color: accentColor, borderColor: `${accentColor}33` }}
      >
        PROFESSIONAL SUMMARY
      </h2>
      <p className="text-slate-700 text-[11px] leading-relaxed font-sans m-0">
        {summary}
      </p>
    </div>
  )
}
