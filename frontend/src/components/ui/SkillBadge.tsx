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
        'flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-[var(--radius-badge)] bg-[var(--divider)] text-[var(--heading)] border border-[var(--border)] shadow-[var(--shadow-sm)] hover:border-[var(--primary)]/30 transition-all font-sans',
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
          className="p-0.5 rounded-full hover:bg-[var(--border)] text-[var(--muted)] hover:text-[var(--heading)] transition-colors focus:outline-none cursor-pointer"
          aria-label={`Remove skill ${skill}`}
        >
          <X size={12} />
        </button>
      )}
    </Badge>
  )
}
