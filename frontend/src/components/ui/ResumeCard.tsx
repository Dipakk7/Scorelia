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
        'group relative flex flex-col justify-between p-5 border border-[var(--border)] bg-[var(--surface)]/75 backdrop-blur-md rounded-[var(--radius-card)] shadow-[var(--shadow-sm)] hover:border-[var(--primary)]/35 dark:hover:border-[var(--primary)]/20 hover:bg-[var(--surface-hover)] hover:shadow-[var(--shadow-md)] transition-all duration-300',
        className
      )}
    >
      <div className="space-y-4">
        {/* Card Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="p-2.5 bg-[var(--surface-hover)] rounded-xl text-[var(--muted)] border border-[var(--border)] group-hover:scale-105 group-hover:bg-[var(--primary)]/5 group-hover:text-[var(--primary)] group-hover:border-[var(--primary)]/10 transition-all duration-300 shadow-xs">
            <FileText size={20} className="stroke-[1.75]" />
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <Badge variant={getStatusColor(resume.status)} className="capitalize text-[9px] px-2 py-0">
              {resume.status}
            </Badge>
            {resume.ats_score !== null && (
              <span className="text-[10px] font-black font-display text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-0.5 rounded-lg border border-[var(--primary)]/20 shadow-2xs">
                ATS: {resume.ats_score}/100
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-1.5 text-left">
          <h4
            className="font-bold text-sm text-[var(--heading)] line-clamp-1 group-hover:text-[var(--primary)] transition-colors duration-200 cursor-pointer"
            onClick={() => onView && onView(resume.id)}
            title={resume.original_filename}
          >
            {resume.original_filename}
          </h4>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] font-sans">
            <span className="text-muted-foreground">{resume.file_type}</span>
            <span className="w-1 h-1 bg-[var(--border)] rounded-full" />
            <span>{formatFileSize(resume.file_size)}</span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-5 pt-3 border-t border-[var(--border)] flex items-center justify-between">
        <span className="text-[10px] font-medium text-[var(--muted)] font-sans">
          {new Date(resume.uploaded_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>

        {/* Action Buttons */}
        <div className="flex items-center gap-0.5">
          {onView && (
            <button
              onClick={() => onView(resume.id)}
              className="p-1.5 text-[var(--muted)] hover:text-[var(--primary)] hover:bg-[var(--surface-hover)] rounded-lg cursor-pointer transition-colors"
              title="View Parsed Content"
            >
              <Eye size={13} />
            </button>
          )}
          {onEdit && resume.status.toLowerCase() !== 'failed' && (
            <button
              onClick={() => onEdit(resume.id)}
              className="p-1.5 text-[var(--muted)] hover:text-[var(--primary)] hover:bg-[var(--surface-hover)] rounded-lg cursor-pointer transition-colors"
              title="Edit Resume Sections"
            >
              <Edit3 size={13} />
            </button>
          )}
          {onDownload && (
            <button
              onClick={() => onDownload(resume.id)}
              className="p-1.5 text-[var(--muted)] hover:text-[var(--success)] hover:bg-[var(--surface-hover)] rounded-lg cursor-pointer transition-colors"
              title="Download File"
            >
              <Download size={13} />
            </button>
          )}
          {onAnalyze && resume.status.toLowerCase() === 'parsed' && (
            <button
              onClick={() => onAnalyze(resume.id)}
              className="p-1.5 text-[var(--muted)] hover:text-[var(--primary)] hover:bg-[var(--surface-hover)] rounded-lg cursor-pointer transition-colors"
              title="Start ATS Analysis"
            >
              <RefreshCw size={13} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(resume.id)}
              className="p-1.5 text-[var(--muted)] hover:text-[var(--danger)] hover:bg-[var(--surface-hover)] rounded-lg cursor-pointer transition-colors"
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
