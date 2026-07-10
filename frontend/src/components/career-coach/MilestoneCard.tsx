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

  const getStatusBadge = (status: MilestoneStatus) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 border border-emerald-500/20 text-[9px] font-black uppercase tracking-wider py-0 px-2 rounded-lg leading-none shrink-0">
            COMPLETED
          </Badge>
        )
      case 'IN_PROGRESS':
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-450 border border-amber-500/20 text-[9px] font-black uppercase tracking-wider py-0 px-2 rounded-lg leading-none shrink-0">
            IN PROGRESS
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-[9px] font-black uppercase tracking-wider py-0 px-2 border-slate-200 dark:border-slate-805 text-slate-500 rounded-lg leading-none shrink-0">
            NOT STARTED
          </Badge>
        )
    }
  }

  const renderDescription = (desc?: string) => {
    if (!desc) return null
    return (
      <div className="space-y-3 text-xs text-slate-655 dark:text-slate-400 whitespace-pre-line leading-relaxed font-sans mt-3 pt-3 border-t border-slate-100 dark:border-slate-850/60 font-medium text-left">
        {desc}
      </div>
    )
  }

  return (
    <Card className="border border-border bg-card/70 backdrop-blur-md rounded-2xl shadow-sm hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 overflow-hidden text-left font-sans text-xs hover:bg-slate-50/20 dark:hover:bg-slate-850/10">
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
              className="focus:outline-none hover:opacity-85 transition-opacity cursor-pointer border-none bg-transparent p-0 flex items-center"
              title="Click to cycle status"
              aria-label={`Cycle status for ${milestone.title}`}
            >
              {getStatusIcon(milestone.status)}
            </button>
            
            <div className="space-y-0.5 text-left">
              <h4 className="text-xs font-extrabold text-foreground font-display m-0 leading-none">
                {milestone.title}
              </h4>
              <div className="flex items-center gap-2.5 text-[10px] text-muted-foreground font-sans font-bold leading-none mt-1.5">
                <span className="flex items-center gap-1">
                  <Calendar size={11} className="text-slate-400" />
                  {milestone.duration || 'Flexible'}
                </span>
                <span className="text-slate-300">•</span>
                <span>Phase {milestone.phase_number}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {getStatusBadge(milestone.status)}

            <button
              onClick={onToggleExpand}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer focus:outline-none border-none bg-transparent flex items-center"
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
