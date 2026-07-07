import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/api/api'
import type { ResumeResponse, ParsedResumeData } from '@/types/resume'
import ResumeCard from '@/components/ui/ResumeCard'
import ResumeTable from '@/components/ui/ResumeTable'
import ResumeUploadZone from '@/components/ui/ResumeUploadZone'
import ResumeViewer from '@/components/ui/ResumeViewer'
import ResumeEditor from '@/components/ui/ResumeEditor'
import ResumeMetadata from '@/components/ui/ResumeMetadata'
import ResumeHistory from '@/components/ui/ResumeHistory'
import EmptyResumeState from '@/components/ui/EmptyResumeState'
import { Loader } from '@/components/ui/Loader'
import { ErrorState } from '@/components/ui/ErrorState'
import { ResumesSkeleton } from '@/components/ui/Skeletons'
import { Button } from '@/components/ui/Button'
import { StatisticCard } from '@/components/ui/StatisticCard'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import toast from 'react-hot-toast'
import {
  FileText,
  Plus,
  Play,
  Hammer,
  LayoutDashboard,
  ListFilter,
  Upload,
  Eye,
  Trash2,
  Download,
  ArrowLeft,
  Sparkles,
  TrendingUp,
  Server,
  Activity,
  Award,
} from 'lucide-react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { Spinner } from '@/components/ui/Spinner'

