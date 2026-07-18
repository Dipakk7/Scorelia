import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { MilestoneCard } from './MilestoneCard'
import { Button } from '@/components/ui/Button'
import { ListFilter, Eye, EyeOff, Search } from 'lucide-react'
import type { MilestoneResponse, MilestoneStatus } from '@/types/roadmap'
import { cn } from '@/lib/utils'

interface RoadmapTimelineProps {
  milestones: MilestoneResponse[]
  onUpdateStatus?: (milestoneId: string, newStatus: MilestoneStatus) => void
}

export function RoadmapTimeline({ milestones, onUpdateStatus }: RoadmapTimelineProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [isAllExpanded, setIsAllExpanded] = useState(false)

  // Expand / Collapse cache helper
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({})

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const handleExpandAll = () => {
    const nextState = !isAllExpanded
    setIsAllExpanded(nextState)
    const newExpanded: Record<string, boolean> = {}
    milestones.forEach(ms => {
      newExpanded[ms.id] = nextState
    })
    setExpandedIds(newExpanded)
  }

  // Filtered milestones list
  const filteredMilestones = useMemo(() => {
    return milestones.filter(ms => {
      const matchesSearch = ms.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (ms.description || '').toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = statusFilter === 'ALL' || ms.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [milestones, searchQuery, statusFilter])

  // Group milestones by Phase Number
  const phases = useMemo(() => {
    const groups: Record<number, MilestoneResponse[]> = {}
    filteredMilestones.forEach(ms => {
      if (!groups[ms.phase_number]) {
        groups[ms.phase_number] = []
      }
      groups[ms.phase_number].push(ms)
    })
    return Object.keys(groups)
      .map(Number)
      .sort((a, b) => a - b)
      .map(phaseNum => ({
        phaseNumber: phaseNum,
        items: groups[phaseNum].sort((a, b) => a.order_index - b.order_index)
      }))
  }, [filteredMilestones])

  return (
    <div className="space-y-6 text-left font-sans text-xs">
      {/* Filters and Search Bar */}
      <Card className="border border-[var(--border)] bg-card/70 backdrop-blur-md rounded-[var(--radius-card)] shadow-sm hover:border-[var(--primary)]/40 transition-all duration-300">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-xs text-left">
            <span className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400">
              <Search size={14} />
            </span>
            <input
              type="text"
              placeholder="Search milestones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9.5 pr-4 py-2 border border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--surface-hover)]/30 text-slate-855 dark:text-slate-205 placeholder-slate-405 focus:outline-none focus:ring-1 focus:ring-brand-500 font-sans shadow-2xs transition-colors h-10"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            <span className="text-[9px] text-muted-foreground font-black flex items-center gap-1.5 mr-2 uppercase tracking-widest leading-none">
              <ListFilter size={14} className="text-slate-400" /> Filter:
            </span>
            {['ALL', 'NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cn(
                  'px-3 py-1.5 rounded-[var(--radius-sm)] text-[9px] uppercase tracking-wider font-black font-sans transition-all cursor-pointer border h-8.5 leading-none',
                  statusFilter === status
                    ? 'bg-brand-500/10 text-brand-655 dark:text-brand-400 border-brand-500/25'
                    : 'bg-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border-slate-202 dark:border-slate-800'
                )}
              >
                {status.replace('_', ' ')}
              </button>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={handleExpandAll}
              className="h-8.5 text-[9px] uppercase tracking-wider font-bold cursor-pointer rounded-[var(--radius-sm)] border-[var(--border)] hover:border-brand-500/30 hover:bg-brand-500/5 transition-all bg-transparent flex items-center gap-1.5 ml-2"
            >
              {isAllExpanded ? <EyeOff size={14} /> : <Eye size={14} />}
              <span>{isAllExpanded ? 'Collapse' : 'Expand'}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Timeline phases */}
      {phases.length === 0 ? (
        <Card className="border border-[var(--border)] bg-card/70 backdrop-blur-md rounded-[var(--radius-card)] shadow-sm hover:border-[var(--primary)]/40 transition-all duration-300">
          <CardContent className="py-12 text-center text-xs text-muted-foreground italic font-medium leading-relaxed">
            No milestones match the active search or filter constraints.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8 relative before:absolute before:inset-0 before:left-[17px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border/60">
          {phases.map((phase) => (
            <div key={phase.phaseNumber} className="space-y-4">
              {/* Phase header */}
              <div className="flex items-center gap-4 relative z-10 text-left">
                <div className="h-9 w-9 bg-brand-500 text-white rounded-full flex items-center justify-center font-display font-extrabold text-sm border-4 border-background shrink-0 shadow-sm leading-none">
                  {phase.phaseNumber}
                </div>
                <div className="space-y-1 text-left">
                  <h3 className="text-sm font-extrabold font-display text-foreground m-0 leading-none">
                    Phase {phase.phaseNumber}
                  </h3>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-black m-0 leading-none">
                    {phase.items.length} Milestones in Phase
                  </p>
                </div>
              </div>

              {/* Milestones inside Phase */}
              <div className="pl-9 space-y-4">
                {phase.items.map((ms) => (
                  <MilestoneCard
                    key={ms.id}
                    milestone={ms}
                    isExpanded={!!expandedIds[ms.id]}
                    onToggleExpand={() => toggleExpand(ms.id)}
                    onUpdateStatus={onUpdateStatus}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
export default RoadmapTimeline
