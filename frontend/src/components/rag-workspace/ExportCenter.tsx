import React, { useState } from 'react'
import { Download, FileCode, FileSpreadsheet, FileText, Archive, Check } from 'lucide-react'
import type { ExportFormat } from '@/data/ragReportsMockData'
import { cn } from '@/lib/utils'

export interface ExportCenterProps {
  onGenerateExport: (format: ExportFormat, targets: string[]) => void
  isExporting?: boolean
  className?: string
}

export function ExportCenter({
  onGenerateExport,
  isExporting = false,
  className
}: ExportCenterProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('ZIP')
  const [selectedTargets, setSelectedTargets] = useState<string[]>([
    'Collections',
    'Documents',
    'Analytics'
  ])

  const formats: { id: ExportFormat; label: string; icon: any }[] = [
    { id: 'ZIP', label: 'ZIP Bundle', icon: Archive },
    { id: 'PDF', label: 'PDF Report', icon: FileText },
    { id: 'CSV', label: 'CSV Spreadsheet', icon: FileSpreadsheet },
    { id: 'JSON', label: 'JSON Dataset', icon: FileCode },
    { id: 'Markdown', label: 'Markdown Docs', icon: FileText }
  ]

  const availableTargets = [
    'Collections',
    'Documents',
    'Analytics',
    'Knowledge Graph',
    'Conversation History',
    'Workspace Settings'
  ]

  const toggleTarget = (target: string) => {
    setSelectedTargets((prev) =>
      prev.includes(target) ? prev.filter((t) => t !== target) : [...prev, target]
    )
  }

  return (
    <div className={cn('p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] text-left space-y-4 select-none', className)}>
      <div className="border-b border-[var(--border)] pb-3">
        <h3 className="text-sm font-bold text-[var(--heading)] uppercase tracking-wider flex items-center gap-2 font-sans">
          <Download size={16} className="text-purple-400" />
          Export Center
        </h3>
        <p className="text-xs text-[var(--muted)]">
          Select export formats and target data layers to package workspace data.
        </p>
      </div>

      <div className="space-y-3">
        {/* Format Selector */}
        <div>
          <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider block mb-2">
            1. Select Export Format
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {formats.map((fmt) => {
              const Icon = fmt.icon
              const isSelected = selectedFormat === fmt.id

              return (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => setSelectedFormat(fmt.id)}
                  className={cn(
                    'p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1.5',
                    isSelected
                      ? 'bg-purple-500/10 border-purple-500/50 text-purple-400 shadow-md shadow-purple-900/30'
                      : 'bg-[var(--surface-hover)] border-[var(--border)] text-[var(--heading)] hover:border-purple-500/30'
                  )}
                >
                  <Icon size={16} className={isSelected ? 'text-purple-400' : 'text-[var(--muted)]'} />
                  <span>{fmt.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Target Data Layers Checkboxes */}
        <div>
          <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider block mb-2">
            2. Select Data Targets ({selectedTargets.length} selected)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {availableTargets.map((tgt) => {
              const isChecked = selectedTargets.includes(tgt)

              return (
                <button
                  key={tgt}
                  type="button"
                  onClick={() => toggleTarget(tgt)}
                  className={cn(
                    'p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer flex items-center justify-between',
                    isChecked
                      ? 'bg-purple-500/10 border-purple-500/30 text-purple-400 font-bold'
                      : 'bg-[var(--surface-hover)] border-[var(--border)] text-[var(--muted)] hover:text-[var(--heading)]'
                  )}
                >
                  <span>{tgt}</span>
                  {isChecked && <Check size={14} className="text-purple-400" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Generate Export CTA */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={() => onGenerateExport(selectedFormat, selectedTargets)}
            disabled={isExporting || selectedTargets.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-900/40 cursor-pointer disabled:opacity-50 min-h-[40px] border-none"
          >
            <Download size={15} />
            <span>{isExporting ? 'Generating Export Bundle...' : `Generate ${selectedFormat} Export`}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ExportCenter

