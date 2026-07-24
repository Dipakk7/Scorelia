import React from 'react'
import { Info } from 'lucide-react'

interface PreviewEmptyStateProps {
  sectionTitle: string
  message?: string
}

export const PreviewEmptyState: React.FC<PreviewEmptyStateProps> = ({
  sectionTitle,
  message = 'No entries added to this section yet.',
}) => {
  return (
    <div className="p-3 rounded border border-dashed border-slate-300 bg-slate-50/50 text-slate-500 text-[11px] font-sans flex items-center gap-2">
      <Info size={13} className="text-slate-400 shrink-0" />
      <span>{sectionTitle}: {message}</span>
    </div>
  )
}
