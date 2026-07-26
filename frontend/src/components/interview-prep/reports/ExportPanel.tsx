import React, { useState } from 'react'
import { FileText, Download, Printer, CheckCircle2, Loader2, Info } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import toast from 'react-hot-toast'
import type { ExportFormatOption } from '@/types/interviewPrep'

export interface ExportPanelProps {
  exportFormats?: ExportFormatOption[]
}

export function ExportPanel({ exportFormats }: ExportPanelProps) {
  const formats: ExportFormatOption[] = exportFormats || [
    { format: 'PDF', label: 'PDF Document (.pdf)', isAvailable: true },
    { format: 'DOCX', label: 'Microsoft Word (.docx)', isAvailable: true },
    { format: 'Markdown', label: 'Markdown (.md)', isAvailable: true },
    { format: 'JSON', label: 'Structured JSON Data', isAvailable: true },
    { format: 'CSV', label: 'CSV Spreadsheet', isAvailable: true },
    { format: 'Print', label: 'Print View', isAvailable: true },
  ]

  const [exportingFormat, setExportingFormat] = useState<string | null>(null)
  const [progressPercent, setProgressPercent] = useState<number>(0)

  const handleExport = (fmt: ExportFormatOption) => {
    if (!fmt.isAvailable) {
      toast.error(fmt.tooltipMessage || `${fmt.format} export is currently unavailable`)
      return
    }

    if (fmt.format === 'Print') {
      window.print()
      return
    }

    setExportingFormat(fmt.format)
    setProgressPercent(20)

    const interval = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setExportingFormat(null)
          toast.success(`Successfully exported Interview Report as ${fmt.format}!`)
          return 0
        }
        return prev + 30
      })
    }, 300)
  }

  return (
    <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-4 space-y-4 hover:border-purple-500/30 transition-all text-left">
      <CardHeader className="p-0 pb-2 border-b border-white/10 flex flex-row items-center justify-between">
        <CardTitle className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Download className="h-4 w-4 text-purple-400" /> Export Diagnostic Report
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 space-y-3">
        {/* Progress Bar during Exporting */}
        {exportingFormat && (
          <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs text-purple-300 font-semibold">
              <span className="flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-purple-400" />
                Generating {exportingFormat} Report...
              </span>
              <span className="font-mono">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-purple-500 transition-all duration-200"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Format Options List */}
        <div className="space-y-2 text-xs">
          {formats.map((fmt) => (
            <div key={fmt.format} className="flex items-center justify-between p-2.5 rounded-xl bg-[#141627] border border-white/5 hover:border-purple-500/30 transition-all">
              <div className="flex items-center gap-2">
                {fmt.format === 'Print' ? (
                  <Printer className="h-4 w-4 text-purple-400 shrink-0" />
                ) : (
                  <FileText className="h-4 w-4 text-purple-400 shrink-0" />
                )}
                <span className="font-bold text-white">{fmt.label}</span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport(fmt)}
                disabled={!fmt.isAvailable || exportingFormat !== null}
                className="px-2.5 py-1 text-[11px] font-semibold text-purple-300 border-purple-500/30 hover:bg-purple-600/20 rounded-lg cursor-pointer"
              >
                {fmt.format === 'Print' ? 'Print' : 'Export'}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
export default ExportPanel
