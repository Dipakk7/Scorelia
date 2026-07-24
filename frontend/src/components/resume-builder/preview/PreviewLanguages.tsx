import React from 'react'
import type { SampleResumeData } from '../templates/types'

interface PreviewLanguagesProps {
  languages: SampleResumeData['languages']
  accentColor?: string
}

export const PreviewLanguages: React.FC<PreviewLanguagesProps> = ({ languages, accentColor = '#1e40af' }) => {
  if (!languages || languages.length === 0) return null

  return (
    <div className="space-y-1 text-[11px] text-slate-700">
      <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 m-0 border-b pb-0.5" style={{ color: accentColor }}>
        LANGUAGES
      </h3>
      <p className="m-0 font-medium">
        {languages.map((l) => `${l.name} (${l.proficiency})`).join(' • ')}
      </p>
    </div>
  )
}
