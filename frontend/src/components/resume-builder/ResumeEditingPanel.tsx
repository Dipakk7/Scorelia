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
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-surface-l1 border border-slate-200/80 dark:border-border-subtle/40 rounded-2xl shadow-none overflow-hidden text-left font-sans transition-colors">
      {/* Structural Tab Container Switcher Bar for all 12 sections */}
      <div className="flex items-center gap-1 p-2 bg-slate-100/60 dark:bg-surface-l2/50 border-b border-slate-200/80 dark:border-border-subtle/30 overflow-x-auto custom-scrollbar" role="tablist" aria-label="Resume section editor tabs">
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
                'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80',
                isActive
                  ? 'bg-purple-100/70 dark:bg-purple-600/20 text-purple-900 dark:text-purple-200 border-purple-300 dark:border-purple-500/40 shadow-none'
                  : 'bg-transparent text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-200/50 dark:hover:bg-surface-l4/50 hover:text-slate-900 dark:hover:text-slate-200'
              )}
            >
              <Icon size={13} className={isActive ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400 dark:text-slate-500'} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Main Scrollable Editing Workspace Body */}
      <div className="flex-1 overflow-y-auto p-4 md:p-5 custom-scrollbar text-left">
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
                degree: 'New Qualification',
                institution: 'University',
                location: 'Location',
                startDate: '2022',
                endDate: '2026',
              }
              handleUpdateField('education', [...(resumeData?.education || []), newEdu])
            }}
            onDelete={(id) => {
              handleUpdateField(
                'education',
                (resumeData?.education || []).filter((item) => item.id !== id)
              )
            }}
            onUpdate={(id, updated) => {
              handleUpdateField(
                'education',
                (resumeData?.education || []).map((item) => (item.id === id ? updated : item))
              )
            }}
            onReorder={(reordered) => handleUpdateField('education', reordered)}
          />
        )}

        {activeSectionTab === 'skills' && (
          <SkillsSection
            categories={resumeData?.skills}
            onAddCategory={() => {
              const newCat = {
                id: `cat-${Date.now()}`,
                name: 'New Skill Category',
                skills: ['Skill 1', 'Skill 2'],
              }
              handleUpdateField('skills', [...(resumeData?.skills || []), newCat])
            }}
            onDeleteCategory={(id) => {
              handleUpdateField(
                'skills',
                (resumeData?.skills || []).filter((item) => item.id !== id)
              )
            }}
            onUpdateCategory={(id, updated) => {
              handleUpdateField(
                'skills',
                (resumeData?.skills || []).map((item) => (item.id === id ? updated : item))
              )
            }}
            onReorder={(reordered) => handleUpdateField('skills', reordered)}
          />
        )}

        {activeSectionTab === 'projects' && (
          <ProjectsSection
            items={resumeData?.projects}
            onAdd={() => {
              const newProj = {
                id: `proj-${Date.now()}`,
                name: 'New Technical Project',
                subtitle: 'Tech Stack',
                bullets: ['Key system capability or result.'],
              }
              handleUpdateField('projects', [...(resumeData?.projects || []), newProj])
            }}
            onDelete={(id) => {
              handleUpdateField(
                'projects',
                (resumeData?.projects || []).filter((item) => item.id !== id)
              )
            }}
            onUpdate={(id, updated) => {
              handleUpdateField(
                'projects',
                (resumeData?.projects || []).map((item) => (item.id === id ? updated : item))
              )
            }}
            onReorder={(reordered) => handleUpdateField('projects', reordered)}
          />
        )}

        {activeSectionTab === 'certifications' && (
          <CertificationsSection
            items={resumeData?.certifications}
            onAdd={() => {
              const newCert = {
                id: `cert-${Date.now()}`,
                name: 'Certification Title',
                issuer: 'Organization',
                date: '2025',
              }
              handleUpdateField('certifications', [...(resumeData?.certifications || []), newCert])
            }}
            onDelete={(id) => {
              handleUpdateField(
                'certifications',
                (resumeData?.certifications || []).filter((item) => item.id !== id)
              )
            }}
            onUpdate={(id, updated) => {
              handleUpdateField(
                'certifications',
                (resumeData?.certifications || []).map((item) => (item.id === id ? updated : item))
              )
            }}
            onReorder={(reordered) => handleUpdateField('certifications', reordered)}
          />
        )}

        {activeSectionTab === 'languages' && (
          <LanguagesSection
            items={resumeData?.languages as any}
            onAdd={() => {
              const newLang = {
                id: `lang-${Date.now()}`,
                name: 'Language Name',
                proficiency: 'Fluent' as const,
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
                title: 'Achievement Title',
                description: 'Description of accomplishment.',
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
              const newSec = {
                id: `cust-${Date.now()}`,
                sectionTitle: 'New Custom Section',
                items: [
                  {
                    id: `cust-item-${Date.now()}`,
                    title: 'Entry Title',
                    subtitle: 'Subtitle',
                    description: 'Description',
                  },
                ],
              }
              handleUpdateField('customSections', [...(resumeData?.customSections || []), newSec])
            }}
            onDeleteSection={(id: string) => {
              handleUpdateField(
                'customSections',
                (resumeData?.customSections || []).filter((item) => item.id !== id)
              )
            }}
            onUpdateSection={(id: string, updated: any) => {
              handleUpdateField(
                'customSections',
                (resumeData?.customSections || []).map((item) => (item.id === id ? updated : item))
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
      <div className="p-3.5 border-t border-slate-200/80 dark:border-border-subtle/30 bg-white/90 dark:bg-surface-l2/40 flex items-center justify-between gap-3 transition-colors">
        <button
          type="button"
          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-surface-l4 transition-all duration-150 ease-out active:scale-[0.98] transform-gpu motion-reduce:transition-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80"
        >
          Discard Changes
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={isSaving}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-surface-l4 border border-slate-200 dark:border-border-subtle hover:bg-slate-200 dark:hover:bg-surface-l3 transition-all duration-150 ease-out active:scale-[0.98] transform-gpu motion-reduce:transition-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80"
          >
            {isSaving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            type="button"
            onClick={() => onStepChange(Math.min(activeStep + 1, 8))}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 border border-purple-500/30 shadow-sm transition-all duration-150 ease-out active:scale-[0.98] transform-gpu motion-reduce:transition-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80"
          >
            <span>Save &amp; Continue</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}
