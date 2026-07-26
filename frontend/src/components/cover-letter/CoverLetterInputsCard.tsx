import React, { useState } from 'react'
import {
  RefreshCw,
  Building,
  Briefcase,
  UserCheck,
  Globe,
  Sparkles,
  FileText,
  ChevronDown,
  Loader2,
} from 'lucide-react'
import PlaceholderCard from './PlaceholderCard'
import { mockJobDescriptions } from '@/lib/cover-letter-mock-data'
import { type AdaptedResumeOption } from '@/lib/cover-letter-adapter'

export interface CoverLetterInputsCardProps {
  resumes?: AdaptedResumeOption[]
  isGenerating?: boolean
  onStartGeneration?: () => void
  onGenerateClick?: (formData: {
    resumeId: string
    companyName: string
    jobTitle: string
    hiringManager: string
    jobDescription: string
    tone: string
    experienceLevel: string
    language: string
  }) => void
}

export const CoverLetterInputsCard: React.FC<CoverLetterInputsCardProps> = ({
  resumes = [],
  isGenerating = false,
  onStartGeneration,
  onGenerateClick,
}) => {
  const defaultJob = mockJobDescriptions[0]
  const [selectedResumeId, setSelectedResumeId] = useState(resumes[0]?.id ?? 'res-1')
  const [companyName, setCompanyName] = useState(defaultJob.company)
  const [jobTitle, setJobTitle] = useState(defaultJob.jobTitle)
  const [hiringManager, setHiringManager] = useState(defaultJob.hiringManager)
  const [jobDescription, setJobDescription] = useState(defaultJob.description)
  const [tone, setTone] = useState(defaultJob.tone)
  const [experienceLevel, setExperienceLevel] = useState(defaultJob.experienceLevel)
  const [language, setLanguage] = useState(defaultJob.language)
  const [showFullDesc, setShowFullDesc] = useState(false)

  const handleGenerate = () => {
    onStartGeneration?.()
    onGenerateClick?.({
      resumeId: selectedResumeId,
      companyName,
      jobTitle,
      hiringManager,
      jobDescription,
      tone,
      experienceLevel,
      language,
    })
  }

  const safeResumes = resumes.length > 0 ? resumes : [
    { id: 'res-1', title: 'Dipak_Khandagale_AI_Engineer.pdf', score: 86, updatedAt: 'Updated 2 days ago' },
  ]

  return (
    <PlaceholderCard
      title="Cover Letter Inputs"
      description="Configure target position and resume preferences to tailor your cover letter."
      action={
        <button
          type="button"
          onClick={() => {
            setCompanyName(defaultJob.company)
            setJobTitle(defaultJob.jobTitle)
            setHiringManager(defaultJob.hiringManager)
            setJobDescription(defaultJob.description)
            setTone('Professional')
            setExperienceLevel('Fresher')
            setLanguage('English (US)')
          }}
          className="text-xs font-semibold text-[var(--primary)] hover:underline cursor-pointer bg-transparent border-none p-0 flex items-center gap-1"
        >
          <RefreshCw size={12} />
          <span>Reset Defaults</span>
        </button>
      }
      className="space-y-4"
    >
      <div className="space-y-4 text-xs">
        {/* Row 1: Source Resume & Company Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Source Resume Dropdown */}
          <div className="space-y-1.5 text-left">
            <label htmlFor="resume-select-p5" className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1">
              <FileText size={11} className="text-[var(--primary)]" />
              <span>Source Resume</span>
            </label>
            <div className="relative">
              <select
                id="resume-select-p5"
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40 px-3.5 py-2.5 text-xs font-semibold text-[var(--heading)] shadow-sm focus:border-[var(--primary)] focus:outline-none cursor-pointer pr-8"
              >
                {safeResumes.map((res) => (
                  <option key={res.id} value={res.id}>
                    {res.title} (ATS Score: {res.score})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 h-3.5 w-3.5 text-[var(--muted)] pointer-events-none" />
            </div>
          </div>

          {/* Company Name */}
          <div className="space-y-1.5 text-left">
            <label htmlFor="company-name-input-p5" className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1">
              <Building size={11} className="text-[var(--primary)]" />
              <span>Company Name</span>
            </label>
            <input
              id="company-name-input-p5"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Google"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40 px-3.5 py-2 text-xs font-semibold text-[var(--heading)] shadow-sm focus:border-[var(--primary)] focus:outline-none"
            />
          </div>
        </div>

        {/* Row 2: Target Job Title & Hiring Manager */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Job Title */}
          <div className="space-y-1.5 text-left">
            <label htmlFor="job-title-input-p5" className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1">
              <Briefcase size={11} className="text-[var(--primary)]" />
              <span>Target Job Title</span>
            </label>
            <input
              id="job-title-input-p5"
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. AI/ML Engineer"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40 px-3.5 py-2 text-xs font-semibold text-[var(--heading)] shadow-sm focus:border-[var(--primary)] focus:outline-none"
            />
          </div>

          {/* Hiring Manager (Optional) */}
          <div className="space-y-1.5 text-left">
            <label htmlFor="hiring-manager-input-p5" className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1">
              <UserCheck size={11} className="text-[var(--primary)]" />
              <span>Hiring Manager (Optional)</span>
            </label>
            <input
              id="hiring-manager-input-p5"
              type="text"
              value={hiringManager}
              onChange={(e) => setHiringManager(e.target.value)}
              placeholder="e.g. Hiring Manager or Dr. Sarah Jenkins"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40 px-3.5 py-2 text-xs font-semibold text-[var(--heading)] shadow-sm focus:border-[var(--primary)] focus:outline-none"
            />
          </div>
        </div>

        {/* Row 3: Target Job Description Textarea */}
        <div className="space-y-1.5 text-left">
          <div className="flex items-center justify-between">
            <label htmlFor="job-desc-textarea-p5" className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1">
              <FileText size={11} className="text-[var(--primary)]" />
              <span>Job Description Input Area</span>
            </label>
            <span className="text-[10px] font-semibold text-[var(--muted)]">
              {(jobDescription ?? '').length} characters
            </span>
          </div>
          <textarea
            id="job-desc-textarea-p5"
            rows={showFullDesc ? 6 : 3}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste target job description here..."
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40 p-3 text-xs font-medium text-[var(--body)] shadow-sm focus:border-[var(--primary)] focus:outline-none leading-relaxed resize-none"
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowFullDesc(!showFullDesc)}
              className="text-[11px] font-semibold text-[var(--primary)] hover:underline cursor-pointer bg-transparent border-none p-0"
            >
              {showFullDesc ? 'Collapse text area' : 'Expand text area'}
            </button>
          </div>
        </div>

        {/* Row 4: Selectors (Tone, Experience Level, Language) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
          {/* Tone Selector */}
          <div className="space-y-1 text-left">
            <label htmlFor="tone-select-inputs-p5" className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--muted)] block">
              Writing Tone
            </label>
            <div className="relative">
              <select
                id="tone-select-inputs-p5"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40 px-3 py-2 text-xs font-semibold text-[var(--heading)] shadow-sm focus:border-[var(--primary)] focus:outline-none cursor-pointer pr-7"
              >
                <option value="Professional">Professional</option>
                <option value="Persuasive">Persuasive</option>
                <option value="Enthusiastic">Enthusiastic</option>
                <option value="Formal">Formal</option>
                <option value="Executive">Executive</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-[var(--muted)] pointer-events-none" />
            </div>
          </div>

          {/* Experience Level */}
          <div className="space-y-1 text-left">
            <label htmlFor="experience-select-inputs-p5" className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--muted)] block">
              Experience Level
            </label>
            <div className="relative">
              <select
                id="experience-select-inputs-p5"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40 px-3 py-2 text-xs font-semibold text-[var(--heading)] shadow-sm focus:border-[var(--primary)] focus:outline-none cursor-pointer pr-7"
              >
                <option value="Fresher">Fresher / Graduate</option>
                <option value="Internship">Internship</option>
                <option value="Mid-Level">Mid-Level (2-5 yrs)</option>
                <option value="Senior">Senior (5+ yrs)</option>
                <option value="Executive">Executive / Lead</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-[var(--muted)] pointer-events-none" />
            </div>
          </div>

          {/* Language Selector */}
          <div className="space-y-1 text-left">
            <label htmlFor="language-select-inputs-p5" className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1">
              <Globe size={10} className="text-[var(--muted)]" />
              <span>Language</span>
            </label>
            <div className="relative">
              <select
                id="language-select-inputs-p5"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40 px-3 py-2 text-xs font-semibold text-[var(--heading)] shadow-sm focus:border-[var(--primary)] focus:outline-none cursor-pointer pr-7"
              >
                <option value="English (US)">English (US)</option>
                <option value="English (UK)">English (UK)</option>
                <option value="Spanish">Spanish</option>
                <option value="German">German</option>
                <option value="French">French</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-[var(--muted)] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="pt-3">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-extrabold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white shadow-md hover:opacity-95 transition-all cursor-pointer border-none disabled:opacity-75"
          >
            {isGenerating ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>Generating Cover Letter...</span>
              </>
            ) : (
              <>
                <Sparkles size={15} className="animate-pulse" />
                <span>Generate Tailored Cover Letter</span>
              </>
            )}
          </button>
        </div>
      </div>
    </PlaceholderCard>
  )
}

export default CoverLetterInputsCard
