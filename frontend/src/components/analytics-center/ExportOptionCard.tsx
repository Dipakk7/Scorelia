import React from 'react'
import { motion } from 'framer-motion'
import { FileText, FileSpreadsheet, Table, Code, Presentation, Download } from 'lucide-react'
import { useScoreliaReducedMotion } from '@/lib/motion'
import type { ExportOptionItem, ExportFormatType } from '@/data/analyticsReportsMockData'

interface ExportOptionCardProps {
  option: ExportOptionItem
  onExport?: (option: ExportOptionItem) => void
  className?: string
}

const formatIconMap: Record<ExportFormatType, React.ElementType> = {
  PDF: FileText,
  Excel: FileSpreadsheet,
  CSV: Table,
  JSON: Code,
  PowerPoint: Presentation,
}

export function ExportOptionCard({ option, onExport, className = '' }: ExportOptionCardProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const IconComponent = formatIconMap[option.format] || FileText

  const cardVariants = {
    initial: { scale: 1, y: 0 },
    hover: shouldReduceMotion
      ? {}
      : {
          scale: 1.015,
          y: -2,
          boxShadow: '0 8px 20px -4px rgba(0, 0, 0, 0.4), 0 0 12px rgba(168, 85, 247, 0.15)',
          borderColor: 'rgba(168, 85, 247, 0.35)',
        },
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      tabIndex={0}
      role="article"
      aria-label={`Export format: ${option.name}`}
      className={`flex flex-col justify-between p-4 rounded-2xl bg-[#0f101c] border border-white/10 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 text-left min-h-[150px] ${className}`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`p-2 rounded-xl border shrink-0 ${option.iconBg}`}>
              <IconComponent size={16} className="stroke-[2]" />
            </div>
            <span className="text-xs font-bold text-slate-100 truncate">{option.name}</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold border border-purple-500/30">
            {option.format}
          </span>
        </div>

        <p className="text-xs text-slate-400 font-medium leading-relaxed m-0 my-1 line-clamp-2">
          {option.description}
        </p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-3 text-xs">
        <span className="text-[10px] font-mono text-slate-500">Size: <strong className="text-slate-300">{option.estimatedSize}</strong></span>

        <button
          type="button"
          onClick={() => onExport?.(option)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors shadow-md shadow-purple-900/40 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
        >
          <Download size={13} className="shrink-0" />
          <span>Export {option.format}</span>
        </button>
      </div>
    </motion.div>
  )
}

export default ExportOptionCard
