import { Badge } from '@/components/ui/Badge'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SkillBadgeProps {
  skill: string
  onDelete?: () => void
  className?: string
}

export function SkillBadge({ skill, onDelete, className }: SkillBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-250 dark:border-slate-700/60 shadow-xs hover:border-slate-350 dark:hover:border-slate-650 transition-all font-sans',
        className
      )}
    >
      <span>{skill}</span>
      {onDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-100 transition-colors focus:outline-none cursor-pointer"
          aria-label={`Remove skill ${skill}`}
        >
          <X size={12} />
        </button>
      )}
    </Badge>
  )
}
