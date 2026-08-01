import React from 'react'
import type { SampleResumeData } from '../templates/types'
import { PreviewEmptyState } from './PreviewEmptyState'

interface PreviewEducationProps {
  education: SampleResumeData['education']
  accentColor?: string
}

export const PreviewEducation: React.FC<PreviewEducationProps> = ({
  education,
}) => {
  if (!education || education.length === 0) {
    return <PreviewEmptyState sectionTitle="Education" />
  }

  return (
    <div className="space-y-2 break-inside-avoid">
      <h2 className="text-[11px] font-bold tracking-widest font-display uppercase border-b border-slate-200/80 pb-0.5 m-0 text-slate-900">
        EDUCATION
      </h2>
      <div className="space-y-2">
        {education.map((item) => (
          <div key={item.id} className="space-y-0.5 text-[10.5px] break-inside-avoid">
            <div className="flex items-baseline justify-between text-slate-900 text-[11px] leading-tight">
              <span className="font-bold">{item.degree}</span>
              <span className="text-[9.5px] font-mono text-slate-500 font-medium">
                {item.startDate} – {item.endDate}
              </span>
            </div>
            <div className="flex items-baseline justify-between text-slate-700 font-medium">
              <span className="font-semibold">{item.institution}</span>
              {item.gpa && <span className="text-[9.5px] text-slate-500 font-mono">GPA: {item.gpa}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
