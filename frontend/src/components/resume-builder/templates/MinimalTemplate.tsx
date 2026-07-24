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

interface MinimalTemplateProps {
  data: SampleResumeData
}

export const MinimalTemplate: React.FC<MinimalTemplateProps> = ({ data }) => {
  const accentColor = '#334155' // Slate monochrome accent

  return (
    <div className="p-8 md:p-10 space-y-6 font-sans text-xs text-slate-900 leading-relaxed text-left">
      <div className="flex justify-between items-start border-b pb-3 border-slate-200">
        <PreviewHeader
          fullName={data.fullName}
          professionalTitle={data.professionalTitle}
          headline={data.headline}
          accentColor={accentColor}
        />
        <span className="text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
          Minimal Template
        </span>
      </div>

      <PreviewContact
        email={data.email}
        phone={data.phone}
        location={data.location}
        website={data.website}
        linkedin={data.linkedin}
        github={data.github}
        accentColor={accentColor}
      />

      <div className="space-y-5">
        <PreviewSummary summary={data.summary} accentColor={accentColor} />
        <PreviewExperience experience={data.experience} accentColor={accentColor} />
        <PreviewProjects projects={data.projects} accentColor={accentColor} />
        <PreviewEducation education={data.education} accentColor={accentColor} />
        <PreviewSkills skills={data.skills} accentColor={accentColor} />
        <PreviewCertifications certifications={data.certifications} accentColor={accentColor} />
      </div>
    </div>
  )
}
