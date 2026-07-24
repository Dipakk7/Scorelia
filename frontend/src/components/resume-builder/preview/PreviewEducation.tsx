import React from 'react'
import type { SampleResumeData } from '../templates/types'
import { PreviewEmptyState } from './PreviewEmptyState'

interface PreviewEducationProps {
  education: SampleResumeData['education']
  accentColor?: string
}

export const PreviewEducation: React.FC<PreviewEducationProps> = ({
  education,
  accentColor = '#1e40af',
}) => {
  if (!education || education.length === 0) {
    return <PreviewEmptyState sectionTitle="Education" />
  }

  return (
    <div className="space-y-2">
      <h2
        className="text-xs font-bold tracking-wider font-display uppercase border-b pb-0.5 m-0"
        style={{ color: accentColor, borderColor: `${accentColor}33` }}
      >
        EDUCATION
      </h2>
      <div className="space-y-2">
        {education.map((item) => (
          <div key={item.id} className="space-y-0.5 text-[11px]">
            <div className="flex items-baseline justify-between font-bold text-slate-800">
              <span>{item.degree}</span>
              <span className="text-[10px] font-mono text-slate-500 font-normal">
                {item.startDate} - {item.endDate}
              </span>
            </div>
            <div className="flex items-baseline justify-between text-slate-700 font-medium">
              <span style={{ color: accentColor }}>{item.institution}</span>
              {item.gpa && <span className="text-[10px] text-slate-600 font-mono">GPA: {item.gpa}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
