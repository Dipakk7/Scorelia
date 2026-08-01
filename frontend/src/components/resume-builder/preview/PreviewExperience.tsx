import React from 'react'
import type { SampleResumeData } from '../templates/types'
import { PreviewEmptyState } from './PreviewEmptyState'

interface PreviewExperienceProps {
  experience: SampleResumeData['experience']
  accentColor?: string
}

export const PreviewExperience: React.FC<PreviewExperienceProps> = ({
  experience,
}) => {
  if (!experience || experience.length === 0) {
    return <PreviewEmptyState sectionTitle="Work Experience" />
  }

  return (
    <div className="space-y-2 break-inside-avoid">
      <h2 className="text-[11px] font-bold tracking-widest font-display uppercase border-b border-slate-200/80 pb-0.5 m-0 text-slate-900">
        EXPERIENCE
      </h2>
      <div className="space-y-2.5">
        {experience.map((item) => (
          <div key={item.id} className="space-y-0.5 break-inside-avoid">
            <div className="flex items-baseline justify-between text-slate-900 text-[11px] leading-tight">
              <span className="font-bold">{item.company}</span>
              <span className="text-[9.5px] font-mono text-slate-500 font-medium">
                {item.startDate} – {item.current ? 'Present' : item.endDate}
              </span>
            </div>
            <div className="flex items-baseline justify-between text-[10.5px] text-slate-700 font-semibold italic">
              <span>{item.title}</span>
              {item.location && <span className="text-[9.5px] text-slate-500 font-normal not-italic">{item.location}</span>}
            </div>
            {item.bullets && item.bullets.length > 0 && (
              <ul className="list-disc list-outside text-slate-700 space-y-1 pl-4 text-[10.5px] font-sans pt-0.5 marker:text-slate-400">
                {item.bullets.map((bullet, idx) => (
                  <li key={idx} className="leading-relaxed">{bullet}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
