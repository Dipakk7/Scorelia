import React from 'react'
import type { SampleResumeData } from '../templates/types'
import { PreviewEmptyState } from './PreviewEmptyState'

interface PreviewCertificationsProps {
  certifications: SampleResumeData['certifications']
  accentColor?: string
}

export const PreviewCertifications: React.FC<PreviewCertificationsProps> = ({
  certifications,
  accentColor = '#1e40af',
}) => {
  if (!certifications || certifications.length === 0) {
    return <PreviewEmptyState sectionTitle="Certifications" />
  }

  return (
    <div className="space-y-1.5">
      <h2
        className="text-xs font-bold tracking-wider font-display uppercase border-b pb-0.5 m-0"
        style={{ color: accentColor, borderColor: `${accentColor}33` }}
      >
        CERTIFICATIONS
      </h2>
      <div className="space-y-1 text-[11px] text-slate-700">
        {certifications.map((item) => (
          <div key={item.id} className="flex items-baseline justify-between font-medium">
            <span>
              <strong className="text-slate-900 font-semibold">{item.name}</strong> – {item.issuer}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">{item.date}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
