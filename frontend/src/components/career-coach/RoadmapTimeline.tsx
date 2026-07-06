import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { MilestoneCard } from './MilestoneCard'
import { Button } from '@/components/ui/Button'
import { ListFilter, Eye, EyeOff, Search } from 'lucide-react'
import type { MilestoneResponse, MilestoneStatus } from '@/types/roadmap'

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
    <div className="space-y-6">
      {/* Filters and Search Bar */}
      <Card className="border-slate-200/60 dark:border-slate-800/40 bg-white/40 dark:bg-slate-900/30 backdrop-blur-md">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-xs">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search milestones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mr-2">
              <ListFilter size={14} /> Filter:
            </span>
            {['ALL', 'NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-display transition-all ${
                  statusFilter === status
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                    : 'bg-white dark:bg-slate-950 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={handleExpandAll}
              className="text-xs flex items-center gap-1.5 border-slate-200 dark:border-slate-800 ml-2"
            >
              {isAllExpanded ? <EyeOff size={14} /> : <Eye size={14} />}
              <span>{isAllExpanded ? 'Collapse All' : 'Expand All'}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Timeline phases */}
      {phases.length === 0 ? (
        <Card className="border-slate-200/60 dark:border-slate-800/40 bg-white/40 dark:bg-slate-900/30 backdrop-blur-md">
          <CardContent className="py-12 text-center text-xs text-slate-500 italic">
            No milestones match the active search or filter constraints.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8 relative before:absolute before:inset-0 before:left-[17px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200 dark:before:bg-slate-800">
          {phases.map((phase) => (
            <div key={phase.phaseNumber} className="space-y-4">
              {/* Phase header */}
              <div className="flex items-center gap-4 relative z-10 text-left">
                <div className="h-9 w-9 bg-brand-600 text-white rounded-full flex items-center justify-center font-display font-extrabold text-sm border-4 border-slate-50 dark:border-dark-bg shadow-sm">
                  {phase.phaseNumber}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold font-display text-slate-900 dark:text-white m-0">
                    Phase {phase.phaseNumber}
                  </h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
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
