import { useState, useEffect } from 'react'
import { Clock, RotateCcw, Eye, AlertCircle, Loader2 } from 'lucide-react'
import api from '@/api/api'
import type { CoverLetterOptimizationResponse } from '@/types/cover-letter'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

interface CoverLetterHistoryProps {
  coverLetterId: string
  activeContent: string
  onRestore: (content: string) => void
  onCompare: (original: string, optimized: string) => void
}

export default function CoverLetterHistory({
  coverLetterId,
  activeContent,
  onRestore,
  onCompare,
}: CoverLetterHistoryProps) {
  const [optimizations, setOptimizations] = useState<CoverLetterOptimizationResponse[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchHistory = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await api.get(`/ai/cover-letter/optimizations`, {
        params: { cover_letter_id: coverLetterId },
      })
      // Sort optimizations descending (newest first)
      const sorted = (res.data.optimizations || []).sort(
        (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      setOptimizations(sorted)
    } catch (err: any) {
      console.error(err)
      setError('Failed to load version history. Verify connection.')
    } finally {
      setIsLoading(false)
    }
  }

  // Refetch history when cover letter ID changes
  useEffect(() => {
    if (coverLetterId) {
      const fetchHistoryInternal = async () => {
        setIsLoading(true)
        setError(null)
        try {
          const res = await api.get(`/ai/cover-letter/optimizations`, {
            params: { cover_letter_id: coverLetterId },
          })
          const sorted = (res.data.optimizations || []).sort(
            (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
          setOptimizations(sorted)
        } catch (err: any) {
          console.error(err)
          setError('Failed to load version history. Verify connection.')
        } finally {
          setIsLoading(false)
        }
      }
      fetchHistoryInternal()
    }
  }, [coverLetterId])

  const formatTimestamp = (dateStr: string) => {
    return new Date(dateStr).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between">
        <h4 className="font-display font-bold text-xs uppercase text-slate-500 dark:text-slate-400 tracking-wider">
          Revision Version History
        </h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchHistory}
          disabled={isLoading}
          className="h-7 text-[10px] font-bold cursor-pointer"
        >
          Refresh Logs
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-8 space-y-2.5">
          <Loader2 size={20} className="animate-spin text-brand-500" />
          <span className="text-xs text-slate-550 dark:text-slate-400 font-sans">Syncing revision history...</span>
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 p-4 rounded-xl border border-rose-200/50 bg-rose-500/5 text-rose-500 text-xs">
          <AlertCircle size={14} className="shrink-0" />
          <span>{error}</span>
        </div>
      ) : optimizations.length === 0 ? (
        <div className="p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-card text-center space-y-2">
          <Clock size={20} className="mx-auto text-slate-400 dark:text-slate-500" />
          <h5 className="font-semibold text-slate-900 dark:text-white text-xs">Initial Draft Active</h5>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 max-w-[200px] mx-auto leading-normal font-sans">
            Only the initial generated version exists. Use AI audits to rewrite and build revisions.
          </p>
        </div>
      ) : (
        <div className="relative border-l border-slate-200 dark:border-slate-800 ml-3.5 pl-6 space-y-5 py-1">
          {optimizations.map((opt) => {
            const isRestored = activeContent === opt.optimized_content

            return (
              <div key={opt.id} className="relative group/item">
                {/* Timeline Dot icon */}
                <div
                  className={cn(
                    'absolute left-[-31px] top-1.5 h-3.5 w-3.5 rounded-full border-2 transition-all duration-200 flex items-center justify-center',
                    isRestored
                      ? 'bg-brand-500 border-brand-500 ring-4 ring-brand-500/10'
                      : 'bg-white dark:bg-dark-bg border-slate-300 dark:border-slate-700'
                  )}
                />

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold text-slate-900 dark:text-white font-sans">
                      {formatTimestamp(opt.created_at)}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Badge variant="outline" className="text-[9px] py-0 px-1 border-slate-200 dark:border-slate-800 text-slate-500">
                        Score: {opt.quality_score.overall_score}/100
                      </Badge>
                      {opt.version_comparison.estimated_quality_gain > 0 && (
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[9px] py-0 px-1">
                          +{opt.version_comparison.estimated_quality_gain}% Gain
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-600 dark:text-slate-455 font-sans leading-normal">
                    <strong>Changes:</strong> {opt.version_comparison.improvement_summary || 'Optimized document structure.'}
                  </p>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onCompare(opt.original_content, opt.optimized_content)}
                      className="h-7 px-2.5 text-[10px] gap-1 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/80"
                    >
                      <Eye size={10} />
                      <span>Compare Diff</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRestore(opt.optimized_content)}
                      disabled={isRestored}
                      className={cn(
                        'h-7 px-2.5 text-[10px] gap-1 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/80',
                        isRestored && 'text-slate-400 hover:bg-transparent pointer-events-none'
                      )}
                    >
                      <RotateCcw size={10} />
                      <span>{isRestored ? 'Current' : 'Restore'}</span>
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
