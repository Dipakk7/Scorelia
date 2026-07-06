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
        'group relative flex flex-col justify-between p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300',
        className
      )}
    >
      <div className="space-y-4">
        {/* Card Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400 group-hover:scale-105 transition-transform duration-300">
            <FileText size={24} />
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <Badge variant={getStatusColor(resume.status)} className="capitalize text-[10px]">
              {resume.status}
            </Badge>
            {resume.ats_score !== null && (
              <span className="text-xs font-bold font-display text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/45 px-2 py-0.5 rounded-lg border border-brand-100 dark:border-brand-900/30">
                ATS: {resume.ats_score}/100
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-1">
          <h4
            className="font-semibold text-sm text-slate-800 dark:text-slate-100 line-clamp-1 group-hover:text-brand-650 dark:group-hover:text-brand-400 transition-colors duration-200 cursor-pointer text-left"
            onClick={() => onView && onView(resume.id)}
            title={resume.original_filename}
          >
            {resume.original_filename}
          </h4>
          <div className="flex items-center gap-2 text-[11px] text-slate-550 dark:text-slate-450 font-sans">
            <span className="uppercase">{resume.file_type}</span>
            <span className="w-1 h-1 bg-slate-300 dark:bg-slate-650 rounded-full" />
            <span>{formatFileSize(resume.file_size)}</span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between">
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-sans">
          Uploaded {new Date(resume.uploaded_at).toLocaleDateString()}
        </span>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {onView && (
            <button
              onClick={() => onView(resume.id)}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-450 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-lg cursor-pointer transition-colors"
              title="View Parsed Content"
            >
              <Eye size={14} />
            </button>
          )}
          {onEdit && resume.status.toLowerCase() !== 'failed' && (
            <button
              onClick={() => onEdit(resume.id)}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-450 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-lg cursor-pointer transition-colors"
              title="Edit Resume Sections"
            >
              <Edit3 size={14} />
            </button>
          )}
          {onDownload && (
            <button
              onClick={() => onDownload(resume.id)}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-450 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-lg cursor-pointer transition-colors"
              title="Download File"
            >
              <Download size={14} />
            </button>
          )}
          {onAnalyze && resume.status.toLowerCase() === 'parsed' && (
            <button
              onClick={() => onAnalyze(resume.id)}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-450 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-lg cursor-pointer transition-colors"
              title="Start ATS Analysis"
            >
              <RefreshCw size={14} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(resume.id)}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-450 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-lg cursor-pointer transition-colors"
              title="Delete Resume"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
