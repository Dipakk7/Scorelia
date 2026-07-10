import { Calendar, Trash2, Download, ExternalLink } from 'lucide-react'
import type { CoverLetterResponse } from '@/types/cover-letter'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

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
    <Card className="border border-border/60 bg-card/70 backdrop-blur-md rounded-2xl shadow-sm hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 group flex flex-col justify-between text-left font-sans">
      <CardContent className="p-5 flex flex-col h-full justify-between">
        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <div className="space-y-1">
              <h3 className="font-bold text-foreground text-sm group-hover:text-brand-500 transition-colors duration-150 line-clamp-1 m-0 leading-tight">
                {coverLetter.job_title}
              </h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-405 line-clamp-1 m-0">
                {coverLetter.company_name}
              </p>
            </div>
            <div className="flex flex-shrink-0 gap-1.5">
              <Badge variant="outline" className="text-[9px] font-black uppercase tracking-wider border-slate-200/60 dark:border-slate-800">
                {formattedStyle}
              </Badge>
            </div>
          </div>

          {/* Description summary */}
          <p className="text-xs text-slate-550 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4 font-sans font-medium">
            {coverLetter.generated_content || 'No content generated yet.'}
          </p>
        </div>

        {/* Footer info & action buttons */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-850/80 mt-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
            <Calendar size={12} className="text-slate-400" />
            <span className="text-[10px] font-bold font-sans tracking-wide uppercase">{formattedDate}</span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(coverLetter.id)}
              className="h-8 w-8 p-0 text-slate-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-slate-50/50 dark:hover:bg-slate-850/30 rounded-lg cursor-pointer transition-all flex items-center justify-center bg-transparent border-none"
              title="Delete Cover Letter"
            >
              <Trash2 size={13} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onExport(coverLetter)}
              className="h-8 w-8 p-0 text-slate-400 dark:text-slate-500 hover:text-brand-500 dark:hover:text-brand-400 hover:bg-slate-50/50 dark:hover:bg-slate-850/30 rounded-lg cursor-pointer transition-all flex items-center justify-center bg-transparent border-none"
              title="Export Document"
            >
              <Download size={13} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelect(coverLetter.id)}
              className="h-8 px-2.5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer rounded-lg border-border hover:border-brand-500/30 hover:bg-brand-500/5 transition-all bg-transparent"
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
