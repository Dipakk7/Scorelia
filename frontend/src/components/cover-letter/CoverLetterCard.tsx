import { Calendar, Trash2, Download, ExternalLink } from 'lucide-react'
import type { CoverLetterResponse } from '@/types/cover-letter'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

interface CoverLetterCardProps {
  coverLetter: CoverLetterResponse
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onExport: (coverLetter: CoverLetterResponse) => void
}

export default function CoverLetterCard({
  coverLetter,
  onSelect,
  onDelete,
  onExport,
}: CoverLetterCardProps) {
  const formattedDate = new Date(coverLetter.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  // Format writing style nicely
  const formattedStyle = coverLetter.writing_style.charAt(0) + coverLetter.writing_style.slice(1).toLowerCase()

  return (
    <Card className="hover:shadow-md dark:bg-dark-card border-slate-200/80 dark:border-dark-border hover:border-slate-350 dark:hover:border-slate-700 transition-all duration-200 group flex flex-col justify-between">
      <CardContent className="p-5 flex flex-col h-full justify-between">
        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <div className="space-y-0.5">
              <h3 className="font-semibold text-slate-900 dark:text-white font-display text-sm group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors duration-150 line-clamp-1">
                {coverLetter.job_title}
              </h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 line-clamp-1">
                {coverLetter.company_name}
              </p>
            </div>
            <div className="flex flex-shrink-0 gap-1.5">
              <Badge variant="outline" className="text-[10px] uppercase font-semibold font-sans tracking-wide">
                {formattedStyle}
              </Badge>
            </div>
          </div>

          {/* Description summary */}
          <p className="text-xs text-slate-550 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4 font-sans">
            {coverLetter.generated_content || 'No content generated yet.'}
          </p>
        </div>

        {/* Footer info & action buttons */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/85 mt-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
            <Calendar size={12} />
            <span className="text-[10px] font-medium font-sans">{formattedDate}</span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(coverLetter.id)}
              className="h-8 w-8 p-0 text-slate-400 hover:text-rose-500 cursor-pointer"
              title="Delete Cover Letter"
            >
              <Trash2 size={14} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onExport(coverLetter)}
              className="h-8 w-8 p-0 text-slate-400 hover:text-brand-500 cursor-pointer"
              title="Export Document"
            >
              <Download size={14} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelect(coverLetter.id)}
              className="h-8 px-2.5 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Workspace</span>
              <ExternalLink size={10} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
