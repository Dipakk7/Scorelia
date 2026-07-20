import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '@/api/api'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card, CardContent } from '@/components/ui/Card'
import { Slider } from '@/components/ui/Slider'
import type { ResumeResponse } from '@/types/resume'
import type { InterviewSessionCreate } from '@/types/interview'
import { Briefcase, Building, Settings, Play, Loader2 } from 'lucide-react'

interface InterviewSetupFormProps {
  onSubmit: (data: InterviewSessionCreate & { timeLimitMinutes: number }) => void
  isSubmitting?: boolean
}

export default function InterviewSetupForm({ onSubmit, isSubmitting }: InterviewSetupFormProps) {
  const [targetRole, setTargetRole] = useState<string>('Software Engineer')
  const [companyName, setCompanyName] = useState<string>('Google')
  const [interviewType, setInterviewType] = useState<
    'BEHAVIORAL' | 'TECHNICAL' | 'FIT' | 'HR' | 'SYSTEM_DESIGN' | 'RESUME_BASED' | 'MIXED'
  >('BEHAVIORAL')
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD' | 'ADAPTIVE'>('MEDIUM')
  const [totalQuestions, setTotalQuestions] = useState<number>(5)
  const [resumeId, setResumeId] = useState<string>('')
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number>(5)

  // Fetch resumes for resume selection
  const { data: resumesData, isLoading: resumesLoading } = useQuery<{ resumes: ResumeResponse[]; total: number }>({
    queryKey: ['interviewSetupResumes'],
    queryFn: async () => {
      const res = await api.get('/resumes')
      return res.data
    },
  })

  // Filter parsed resumes since we need parsing data for resume-based questions
  const parsedResumes = (resumesData?.resumes || []).filter((r) => r.status.toLowerCase() === 'parsed')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      target_role: targetRole.trim(),
      company_name: companyName.trim(),
      interview_type: interviewType,
      difficulty: difficulty,
      total_questions: totalQuestions,
      resume_id: resumeId || undefined,
      timeLimitMinutes: timeLimitMinutes,
      session_metadata: {
        time_limit_seconds: timeLimitMinutes * 60,
        configured_date: new Date().toISOString(),
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left font-sans text-xs">
      <Card className="border border-border bg-card/70 backdrop-blur-md rounded-2xl shadow-sm overflow-hidden hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300">
        <CardContent className="p-6 space-y-6">
          <h3 className="font-display font-black text-sm text-foreground flex items-center gap-2 pb-3 border-b border-border m-0">
            <Settings size={16} className="text-brand-500" />
            <span>Mock Interview Configuration Wizard</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Target Role */}
            <Input
              id="role"
              label="Target Job Title / Role"
              leftIcon={<Briefcase size={16} />}
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Frontend Engineer, Product Manager"
              required
            />

            {/* Company Name */}
            <Input
              id="company"
              label="Target Company Name"
              leftIcon={<Building size={16} />}
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Google, Netflix, Stripe"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Interview Type */}
            <Select
              id="type"
              label="Interview Domain Category"
              value={interviewType}
              onChange={(e: any) => setInterviewType(e.target.value)}
            >
              <option value="BEHAVIORAL">Behavioral / Leadership (STAR Method)</option>
              <option value="TECHNICAL">Technical Coding & Concept Core</option>
              <option value="SYSTEM_DESIGN">System Design & High Level Architecture</option>
              <option value="RESUME_BASED">Resume-Based Experience Drill</option>
              <option value="HR">HR Fit, Culture & General Motivation</option>
              <option value="MIXED">Mixed Round Robin (Behavioral + Tech)</option>
            </Select>

            {/* Difficulty Level */}
            <Select
              id="difficulty"
              label="Difficulty Level"
              value={difficulty}
              onChange={(e: any) => setDifficulty(e.target.value)}
            >
              <option value="EASY">Easy (Screening / Fundamental Concepts)</option>
              <option value="MEDIUM">Medium (Standard Industry Benchmarks)</option>
              <option value="HARD">Hard (FAANG / Core Specialized Focus)</option>
              <option value="ADAPTIVE">Adaptive (Scales based on answer score)</option>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Question count */}
            <Slider
              id="questions"
              label="Total Questions"
              min={3}
              max={10}
              step={1}
              value={totalQuestions}
              onChange={(e) => setTotalQuestions(parseInt(e.target.value))}
            />

            {/* Time limit */}
            <Slider
              id="time"
              label="Timer Limit (Minutes)"
              min={2}
              max={15}
              step={1}
              value={timeLimitMinutes}
              onChange={(e) => setTimeLimitMinutes(parseInt(e.target.value))}
            />

            {/* Resume Selection */}
            {resumesLoading ? (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold font-display uppercase tracking-wider text-muted-foreground">
                  Tailor with parsed Resume
                </label>
                <div className="h-10 flex items-center px-3 border border-border bg-slate-50/50 dark:bg-slate-900/60 rounded-xl">
                  <Loader2 size={14} className="animate-spin text-slate-400 mr-2" />
                  <span className="text-[10px] text-muted-foreground">Loading resumes...</span>
                </div>
              </div>
            ) : (
              <Select
                id="resume"
                label="Tailor with parsed Resume"
                value={resumeId}
                onChange={(e) => setResumeId(e.target.value)}
              >
                <option value="">-- No resume mapping (Uses general model defaults) --</option>
                {parsedResumes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.original_filename} (Score: {r.ats_score || 'N/A'})
                  </option>
                ))}
              </Select>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-1">
        <Button
          type="submit"
          disabled={isSubmitting || resumesLoading}
          className="flex items-center justify-center gap-1.5 px-5 py-2.5 font-bold cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-brand-500/10 border-none rounded-xl transition-all duration-200 text-xs h-10"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Simulating...</span>
            </>
          ) : (
            <>
              <Play size={14} className="animate-pulse" />
              <span>Start Mock Session</span>
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
