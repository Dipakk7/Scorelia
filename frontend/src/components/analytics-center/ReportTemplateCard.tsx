import React from 'react'
import { motion } from 'framer-motion'
import { FileText, Scan, TrendingUp, Activity, Play } from 'lucide-react'
import { useScoreliaReducedMotion } from '@/lib/motion'
import type { ReportTemplateItem } from '@/data/analyticsReportsMockData'

interface ReportTemplateCardProps {
  template: ReportTemplateItem
  onGenerate?: (template: ReportTemplateItem) => void
  className?: string
}

const iconMap: Record<string, React.ElementType> = {
  FileText,
  Scan,
  TrendingUp,
  Activity,
}

export function ReportTemplateCard({ template, onGenerate, className = '' }: ReportTemplateCardProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const IconComponent = iconMap[template.iconName] || FileText

  const cardVariants = {
    initial: { scale: 1, y: 0 },
    hover: shouldReduceMotion
      ? {}
      : {
          scale: 1.015,
          y: -2,
          boxShadow: '0 10px 24px -4px rgba(0, 0, 0, 0.4), 0 0 16px rgba(168, 85, 247, 0.15)',
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
      aria-label={`Report Template: ${template.name}`}
      className={`flex flex-col justify-between p-4 rounded-2xl bg-[#0f101c] border border-white/10 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 text-left min-h-[160px] ${className}`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`p-2 rounded-xl border shrink-0 ${template.iconBg}`}>
              <IconComponent size={16} className="stroke-[2]" />
            </div>
            <span className="text-xs font-bold text-slate-100 truncate">{template.name}</span>
          </div>

          <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono font-bold text-purple-300">
            {template.format}
          </span>
        </div>

        <p className="text-xs text-slate-400 font-medium leading-relaxed m-0 my-1 line-clamp-2">
          {template.description}
        </p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-3 text-xs">
        <span className="text-[10px] font-mono text-slate-500">Est. Time: <strong className="text-slate-300">{template.estimatedGenerationTime}</strong></span>

        <button
          type="button"
          onClick={() => onGenerate?.(template)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors shadow-md shadow-purple-900/40 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
        >
          <Play size={12} className="fill-current shrink-0" />
          <span>Generate</span>
        </button>
      </div>
    </motion.div>
  )
}

export default ReportTemplateCard
