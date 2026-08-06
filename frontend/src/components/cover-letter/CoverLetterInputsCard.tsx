import React, { useState, useMemo } from 'react'
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
  Clipboard,
  Trash2,
  CheckCircle2,
  SlidersHorizontal,
  Target,
  Wand2,
} from 'lucide-react'
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

  const activeResume = safeResumes.find((r) => r.id === selectedResumeId) ?? safeResumes[0]

  // Extracted skills dynamically derived from job description
  const detectedSkills = useMemo(() => {
    const text = jobDescription.toLowerCase()
    const candidates = [
      'python', 'pytorch', 'tensorflow', 'react', 'typescript', 'machine learning',
      'system architecture', 'aws', 'docker', 'kubernetes', 'node.js', 'sql',
      'communication', 'leadership', 'agile', 'ci/cd', 'rest api', 'nlp'
    ]
    return candidates.filter((skill) => text.includes(skill.toLowerCase()))
  }, [jobDescription])

  const handlePasteClipboard = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText()
      if (clipboardText) {
        setJobDescription(clipboardText)
      }
    } catch {
      // Clipboard fallback
    }
  }

  const handleLoadSampleJD = () => {
    setCompanyName(defaultJob.company)
    setJobTitle(defaultJob.jobTitle)
    setHiringManager(defaultJob.hiringManager)
    setJobDescription(defaultJob.description)
  }

  const handleClearJD = () => {
    setJobDescription('')
  }

  return (
    <div className="rounded-2xl bg-[#121426] border border-white/10 bg-gradient-to-r from-[#14162a] via-[#111324] to-[#14162a] p-4 sm:p-6 shadow-lg shadow-purple-950/10 space-y-6 text-left transition-all">
      {/* Studio Header & Reset Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight m-0">
              Setup & Targeting Studio
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
              5-Step Setup
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium m-0 mt-1">
            Configure your source resume, target job posting, and preferred writing style.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLoadSampleJD}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-purple-300 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 transition-all cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
          <span>Load Sample Job</span>
        </button>
      </div>

      {/* STEP 1: SOURCE RESUME SELECTION */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="setup-resume-select" className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-extrabold">1</span>
            <span>Source Resume</span>
          </label>
          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
            ATS Score: {activeResume?.score ?? 86}%
          </span>
        </div>

        <div className="relative">
          <select
            id="setup-resume-select"
            value={selectedResumeId}
            onChange={(e) => setSelectedResumeId(e.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-700/80 bg-slate-900/90 px-4 py-3 text-xs font-semibold text-white shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none cursor-pointer pr-10"
          >
            {safeResumes.map((res) => (
              <option key={res.id} value={res.id} className="bg-slate-900 text-white">
                {res.title} — ATS Score: {res.score}% ({res.updatedAt})
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3.5 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* STEP 2: TARGET ORGANIZATION & POSITION */}
      <div className="space-y-2 pt-1">
        <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-extrabold">2</span>
          <span>Target Organization & Role</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Company Name */}
          <div className="space-y-1.5">
            <label htmlFor="setup-company-input" className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-indigo-400" />
              <span>Company Name *</span>
            </label>
            <input
              id="setup-company-input"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Google, Stripe, Microsoft"
              className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3.5 py-2.5 text-xs font-semibold text-white placeholder-slate-500 shadow-sm focus:border-purple-500 focus:outline-none"
            />
            {/* Suggestion Chips */}
            <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
              <span className="text-[10px] text-slate-500 font-medium">Quick Suggestions:</span>
              {['Google', 'Microsoft', 'Stripe', 'OpenAI'].map((comp) => (
                <button
                  key={comp}
                  type="button"
                  onClick={() => setCompanyName(comp)}
                  className="text-[10px] font-bold text-slate-400 hover:text-purple-300 hover:bg-purple-500/20 px-2 py-0.5 rounded-md border border-slate-800 transition-colors cursor-pointer bg-transparent"
                >
                  + {comp}
                </button>
              ))}
            </div>
          </div>

          {/* Job Title */}
          <div className="space-y-1.5">
            <label htmlFor="setup-job-title-input" className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
              <span>Target Job Title *</span>
            </label>
            <input
              id="setup-job-title-input"
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior AI/ML Engineer"
              className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3.5 py-2.5 text-xs font-semibold text-white placeholder-slate-500 shadow-sm focus:border-purple-500 focus:outline-none"
            />
            {/* Suggestion Chips */}
            <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
              <span className="text-[10px] text-slate-500 font-medium">Suggestions:</span>
              {['AI Engineer', 'Frontend Lead', 'Product Manager'].map((title) => (
                <button
                  key={title}
                  type="button"
                  onClick={() => setJobTitle(title)}
                  className="text-[10px] font-bold text-slate-400 hover:text-purple-300 hover:bg-purple-500/20 px-2 py-0.5 rounded-md border border-slate-800 transition-colors cursor-pointer bg-transparent"
                >
                  + {title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* STEP 3: TARGET JOB DESCRIPTION (HERO INPUT) */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <label htmlFor="setup-jd-textarea" className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-extrabold">3</span>
            <span>Target Job Description (Hero Input)</span>
          </label>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 bg-slate-900 px-2.5 py-0.5 rounded-lg border border-slate-800">
              {jobDescription.length} chars
            </span>
            <button
              type="button"
              onClick={handlePasteClipboard}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-300 hover:text-white bg-slate-900 hover:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700/80 transition-colors cursor-pointer"
            >
              <Clipboard className="w-3 h-3 text-purple-400" />
              <span>Paste Clipboard</span>
            </button>
            {jobDescription && (
              <button
                type="button"
                onClick={handleClearJD}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-2.5 py-1 rounded-lg border border-rose-500/20 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Hero Textarea Container */}
        <div className="relative">
          <textarea
            id="setup-jd-textarea"
            rows={7}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste target job description details here. Include key responsibilities, qualifications, and required technical skills for optimal AI tailoring..."
            className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 p-4 text-xs font-medium text-slate-100 placeholder-slate-500 shadow-inner focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none leading-relaxed resize-none font-mono"
          />
        </div>

        {/* Dynamic Skill Extractor Bar */}
        {detectedSkills.length > 0 && (
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                <span>Extracted Key Competencies ({detectedSkills.length})</span>
              </span>
              <span className="text-emerald-400 text-[10px]">Auto-Detected</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {detectedSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 capitalize"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>{skill}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* STEP 4: WRITING TONE & PREFERENCES */}
      <div className="space-y-2 pt-1">
        <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-extrabold">4</span>
          <span>Writing Style & Personalization</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Tone */}
          <div className="space-y-1">
            <label htmlFor="setup-tone-select" className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Writing Tone
            </label>
            <div className="relative">
              <select
                id="setup-tone-select"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-700/80 bg-slate-900/90 px-3 py-2 text-xs font-semibold text-white shadow-sm focus:border-purple-500 focus:outline-none cursor-pointer pr-7"
              >
                <option value="Professional">Professional</option>
                <option value="Persuasive">Persuasive</option>
                <option value="Executive">Executive</option>
                <option value="Enthusiastic">Enthusiastic</option>
                <option value="Formal">Formal</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-1">
            <label htmlFor="setup-exp-select" className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Experience Level
            </label>
            <div className="relative">
              <select
                id="setup-exp-select"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-700/80 bg-slate-900/90 px-3 py-2 text-xs font-semibold text-white shadow-sm focus:border-purple-500 focus:outline-none cursor-pointer pr-7"
              >
                <option value="Fresher">Fresher / Graduate</option>
                <option value="Internship">Internship</option>
                <option value="Mid-Level">Mid-Level (2-5 yrs)</option>
                <option value="Senior">Senior (5+ yrs)</option>
                <option value="Executive">Executive / Lead</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Language */}
          <div className="space-y-1">
            <label htmlFor="setup-lang-select" className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Globe className="w-3 h-3 text-slate-400" />
              <span>Language</span>
            </label>
            <div className="relative">
              <select
                id="setup-lang-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-700/80 bg-slate-900/90 px-3 py-2 text-xs font-semibold text-white shadow-sm focus:border-purple-500 focus:outline-none cursor-pointer pr-7"
              >
                <option value="English (US)">English (US)</option>
                <option value="English (UK)">English (UK)</option>
                <option value="Spanish">Spanish</option>
                <option value="German">German</option>
                <option value="French">French</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Hiring Manager */}
          <div className="space-y-1">
            <label htmlFor="setup-hiring-manager" className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-slate-400" />
              <span>Hiring Manager</span>
            </label>
            <input
              id="setup-hiring-manager"
              type="text"
              value={hiringManager}
              onChange={(e) => setHiringManager(e.target.value)}
              placeholder="e.g. Dr. Sarah Jenkins"
              className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3 py-2 text-xs font-semibold text-white placeholder-slate-500 shadow-sm focus:border-purple-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* STEP 5: EXECUTIVE PRIMARY CTA */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating || !jobDescription.trim()}
          className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl text-sm font-extrabold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 shadow-xl shadow-purple-600/30 border border-purple-500/30 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating Tailored Cover Letter...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-purple-200 animate-pulse" />
              <span>Generate Cover Letter & Proceed to Writing Studio</span>
              <Wand2 className="w-4 h-4 text-purple-200 ml-1" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default CoverLetterInputsCard
