import { useState, useEffect } from 'react'
import { CheckCircle2, XCircle, Loader2, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface ProcessingStatusProps {
  stages: Record<string, string> // e.g. { parser: 'SUCCESS', review: 'RUNNING', rewrite: 'PENDING', optimization: 'PENDING' }
  onRetry?: () => void
  onCancel?: () => void
  isProcessing: boolean
  error?: string | null
}

const STAGE_LABELS: Record<string, string> = {
  parser: 'Parsing Resume Structure',
  review: 'AI Feedback & Score Review',
  rewrite: 'Generating Version Rewrites',
  optimization: 'Targeting Keyword Optimization',
}

export function ProcessingStatus({
  stages,
  onRetry,
  onCancel,
  isProcessing,
  error,
}: ProcessingStatusProps) {
  const [elapsedTime, setElapsedTime] = useState(0)

  // Track elapsed time when processing is active
  useEffect(() => {
    let timer: any = null
    if (isProcessing) {
      setElapsedTime(0)
      timer = setInterval(() => {
        setElapsedTime((prev) => prev + 1)
      }, 1000)
    } else {
      if (timer) clearInterval(timer)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isProcessing])

  // Calculate overall progress percentage
  const totalStages = Object.keys(STAGE_LABELS).length
  const completedStages = Object.values(stages).filter((status) => status === 'SUCCESS').length
  const progressPercent = totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0

  const hasFailed = Object.values(stages).some((status) => status === 'FAILED') || !!error

  return (
    <Card className="border border-border bg-background/70 backdrop-blur-md shadow-xl overflow-hidden text-left font-sans">
      <CardHeader className="pb-3 border-b border-border">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-base font-bold text-foreground">
              AI Pipeline Orchestrator
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Executing Parser → Review → Rewrite → Scoring workflow pipeline.
            </p>
          </div>
          {isProcessing && (
            <div className="px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold flex items-center gap-1.5 animate-pulse">
              <span className="h-1.5 w-1.5 bg-brand-500 rounded-full animate-ping" />
              Processing: {elapsedTime}s
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-5 space-y-6">
        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
            <span>Overall Completion Status</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-2 w-full bg-slate-150 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Stages Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.keys(STAGE_LABELS).map((stageKey) => {
            const status = stages[stageKey] || 'PENDING'
            const label = STAGE_LABELS[stageKey]

            let statusIcon = (
              <div className="h-5 w-5 rounded-full border-2 border-slate-300 dark:border-slate-700 shrink-0" />
            )
            let statusClass = 'text-slate-400 dark:text-slate-600'
            let bgClass = 'border-border'

            if (status === 'SUCCESS') {
              statusIcon = <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
              statusClass = 'text-foreground font-medium'
              bgClass = 'border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10'
            } else if (status === 'RUNNING') {
              statusIcon = <Loader2 className="h-5 w-5 text-brand-500 animate-spin shrink-0" />
              statusClass = 'text-brand-600 dark:text-brand-400 font-semibold'
              bgClass = 'border-brand-500/30 bg-brand-500/5 dark:bg-brand-500/10 ring-1 ring-brand-500/20'
            } else if (status === 'FAILED') {
              statusIcon = <XCircle className="h-5 w-5 text-rose-500 shrink-0" />
              statusClass = 'text-rose-600 dark:text-rose-450 font-semibold'
              bgClass = 'border-rose-500/30 bg-rose-500/5 dark:bg-rose-500/10'
            }

            return (
              <div
                key={stageKey}
                className={`flex items-center gap-3.5 p-3.5 border rounded-xl transition-all duration-300 ${bgClass}`}
              >
                {statusIcon}
                <div className="min-w-0">
                  <p className={`text-xs ${statusClass}`}>{label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider font-semibold">
                    {status}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Error Callout */}
        {hasFailed && (
          <div className="p-4 border border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20 rounded-xl space-y-2">
            <h4 className="text-xs font-bold text-rose-700 dark:text-rose-400">
              Pipeline Process Interrupted
            </h4>
            <p className="text-xs text-rose-650 dark:text-rose-300/80 leading-relaxed">
              {error || 'One or more stages of the AI Resume Intelligence workflow pipeline failed to complete.'}
            </p>
            {onRetry && (
              <div className="flex gap-2 pt-1.5">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onRetry}
                  className="flex items-center gap-1.5 py-1.5 px-3.5 text-xs bg-rose-600 hover:bg-rose-700 border-none cursor-pointer"
                >
                  <RefreshCw size={13} className="animate-pulse" />
                  <span>Retry Pipeline</span>
                </Button>
                {onCancel && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onCancel}
                    className="py-1.5 px-3.5 text-xs cursor-pointer border-slate-350 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-650"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ProcessingStatus
