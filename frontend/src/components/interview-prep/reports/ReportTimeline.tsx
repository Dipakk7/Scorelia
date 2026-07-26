import React from 'react'
import { History, FileSpreadsheet, Video, BookOpen, Flame } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { ReportTimelineItem } from '@/types/interviewPrep'

export interface ReportTimelineProps {
  timeline?: ReportTimelineItem[]
}

export function ReportTimeline({ timeline }: ReportTimelineProps) {
  const items: ReportTimelineItem[] = timeline || [
    { id: 'rpt-1', date: 'May 20, 2026', title: 'Generated FAANG Readiness Diagnostic Report', category: 'Report Generated', scoreBadge: '87% Index' },
    { id: 'rpt-2', date: 'May 18, 2026', title: 'Completed System Design HNSW Vector Index Round', category: 'Mock Interview', scoreBadge: '84% Score' },
    { id: 'rpt-3', date: 'May 16, 2026', title: 'Hit 500+ Question Bank Milestone', category: 'Milestone', scoreBadge: '500+ Questions' },
    { id: 'rpt-4', date: 'May 12, 2026', title: 'Achieved 5-Day Practice Streak', category: 'Practice', scoreBadge: '🔥 5 Days' },
  ]

  const getIcon = (cat: string) => {
    switch (cat) {
      case 'Report Generated':
        return FileSpreadsheet
      case 'Mock Interview':
        return Video
      case 'Milestone':
        return BookOpen
      case 'Practice':
        return Flame
      default:
        return History
    }
  }

  return (
    <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-4 space-y-4 hover:border-purple-500/30 transition-all text-left">
      <CardHeader className="p-0 pb-2 border-b border-white/10 flex flex-row items-center justify-between">
        <CardTitle className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <History className="h-4 w-4 text-purple-400" /> Chronological Report Timeline
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 space-y-3">
        {items.map((it) => {
          const Icon = getIcon(it.category)
          return (
            <div key={it.id} className="p-2.5 rounded-xl bg-[#141627] border border-white/5 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                  <span className="truncate">{it.title}</span>
                </span>
                {it.scoreBadge && (
                  <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20 text-[9px] font-bold">
                    {it.scoreBadge}
                  </Badge>
                )}
              </div>
              <span className="text-[10px] text-slate-400 font-mono block">{it.date}</span>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
export default ReportTimeline
