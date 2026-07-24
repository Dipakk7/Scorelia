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

  return (
    <div className="flex flex-col h-full bg-[#0b0c14]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl overflow-hidden text-left font-sans">
      {/* Structural Tab Container Switcher Bar for all 12 sections */}
      <div className="flex items-center gap-1 p-2 bg-slate-950/80 border-b border-white/10 overflow-x-auto custom-scrollbar" role="tablist" aria-label="Resume section editor tabs">
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
                  ? 'bg-gradient-to-r from-purple-600/30 via-indigo-600/30 to-pink-600/30 text-purple-200 border-purple-500/50 shadow-md shadow-purple-950/40'
                  : 'bg-transparent text-slate-400 border-transparent hover:bg-white/5 hover:text-slate-200'
              )}
            >
              <Icon size={13} className={isActive ? 'text-purple-400' : 'text-slate-500'} />
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
              handleUpdateField('fullName', updated.fullName)
              handleUpdateField('professionalTitle', updated.professionalTitle)
              handleUpdateField('headline', updated.headline)
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
              handleUpdateField('email', updated.email)
              handleUpdateField('phone', updated.phone)
              handleUpdateField('location', updated.location)
              handleUpdateField('website', updated.website)
              handleUpdateField('linkedin', updated.linkedin)
              handleUpdateField('github', updated.github)
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
              handleUpdateField('summary', updated.summaryText)
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
                proficiency: 'Fluent',
              }
              handleUpdateField('languages', [...(resumeData?.languages || []), newLang])
            }}
            onDelete={(id) => {
              handleUpdateField(
                'languages',
                (resumeData?.languages || []).filter((item) => item.id !== id)
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
            onDelete={(id) => {
              handleUpdateField(
                'achievements',
                (resumeData?.achievements || []).filter((item) => item.id !== id)
              )
            }}
          />
        )}

        {activeSectionTab === 'custom' && <CustomSectionsSection />}

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
            onDelete={(id) => {
              handleUpdateField(
                'references',
                (resumeData?.references || []).filter((item) => item.id !== id)
              )
            }}
          />
        )}
      </div>

      {/* Left Editing Workspace Sticky Bottom Action Toolbar */}
      <div className="p-4 border-t border-white/10 bg-[#0b0c14] flex items-center justify-between gap-3">
        <button
          type="button"
          className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
        >
          Discard Changes
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
          >
            {isSaving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            type="button"
            onClick={() => onStepChange(Math.min(activeStep + 1, 8))}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-950/50 border border-purple-400/30 transition-all cursor-pointer active:scale-95"
          >
            <span>Save &amp; Continue</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
