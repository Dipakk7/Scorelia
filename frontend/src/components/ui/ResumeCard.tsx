import { FileText, Download, Trash2, Edit3, Eye, RefreshCw } from 'lucide-react'
import type { ResumeResponse } from '@/types/resume'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

interface ResumeCardProps {
  resume: ResumeResponse
  onView?: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onDownload?: (id: string) => void
  onAnalyze?: (id: string) => void
  className?: string
}

export default function ResumeCard({
  resume,
  onView,
  onEdit,
  onDelete,
  onDownload,
  onAnalyze,
  className,
}: ResumeCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'parsed':
        return 'success'
      case 'failed':
        return 'error'
      case 'parsing':
        return 'warning'
      default:
        return 'default'
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  return (
    <div
      className={cn(
        'group relative flex flex-col justify-between p-5 border border-slate-200/60 dark:border-slate-850 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.015)] dark:shadow-none hover:border-brand-500/30 dark:hover:border-brand-500/20 hover:bg-white dark:hover:bg-slate-900/60 hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] dark:hover:shadow-none transition-all duration-300',
        className
      )}
    >
      <div className="space-y-4">
        {/* Card Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="p-2.5 bg-slate-50 dark:bg-slate-850 rounded-xl text-slate-400 dark:text-slate-550 border border-slate-100 dark:border-slate-800/80 group-hover:scale-105 group-hover:bg-brand-500/5 group-hover:text-brand-500 group-hover:border-brand-500/10 transition-all duration-300 shadow-xs">
            <FileText size={20} className="stroke-[1.75]" />
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <Badge variant={getStatusColor(resume.status)} className="capitalize text-[9px] px-2 py-0">
              {resume.status}
            </Badge>
            {resume.ats_score !== null && (
              <span className="text-[10px] font-black font-display text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-950/30 px-2 py-0.5 rounded-lg border border-brand-100/50 dark:border-brand-900/20 shadow-2xs">
                ATS: {resume.ats_score}/100
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-1.5 text-left">
          <h4
            className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors duration-200 cursor-pointer"
            onClick={() => onView && onView(resume.id)}
            title={resume.original_filename}
          >
            {resume.original_filename}
          </h4>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-sans">
            <span className="text-slate-500 dark:text-slate-400">{resume.file_type}</span>
            <span className="w-1 h-1 bg-slate-350 dark:bg-slate-700 rounded-full" />
            <span>{formatFileSize(resume.file_size)}</span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
        <span className="text-[10px] font-medium text-slate-450 dark:text-slate-500 font-sans">
          {new Date(resume.uploaded_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>

        {/* Action Buttons */}
        <div className="flex items-center gap-0.5">
          {onView && (
            <button
              onClick={() => onView(resume.id)}
              className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-brand-500 dark:hover:text-brand-400 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-lg cursor-pointer transition-colors"
              title="View Parsed Content"
            >
              <Eye size={13} />
            </button>
          )}
          {onEdit && resume.status.toLowerCase() !== 'failed' && (
            <button
              onClick={() => onEdit(resume.id)}
              className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-lg cursor-pointer transition-colors"
              title="Edit Resume Sections"
            >
              <Edit3 size={13} />
            </button>
          )}
          {onDownload && (
            <button
              onClick={() => onDownload(resume.id)}
              className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-emerald-500 dark:hover:text-emerald-450 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-lg cursor-pointer transition-colors"
              title="Download File"
            >
              <Download size={13} />
            </button>
          )}
          {onAnalyze && resume.status.toLowerCase() === 'parsed' && (
            <button
              onClick={() => onAnalyze(resume.id)}
              className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-lg cursor-pointer transition-colors"
              title="Start ATS Analysis"
            >
              <RefreshCw size={13} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(resume.id)}
              className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-lg cursor-pointer transition-colors"
              title="Delete Resume"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
