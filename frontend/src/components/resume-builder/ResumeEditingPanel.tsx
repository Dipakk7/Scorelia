import React, { useState } from 'react'
import {
  User,
  Mail,
  Briefcase,
  GraduationCap,
  Sparkles,
  FileText,
  Award,
  Languages as LanguagesIcon,
  FolderGit2,
  Code,
  Sliders,
  ArrowRight,
  UserCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SampleResumeData } from './templates/types'

// Import 12 Modular Resume Section Components
import { PersonalInfoSection } from './sections/PersonalInfoSection'
import { ContactInfoSection } from './sections/ContactInfoSection'
import { SummarySection } from './sections/SummarySection'
import { ExperienceSection } from './sections/ExperienceSection'
import { EducationSection } from './sections/EducationSection'
import { SkillsSection } from './sections/SkillsSection'
import { ProjectsSection } from './sections/ProjectsSection'
import { CertificationsSection } from './sections/CertificationsSection'
import { LanguagesSection } from './sections/LanguagesSection'
import { AchievementsSection } from './sections/AchievementsSection'
import { CustomSectionsSection } from './sections/CustomSectionsSection'
import { ReferencesSection } from './sections/ReferencesSection'

interface ResumeEditingPanelProps {
  activeStep: number
  onStepChange: (stepId: number) => void
  resumeData?: SampleResumeData
  onUpdateResumeData?: (updated: SampleResumeData) => void
  onSaveDraft?: () => void
  isSaving?: boolean
}

