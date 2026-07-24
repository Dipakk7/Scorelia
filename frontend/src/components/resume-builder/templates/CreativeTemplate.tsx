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
import { PreviewAchievements } from '../preview/PreviewAchievements'

interface CreativeTemplateProps {
  data: SampleResumeData
}

export const CreativeTemplate: React.FC<CreativeTemplateProps> = ({ data }) => {
  const accentColor = '#db2777' // Pink / Magenta accent

  return (
    <div className="p-8 md:p-10 space-y-5 font-sans text-xs text-slate-900 leading-relaxed text-left border-t-8 border-pink-600">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
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
        <span className="text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-pink-100 text-pink-700">
          Creative Template
        </span>
      </div>

      <div className="space-y-5 pt-2">
        <PreviewSummary summary={data.summary} accentColor={accentColor} />
        <PreviewExperience experience={data.experience} accentColor={accentColor} />
        <PreviewProjects projects={data.projects} accentColor={accentColor} />
        <PreviewSkills skills={data.skills} accentColor={accentColor} />
        <PreviewEducation education={data.education} accentColor={accentColor} />
        <PreviewCertifications certifications={data.certifications} accentColor={accentColor} />
        <PreviewAchievements achievements={data.achievements} accentColor={accentColor} />
      </div>
    </div>
  )
}
