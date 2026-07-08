import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '@/api/api'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import type { ResumeResponse } from '@/types/resume'
import type { InterviewSessionCreate } from '@/types/interview'
import { Briefcase, Building, Settings, Play, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

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
  const parsedResumes = (resumesData?.resumes || []).filter((r) => r.status === 'PARSED')

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
      <Card className="border border-slate-205 dark:border-slate-855 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl shadow-sm overflow-hidden hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300">
        <CardContent className="p-6 space-y-6">
          <h3 className="font-display font-black text-sm text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 m-0">
            <Settings size={16} className="text-brand-500" />
            <span>Mock Interview Configuration Wizard</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Target Role */}
            <div className="space-y-1.5">
              <label htmlFor="role" className="block text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest leading-none">
                Target Job Title / Role
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400" />
                <Input
                  id="role"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Frontend Engineer, Product Manager"
                  className="pl-10 text-xs bg-slate-50/50 dark:bg-slate-900/60 border border-slate-250 dark:border-slate-800 rounded-xl p-2.5 h-10 text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Company Name */}
            <div className="space-y-1.5">
              <label htmlFor="company" className="block text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest leading-none">
                Target Company Name
              </label>
              <div className="relative">
                <Building className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400" />
                <Input
                  id="company"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Google, Netflix, Stripe"
                  className="pl-10 text-xs bg-slate-50/50 dark:bg-slate-900/60 border border-slate-250 dark:border-slate-800 rounded-xl p-2.5 h-10 text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Interview Type */}
            <div className="space-y-1.5">
              <label htmlFor="type" className="block text-[10px] font-black text-slate-455 dark:text-slate-505 uppercase tracking-widest leading-none">
                Interview Domain Category
              </label>
              <select
                id="type"
                value={interviewType}
                onChange={(e: any) => setInterviewType(e.target.value)}
                className="w-full text-xs bg-slate-50/50 dark:bg-slate-900/60 border border-slate-250 dark:border-slate-800 rounded-xl p-2.5 h-10 text-slate-855 dark:text-slate-205 focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer transition-colors"
              >
                <option value="BEHAVIORAL">Behavioral / Leadership (STAR Method)</option>
                <option value="TECHNICAL">Technical Coding & Concept Core</option>
                <option value="SYSTEM_DESIGN">System Design & High Level Architecture</option>
                <option value="RESUME_BASED">Resume-Based Experience Drill</option>
                <option value="HR">HR Fit, Culture & General Motivation</option>
                <option value="MIXED">Mixed Round Robin (Behavioral + Tech)</option>
              </select>
            </div>

            {/* Difficulty Level */}
            <div className="space-y-1.5">
              <label htmlFor="difficulty" className="block text-[10px] font-black text-slate-455 dark:text-slate-505 uppercase tracking-widest leading-none">
                Difficulty Level
              </label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e: any) => setDifficulty(e.target.value)}
                className="w-full text-xs bg-slate-50/50 dark:bg-slate-900/60 border border-slate-250 dark:border-slate-800 rounded-xl p-2.5 h-10 text-slate-855 dark:text-slate-205 focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer transition-colors"
              >
                <option value="EASY">Easy (Screening / Fundamental Concepts)</option>
                <option value="MEDIUM">Medium (Standard Industry Benchmarks)</option>
                <option value="HARD">Hard (FAANG / Core Specialized Focus)</option>
                <option value="ADAPTIVE">Adaptive (Scales based on answer score)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Question count */}
            <div className="space-y-1.5">
              <label htmlFor="questions" className="block text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest leading-none">
                Total Question Count ({totalQuestions})
              </label>
              <input
                id="questions"
                type="range"
                min="3"
                max="10"
                step="1"
                value={totalQuestions}
                onChange={(e) => setTotalQuestions(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600 mt-2"
              />
              <span className="text-[10px] text-slate-450 dark:text-slate-500 block text-right mt-1 font-bold">{totalQuestions} questions</span>
            </div>

            {/* Time limit */}
            <div className="space-y-1.5">
              <label htmlFor="time" className="block text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest leading-none">
                Timer Limit: {timeLimitMinutes} min ({timeLimitMinutes * 60}s)
              </label>
              <input
                id="time"
                type="range"
                min="2"
                max="15"
                step="1"
                value={timeLimitMinutes}
                onChange={(e) => setTimeLimitMinutes(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600 mt-2"
              />
              <span className="text-[10px] text-slate-450 dark:text-slate-500 block text-right mt-1 font-bold">{timeLimitMinutes} minutes total</span>
            </div>

            {/* Resume Selection */}
            <div className="space-y-1.5">
              <label htmlFor="resume" className="block text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest leading-none">
                Tailor with parsed Resume
              </label>
              {resumesLoading ? (
                <div className="h-10 flex items-center px-3 border border-slate-250 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 rounded-xl">
                  <Loader2 size={14} className="animate-spin text-slate-400 mr-2" />
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Loading resumes...</span>
                </div>
              ) : (
                <select
                  id="resume"
                  value={resumeId}
                  onChange={(e) => setResumeId(e.target.value)}
                  className="w-full text-xs bg-slate-50/50 dark:bg-slate-900/60 border border-slate-250 dark:border-slate-800 rounded-xl p-2.5 h-10 text-slate-855 dark:text-slate-205 focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer transition-colors"
                >
                  <option value="">-- No resume mapping (Uses general model defaults) --</option>
                  {parsedResumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.original_filename} (Score: {r.ats_score || 'N/A'})
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-1">
        <Button
          type="submit"
          disabled={isSubmitting || resumesLoading}
          className="flex items-center justify-center gap-1.5 px-5 py-2.5 font-bold cursor-pointer bg-gradient-to-r from-brand-600 to-indigo-650 hover:from-brand-700 hover:to-indigo-700 text-white shadow-sm shadow-brand-500/10 border-none rounded-xl transition-all duration-200 text-xs h-10"
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