export const ResumeEditingPanel: React.FC<ResumeEditingPanelProps> = ({
  activeStep,
  onStepChange,
  resumeData,
  onUpdateResumeData,
  onSaveDraft,
  isSaving = false,
}) => {
  const [activeSectionTab, setActiveSectionTab] = useState<string>('personal')

  // Helper to partially update central state
  const handleUpdateField = (key: keyof SampleResumeData, value: any) => {
    if (onUpdateResumeData && resumeData) {
      onUpdateResumeData({
        ...resumeData,
        [key]: value,
      })
    }
  }

  const handleUpdateFields = (fields: Partial<SampleResumeData>) => {
    if (onUpdateResumeData && resumeData) {
      onUpdateResumeData({
        ...resumeData,
        ...fields,
      })
    }
  }

  return (
    <div className="flex flex-col h-full min-h-0 bg-[#0b0c14]/95 border border-slate-800/90 rounded-2xl shadow-xl overflow-hidden text-left font-sans transition-colors">
      {/* Structural Tab Container Switcher Bar for all 12 sections */}
      <div className="h-[48px] min-h-[48px] flex items-center gap-1.5 p-2 bg-[#0e101c] border-b border-slate-800/80 overflow-x-auto custom-scrollbar shrink-0 flex-none box-border" role="tablist" aria-label="Resume section editor tabs">
        {[
          { id: 'personal', label: 'Personal', icon: User },
          { id: 'contact', label: 'Contact', icon: Mail },
          { id: 'summary', label: 'Summary', icon: FileText },
          { id: 'experience', label: 'Experience', icon: Briefcase },
          { id: 'education', label: 'Education', icon: GraduationCap },
          { id: 'skills', label: 'Skills', icon: Code },
          { id: 'projects', label: 'Projects', icon: FolderGit2 },
          { id: 'certifications', label: 'Certifications', icon: Award },
          { id: 'languages', label: 'Languages', icon: LanguagesIcon },
          { id: 'achievements', label: 'Achievements', icon: Sparkles },
          { id: 'custom', label: 'Custom', icon: Sliders },
          { id: 'references', label: 'References', icon: UserCheck },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeSectionTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`${tab.label} section`}
              onClick={() => setActiveSectionTab(tab.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500',
                isActive
                  ? 'bg-purple-600/20 text-white border-purple-500/50 shadow-xs'
                  : 'bg-transparent text-slate-400 border-transparent hover:bg-slate-900/60 hover:text-slate-200'
              )}
            >
              <Icon size={13} className={isActive ? 'text-purple-400' : 'text-slate-400'} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Main Scrollable Editing Workspace Body */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-5 custom-scrollbar text-left">
        {activeSectionTab === 'personal' && (
          <PersonalInfoSection
            data={{
              fullName: resumeData?.fullName || '',
              professionalTitle: resumeData?.professionalTitle || '',
              headline: resumeData?.headline || '',
            }}
            onChange={(updated) => {
              handleUpdateFields({
                fullName: updated.fullName,
                professionalTitle: updated.professionalTitle,
                headline: updated.headline,
              })
            }}
          />
        )}

        {activeSectionTab === 'contact' && (
          <ContactInfoSection
            data={{
              email: resumeData?.email || '',
              phone: resumeData?.phone || '',
              countryCode: resumeData?.countryCode || '+91',
              location: resumeData?.location || '',
              website: resumeData?.website || '',
              linkedin: resumeData?.linkedin || '',
              github: resumeData?.github || '',
            }}
            onChange={(updated) => {
              handleUpdateFields({
                email: updated.email,
                phone: updated.phone,
                location: updated.location,
                website: updated.website,
                linkedin: updated.linkedin,
                github: updated.github,
              })
            }}
          />
        )}

        {activeSectionTab === 'summary' && (
          <SummarySection
            data={{
              summaryText: resumeData?.summary || '',
              maxCharacters: 300,
            }}
            onChange={(updated) => {
              handleUpdateFields({
                summary: updated.summaryText,
              })
            }}
          />
        )}

        {activeSectionTab === 'experience' && (
          <ExperienceSection
            items={resumeData?.experience}
            onAdd={() => {
              const newExp = {
                id: `exp-${Date.now()}`,
                title: 'New Position',
                company: 'Company',
                location: 'Remote',
                startDate: '2024',
                endDate: 'Present',
                current: true,
                bullets: ['Key responsibility or measurable achievement.'],
              }
              handleUpdateField('experience', [...(resumeData?.experience || []), newExp])
            }}
            onDelete={(id) => {
              handleUpdateField(
                'experience',
                (resumeData?.experience || []).filter((item) => item.id !== id)
              )
            }}
            onUpdate={(id, updated) => {
              handleUpdateField(
                'experience',
                (resumeData?.experience || []).map((item) => (item.id === id ? updated : item))
              )
            }}
            onReorder={(reordered) => handleUpdateField('experience', reordered)}
          />
        )}

        {activeSectionTab === 'education' && (
          <EducationSection
            items={resumeData?.education}
            onAdd={() => {
              const newEdu = {
                id: `edu-${Date.now()}`,
                degree: 'Bachelor of Technology',
                field: 'Computer Science',
                institution: 'University Name',
                startDate: '2020',
                endDate: '2024',
              }
              handleUpdateField('education', [...(resumeData?.education || []), newEdu])
            }}
            onDelete={(id: string) => {
              handleUpdateField(
                'education',
                (resumeData?.education || []).filter((item) => item.id !== id)
              )
            }}
            onUpdate={(id: string, updated: any) => {
              handleUpdateField(
                'education',
                (resumeData?.education || []).map((item) => (item.id === id ? updated : item))
              )
            }}
          />
        )}

        {activeSectionTab === 'skills' && (
          <SkillsSection
            categories={resumeData?.skills}
            onUpdateCategory={(catId, updatedCat) => {
              const updatedSkills = (resumeData?.skills || []).map((cat) =>
                cat.id === catId ? updatedCat : cat
              )
              handleUpdateField('skills', updatedSkills)
            }}
            onAddCategory={() => {
              const newCat = {
                id: `cat-${Date.now()}`,
                name: 'New Skill Category',
                skills: ['Skill 1', 'Skill 2'],
              }
              handleUpdateField('skills', [...(resumeData?.skills || []), newCat])
            }}
            onDeleteCategory={(catId) => {
              handleUpdateField(
                'skills',
                (resumeData?.skills || []).filter((cat) => cat.id !== catId)
              )
            }}
          />
        )}

        {activeSectionTab === 'projects' && (
          <ProjectsSection
            items={resumeData?.projects}
            onAdd={() => {
              const newProj = {
                id: `proj-${Date.now()}`,
                title: 'New Key Project',
                description: 'Brief overview of technical architecture and outcomes.',
                technologies: ['React', 'Node.js'],
                bullets: ['Key outcome or metric.'],
              }
              handleUpdateField('projects', [...(resumeData?.projects || []), newProj])
            }}
            onDelete={(id: string) => {
              handleUpdateField(
                'projects',
                (resumeData?.projects || []).filter((item) => item.id !== id)
              )
            }}
            onUpdate={(id: string, updated: any) => {
              handleUpdateField(
                'projects',
                (resumeData?.projects || []).map((item) => (item.id === id ? updated : item))
              )
            }}
          />
        )}

        {activeSectionTab === 'certifications' && (
          <CertificationsSection
            items={resumeData?.certifications}
            onAdd={() => {
              const newCert = {
                id: `cert-${Date.now()}`,
                name: 'Certification Name',
                issuer: 'Issuer Organization',
                issueDate: '2024',
              }
              handleUpdateField('certifications', [...(resumeData?.certifications || []), newCert])
            }}
            onDelete={(id: string) => {
              handleUpdateField(
                'certifications',
                (resumeData?.certifications || []).filter((item) => item.id !== id)
              )
            }}
            onUpdate={(id: string, updated: any) => {
              handleUpdateField(
                'certifications',
                (resumeData?.certifications || []).map((item) => (item.id === id ? updated : item))
              )
            }}
          />
        )}

        {activeSectionTab === 'languages' && (
          <LanguagesSection
            items={resumeData?.languages as any}
            onAdd={() => {
              const newLang = {
                id: `lang-${Date.now()}`,
                language: 'Language Name',
                proficiency: 'Fluent',
              }
              handleUpdateField('languages', [...(resumeData?.languages || []), newLang])
            }}
            onDelete={(id: string) => {
              handleUpdateField(
                'languages',
                (resumeData?.languages || []).filter((item) => item.id !== id)
              )
            }}
            onUpdate={(id: string, updated: any) => {
              handleUpdateField(
                'languages',
                (resumeData?.languages || []).map((item) => (item.id === id ? updated : item))
              )
            }}
          />
        )}

        {activeSectionTab === 'achievements' && (
          <AchievementsSection
            items={resumeData?.achievements}
            onAdd={() => {
              const newAch = {
                id: `ach-${Date.now()}`,
                title: 'Key Achievement Title',
                description: 'Details of recognition or metric.',
              }
              handleUpdateField('achievements', [...(resumeData?.achievements || []), newAch])
            }}
            onDelete={(id: string) => {
              handleUpdateField(
                'achievements',
                (resumeData?.achievements || []).filter((item) => item.id !== id)
              )
            }}
            onUpdate={(id: string, updated: any) => {
              handleUpdateField(
                'achievements',
                (resumeData?.achievements || []).map((item) => (item.id === id ? updated : item))
              )
            }}
          />
        )}

        {activeSectionTab === 'custom' && (
          <CustomSectionsSection
            sections={resumeData?.customSections}
            onAddSection={() => {
              const newCustom = {
                id: `custom-${Date.now()}`,
                title: 'New Custom Section',
                items: [{ id: `citem-${Date.now()}`, title: 'Item Title', description: 'Item description' }],
              }
              handleUpdateField('customSections', [...(resumeData?.customSections || []), newCustom])
            }}
            onDeleteSection={(secId: string) => {
              handleUpdateField(
                'customSections',
                (resumeData?.customSections || []).filter((sec) => sec.id !== secId)
              )
            }}
            onUpdateSection={(secId: string, updatedSec: any) => {
              handleUpdateField(
                'customSections',
                (resumeData?.customSections || []).map((sec) => (sec.id === secId ? updatedSec : sec))
              )
            }}
          />
        )}

        {activeSectionTab === 'references' && (
          <ReferencesSection
            items={resumeData?.references}
            availableUponRequest={resumeData?.availableUponRequest}
            onToggleAvailable={(val) => handleUpdateField('availableUponRequest', val)}
            onAdd={() => {
              const newRef = {
                id: `ref-${Date.now()}`,
                name: 'Reference Name',
                title: 'Title',
                company: 'Company',
              }
              handleUpdateField('references', [...(resumeData?.references || []), newRef])
            }}
            onDelete={(id: string) => {
              handleUpdateField(
                'references',
                (resumeData?.references || []).filter((item) => item.id !== id)
              )
            }}
            onUpdate={(id: string, updated: any) => {
              handleUpdateField(
                'references',
                (resumeData?.references || []).map((item) => (item.id === id ? updated : item))
              )
            }}
          />
        )}
      </div>

      {/* Left Editing Workspace Sticky Bottom Action Toolbar */}
      <div className="h-[48px] min-h-[48px] px-3.5 border-t border-slate-800/80 bg-[#0e101c] flex items-center justify-between gap-3 text-xs transition-colors shrink-0 flex-none box-border">
        <button
          type="button"
          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
        >
          Discard Changes
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={isSaving}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-[#141628] hover:bg-[#1c1f36] border border-slate-700/80 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          >
            {isSaving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            type="button"
            onClick={() => onStepChange(Math.min(activeStep + 1, 8))}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-extrabold text-white bg-purple-600 hover:bg-purple-500 border border-purple-500/40 shadow-sm shadow-purple-950/40 transition-all cursor-pointer active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          >
            <span>Save &amp; Continue</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}
