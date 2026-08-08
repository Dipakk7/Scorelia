import React, { useState } from 'react'
import { useReports } from '@/hooks/useReports'
import { EmptyReportsState } from './EmptyReportsState'
import { ExportCenter } from './ExportCenter'
import { BarChart2, Download, Calendar, Play, FileText, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ReportsWorkspaceProps {
  className?: string
}

export function ReportsWorkspace({ className }: ReportsWorkspaceProps) {
  const { templates, generatedReports, scheduledReports, generateReport, isGenerating } = useReports()
  const [selectedFormat, setSelectedFormat] = useState<Record<string, 'PDF' | 'CSV' | 'JSON'>>({})

  const handleGenerate = async (templateId: string) => {
    const tmpl = templates.find((t) => t.id === templateId)
    const format = selectedFormat[templateId] || tmpl?.supportedFormats[0] || 'PDF'

    const newReport = await generateReport({ templateId, format })

    // Trigger instant download
    const dummyContent = `data:text/plain;charset=utf-8,Scorelia Generated Report: ${newReport.name}\nTemplate: ${newReport.templateName}\nCreated: ${newReport.createdDate}`
    const encodedUri = encodeURI(dummyContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', newReport.name)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className={cn('space-y-6 text-left', className)}>
      {/* 1. Report Templates Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
          <BarChart2 size={16} className="text-purple-400" />
          <span>Available Executive Report Templates ({templates.length})</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
          {templates.map((tmpl) => (
            <div
              key={tmpl.id}
              className="p-5 rounded-2xl bg-[#111322] border border-white/10 hover:border-purple-500/40 shadow-xl space-y-4 transition-all hover:-translate-y-0.5 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] font-bold uppercase tracking-wider">
                    {tmpl.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{tmpl.estimatedGenerationTime}</span>
                </div>

                <h4 className="font-bold text-white text-xs tracking-tight">{tmpl.name}</h4>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{tmpl.description}</p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2 text-xs">
                {/* Format Select */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#0b0c14] border border-white/10 text-slate-300">
                  <span className="text-[10px] text-slate-400 font-medium">Format:</span>
                  <select
                    value={selectedFormat[tmpl.id] || tmpl.supportedFormats[0]}
                    onChange={(e) =>
                      setSelectedFormat((prev) => ({ ...prev, [tmpl.id]: e.target.value as any }))
                    }
                    className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer text-xs font-mono"
                  >
                    {tmpl.supportedFormats.map((fmt) => (
                      <option key={fmt} value={fmt} className="bg-[#111322]">
                        {fmt}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={() => handleGenerate(tmpl.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md cursor-pointer transition-all active:scale-95"
                >
                  <Play size={12} fill="currentColor" />
                  <span>Generate</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Export Center Component */}
      <ExportCenter />

      {/* 3. Generated & Scheduled Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        {/* Generated History */}
        <div className="p-5 rounded-2xl bg-[#111322] border border-white/10 shadow-xl space-y-4 h-full flex flex-col justify-between">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <FileText size={16} className="text-emerald-400" />
            <span>Generated Reports History ({generatedReports.length})</span>
          </h3>

          {generatedReports.length === 0 ? (
            <EmptyReportsState />
          ) : (
            <div className="space-y-2 text-xs">
              {generatedReports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-3 rounded-xl bg-[#0b0c14] border border-white/5 flex items-center justify-between gap-3"
                >
                  <div className="truncate">
                    <span className="font-bold text-white block truncate">{rep.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{rep.templateName} • {rep.size}</span>
                  </div>

                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold">
                    {rep.format}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Scheduled Reports */}
        <div className="p-5 rounded-2xl bg-[#111322] border border-white/10 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Calendar size={16} className="text-blue-400" />
            <span>Scheduled Recurring Reports ({scheduledReports.length})</span>
          </h3>

          <div className="space-y-2.5 text-xs">
            {scheduledReports.map((sch) => (
              <div
                key={sch.id}
                className="p-3.5 rounded-xl bg-[#0b0c14] border border-white/5 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{sch.name}</span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase">
                    {sch.frequency}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>Recipients: {sch.recipients.length} users</span>
                  <span>Next: <strong className="text-purple-300">{sch.nextRun}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportsWorkspace
