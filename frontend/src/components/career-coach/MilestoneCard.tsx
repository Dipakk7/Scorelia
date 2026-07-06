import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ChevronDown, ChevronUp, Calendar, CheckCircle2, Circle, PlayCircle } from 'lucide-react'
import type { MilestoneResponse, MilestoneStatus } from '@/types/roadmap'

interface MilestoneCardProps {
  milestone: MilestoneResponse
  isExpanded: boolean
  onToggleExpand: () => void
  onUpdateStatus?: (milestoneId: string, newStatus: MilestoneStatus) => void
}

export function MilestoneCard({
  milestone,
  isExpanded,
  onToggleExpand,
  onUpdateStatus
}: MilestoneCardProps) {
  const getStatusIcon = (status: MilestoneStatus) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle2 className="text-emerald-500 h-5 w-5 fill-emerald-50 dark:fill-slate-900" />
      case 'IN_PROGRESS':
        return <PlayCircle className="text-amber-500 h-5 w-5 fill-amber-50 dark:fill-slate-900" />
      default:
        return <Circle className="text-slate-300 dark:text-slate-700 h-5 w-5" />
    }
  }

  const getStatusBadgeVariant = (status: MilestoneStatus) => {
    switch (status) {
      case 'COMPLETED':
        return 'success'
      case 'IN_PROGRESS':
        return 'warning'
      default:
        return 'secondary'
    }
  }

  // Parse out sections from description if formatted with custom markdown headers
  const renderDescription = (desc?: string) => {
    if (!desc) return null
    return (
      <div className="space-y-3 text-xs text-slate-650 dark:text-slate-350 whitespace-pre-line leading-relaxed font-sans mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        {desc}
      </div>
    )
  }

  return (
    <Card className="border-slate-200/60 dark:border-slate-800/40 bg-white/70 dark:bg-slate-900/40 hover:bg-slate-50/50 dark:hover:bg-slate-900/60 transition-all duration-150">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <button
              onClick={() => {
                if (onUpdateStatus) {
                  // Cycle status: NOT_STARTED -> IN_PROGRESS -> COMPLETED -> NOT_STARTED
                  const nextStatusMap: Record<MilestoneStatus, MilestoneStatus> = {
                    NOT_STARTED: 'IN_PROGRESS',
                    IN_PROGRESS: 'COMPLETED',
                    COMPLETED: 'NOT_STARTED'
                  }
                  onUpdateStatus(milestone.id, nextStatusMap[milestone.status] || 'NOT_STARTED')
                }
              }}
              className="focus:outline-none hover:opacity-85 transition-opacity cursor-pointer"
              title="Click to cycle status"
              aria-label={`Cycle status for ${milestone.title}`}
            >
              {getStatusIcon(milestone.status)}
            </button>
            
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                {milestone.title}
              </h4>
              <div className="flex items-center gap-2.5 text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar size={11} />
                  {milestone.duration || 'Flexible'}
                </span>
                <span>•</span>
                <span>Phase {milestone.phase_number}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={getStatusBadgeVariant(milestone.status)}>
              {milestone.status.replace('_', ' ')}
            </Badge>

            <button
              onClick={onToggleExpand}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer focus:outline-none"
              aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>

        {isExpanded && renderDescription(milestone.description)}
      </CardContent>
    </Card>
  )
}
export default MilestoneCard