export default function ResumesPage() {
  const queryClient = useQueryClient()

  // Navigation states: 'dashboard' | 'list' | 'upload' | 'workspace'
  const [currentView, setCurrentView] = useState<'dashboard' | 'list' | 'upload' | 'workspace'>('dashboard')
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null)
  const [workspaceTab, setWorkspaceTab] = useState<'viewer' | 'editor' | 'metadata' | 'history'>('viewer')

  // Fetch all resumes
  const {
    data: resumesData,
    isLoading,
    error,
    refetch,
  } = useQuery<{ resumes: ResumeResponse[]; total: number }>({
    queryKey: ['resumesList'],
    queryFn: async () => {
      const res = await api.get('/resumes')
      return res.data
    },
  })

  // Fetch individual resume details (if selected)
  const { data: selectedResume, isLoading: isSelectedLoading } = useQuery<ResumeResponse>({
    queryKey: ['resumeDetail', selectedResumeId],
    queryFn: async () => {
      if (!selectedResumeId) return null
      const res = await api.get(`/resumes/${selectedResumeId}`)
      return res.data
    },
    enabled: !!selectedResumeId,
  })

  // MUTATIONS

  // Trigger parsing mutation
  const parseMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.post(`/resumes/${id}/parse`)
      return res.data
    },
    onSuccess: () => {
      toast.success('Resume parsed successfully!')
      queryClient.invalidateQueries({ queryKey: ['resumesList'] })
      queryClient.invalidateQueries({ queryKey: ['resumeDetail', selectedResumeId] })
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.detail || err?.message || 'Failed to parse resume.'
      toast.error(msg)
    },
  })

  // Start ATS scoring mutation
  const scoreMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.post(`/resumes/${id}/score`)
      return res.data
    },
    onSuccess: (data) => {
      toast.success(`ATS Scoring Complete! Score: ${data.overall_score}/100`)
      queryClient.invalidateQueries({ queryKey: ['resumesList'] })
      queryClient.invalidateQueries({ queryKey: ['resumeDetail', selectedResumeId] })
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.detail || err?.message || 'Failed to compute ATS score.'
      toast.error(msg)
    },
  })

  // Delete resume mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/resumes/${id}`)
      return res.data
    },
    onSuccess: () => {
      toast.success('Resume deleted successfully.')
      queryClient.invalidateQueries({ queryKey: ['resumesList'] })
      if (selectedResumeId) {
        setSelectedResumeId(null)
        setCurrentView('list')
      }
    },
    onError: () => {
      toast.error('Failed to delete resume.')
    },
  })

  // Rename resume mutation
  const renameMutation = useMutation({
    mutationFn: async ({ id, newName }: { id: string; newName: string }) => {
      const res = await api.put(`/resumes/${id}`, { original_filename: newName })
      return res.data
    },
    onSuccess: () => {
      toast.success('Resume renamed successfully.')
      queryClient.invalidateQueries({ queryKey: ['resumesList'] })
      queryClient.invalidateQueries({ queryKey: ['resumeDetail', selectedResumeId] })
    },
    onError: () => {
      toast.error('Failed to rename resume.')
    },
  })

  // Update parsed data mutation (saves manual edits)
  const updateDataMutation = useMutation({
    mutationFn: async ({ id, parsedData }: { id: string; parsedData: ParsedResumeData }) => {
      const res = await api.put(`/resumes/${id}`, { parsed_data: parsedData })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumesList'] })
      queryClient.invalidateQueries({ queryKey: ['resumeDetail', selectedResumeId] })
    },
  })

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map((id) => api.delete(`/resumes/${id}`)))
    },
    onSuccess: () => {
      toast.success('Selected resumes deleted.')
      queryClient.invalidateQueries({ queryKey: ['resumesList'] })
    },
    onError: () => {
      toast.error('Some resume deletions failed.')
    },
  })

  // Trigger file download
  const handleDownload = async (id: string) => {
    try {
      const res = await api.get(`/resumes/${id}/download`, { responseType: 'blob' })
      const resumeItem = resumes.find((r) => r.id === id)
      const filename = resumeItem?.original_filename || 'resume_download.pdf'
      const blob = new Blob([res.data], { type: (res.headers['content-type'] as string) || 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch {
      toast.error('Failed to download resume file.')
    }
  }

  if (isLoading) {
    return <ResumesSkeleton />
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load resume module"
        message={(error as any)?.message || 'Could not sync resumes with the backend API.'}
        onRetry={() => refetch()}
      />
    )
  }

  const resumes = resumesData?.resumes ?? []

  // DASHBOARD STATISTICS COMPUTATIONS

  const totalResumes = resumes.length
  const latestResume = resumes[0] || null

  const parsedResumes = resumes.filter(
    (r) => r.status.toLowerCase() === 'parsed' || r.status.toLowerCase() === 'completed'
  )
  const parsingSuccessRate =
    totalResumes > 0 ? Math.round((parsedResumes.length / totalResumes) * 100) : 0

  const totalStorageBytes = resumes.reduce((acc, curr) => acc + curr.file_size, 0)
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 KB'
    const k = 1024
    return (bytes / (k * k)).toFixed(1) + ' MB'
  }

  // Generate upload activity list for chart
  const uploadActivityData = (() => {
    const activityMap: Record<string, number> = {}
    resumes.forEach((r) => {
      const dateStr = new Date(r.uploaded_at).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      })
      activityMap[dateStr] = (activityMap[dateStr] || 0) + 1
    })

    return Object.entries(activityMap)
      .map(([date, count]) => ({ date, count }))
      .reverse()
      .slice(-7) // last 7 upload days
  })()

  // Actions routing helpers
  const handleViewDetails = (id: string) => {
    setSelectedResumeId(id)
    setWorkspaceTab('viewer')
    setCurrentView('workspace')
  }

  const handleEditDetails = (id: string) => {
    setSelectedResumeId(id)
    setWorkspaceTab('editor')
    setCurrentView('workspace')
  }

  return (
    <div className="space-y-6 text-left animate-fadeIn font-sans">
      {/* Workspace Banner */}
      <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 rounded-xl flex items-start gap-3">
        <Hammer className="shrink-0 mt-0.5" size={20} />
        <div>
          <strong className="block font-semibold font-display text-sm">Resume Management Live</strong>
          <p className="text-xs mt-0.5 leading-relaxed font-sans">
            Phase 14 Part 3 Resume Workspace is fully configured. You can upload, parse using spaCy models, edit extraction structures, view histories, compute ATS scores, and audit file details.
          </p>
        </div>
      </div>

      {/* Main Page Headers & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white m-0">
            Resume Workspace
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Build, optimize, parse, and review your professional profiles.
          </p>
        </div>

        {currentView !== 'workspace' && (
          <div className="flex items-center gap-2">
            <Button
              variant={currentView === 'dashboard' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setCurrentView('dashboard')}
              className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <LayoutDashboard size={14} />
              <span>Dashboard</span>
            </Button>
            <Button
              variant={currentView === 'list' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setCurrentView('list')}
              className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <ListFilter size={14} />
              <span>Inventory List</span>
            </Button>
            <Button
              variant={currentView === 'upload' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setCurrentView('upload')}
              className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <Upload size={14} />
              <span>Upload Files</span>
            </Button>
          </div>
        )}
      </div>

      {/* ==================== VIEW 1: DASHBOARD ==================== */}
      {currentView === 'dashboard' && totalResumes === 0 && (
        <EmptyResumeState onUploadClick={() => setCurrentView('upload')} />
      )}

      {currentView === 'dashboard' && totalResumes > 0 && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatisticCard
              title="Total Resumes"
              value={totalResumes}
              description="Uploaded resume profiles"
              icon={FileText}
            />
            <StatisticCard
              title="Parse Success Rate"
              value={`${parsingSuccessRate}%`}
              description="spaCy extraction success"
              icon={Sparkles}
            />
            <StatisticCard
              title="Storage Occupied"
              value={formatBytes(totalStorageBytes)}
              description="Local server storage"
              icon={Server}
            />
            <StatisticCard
              title="Avg. ATS Score"
              value={
                resumes.filter((r) => r.ats_score !== null).length > 0
                  ? Math.round(
                      resumes
                        .filter((r) => r.ats_score !== null)
                        .reduce((acc, curr) => acc + (curr.ats_score || 0), 0) /
                        resumes.filter((r) => r.ats_score !== null).length
                    )
                  : 'N/A'
              }
              description="Across analyzed profiles"
              icon={Award}
            />
          </div>

          {/* Quick Dashboard Activity and Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart: Upload Activity */}
            <Card className="lg:col-span-2 p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-4 text-left">
                <Activity className="text-brand-500" size={18} />
                <h3 className="text-sm font-bold font-display text-slate-850 dark:text-slate-100 m-0">
                  Upload Activity History
                </h3>
              </div>
              <div className="h-56 w-full font-sans text-xs">
                {uploadActivityData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-slate-400">
                    No upload activity logs.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={uploadActivityData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800/40" />
                      <XAxis dataKey="date" stroke="#94a3b8" />
                      <YAxis allowDecimals={false} stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                        }}
                      />
                      <Bar dataKey="count" fill="#0F9D9A" radius={[6, 6, 0, 0]} barSize={32} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card>

            {/* Quick Actions / Latest Profile */}
            <div className="space-y-6 lg:col-span-1">
              {/* Latest Uploaded Resume Summary */}
              {latestResume && (
                <Card className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 text-left">
                  <div className="flex items-center gap-2 text-slate-500">
                    <TrendingUp size={16} />
                    <h3 className="text-xs font-bold uppercase tracking-wider font-display m-0">
                      Latest Activity
                    </h3>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-850 dark:text-slate-100 truncate">
                      {latestResume.original_filename}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-450 dark:text-slate-500">
                      <span className="uppercase">{latestResume.file_type}</span>
                      <span>•</span>
                      <span>Uploaded {new Date(latestResume.uploaded_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-850">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(latestResume.id)}
                      className="text-[11px] py-1 px-3 flex-1 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Eye size={12} />
                      <span>View details</span>
                    </Button>
                    {latestResume.status.toLowerCase() === 'parsed' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => scoreMutation.mutate(latestResume.id)}
                        disabled={scoreMutation.isPending}
                        className="text-[11px] py-1 px-3 flex-1 flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Play size={12} />
                        <span>ATS Analysis</span>
                      </Button>
                    )}
                  </div>
                </Card>
              )}

              {/* General Quick Actions list */}
              <Card className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 text-left font-sans">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-display m-0">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setCurrentView('upload')}
                    className="p-3 bg-slate-50 dark:bg-slate-850/50 hover:bg-brand-50 dark:hover:bg-brand-950/20 border border-slate-150 dark:border-slate-800 rounded-xl font-semibold text-slate-700 dark:text-slate-300 hover:text-brand-650 cursor-pointer text-center space-y-1 transition-all"
                  >
                    <Plus className="mx-auto" size={16} />
                    <span>Upload New</span>
                  </button>
                  <button
                    onClick={() => setCurrentView('list')}
                    className="p-3 bg-slate-50 dark:bg-slate-850/50 hover:bg-brand-50 dark:hover:bg-brand-950/20 border border-slate-150 dark:border-slate-800 rounded-xl font-semibold text-slate-700 dark:text-slate-300 hover:text-brand-650 cursor-pointer text-center space-y-1 transition-all"
                  >
                    <ListFilter className="mx-auto" size={16} />
                    <span>View List</span>
                  </button>
                </div>
              </Card>
            </div>
          </div>

          {/* Grid Layout of resumes */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold font-display text-slate-800 dark:text-slate-100 text-left">
              Recent uploads
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resumes.slice(0, 3).map((resume) => (
                <ResumeCard
                  key={resume.id}
                  resume={resume}
                  onView={handleViewDetails}
                  onEdit={handleEditDetails}
                  onDelete={(id) => deleteMutation.mutateAsync(id)}
                  onDownload={handleDownload}
                  onAnalyze={(id) => scoreMutation.mutate(id)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================== VIEW 2: INVENTORY TABLE LIST ==================== */}
      {currentView === 'list' && (
        <ResumeTable
          resumes={resumes}
          onView={handleViewDetails}
          onEdit={handleEditDetails}
          onDelete={async (id) => {
            await deleteMutation.mutateAsync(id)
          }}
          onBulkDelete={async (ids) => {
            await bulkDeleteMutation.mutateAsync(ids)
          }}
          onDownload={handleDownload}
          onAnalyze={(id) => scoreMutation.mutate(id)}
          onRename={async (id, newName) => {
            await renameMutation.mutateAsync({ id, newName })
          }}
        />
      )}

      {/* ==================== VIEW 3: UPLOAD ZONE ==================== */}
      {currentView === 'upload' && (
        <Card className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
          <ResumeUploadZone onUploadSuccess={() => queryClient.invalidateQueries({ queryKey: ['resumesList'] })} />
        </Card>
      )}

      {/* ==================== VIEW 4: DETAILED RESUME WORKSPACE ==================== */}
      {currentView === 'workspace' && selectedResumeId && (
        <div className="space-y-6">
          {/* Workspace Sub Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedResumeId(null)
                  setCurrentView('list')
                }}
                className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
              >
                <ArrowLeft size={16} />
              </Button>
              <div className="text-left">
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Workspace Profile
                </span>
                <h2 className="text-sm font-bold font-display text-slate-800 dark:text-white truncate max-w-sm m-0">
                  {selectedResume?.original_filename || 'Loading file...'}
                </h2>
              </div>
            </div>

            {/* Quick action triggers inside the Workspace */}
            {selectedResume && (
              <div className="flex items-center gap-2 font-sans">
                <Badge variant={selectedResume.status === 'parsed' ? 'success' : 'warning'} className="capitalize text-[10px] mr-2">
                  {selectedResume.status}
                </Badge>
                {selectedResume.status.toLowerCase() === 'uploaded' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => parseMutation.mutate(selectedResume.id)}
                    disabled={parseMutation.isPending}
                    className="flex items-center gap-1 text-xs text-brand-650 hover:bg-brand-50 border border-brand-100 dark:text-brand-400 dark:hover:bg-brand-950/20 dark:border-brand-900/30 cursor-pointer"
                  >
                    {parseMutation.isPending ? <Spinner size="sm" className="text-brand-650 dark:text-brand-400" /> : <Sparkles size={12} />}
                    <span>Parse Resume</span>
                  </Button>
                )}
                {selectedResume.status.toLowerCase() === 'parsed' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => scoreMutation.mutate(selectedResume.id)}
                    disabled={scoreMutation.isPending}
                    className="flex items-center gap-1 text-xs text-indigo-650 hover:bg-indigo-50 border border-indigo-100 dark:text-indigo-400 dark:hover:bg-indigo-950/20 dark:border-indigo-900/30 cursor-pointer"
                  >
                    {scoreMutation.isPending ? <Spinner size="sm" className="text-indigo-650 dark:text-indigo-400" /> : <Play size={12} />}
                    <span>Calculate ATS</span>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload(selectedResume.id)}
                  className="flex items-center gap-1 text-xs text-slate-650 hover:bg-slate-100 border border-slate-200 dark:text-slate-350 dark:hover:bg-slate-800 dark:border-slate-850 cursor-pointer"
                >
                  <Download size={12} />
                  <span>Download</span>
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this resume?')) {
                      deleteMutation.mutate(selectedResume.id)
                    }
                  }}
                  className="flex items-center gap-1 text-xs font-semibold py-1 px-3 rounded-lg cursor-pointer bg-red-650 hover:bg-red-700 text-white"
                >
                  <Trash2 size={12} />
                  <span>Delete</span>
                </Button>
              </div>
            )}
          </div>

          {/* Tab switches */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 gap-1 font-sans">
            <button
              onClick={() => setWorkspaceTab('viewer')}
              className={`px-4 py-2 text-xs font-semibold border-b-2 cursor-pointer transition-colors ${
                workspaceTab === 'viewer'
                  ? 'border-brand-600 text-brand-650 dark:border-brand-500 dark:text-brand-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Resume Viewer
            </button>
            <button
              onClick={() => setWorkspaceTab('editor')}
              className={`px-4 py-2 text-xs font-semibold border-b-2 cursor-pointer transition-colors ${
                workspaceTab === 'editor'
                  ? 'border-brand-600 text-brand-650 dark:border-brand-500 dark:text-brand-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Parse Editor
            </button>
            <button
              onClick={() => setWorkspaceTab('metadata')}
              className={`px-4 py-2 text-xs font-semibold border-b-2 cursor-pointer transition-colors ${
                workspaceTab === 'metadata'
                  ? 'border-brand-600 text-brand-650 dark:border-brand-500 dark:text-brand-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Parser Analytics
            </button>
            <button
              onClick={() => setWorkspaceTab('history')}
              className={`px-4 py-2 text-xs font-semibold border-b-2 cursor-pointer transition-colors ${
                workspaceTab === 'history'
                  ? 'border-brand-600 text-brand-650 dark:border-brand-500 dark:text-brand-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Version Logs
            </button>
          </div>

          {/* Selected Resume Loading State */}
          {isSelectedLoading ? (
            <Loader label="Synchronizing profile parsed data..." />
          ) : (
            <div>
              {workspaceTab === 'viewer' && selectedResume && (
                <ResumeViewer
                  parsedData={selectedResume.parsed_data}
                  originalFilename={selectedResume.original_filename}
                />
              )}

              {workspaceTab === 'editor' && selectedResume && (
                <ResumeEditor
                  parsedData={selectedResume.parsed_data}
                  onSave={async (updatedData) => {
                    await updateDataMutation.mutateAsync({
                      id: selectedResume.id,
                      parsedData: updatedData,
                    })
                  }}
                  onDiscard={() => setWorkspaceTab('viewer')}
                />
              )}

              {workspaceTab === 'metadata' && selectedResume && (
                <ResumeMetadata
                  parsedData={selectedResume.parsed_data}
                  fileSize={selectedResume.file_size}
                  fileType={selectedResume.file_type}
                />
              )}

              {workspaceTab === 'history' && selectedResume && (
                <ResumeHistory resumeId={selectedResume.id} />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
