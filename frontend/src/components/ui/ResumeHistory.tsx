import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/api/api'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Loader } from '@/components/ui/Loader'
import { Spinner } from '@/components/ui/Spinner'
import { History, RotateCcw, Calendar, Cpu, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

interface ResumeHistoryProps {
  resumeId: string
  onRestoreSuccess?: () => void
}

interface RewriteVersion {
  id: string
  resume_id: string
  rewrite_mode: string
  created_at: string
  metadata: {
    model: string
    provider: string
    latency_ms: number
    mode: string
    job_description?: string
  }
}

export default function ResumeHistory({ resumeId, onRestoreSuccess }: ResumeHistoryProps) {
  const queryClient = useQueryClient()

  // Fetch rewrites history
  const {
    data: historyData,
    isLoading,
    error,
    refetch,
  } = useQuery<{ rewrites: RewriteVersion[]; total: number }>({
    queryKey: ['resumeHistory', resumeId],
    queryFn: async () => {
      const res = await api.get(`/ai/resume/rewrites`, {
        params: { resume_id: resumeId },
      })
      return res.data
    },
  })

  // Restore version mutation
  const restoreMutation = useMutation({
    mutationFn: async (rewriteId: string) => {
      const res = await api.post(`/ai/resume/rewrite/${rewriteId}/undo`)
      return res.data
    },
    onSuccess: () => {
      toast.success('Successfully rolled back to this version!')
      // Invalidate queries to reload updated resume data
      queryClient.invalidateQueries({ queryKey: ['resumeDetail', resumeId] })
      queryClient.invalidateQueries({ queryKey: ['resumesList'] })
      if (onRestoreSuccess) onRestoreSuccess()
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.detail || err?.message || 'Failed to rollback version.'
      toast.error(msg)
    },
  })

  if (isLoading) {
    return <Loader label="Retrieving version history..." />
  }

  if (error) {
    return (
      <div className="p-5 text-center border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl">
        <p className="text-xs text-red-500 font-sans">
          Failed to load version logs: {(error as any)?.message}
        </p>
        <Button variant="ghost" size="sm" onClick={() => refetch()} className="mt-2 text-xs">
          Retry
        </Button>
      </div>
    )
  }

  const rewrites = historyData?.rewrites || []

  return (
    <div className="space-y-6 text-left font-sans">
      <div className="flex items-center gap-2">
        <History className="text-slate-500" size={18} />
        <h3 className="text-sm font-bold font-display text-slate-800 dark:text-slate-100 m-0">
          AI rewrite logs & history
        </h3>
      </div>

      {rewrites.length === 0 ? (
        <div className="p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center">
          <History className="mx-auto text-slate-350 dark:text-slate-650 mb-2" size={32} />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            No optimization or rewrite logs found for this resume.
          </p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 max-w-xs mx-auto">
            Rewrites performed by the AI Assistant will be logged here, permitting you to roll back changes at any time.
          </p>
        </div>
      ) : (
        <div className="relative border-l border-slate-200 dark:border-slate-800 ml-4 pl-6 space-y-6 py-2">
          {rewrites.map((version) => {
            const isRestoring = restoreMutation.isPending && restoreMutation.variables === version.id

            return (
              <div key={version.id} className="relative group">
                {/* Timeline Dot */}
                <div className="absolute -left-[31px] top-1.5 p-1 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 group-hover:border-brand-500 group-hover:text-brand-500 rounded-full transition-colors duration-300">
                  <Sparkles size={10} />
                </div>

                {/* Card Container */}
                <div className="p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 max-w-md">
                    <div className="flex items-center flex-wrap gap-2">
                      <Badge variant="default" className="text-[10px] uppercase font-semibold">
                        {version.rewrite_mode.replace('_', ' ')}
                      </Badge>
                      <span className="text-[10px] text-slate-450 dark:text-slate-500 flex items-center gap-1">
                        <Calendar size={11} />
                        {new Date(version.created_at).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      AI Optimizer Run (Mode: {version.rewrite_mode})
                    </p>

                    {version.metadata.job_description && (
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-sans line-clamp-1">
                        Target Job: {version.metadata.job_description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-[10px] text-slate-400 dark:text-slate-500">
                      <span className="flex items-center gap-0.5">
                        <Cpu size={10} /> {version.metadata.model}
                      </span>
                      <span>•</span>
                      <span>{(version.metadata.latency_ms / 1000).toFixed(1)}s processing</span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => restoreMutation.mutate(version.id)}
                      disabled={restoreMutation.isPending}
                      className="flex items-center gap-1 text-xs text-brand-650 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-950/20 cursor-pointer"
                    >
                      {isRestoring ? (
                        <Spinner size="sm" className="text-brand-650 dark:text-brand-400" />
                      ) : (
                        <RotateCcw size={12} />
                      )}
                      <span>Restore This</span>
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
