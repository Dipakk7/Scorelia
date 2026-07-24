import React from 'react'
import type { SampleResumeData } from '../templates/types'
import { PreviewEmptyState } from './PreviewEmptyState'

interface PreviewSkillsProps {
  skills: SampleResumeData['skills']
  accentColor?: string
}

export const PreviewSkills: React.FC<PreviewSkillsProps> = ({ skills, accentColor = '#1e40af' }) => {
  if (!skills || skills.length === 0) {
    return <PreviewEmptyState sectionTitle="Skills" />
  }

  return (
    <div className="space-y-1.5">
      <h2
        className="text-xs font-bold tracking-wider font-display uppercase border-b pb-0.5 m-0"
        style={{ color: accentColor, borderColor: `${accentColor}33` }}
      >
        SKILLS
      </h2>
      <div className="space-y-1 text-[11px] text-slate-700 font-sans">
        {skills.map((cat) => (
          <p key={cat.id} className="m-0 leading-snug">
            <strong className="text-slate-900 font-semibold">{cat.name}:</strong>{' '}
            {cat.skills.join(', ')}
          </p>
        ))}
      </div>
    </div>
  )
}
