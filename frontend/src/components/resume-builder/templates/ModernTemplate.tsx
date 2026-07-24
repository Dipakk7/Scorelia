import React from 'react'
import type { SampleResumeData } from './types'
import { PreviewHeader } from '../preview/PreviewHeader'
import { PreviewContact } from '../preview/PreviewContact'
import { PreviewSummary } from '../preview/PreviewSummary'
import { PreviewExperience } from '../preview/PreviewExperience'
import { PreviewEducation } from '../preview/PreviewEducation'
import { PreviewSkills } from '../preview/PreviewSkills'
import { PreviewProjects } from '../preview/PreviewProjects'
import { PreviewCertifications } from '../preview/PreviewCertifications'
import { PreviewLanguages } from '../preview/PreviewLanguages'
import { PreviewAchievements } from '../preview/PreviewAchievements'
import { PreviewReferences } from '../preview/PreviewReferences'

interface ModernTemplateProps {
  data: SampleResumeData
}

export const ModernTemplate: React.FC<ModernTemplateProps> = ({ data }) => {
  const accentColor = '#7c3aed' // Vibrant Purple accent

  return (
    <div className="p-8 md:p-10 space-y-5 font-sans text-xs text-slate-900 leading-relaxed text-left relative">
      {/* Top Template Tag Badge */}
      <div className="flex justify-end">
        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-100 text-purple-700 font-mono">
          Modern Template
        </span>
      </div>

      {/* Header & Contact */}
      <div className="border-b-2 pb-4 space-y-2 border-purple-200">
        <PreviewHeader
          fullName={data.fullName}
          professionalTitle={data.professionalTitle}
          headline={data.headline}
          accentColor={accentColor}
        />
        <PreviewContact
          email={data.email}
          phone={data.phone}
          location={data.location}
          website={data.website}
          linkedin={data.linkedin}
          github={data.github}
          accentColor={accentColor}
        />
      </div>

      {/* Main Content Flow */}
      <PreviewSummary summary={data.summary} accentColor={accentColor} />
      <PreviewExperience experience={data.experience} accentColor={accentColor} />
      <PreviewProjects projects={data.projects} accentColor={accentColor} />
      <PreviewEducation education={data.education} accentColor={accentColor} />
      <PreviewSkills skills={data.skills} accentColor={accentColor} />
      <PreviewCertifications certifications={data.certifications} accentColor={accentColor} />
      <PreviewAchievements achievements={data.achievements} accentColor={accentColor} />
      <PreviewLanguages languages={data.languages} accentColor={accentColor} />
      <PreviewReferences references={data.references} availableUponRequest={data.availableUponRequest} accentColor={accentColor} />
    </div>
  )
}
