import { FileText } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'

interface EmptyResumeStateProps {
  onUploadClick: () => void
}

export default function EmptyResumeState({ onUploadClick }: EmptyResumeStateProps) {
  return (
    <EmptyState
      icon={<FileText className="text-slate-400 dark:text-slate-500" size={40} />}
      title="No resumes found"
      description="Upload your resume in PDF or DOCX format. CareerPilot will parse your experience and skills to match you with suitable jobs."
      actionLabel="Upload Resume"
      onAction={onUploadClick}
      className="border-slate-200 dark:border-slate-800"
    />
  )
}
