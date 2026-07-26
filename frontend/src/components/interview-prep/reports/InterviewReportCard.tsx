import React from 'react'
import { Video, Award, Calendar, CheckCircle2, ChevronRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { InterviewReportDetails } from '@/types/interviewPrep'

export interface InterviewReportCardProps {
  reports: InterviewReportDetails[]
  onSelectReport?: (report: InterviewReportDetails) => void
}

export function InterviewReportCard({ reports, onSelectReport }: InterviewReportCardProps) {
  return (
    <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-5 space-y-4 hover:border-purple-500/30 transition-all text-left">
      <CardHeader className="p-0 pb-3 flex flex-row items-center justify-between border-b border-white/10">
        <CardTitle className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Video className="h-4 w-4 text-purple-400" /> Generated Diagnostic Reports
        </CardTitle>
        <span className="text-[10px] text-slate-400 font-mono font-semibold">{reports.length} Reports</span>
      </CardHeader>

      <CardContent className="p-0 space-y-3">
        {reports.map((rep) => (
          <div
            key={rep.reportId}
            onClick={() => onSelectReport && onSelectReport(rep)}
            className="p-4 rounded-xl bg-[#141627] border border-white/5 hover:border-purple-500/30 transition-all cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-500/15 text-purple-300 border-purple-500/30 text-[10px] font-bold">
                  {rep.reportType}
                </Badge>
                <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                  {rep.title}
                </h4>
              </div>

              <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                <Calendar className="h-3 w-3" /> {rep.generatedDate}
              </span>
            </div>

            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              {rep.summaryText}
            </p>

            <div className="space-y-1 pt-1">
              {rep.keyHighlights.map((hl, i) => (
                <div key={i} className="flex items-center gap-2 text-[11px] text-slate-300 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                  <span>{hl}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
export default InterviewReportCard
