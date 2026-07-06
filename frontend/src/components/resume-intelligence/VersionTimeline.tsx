import {
  Clock,
  History,
  FileText,
  Sparkles,
  ArrowRightLeft,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react'
import type {
  ResumeReviewResponse,
  ResumeRewriteResponse,
  ResumeOptimizationResponse,
  TimelineItem,
} from '@/types/resume-intelligence'

interface VersionTimelineProps {
  resumeUploadedAt: string
  resumeFilename: string
  reviews?: ResumeReviewResponse[]
  rewrites?: ResumeRewriteResponse[]
  optimizations?: ResumeOptimizationResponse[]
  onCompare: (item: TimelineItem) => void
  onRestore: (item: TimelineItem) => void
  isRestoring?: boolean
}

export function VersionTimeline({
  resumeUploadedAt,
  resumeFilename,
  reviews = [],
  rewrites = [],
  optimizations = [],
  onCompare,
  onRestore,
  isRestoring = false,
}: VersionTimelineProps) {
  // 1. Build list of timeline items
  const items: TimelineItem[] = []

  // Add original version
  items.push({
    id: 'original',
    type: 'original',
    title: 'Original Upload',
    subtitle: resumeFilename,
    timestamp: resumeUploadedAt,
    rawItem: null,
  })

  // Add reviews
  reviews.forEach((rev) => {
    items.push({
      id: rev.id,
      type: 'review',
      title: 'AI Assessment Scan',
      subtitle: `Model: ${rev.metadata?.model || 'Ollama'}`,
      timestamp: rev.created_at,
      score: rev.overall_score,
      rawItem: rev,
    })
  })

  // Add rewrites
  rewrites.forEach((rew) => {
    items.push({
      id: rew.id,
      type: 'rewrite',
      title: `AI Persona Rewrite`,
      subtitle: `Mode: ${rew.rewrite_mode}`,
      timestamp: rew.created_at,
      score: rew.quality_scores?.readability_improvement !== undefined ? 70 + rew.quality_scores.readability_improvement : undefined,
      rawItem: rew,
    })
  })

  // Add optimizations
  optimizations.forEach((opt) => {
    items.push({
      id: opt.id,
      type: 'optimization',
      title: 'ATS Keyword Optimization',
      subtitle: `Mode: ${opt.metadata?.mode || 'STANDARD'}`,
      timestamp: opt.created_at,
      score: opt.quality_score?.overall_score,
      rawItem: opt,
    })
  })

  // Sort by timestamp descending (newest first)
  const sortedItems = [...items].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'original':
        return {
          icon: <FileText size={14} />,
          bg: 'bg-slate-100 text-slate-655 dark:bg-slate-800 dark:text-slate-400',
          border: 'border-slate-200 dark:border-slate-800',
        }
      case 'review':
        return {
          icon: <History size={14} />,
          bg: 'bg-brand-500/10 text-brand-600 dark:text-brand-400',
          border: 'border-brand-500/20',
        }
      case 'rewrite':
        return {
          icon: <Sparkles size={14} />,
          bg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
          border: 'border-emerald-500/20',
        }
      case 'optimization':
        return {
          icon: <CheckCircle2 size={14} />,
          bg: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400',
          border: 'border-indigo-500/20',
        }
      default:
        return {
          icon: <Clock size={14} />,
          bg: 'bg-slate-100 text-slate-600',
          border: 'border-slate-200',
        }
    }
  }

  return (
    <div className="space-y-4 text-left font-sans">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-850">
        <span className="p-1 rounded-md bg-brand-500/10 text-brand-600 dark:text-brand-400">
          <History size={15} />
        </span>
        <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200">
          Version History Timeline
        </h4>
      </div>

      <div className="relative pl-6 space-y-6 border-l border-slate-200 dark:border-slate-800 ml-4 max-h-[500px] overflow-y-auto pr-1 py-1">
        {sortedItems.map((item) => {
          const styles = getTypeStyles(item.type)
          const formattedDate = new Date(item.timestamp).toLocaleString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })

          return (
            <div key={item.id} className="relative group">
              {/* Dot Icon Indicator */}
              <span className={`absolute -left-[35px] top-0.5 p-1.5 rounded-full border shrink-0 z-10 transition-transform group-hover:scale-110 ${styles.bg} ${styles.border}`}>
                {styles.icon}
              </span>

              {/* Version content */}
              <div className="p-4 border border-slate-150/80 dark:border-slate-850 rounded-xl bg-white dark:bg-dark-bg/60 hover:shadow-xs transition-shadow space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">{item.subtitle}</p>
                  </div>
                  {item.score !== undefined && (
                    <span className="text-[10px] font-extrabold bg-brand-500/10 text-brand-600 dark:text-brand-400 px-2 py-0.5 rounded-full border border-brand-500/20">
                      Score: {item.score}%
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {formattedDate}
                  </span>
                  
                  {/* Actions */}
                  <div className="flex gap-2">
                    {item.type !== 'original' && (
                      <button
                        onClick={() => onCompare(item)}
                        className="text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-0.5 font-bold cursor-pointer"
                      >
                        <ArrowRightLeft size={10} />
                        <span>Compare</span>
                      </button>
                    )}
                    {item.type === 'rewrite' && (
                      <button
                        onClick={() => onRestore(item)}
                        disabled={isRestoring}
                        className="text-slate-655 dark:text-slate-350 hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-0.5 font-bold disabled:opacity-40 cursor-pointer"
                      >
                        <RotateCcw size={10} />
                        <span>Restore</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default VersionTimeline
