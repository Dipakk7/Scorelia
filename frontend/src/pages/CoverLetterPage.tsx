import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/api/api'
import type { CoverLetterResponse } from '@/types/cover-letter'
import type { ResumeResponse } from '@/types/resume'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Loader } from '@/components/ui/Loader'
import { ErrorState } from '@/components/ui/ErrorState'
import { EmptyCoverLettersState } from '@/components/ui/EmptyState'
import { CoverLetterSkeleton } from '@/components/ui/Skeletons'
import { StatisticCard } from '@/components/ui/StatisticCard'
import TemplateSelector from '@/components/cover-letter/TemplateSelector'
import ExportDialog from '@/components/cover-letter/ExportDialog'
import CoverLetterCard from '@/components/cover-letter/CoverLetterCard'
import CoverLetterEditor from '@/components/cover-letter/CoverLetterEditor'
import CoverLetterHistory from '@/components/cover-letter/CoverLetterHistory'
import DeleteDialog from '@/components/ui/DeleteDialog'
import toast from 'react-hot-toast'
import {
  MailOpen,
  Plus,
  ArrowLeft,
  Briefcase,
  Building,
  Sparkles,
  Calendar,
  Activity,
  Download,
  AlertCircle,
  Loader2,
  Clock,
} from 'lucide-react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { cn } from '@/lib/utils'

export default function CoverLetterPage() {
  const queryClient = useQueryClient()

  // Navigation states: 'dashboard' | 'generate' | 'workspace'
  const [currentView, setCurrentView] = useState<'dashboard' | 'generate' | 'workspace'>('dashboard')
  const [selectedLetterId, setSelectedLetterId] = useState<string | null>(null)

  // Generator form states
  const [companyName, setCompanyName] = useState<string>('')
  const [jobTitle, setJobTitle] = useState<string>('')
  const [jobDescription, setJobDescription] = useState<string>('')
  const [resumeId, setResumeId] = useState<string>('')
  const [writingStyle, setWritingStyle] = useState<string>('PROFESSIONAL')
  const [experienceLevel, setExperienceLevel] = useState<
    'INTERNSHIP' | 'FRESHER' | 'EXPERIENCED' | 'EXECUTIVE' | 'TECHNICAL' | 'CAREER_CHANGE'
  >('EXPERIENCED')
  const [generationMode, setGenerationMode] = useState<'STANDARD' | 'FAST' | 'DETAILED'>('STANDARD')

  // Export Dialog States
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false)
  const [exportLetter, setExportLetter] = useState<CoverLetterResponse | null>(null)

  // Delete Dialog States
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false)
  const [deleteLetterId, setDeleteLetterId] = useState<string | null>(null)

  // Workspace compare states
  const [compareData, setCompareData] = useState<{ original: string; optimized: string } | null>(null)

  // Fetch resumes
  const { data: resumesData } = useQuery<{ resumes: ResumeResponse[]; total: number }>({
    queryKey: ['coverLetterResumes'],
    queryFn: async () => {
      const res = await api.get('/resumes')
      return res.data
    },
  })

  // Filter parsed resumes
  const parsedResumes = (resumesData?.resumes || []).filter((r) => r.status === 'PARSED')

  // Fetch cover letters history
  const {
    data: historyData,
    isLoading: historyLoading,
    error: historyError,
    refetch,
  } = useQuery<{ cover_letters: CoverLetterResponse[]; total: number }>({
    queryKey: ['coverLettersList'],
    queryFn: async () => {
      const res = await api.get('/ai/cover-letter/history')
      return res.data
    },
  })

  // Fetch individual cover letter details (when in workspace)
  const { data: activeLetter, isLoading: isActiveLoading } = useQuery<CoverLetterResponse>({
    queryKey: ['coverLetterDetail', selectedLetterId],
    queryFn: async () => {
      if (!selectedLetterId) return null
      const res = await api.get(`/ai/cover-letter/${selectedLetterId}`)
      return res.data
    },
    enabled: !!selectedLetterId,
  })

  // MUTATIONS

  // Generate cover letter mutation
  const generateMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        resume_id: resumeId,
        company_name: companyName.trim(),
        job_title: jobTitle.trim(),
        job_description: jobDescription.trim() || undefined,
        writing_style: writingStyle,
        experience_level: experienceLevel,
        generation_mode: generationMode,
      }
      const res = await api.post('/ai/cover-letter/generate', payload)
      return res.data
    },
    onSuccess: (data) => {
      toast.success('AI Cover Letter generated successfully!')
      queryClient.invalidateQueries({ queryKey: ['coverLettersList'] })
      setSelectedLetterId(data.id)
      setCurrentView('workspace')
      // Reset form
      setCompanyName('')
      setJobTitle('')
      setJobDescription('')
      setResumeId('')
    },
    onError: (err: any) => {
      console.error(err)
      const msg = err?.response?.data?.message || err?.message || 'Failed to generate cover letter.'
      toast.error(msg)
    },
  })

  // Delete cover letter mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/ai/cover-letter/${id}`)
      return res.data
    },
    onSuccess: () => {
      toast.success('Cover letter deleted successfully.')
      queryClient.invalidateQueries({ queryKey: ['coverLettersList'] })
      setIsDeleteOpen(false)
      setDeleteLetterId(null)
      if (selectedLetterId && deleteLetterId === selectedLetterId) {
        setSelectedLetterId(null)
        setCurrentView('dashboard')
      }
    },
    onError: (err: any) => {
      console.error(err)
      toast.error('Failed to delete cover letter.')
    },
  })

  // Tone options
  const writingStyles = [
    { value: 'PROFESSIONAL', label: 'Professional' },
    { value: 'MODERN', label: 'Modern & Bold' },
    { value: 'FORMAL', label: 'Formal / Academic' },
    { value: 'FRIENDLY', label: 'Friendly & Conversational' },
    { value: 'STARTUP', label: 'Startup Pitch style' },
    { value: 'EXECUTIVE', label: 'Executive Leadership' },
    { value: 'CONCISE', label: 'Concise & Short' },
    { value: 'ENTHUSIASTIC', label: 'Enthusiastic & Passionate' },
  ]

  // RENDER HELPERS

  const handleOpenExport = (letter: CoverLetterResponse) => {
    setExportLetter(letter)
    setIsExportOpen(true)
  }

  const handleOpenDelete = (id: string) => {
    setDeleteLetterId(id)
    setIsDeleteOpen(true)
  }

  const handleUpdateEditorContent = (newContent: string) => {
    // When editing locally, we sync to the cover letter metadata or save local storage
    if (activeLetter) {
      activeLetter.generated_content = newContent
      // Trigger a queries refresh
      queryClient.setQueryData(['coverLetterDetail', selectedLetterId], activeLetter)
    }
  }

  // Visual trend calculation: Count generated letters by month
  const getTrendData = () => {
    const letters = historyData?.cover_letters || []
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const counts: Record<string, number> = {}

    // Initialize last 6 months
    const d = new Date()
    for (let i = 5; i >= 0; i--) {
      const m = new Date(d.getFullYear(), d.getMonth() - i, 1)
      counts[months[m.getMonth()]] = 0
    }

    letters.forEach((cl) => {
      const date = new Date(cl.created_at)
      const monthName = months[date.getMonth()]
      if (counts[monthName] !== undefined) {
        counts[monthName]++
      }
    })

    return Object.entries(counts).map(([name, count]) => ({
      name,
      Count: count,
    }))
  }

  if (historyLoading) {
    return <CoverLetterSkeleton />
  }

  if (historyError) {
    return <ErrorState message="Failed to load cover letters. Verify FastAPI backend." onRetry={refetch} />
  }

  const coverLetters = historyData?.cover_letters || []
  const totalLetters = historyData?.total || 0
  const latestLetter = coverLetters[0] || null

  const recentActivities = coverLetters.slice(0, 4).map((cl) => ({
    title: `Generated cover letter for ${cl.job_title}`,
    time: new Date(cl.created_at).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    meta: cl.company_name,
  }))

  return (
    <div className="space-y-6 text-left animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-905 dark:text-white m-0">AI Cover Letter Builder</h1>
          <p className="text-xs text-slate-500 mt-1">Design and optimize tailored, ATS-friendly cover letters using your parsed resumes.</p>
        </div>

        {currentView === 'dashboard' && (
          <Button
            onClick={() => setCurrentView('generate')}
            disabled={parsedResumes.length === 0}
            className="gap-2 shadow-sm font-semibold text-xs cursor-pointer"
          >
            <Plus size={14} />
            <span>Generate New Letter</span>
          </Button>
        )}

        {currentView !== 'dashboard' && (
          <Button
            variant="outline"
            onClick={() => {
              setCurrentView('dashboard')
              setSelectedLetterId(null)
              setCompareData(null)
            }}
            className="gap-2 text-xs font-semibold cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Back to Dashboard</span>
          </Button>
        )}
      </div>

      {/* DASHBOARD VIEW */}
      {currentView === 'dashboard' && (
        <div className="space-y-6">
          {/* Stats & Trends Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Metrics column */}
            <div className="lg:col-span-4 flex flex-col justify-between gap-4">
              <StatisticCard
                title="Total Documents"
                value={totalLetters}
                description="Tailored letters generated"
                icon={MailOpen}
                className="flex-1 bg-white dark:bg-dark-card border-slate-200/80"
              />
              <Card className="flex-1 border-slate-200/80 dark:border-dark-border dark:bg-dark-card">
                <CardContent className="p-5 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Latest Document
                    </span>
                    <Badge variant="outline" className="text-[9px] font-sans">
                      Active
                    </Badge>
                  </div>
                  {latestLetter ? (
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white text-xs line-clamp-1">
                          {latestLetter.job_title}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-semibold">{latestLetter.company_name}</p>
                      </div>
                      <div className="flex justify-between items-center pt-2.5 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-[9px] text-slate-400">
                          {new Date(latestLetter.created_at).toLocaleDateString()}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedLetterId(latestLetter.id)
                            setCurrentView('workspace')
                          }}
                          className="h-7 text-[10px] font-bold cursor-pointer"
                        >
                          Open Workspace
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-400 italic">No documents generated yet.</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Middle Trend Chart */}
            <Card className="lg:col-span-5 border-slate-200/80 dark:border-dark-border dark:bg-dark-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} className="text-brand-500" />
                  <span>Document Generation Frequency</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getTrendData()} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="#888888" fontSize={9} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={9} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip
                      cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                      contentStyle={{
                        background: 'rgba(17,23,38,0.9)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '8px',
                        fontSize: '9px',
                      }}
                    />
                    <Bar dataKey="Count" fill="var(--color-brand-600)" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Right Activity List */}
            <Card className="lg:col-span-3 border-slate-200/80 dark:border-dark-border dark:bg-dark-card overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Clock size={14} className="text-emerald-500" />
                  <span>Recent activity logs</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {recentActivities.length > 0 ? (
                    recentActivities.map((act, i) => (
                      <div key={i} className="p-3.5 flex items-start justify-between gap-3 text-[10px]">
                        <div>
                          <p className="font-medium text-slate-850 dark:text-slate-200 line-clamp-1">{act.title}</p>
                          <span className="text-[9px] text-slate-450 mt-0.5 block">{act.meta}</span>
                        </div>
                        <span className="text-[8px] text-slate-400 shrink-0">{act.time}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-slate-400 italic text-[10px]">No recent generations logs.</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Parsed Resume Check warning */}
          {parsedResumes.length === 0 && (
            <div className="flex items-start gap-3 p-4 rounded-2xl border border-amber-250/50 bg-amber-500/5 text-amber-600">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <div className="space-y-0.5 text-xs">
                <h4 className="font-bold">No Parsed Resume Found!</h4>
                <p className="font-sans">
                  The AI Cover Letter builder requires a parsed resume to customize letters. Please upload and parse your resume in the{' '}
                  <a href="/resumes" className="underline font-bold">Resume Builder</a> first.
                </p>
              </div>
            </div>
          )}

          {/* History Documents Grid */}
          <div className="space-y-3.5">
            <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">Generated Document History</h3>
            {coverLetters.length === 0 ? (
              <EmptyCoverLettersState
                onAction={() => setCurrentView('generate')}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {coverLetters.map((cl) => (
                  <CoverLetterCard
                    key={cl.id}
                    coverLetter={cl}
                    onSelect={(id) => {
                      setSelectedLetterId(id)
                      setCurrentView('workspace')
                    }}
                    onDelete={handleOpenDelete}
                    onExport={handleOpenExport}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* GENERATE FORM VIEW */}
      {currentView === 'generate' && (
        <Card className="border-slate-200/80 dark:border-dark-border dark:bg-dark-card overflow-hidden">
          <CardContent className="p-6 space-y-6 text-left">
            <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Sparkles size={16} className="text-brand-500" />
              <span>Configure AI Tailored Cover Letter</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Job Title */}
              <div className="space-y-1.5">
                <label htmlFor="job-title" className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Target Job Title
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-400" />
                  <Input
                    id="job-title"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className="pl-10 text-xs dark:bg-dark-bg bg-slate-50 h-10 border-slate-200/70"
                    required
                  />
                </div>
              </div>

              {/* Company Name */}
              <div className="space-y-1.5">
                <label htmlFor="company-name" className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Company Name
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-400" />
                  <Input
                    id="company-name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. OpenAI"
                    className="pl-10 text-xs dark:bg-dark-bg bg-slate-50 h-10 border-slate-200/70"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Resume Selection */}
              <div className="space-y-1.5">
                <label htmlFor="resume-id" className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Select Source Resume
                </label>
                <select
                  id="resume-id"
                  value={resumeId}
                  onChange={(e) => setResumeId(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/65 dark:border-slate-800 rounded-lg p-2.5 h-10 text-slate-850 dark:text-slate-100 focus:outline-none focus:border-brand-500 cursor-pointer"
                  required
                >
                  <option value="">-- Choose Resume --</option>
                  {parsedResumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.original_filename} (Score: {r.ats_score || 'N/A'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Tone Style */}
              <div className="space-y-1.5">
                <label htmlFor="writing-style" className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Writing Style & Tone
                </label>
                <select
                  id="writing-style"
                  value={writingStyle}
                  onChange={(e) => setWritingStyle(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/65 dark:border-slate-800 rounded-lg p-2.5 h-10 text-slate-850 dark:text-slate-100 focus:outline-none focus:border-brand-500 cursor-pointer"
                >
                  {writingStyles.map((style) => (
                    <option key={style.value} value={style.value}>
                      {style.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Generation Mode */}
              <div className="space-y-1.5">
                <label htmlFor="generation-mode" className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Generation Detail Mode
                </label>
                <select
                  id="generation-mode"
                  value={generationMode}
                  onChange={(e: any) => setGenerationMode(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/65 dark:border-slate-800 rounded-lg p-2.5 h-10 text-slate-850 dark:text-slate-100 focus:outline-none focus:border-brand-500 cursor-pointer"
                >
                  <option value="STANDARD">Standard Audit (Optimal detail)</option>
                  <option value="FAST">Fast draft (Quick outline)</option>
                  <option value="DETAILED">Detailed optimize (Comprehensive & rich)</option>
                </select>
              </div>
            </div>

            {/* Template grid selector */}
            <TemplateSelector selectedId={experienceLevel} onChange={setExperienceLevel} />

            {/* Job Description */}
            <div className="space-y-1.5">
              <label htmlFor="job-desc" className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Target Job Description (Recommended)
              </label>
              <textarea
                id="job-desc"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the target job description here. The AI will cross-reference this description with your resume parsing data to align keywords, tech stack, and experience."
                className="w-full text-xs font-sans leading-relaxed text-slate-800 dark:text-slate-205 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 focus:border-brand-500 focus:outline-none rounded-xl p-4.5 resize-none min-h-[140px]"
              />
            </div>

            {/* Form actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-850">
              <Button
                variant="outline"
                onClick={() => setCurrentView('dashboard')}
                disabled={generateMutation.isPending}
                className="h-10 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={() => generateMutation.mutate()}
                disabled={generateMutation.isPending || !companyName || !jobTitle || !resumeId}
                className="gap-2 h-10 text-xs px-6 font-bold shadow-sm cursor-pointer"
              >
                {generateMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Writing Letter...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    <span>Write Cover Letter</span>
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* WORKSPACE VIEW */}
      {currentView === 'workspace' && (
        <div className="space-y-6">
          {isActiveLoading ? (
            <Loader label="Synchronizing Workspace details..." />
          ) : activeLetter ? (
            <div className="space-y-6">
              {/* Workspace Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-sans">
                    Active Editor Workspace
                  </span>
                  <h2 className="text-base font-bold font-display text-slate-900 dark:text-white line-clamp-1">
                    {activeLetter.job_title} at {activeLetter.company_name}
                  </h2>
                  <p className="text-[10px] text-slate-500 font-sans flex items-center gap-1">
                    <Calendar size={11} />
                    <span>Created: {new Date(activeLetter.created_at).toLocaleString()}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleOpenExport(activeLetter)}
                    className="h-9 gap-1.5 text-xs font-semibold cursor-pointer"
                  >
                    <Download size={13} />
                    <span>Export</span>
                  </Button>
                </div>
              </div>

              {/* Double Column workspace */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
                <div className={cn(compareData ? 'xl:col-span-12' : 'xl:col-span-9')}>
                  <CoverLetterEditor
                    coverLetter={activeLetter}
                    onUpdateContent={handleUpdateEditorContent}
                  />
                </div>

                {!compareData && (
                  <div className="xl:col-span-3">
                    <div className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border h-full">
                      <CoverLetterHistory
                        coverLetterId={activeLetter.id}
                        activeContent={activeLetter.generated_content || ''}
                        onRestore={(content) => {
                          handleUpdateEditorContent(content)
                          toast.success('Restored content draft!')
                        }}
                        onCompare={(original, optimized) => {
                          setCompareData({ original, optimized })
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Floating comparison view if active */}
              {compareData && (
                <Card className="border-slate-200/80 dark:border-dark-border dark:bg-dark-card">
                  <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="space-y-1 text-left">
                      <CardTitle className="text-xs font-bold text-slate-905 dark:text-white uppercase tracking-wider">
                        Document Version Comparison Viewer
                      </CardTitle>
                      <CardDescription className="text-[10px]">
                        Review edits between historical baseline and AI Optimized versions.
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCompareData(null)}
                      className="text-xs font-bold h-8 cursor-pointer"
                    >
                      Close Comparison
                    </Button>
                  </CardHeader>
                  <CardContent className="p-5">
                    <CoverLetterHistory
                      coverLetterId={activeLetter.id}
                      activeContent={activeLetter.generated_content || ''}
                      onRestore={(content) => {
                        handleUpdateEditorContent(content)
                        toast.success('Restored content draft!')
                      }}
                      onCompare={(original, optimized) => {
                        setCompareData({ original, optimized })
                      }}
                    />
                    <div className="mt-4">
                      <CoverLetterEditor
                        coverLetter={activeLetter}
                        onUpdateContent={handleUpdateEditorContent}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500">Document details not found.</div>
          )}
        </div>
      )}

      {/* EXPORT DIALOG */}
      {exportLetter && (
        <ExportDialog
          isOpen={isExportOpen}
          onClose={() => {
            setIsExportOpen(false)
            setExportLetter(null)
          }}
          coverLetterId={exportLetter.id}
          companyName={exportLetter.company_name}
          jobTitle={exportLetter.job_title}
          content={exportLetter.generated_content || ''}
        />
      )}

      <DeleteDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={async () => {
          if (deleteLetterId) {
            await deleteMutation.mutateAsync(deleteLetterId)
          }
        }}
        title="Delete Cover Letter?"
        description="This action cannot be undone. It will remove this cover letter and all optimization version history from the database."
      />
    </div>
  )
}
