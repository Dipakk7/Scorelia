import React from 'react'
import type { SampleResumeData } from './types'
import { PreviewContact } from '../preview/PreviewContact'
import { PreviewSummary } from '../preview/PreviewSummary'
import { PreviewExperience } from '../preview/PreviewExperience'
import { PreviewEducation } from '../preview/PreviewEducation'
import { PreviewSkills } from '../preview/PreviewSkills'
import { PreviewProjects } from '../preview/PreviewProjects'
import { PreviewCertifications } from '../preview/PreviewCertifications'
import { PreviewAchievements } from '../preview/PreviewAchievements'

interface ExecutiveTemplateProps {
  data: SampleResumeData
}

export const ExecutiveTemplate: React.FC<ExecutiveTemplateProps> = ({ data }) => {
  const accentColor = '#b45309' // Gold / Amber accent

  return (
    <div className="space-y-5 font-sans text-xs text-slate-900 leading-relaxed text-left">
      {/* Executive Header Banner */}
      <div className="bg-slate-900 text-white p-8 md:p-10 space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black font-display tracking-widest uppercase text-white m-0">
              {data.fullName}
            </h1>
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 mt-1 m-0">
              {data.professionalTitle}
            </p>
          </div>
          <span className="text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Executive Template
          </span>
        </div>

        <div className="pt-2 text-slate-300">
          <PreviewContact
            email={data.email}
            phone={data.phone}
            location={data.location}
            website={data.website}
            linkedin={data.linkedin}
            github={data.github}
            accentColor="#f59e0b"
          />
        </div>
      </div>

      {/* Body Content */}
      <div className="p-8 md:p-10 space-y-5 pt-2">
        <PreviewSummary summary={data.summary} accentColor={accentColor} />
        <PreviewExperience experience={data.experience} accentColor={accentColor} />
        <PreviewProjects projects={data.projects} accentColor={accentColor} />
        <PreviewEducation education={data.education} accentColor={accentColor} />
        <PreviewSkills skills={data.skills} accentColor={accentColor} />
        <PreviewCertifications certifications={data.certifications} accentColor={accentColor} />
        <PreviewAchievements achievements={data.achievements} accentColor={accentColor} />
      </div>
    </div>
  )
}
