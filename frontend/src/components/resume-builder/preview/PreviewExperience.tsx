import React from 'react'
import type { SampleResumeData } from '../templates/types'
import { PreviewEmptyState } from './PreviewEmptyState'

interface PreviewExperienceProps {
  experience: SampleResumeData['experience']
  accentColor?: string
}

export const PreviewExperience: React.FC<PreviewExperienceProps> = ({
  experience,
  accentColor = '#1e40af',
}) => {
  if (!experience || experience.length === 0) {
    return <PreviewEmptyState sectionTitle="Work Experience" />
  }

  return (
    <div className="space-y-2">
      <h2
        className="text-xs font-bold tracking-wider font-display uppercase border-b pb-0.5 m-0"
        style={{ color: accentColor, borderColor: `${accentColor}33` }}
      >
        EXPERIENCE
      </h2>
      <div className="space-y-3">
        {experience.map((item) => (
          <div key={item.id} className="space-y-1">
            <div className="flex items-baseline justify-between font-bold text-slate-800 text-[11px]">
              <span>{item.title}</span>
              <span className="text-[10px] font-mono text-slate-500 font-normal">
                {item.startDate} - {item.current ? 'Present' : item.endDate}
              </span>
            </div>
            <div className="flex items-baseline justify-between text-[11px] font-semibold" style={{ color: accentColor }}>
              <span>{item.company}</span>
              <span className="text-[10px] text-slate-500 font-normal">{item.location}</span>
            </div>
            {item.bullets && item.bullets.length > 0 && (
              <ul className="list-disc list-inside text-slate-700 space-y-0.5 pl-1 text-[11px] font-sans">
                {item.bullets.map((bullet, idx) => (
                  <li key={idx} className="leading-snug">{bullet}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
