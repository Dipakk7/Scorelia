import React from 'react'
import type { SampleResumeData } from '../templates/types'
import { PreviewEmptyState } from './PreviewEmptyState'

interface PreviewProjectsProps {
  projects: SampleResumeData['projects']
  accentColor?: string
}

export const PreviewProjects: React.FC<PreviewProjectsProps> = ({ projects, accentColor = '#1e40af' }) => {
  if (!projects || projects.length === 0) {
    return <PreviewEmptyState sectionTitle="Projects" />
  }

  return (
    <div className="space-y-2">
      <h2
        className="text-xs font-bold tracking-wider font-display uppercase border-b pb-0.5 m-0"
        style={{ color: accentColor, borderColor: `${accentColor}33` }}
      >
        PROJECTS
      </h2>
      <div className="space-y-2 text-[11px]">
        {projects.map((proj) => (
          <div key={proj.id} className="space-y-0.5">
            <div className="flex items-baseline justify-between font-bold text-slate-800">
              <span>{proj.name}</span>
              {proj.subtitle && (
                <span className="text-[10px] text-slate-500 font-mono font-normal">
                  {proj.subtitle}
                </span>
              )}
            </div>
            {proj.bullets && proj.bullets.length > 0 && (
              <ul className="list-disc list-inside text-slate-700 space-y-0.5 pl-1 font-sans">
                {proj.bullets.map((bullet, idx) => (
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
