import React from 'react'
import { FileText, Cpu, CheckCircle2, AlertCircle, FileCode, FileType } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface DocumentPipelinePanelProps {
  className?: string
}

export function DocumentPipelinePanel({ className }: DocumentPipelinePanelProps) {
  const fileTypeDistribution = [
    { format: 'PDF Documents', count: 48, percentage: '56%', icon: FileText, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
    { format: 'Markdown Files', count: 24, percentage: '28%', icon: FileType, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
    { format: 'Code Source', count: 14, percentage: '16%', icon: FileCode, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  ]

  return (
    <div className={cn('space-y-4 text-left select-none', className)}>
      {/* Pipeline Status Summary */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-inner">
              <Cpu size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Ingestion Pipeline</h3>
              <p className="text-[11px] font-medium text-slate-400 font-mono">Parser: Unstructured + PyPDF</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
            <CheckCircle2 size={11} /> 12 Mb/s
          </span>
        </div>

        {/* Live Ingestion Stats */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="text-[10px] text-slate-400">Average Chunk Size</div>
            <div className="font-bold text-white text-xs mt-0.5 font-mono">512 Tokens</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="text-[10px] text-slate-400">Chunk Overlap</div>
            <div className="font-bold text-white text-xs mt-0.5 font-mono">64 Tokens</div>
          </div>
        </div>

        {/* Supported Format Distribution */}
        <div className="space-y-2 pt-1">
          <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Format Breakdown</div>
          {fileTypeDistribution.map((item, idx) => {
            const Icon = item.icon
            return (
              <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs">
                <div className="flex items-center gap-2">
                  <div className={cn('p-1 rounded-lg border', item.color)}>
                    <Icon size={13} />
                  </div>
                  <span className="font-semibold text-slate-200">{item.format}</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="text-white font-bold">{item.count}</span>
                  <span className="text-slate-400">({item.percentage})</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Storage Guidelines Card */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md space-y-2">
        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
          <AlertCircle size={14} className="text-purple-400" />
          Ingestion Best Practices
        </h4>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Ensure PDF documents are clear text or OCR processed. For code repositories, include standard docstrings for max chunk density.
        </p>
      </div>
    </div>
  )
}

export default DocumentPipelinePanel
