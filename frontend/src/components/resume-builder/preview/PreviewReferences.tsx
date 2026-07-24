import React from 'react'
import type { SampleResumeData } from '../templates/types'

interface PreviewReferencesProps {
  references?: SampleResumeData['references']
  availableUponRequest?: boolean
  accentColor?: string
}

export const PreviewReferences: React.FC<PreviewReferencesProps> = ({
  references,
  availableUponRequest = true,
  accentColor = '#1e40af',
}) => {
  return (
    <div className="space-y-1 text-[11px] text-slate-700">
      <h2
        className="text-xs font-bold tracking-wider font-display uppercase border-b pb-0.5 m-0"
        style={{ color: accentColor, borderColor: `${accentColor}33` }}
      >
        REFERENCES
      </h2>
      {availableUponRequest || !references || references.length === 0 ? (
        <p className="italic text-slate-600 font-sans m-0">Professional references available upon request.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {references.map((r) => (
            <div key={r.id} className="space-y-0.5 border-l-2 pl-2 border-slate-300">
              <p className="font-bold text-slate-900 m-0">{r.name}</p>
              <p className="text-[10px] text-slate-600 m-0">{r.title} • {r.company}</p>
              {r.email && <p className="text-[10px] text-slate-500 m-0">{r.email}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
