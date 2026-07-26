import React, { useState, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { 
  Sliders, 
  FileText, 
  Briefcase, 
  Building2, 
  GraduationCap, 
  Globe, 
  Clock, 
  Layers, 
  Sparkles,
  CheckCircle2,
  Circle,
  Play
} from 'lucide-react'
import type { AdaptedResumeOption } from '@/lib/interview-adapter'

export interface InterviewSetupState {
  resumeId: string
  jobTitle: string
  companyName: string
  interviewType: 'HR' | 'Technical' | 'Behavioral' | 'Mixed'
  difficulty: 'Easy' | 'Medium' | 'Hard'
  experienceLevel: 'Fresher' | 'Junior' | 'Mid-Level' | 'Senior'
  language: string
  duration: '10' | '20' | '30' | '45'
}

export interface InterviewSetupCardProps {
  resumes?: AdaptedResumeOption[]
  setupState?: InterviewSetupState
  onSetupChange?: (newSetup: InterviewSetupState) => void
  onStartSession?: () => void
  isCreating?: boolean
}

export const InterviewSetupCard: React.FC<InterviewSetupCardProps> = ({
  resumes = [],
  setupState,
  onSetupChange,
  onStartSession,
  isCreating = false,
}) => {
  const [internalSetup, setInternalSetup] = useState<InterviewSetupState>({
    resumeId: '',
    jobTitle: 'Senior Full Stack Engineer',
    companyName: 'Google',
    interviewType: 'Technical',
    difficulty: 'Medium',
    experienceLevel: 'Senior',
    language: 'English (US)',
    duration: '20',
  })

  const setup = setupState ?? internalSetup

  const handleUpdate = (updates: Partial<InterviewSetupState>) => {
    const updated = { ...setup, ...updates }
    if (onSetupChange) {
      onSetupChange(updated)
    } else {
      setInternalSetup(updated)
    }
  }

  const interviewTypes = ['HR', 'Technical', 'Behavioral', 'Mixed'] as const
  const difficultyLevels = ['Easy', 'Medium', 'Hard'] as const
  const experienceLevels = ['Fresher', 'Junior', 'Mid-Level', 'Senior'] as const
  const durationOptions = [
    { value: '10', label: '10 Minutes' },
    { value: '20', label: '20 Minutes' },
    { value: '30', label: '30 Minutes' },
    { value: '45', label: '45 Minutes' },
  ] as const

  const checklist = useMemo(() => {
    return [
      { id: 'resume', label: 'Resume Profile Selected', complete: Boolean(setup.resumeId) },
      { id: 'role', label: 'Target Job Title Specified', complete: Boolean(setup.jobTitle.trim()) },
      { id: 'type', label: 'Interview Type Chosen', complete: Boolean(setup.interviewType) },
      { id: 'duration', label: 'Estimated Duration Confirmed', complete: Boolean(setup.duration) },
    ]
  }, [setup])

  const completedChecklistCount = checklist.filter((item) => item.complete).length
  const isFullyReady = completedChecklistCount === checklist.length

  return (
    <Card className="relative w-full overflow-hidden border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
      <CardHeader className="border-b border-[var(--border)] bg-[var(--surface-hover)]/30 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
              <Sliders className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-[var(--heading)]">
                Interview Setup & Configuration
              </CardTitle>
              <CardDescription className="text-xs text-[var(--muted)]">
                Define target role parameters and evaluation settings for your mock interview.
              </CardDescription>
            </div>
          </div>

          <Badge variant={isFullyReady ? 'success' : 'warning'} className="px-3 py-1 text-xs font-semibold">
            {isFullyReady ? 'Readiness 100% — Ready to Start' : `Readiness ${completedChecklistCount}/4 Required`}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        {/* Active Configuration Summary */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--primary)]/20 bg-[var(--primary)]/5 p-4 text-xs">
          <div className="flex items-center gap-2 font-medium text-[var(--body)]">
            <Sparkles className="h-4 w-4 text-[var(--primary)] shrink-0" aria-hidden="true" />
            <span>
              Active Preset: <strong className="text-[var(--heading)]">{setup.jobTitle || 'Target Role'}</strong>
              {setup.companyName ? ` at ${setup.companyName}` : ''} ({setup.interviewType} • {setup.difficulty} • {setup.duration} min)
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[var(--primary)] font-semibold">
            <Globe className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{setup.language}</span>
          </div>
        </div>

        {/* Group 1: Role & Resume Credentials */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
            1. Role & Resume Credentials
          </h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Resume Selector */}
            <div className="space-y-1.5">
              <label htmlFor="setup-resume-select" className="flex items-center gap-1.5 text-xs font-semibold text-[var(--heading)]">
                <FileText className="h-3.5 w-3.5 text-[var(--primary)]" aria-hidden="true" />
                Target Resume Profile
              </label>
              <select
                id="setup-resume-select"
                value={setup.resumeId}
                onChange={(e) => handleUpdate({ resumeId: e.target.value })}
                className="h-10 min-h-[44px] w-full rounded-[var(--radius-button)] border border-[var(--border)] bg-[var(--surface)] px-3 text-xs font-medium text-[var(--body)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 cursor-pointer"
              >
                <option value="">Select a resume profile...</option>
                {(resumes ?? []).map((res) => (
                  <option key={res.id} value={res.id}>
                    {res.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Job Title */}
            <div className="space-y-1.5">
              <label htmlFor="setup-job-title" className="flex items-center gap-1.5 text-xs font-semibold text-[var(--heading)]">
                <Briefcase className="h-3.5 w-3.5 text-[var(--primary)]" aria-hidden="true" />
                Job Title
              </label>
              <input
                id="setup-job-title"
                type="text"
                value={setup.jobTitle}
                onChange={(e) => handleUpdate({ jobTitle: e.target.value })}
                placeholder="e.g. Senior Frontend Engineer"
                className="h-10 min-h-[44px] w-full rounded-[var(--radius-button)] border border-[var(--border)] bg-[var(--surface)] px-3 text-xs text-[var(--body)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
              />
            </div>

            {/* Company Name */}
            <div className="space-y-1.5">
              <label htmlFor="setup-company-name" className="flex items-center gap-1.5 text-xs font-semibold text-[var(--heading)]">
                <Building2 className="h-3.5 w-3.5 text-[var(--primary)]" aria-hidden="true" />
                Company Name
              </label>
              <input
                id="setup-company-name"
                type="text"
                value={setup.companyName}
                onChange={(e) => handleUpdate({ companyName: e.target.value })}
                placeholder="e.g. Google, Amazon, Stripe"
                className="h-10 min-h-[44px] w-full rounded-[var(--radius-button)] border border-[var(--border)] bg-[var(--surface)] px-3 text-xs text-[var(--body)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
              />
            </div>
          </div>
        </div>

        {/* Group 2: Format & Difficulty */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
            2. Interview Format & Difficulty
          </h4>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Interview Type */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--heading)]">
                <Layers className="h-3.5 w-3.5 text-[var(--primary)]" aria-hidden="true" />
                Interview Type
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="radiogroup" aria-label="Interview Type Selection">
                {interviewTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    role="radio"
                    aria-checked={setup.interviewType === type}
                    onClick={() => handleUpdate({ interviewType: type })}
                    className={`flex h-10 min-h-[44px] items-center justify-center rounded-[var(--radius-button)] border text-xs font-semibold transition-all cursor-pointer ${
                      setup.interviewType === type
                        ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)] shadow-sm'
                        : 'border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:bg-[var(--surface-hover)]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Level */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--heading)]">
                <Sparkles className="h-3.5 w-3.5 text-[var(--primary)]" aria-hidden="true" />
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Difficulty Level Selection">
                {difficultyLevels.map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    role="radio"
                    aria-checked={setup.difficulty === diff}
                    onClick={() => handleUpdate({ difficulty: diff })}
                    className={`flex h-10 min-h-[44px] items-center justify-center rounded-[var(--radius-button)] border text-xs font-semibold transition-all cursor-pointer ${
                      setup.difficulty === diff
                        ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)] shadow-sm'
                        : 'border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:bg-[var(--surface-hover)]'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Readiness Checklist Card & Action Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-hover)]/20 p-4">
          <div className="space-y-2 flex-1">
            <h4 className="text-xs font-bold text-[var(--heading)]">
              Interview Readiness Checklist
            </h4>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs">
              {checklist.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  {item.complete ? (
                    <CheckCircle2 className="h-4 w-4 text-[var(--success)] shrink-0" aria-hidden="true" />
                  ) : (
                    <Circle className="h-4 w-4 text-[var(--muted)] shrink-0" aria-hidden="true" />
                  )}
                  <span className={item.complete ? 'font-medium text-[var(--heading)]' : 'text-[var(--muted)]'}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="primary"
            onClick={onStartSession}
            isLoading={isCreating}
            disabled={isCreating}
            className="h-10 min-h-[44px] gap-2 px-6 text-xs font-semibold cursor-pointer shadow-md"
          >
            <Play className="h-4 w-4 fill-current" aria-hidden="true" />
            <span>Save & Start Session</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default InterviewSetupCard
