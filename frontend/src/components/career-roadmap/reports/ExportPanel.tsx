import React, { useState } from 'react'
import { Download, FileText, Table, Code, Printer, Check } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export interface ExportPanelProps {
  onExportPDF?: () => void
  onExportCSV?: () => void
  onExportJSON?: () => void
  onPrint?: () => void
  className?: string
}

export function ExportPanel({
  onExportPDF,
  onExportCSV,
  onExportJSON,
  onPrint,
  className,
}: ExportPanelProps) {
  const [downloadedFormat, setDownloadedFormat] = useState<string | null>(null)

  const handleTrigger = (format: string, callback?: () => void) => {
    setDownloadedFormat(format)
    if (format === 'print') {
      window.print()
    } else if (format === 'json') {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ report: 'Scorelia V3 Career Roadmap', date: new Date().toISOString() }, null, 2))
      const downloadAnchor = document.createElement('a')
      downloadAnchor.setAttribute('href', dataStr)
      downloadAnchor.setAttribute('download', `Scorelia_Career_Roadmap_Report_${Date.now()}.json`)
      document.body.appendChild(downloadAnchor)
      downloadAnchor.click()
      downloadAnchor.remove()
    } else if (format === 'csv') {
      const csvStr = 'data:text/csv;charset=utf-8,Phase,Skill,Progress,Status\nPhase 1,Python,100%,Completed\nPhase 2,Machine Learning,72%,In Progress\nPhase 3,LLMs,12%,Upcoming\n'
      const downloadAnchor = document.createElement('a')
      downloadAnchor.setAttribute('href', encodeURI(csvStr))
      downloadAnchor.setAttribute('download', `Scorelia_Career_Roadmap_Report_${Date.now()}.csv`)
      document.body.appendChild(downloadAnchor)
      downloadAnchor.click()
      downloadAnchor.remove()
    }
    callback?.()

    setTimeout(() => {
      setDownloadedFormat(null)
    }, 2500)
  }

  const exportFormats = [
    {
      id: 'pdf',
      title: 'Formatted PDF Report',
      description: 'Download a beautifully styled PDF report ready for recruiters and mentors.',
      icon: <FileText className="h-4 w-4 text-purple-400" aria-hidden="true" />,
      actionText: 'Export PDF',
      action: () => handleTrigger('pdf', onExportPDF),
    },
    {
      id: 'csv',
      title: 'CSV Data Spreadsheet',
      description: 'Export raw milestone logs, skill matrices, and topic metrics to CSV.',
      icon: <Table className="h-4 w-4 text-emerald-400" aria-hidden="true" />,
      actionText: 'Export CSV',
      action: () => handleTrigger('csv', onExportCSV),
    },
    {
      id: 'json',
      title: 'JSON API Payload',
      description: 'Export full machine-readable JSON structure for portfolio integration.',
      icon: <Code className="h-4 w-4 text-cyan-400" aria-hidden="true" />,
      actionText: 'Export JSON',
      action: () => handleTrigger('json', onExportJSON),
    },
    {
      id: 'print',
      title: 'Print / Browser PDF',
      description: 'Open clean printer dialog formatted with print stylesheets.',
      icon: <Printer className="h-4 w-4 text-amber-400" aria-hidden="true" />,
      actionText: 'Print Report',
      action: () => handleTrigger('print', onPrint),
    },
  ]

  return (
    <Card className={cn('p-5 sm:p-6 bg-[#121320] border border-white/10 rounded-2xl space-y-4 shadow-sm text-left', className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2 m-0">
            <Download className="h-4 w-4 text-purple-400 shrink-0" aria-hidden="true" />
            <span>Export &amp; Download Report Options</span>
          </h3>
          <p className="text-xs text-slate-400 font-medium m-0">
            Select your preferred export format to save or publish candidate roadmap data
          </p>
        </div>
        <span className="text-[10px] font-bold text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
          4 Formats
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {exportFormats.map((fmt) => {
          const isDone = downloadedFormat === fmt.id

          return (
            <div
              key={fmt.id}
              className="p-4 rounded-xl bg-[#0b0c14] border border-white/10 space-y-3 flex flex-col justify-between text-left hover:border-purple-500/30 transition-all"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10 shrink-0">
                    {fmt.icon}
                  </div>
                  {isDone && (
                    <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      <Check className="h-3 w-3" aria-hidden="true" />
                      Exported
                    </span>
                  )}
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight leading-snug m-0">
                  {fmt.title}
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed m-0">
                  {fmt.description}
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={fmt.action}
                className="w-full justify-center text-xs font-semibold py-1.5 rounded-lg border-white/10 bg-white/5 hover:bg-white/10 hover:text-white cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-500/50"
                aria-label={fmt.actionText}
              >
                <span>{isDone ? 'Exported!' : fmt.actionText}</span>
              </Button>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
export default ExportPanel
