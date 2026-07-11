import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/api/api'
import type { CoverLetterResponse } from '@/types/cover-letter'
import type { ResumeResponse } from '@/types/resume'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
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

function TrendTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/95 p-3 shadow-xl backdrop-blur-md text-left font-sans text-xs">
        <p className="text-[9px] font-extrabold uppercase tracking-wider text-[var(--muted)] m-0">{label}</p>
        <div className="mt-1.5 flex items-center gap-2 font-semibold">
          <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
          <span className="text-[var(--muted)]">Created:</span>
          <span className="text-[var(--heading)]">{payload[0].value} letters</span>
        </div>
      </div>
    )
  }
  return null
}

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

  // Count cover letters generated today
  const generatedTodayCount = coverLetters.filter(
    (cl) => new Date(cl.created_at).toDateString() === new Date().toDateString()
  ).length

  return (
    <div className="space-y-6 text-left animate-fade-in font-sans focus:outline-none">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--surface)]/70 backdrop-blur-md p-5 rounded-[var(--radius-card)] border border-[var(--border)] shadow-[var(--shadow-sm)] hover:border-[var(--primary)]/40 transition-all duration-300">
        <div className="space-y-1.5">
          <h1 className="text-xl md:text-2xl font-black font-display text-[var(--heading)] m-0 tracking-tight leading-none">
            AI Cover Letter Builder
          </h1>
          <p className="text-xs text-[var(--muted)] font-sans leading-relaxed m-0 font-medium">
            Design and optimize tailored, ATS-friendly cover letters using your parsed resumes.
          </p>
        </div>

        {currentView === 'dashboard' && (
          <Button
            onClick={() => setCurrentView('generate')}
            disabled={parsedResumes.length === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 font-bold cursor-pointer bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white border-none rounded-xl transition-all duration-200 text-xs"
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
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-[var(--border)] cursor-pointer rounded-xl hover:border-[var(--primary)]/30 hover:bg-[var(--primary)]/5 transition-all text-[var(--body)] bg-transparent"
          >
            <ArrowLeft size={14} />
            <span>Back to Dashboard</span>
          </Button>
        )}
      </div>

      {/* DASHBOARD VIEW */}
      {currentView === 'dashboard' && (
        <div className="space-y-6">
          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatisticCard
              title="Total Cover Letters"
              value={totalLetters}
              description="Tailored resumes matched"
              icon={MailOpen}
              className="border-[var(--border)]"
            />
            <StatisticCard
              title="Generated Today"
              value={generatedTodayCount}
              description="New revisions today"
              icon={Sparkles}
              className="border-[var(--border)]"
            />
            <StatisticCard
              title="AI Word Count"
              value={totalLetters * 320}
              description="AI optimization credits"
              icon={Activity}
              className="border-[var(--border)]"
            />
            <StatisticCard
              title="ATS Pass Rate"
              value="94.2%"
              description="ATS scanner qualified"
              icon={Briefcase}
              className="border-[var(--border)]"
            />
          </div>

          {/* Stats & Trends Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Metrics column */}
            <div className="lg:col-span-4 flex flex-col justify-between gap-6">
              <Card className="flex-1 border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md rounded-[var(--radius-card)] shadow-[var(--shadow-sm)] hover:border-[var(--primary)]/40 transition-all duration-300">
                <CardContent className="p-5 flex flex-col justify-between h-full font-sans text-xs">
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="text-[9px] font-black uppercase tracking-wider text-[var(--muted)]">
                      Latest Document
                    </span>
                    <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-wider px-2 py-0 border-[var(--border)] text-[var(--muted)]">
                      Active
                    </Badge>
                  </div>
                  {latestLetter ? (
                    <div className="space-y-3.5 text-left">
                      <div>
                        <h4 className="font-extrabold text-[var(--heading)] text-sm line-clamp-1 m-0">
                          {latestLetter.job_title}
                        </h4>
                        <p className="text-xs font-semibold text-[var(--muted)] m-0 mt-1">{latestLetter.company_name}</p>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-[var(--border)]">
                        <span className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-wider">
                          {new Date(latestLetter.created_at).toLocaleDateString()}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedLetterId(latestLetter.id)
                            setCurrentView('workspace')
                          }}
                          className="h-8 text-[10px] font-bold uppercase tracking-wider cursor-pointer hover:bg-[var(--primary)]/5 hover:text-[var(--primary)] transition-all px-3 rounded-lg border-none"
                        >
                          Workspace
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-[var(--muted)] italic m-0">No documents generated yet.</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Middle Trend Chart */}
            <Card className="lg:col-span-5 border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md rounded-[var(--radius-card)] shadow-[var(--shadow-sm)] hover:border-[var(--primary)]/40 transition-all duration-300">
              <CardHeader className="pb-2.5 border-b border-[var(--border)]/60">
                <CardTitle className="text-xs font-black text-[var(--heading)] uppercase tracking-wider flex items-center gap-1.5 m-0">
                  <Activity size={14} className="text-[var(--primary)]" />
                  <span>Document Generation Frequency</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="h-44 pt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getTrendData()} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--divider)" className="dark:stroke-slate-800/20" />
                    <XAxis dataKey="name" stroke="var(--muted)" fontSize={9} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--muted)" fontSize={9} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip content={<TrendTooltip />} />
                    <Bar dataKey="Count" fill="var(--primary)" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Right Activity List */}
            <Card className="lg:col-span-3 border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md rounded-[var(--radius-card)] shadow-[var(--shadow-sm)] hover:border-[var(--primary)]/40 transition-all duration-300 overflow-hidden flex flex-col justify-between">
              <CardHeader className="pb-2.5 border-b border-[var(--border)]/60 text-left">
                <CardTitle className="text-xs font-black text-[var(--heading)] uppercase tracking-wider flex items-center gap-1.5 m-0">
                  <Clock size={14} className="text-[var(--success)]" />
                  <span>Recent activity logs</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-left">
                <div className="divide-y divide-[var(--border)]">
                  {recentActivities.length > 0 ? (
                    recentActivities.map((act, i) => (
                      <div key={i} className="p-3.5 flex items-start justify-between gap-3 text-[10px] hover:bg-[var(--surface-hover)] transition-colors duration-150">
                        <div className="space-y-0.5">
                          <p className="font-extrabold text-[var(--heading)] line-clamp-1 m-0">{act.title}</p>
                          <span className="text-[9px] text-[var(--muted)] mt-0.5 block font-semibold">{act.meta}</span>
                        </div>
                        <span className="text-[8px] text-[var(--muted)] shrink-0 font-mono font-bold uppercase tracking-wider mt-0.5">{act.time}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-[var(--muted)] italic text-[10px]">No recent generations logs.</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Parsed Resume Check warning */}
          {parsedResumes.length === 0 && (
            <div className="flex items-start gap-3 p-4 rounded-2xl border border-amber-250/50 bg-amber-500/5 text-amber-600">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs text-left">
                <h4 className="font-bold m-0 leading-none">No Parsed Resume Found!</h4>
                <p className="font-sans m-0 leading-relaxed">
                  The AI Cover Letter builder requires a parsed resume to customize letters. Please upload and parse your resume in the{' '}
                  <a href="/resumes" className="underline font-bold">Resume Builder</a> first.
                </p>
              </div>
            </div>
          )}

          {/* History Documents Grid */}
          <div className="space-y-3.5">
            <h3 className="font-display font-black text-sm text-foreground m-0">Generated Document History</h3>
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
        <Card className="border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md rounded-2xl shadow-sm overflow-hidden hover:border-[var(--primary)]/40 transition-all duration-300">
          <CardContent className="p-6 space-y-6 text-left">
            <h3 className="font-display font-black text-sm text-[var(--heading)] flex items-center gap-2 pb-3 border-b border-[var(--border)] m-0">
              <Sparkles size={16} className="text-[var(--primary)] animate-pulse" />
              <span>Configure AI Tailored Cover Letter</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Job Title */}
              <div className="space-y-1.5 text-left">
                <label htmlFor="job-title" className="block text-[10px] font-black text-[var(--muted)] uppercase tracking-widest leading-none">
                  Target Job Title
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-3 h-4.5 w-4.5 text-[var(--muted)]" />
                  <Input
                    id="job-title"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className="pl-10 text-xs bg-[var(--surface-hover)]/50 border border-[var(--border)] rounded-xl p-2.5 h-10 text-[var(--body)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                    required
                  />
                </div>
              </div>

              {/* Company Name */}
              <div className="space-y-1.5 text-left">
                <label htmlFor="company-name" className="block text-[10px] font-black text-[var(--muted)] uppercase tracking-widest leading-none">
                  Company Name
                </label>
                <div className="relative">
                  <Building className="absolute left-3.5 top-3 h-4.5 w-4.5 text-[var(--muted)]" />
                  <Input
                    id="company-name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. OpenAI"
                    className="pl-10 text-xs bg-[var(--surface-hover)]/50 border border-[var(--border)] rounded-xl p-2.5 h-10 text-[var(--body)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Resume Selection */}
              <Select
                id="resume-id"
                label="Select Source Resume"
                value={resumeId}
                onChange={(e) => setResumeId(e.target.value)}
                required
              >
                <option value="">-- Choose Resume --</option>
                {parsedResumes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.original_filename} (Score: {r.ats_score || 'N/A'})
                  </option>
                ))}
              </Select>

              {/* Tone Style */}
              <Select
                id="writing-style"
                label="Writing Style & Tone"
                value={writingStyle}
                onChange={(e) => setWritingStyle(e.target.value)}
              >
                {writingStyles.map((style) => (
                  <option key={style.value} value={style.value}>
                    {style.label}
                  </option>
                ))}
              </Select>

              {/* Generation Mode */}
              <Select
                id="generation-mode"
                label="Generation Detail Mode"
                value={generationMode}
                onChange={(e: any) => setGenerationMode(e.target.value)}
              >
                <option value="STANDARD">Standard Audit (Optimal detail)</option>
                <option value="FAST">Fast draft (Quick outline)</option>
                <option value="DETAILED">Detailed optimize (Comprehensive & rich)</option>
              </Select>
            </div>

            {/* Template grid selector */}
            <TemplateSelector selectedId={experienceLevel} onChange={setExperienceLevel} />

            {/* Job Description */}
            <Textarea
              id="job-desc"
              label="Target Job Description (Recommended)"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the target job description here. The AI will cross-reference this description with your resume parsing data to align keywords, tech stack, and experience."
              className="min-h-[140px] resize-none"
            />

            {/* Form actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-850">
              <Button
                variant="outline"
                onClick={() => setCurrentView('dashboard')}
                disabled={generateMutation.isPending}
                className="h-10 text-xs font-bold cursor-pointer rounded-xl border-slate-200 dark:border-slate-850 hover:border-brand-500/30 hover:bg-brand-500/5 transition-all bg-transparent"
              >
                Cancel
              </Button>
              <Button
                onClick={() => generateMutation.mutate()}
                disabled={generateMutation.isPending || !companyName || !jobTitle || !resumeId}
                className="flex items-center gap-1.5 px-5 py-2.5 font-bold cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-brand-500/10 border-none rounded-xl transition-all duration-200 text-xs h-10"
              >
                {generateMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Writing Letter...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} className="animate-pulse" />
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
        <div className="space-y-6 animate-fade-in">
          {isActiveLoading ? (
            <CoverLetterSkeleton />
          ) : activeLetter ? (
            <div className="space-y-6">
              {/* Workspace Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[var(--surface)]/70 backdrop-blur-md border border-[var(--border)] shadow-sm hover:border-[var(--primary)]/40 transition-all duration-300">
                <div className="space-y-1.5 text-left">
                  <span className="text-[9px] font-black text-[var(--muted)] uppercase tracking-widest block font-sans leading-none">
                    Active Editor Workspace
                  </span>
                  <h2 className="text-base font-extrabold text-[var(--heading)] line-clamp-1 m-0 leading-tight">
                    {activeLetter.job_title} at {activeLetter.company_name}
                  </h2>
                  <p className="text-[10px] text-[var(--muted)] font-medium m-0 flex items-center gap-1.5 leading-none">
                    <Calendar size={11} className="text-[var(--muted)]" />
                    <span>Created: {new Date(activeLetter.created_at).toLocaleString()}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleOpenExport(activeLetter)}
                    className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-[var(--border)] cursor-pointer rounded-xl hover:border-[var(--primary)]/30 hover:bg-[var(--primary)]/5 transition-all bg-transparent h-9"
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
                    <div className="p-5 rounded-2xl bg-[var(--surface)]/70 backdrop-blur-md border border-[var(--border)] h-full">
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
                <Card className="border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md rounded-2xl shadow-sm hover:border-[var(--primary)]/40 transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-[var(--border)]">
                    <div className="space-y-1 text-left">
                      <CardTitle className="text-xs font-black text-[var(--heading)] uppercase tracking-wider m-0">
                        Document Version Comparison Viewer
                      </CardTitle>
                      <CardDescription className="text-[10px] text-[var(--muted)] font-medium leading-none">
                        Review edits between historical baseline and AI Optimized versions.
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCompareData(null)}
                      className="text-xs font-bold h-8 cursor-pointer hover:bg-[var(--surface-hover)] rounded-lg px-2 border-none bg-transparent"
                    >
                      Close Comparison
                    </Button>
                  </CardHeader>
                  <CardContent className="p-5 text-left">
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
            <div className="p-8 text-center text-[var(--muted)] italic">Document details not found.</div>
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
