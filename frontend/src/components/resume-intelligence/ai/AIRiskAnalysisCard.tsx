import React from 'react'
import { Card } from '@/components/ui/Card'
import { ShieldAlert, AlertCircle, AlertTriangle, Info, Wrench, Sparkles, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ATSWarningItem } from '@/lib/mock-ai-insights'

interface AIRiskAnalysisCardProps {
  warnings?: ATSWarningItem[]
  onFixClick?: (id: string) => void
}

const defaultWarnings: ATSWarningItem[] = [
  {
    id: 'w1',
    title: 'Missing MLOps & Infrastructure Keywords',
    severity: 'Critical',
    explanation: 'Scanners flagged low density for container orchestration tools (Kubernetes, Helm).',
    recommendedFix: 'Add Kubernetes and Docker containerization to Skills section.',
  },
  {
    id: 'w2',
    title: 'Bulleted Paragraph Over 3 Lines',
    severity: 'Warning',
    explanation: 'Long bullet in Senior AI Engineer role reduces readability score by 6 pts.',
    recommendedFix: 'Split into two 1-2 line action bullets starting with strong verbs.',
  },
  {
    id: 'w3',
    title: 'Generic Soft Skills Listed',
    severity: 'Info',
    explanation: 'Standalone soft skills have low ATS weighting without quantified achievements.',
    recommendedFix: 'Pair soft skills with specific project deliverables.',
  },
]

export const AIRiskAnalysisCard: React.FC<AIRiskAnalysisCardProps> = ({
  warnings = defaultWarnings,
  onFixClick,
}) => {
  const warningsList = warnings && warnings.length > 0 ? warnings : defaultWarnings

  return (
    <Card className="bg-[#0b0c14]/95 border border-slate-800/90 p-5 md:p-6 rounded-2xl flex flex-col justify-between backdrop-blur-md h-full shadow-xl select-none">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-600/20 border border-rose-500/30 text-rose-300 shadow-xs shrink-0">
            <ShieldAlert className="w-4 h-4 text-rose-300 filter drop-shadow-[0_0_4px_rgba(244,63,94,0.4)]" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-extrabold text-white tracking-tight">
              ATS Risk & Formatting Diagnostics
            </h3>
            <p className="text-xs font-medium text-slate-400 mt-0.5">
              Flags potential issues that cause ATS parsing rejections
            </p>
          </div>
        </div>

        <span className="flex items-center gap-1.5 text-xs font-black text-rose-400 font-mono bg-rose-500/15 border border-rose-500/30 px-3 py-1 rounded-full shadow-xs shrink-0">
          {warningsList.length} Risks Flagged
        </span>
      </div>

      {/* Warnings List */}
      <div className="flex flex-col gap-3.5 flex-1 justify-center">
        {warningsList.map((item) => (
          <div
            key={item.id}
            className={cn(
              'p-4 rounded-xl bg-[#121424]/95 border border-slate-800/90 shadow-sm hover:border-slate-700/90 hover:bg-[#16182c] hover:-translate-y-0.5 transition-all duration-200 flex flex-col gap-3 group relative overflow-hidden',
              item.severity === 'Critical' && 'border-l-4 border-l-rose-500',
              item.severity === 'Warning' && 'border-l-4 border-l-amber-500',
              item.severity === 'Info' && 'border-l-4 border-l-sky-500'
            )}
          >
            {/* Top Title & Enterprise Severity Chip */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                {item.severity === 'Critical' && (
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 stroke-[2.5]" />
                )}
                {item.severity === 'Warning' && (
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 stroke-[2.5]" />
                )}
                {item.severity === 'Info' && (
                  <Info className="w-4 h-4 text-sky-400 shrink-0 stroke-[2.5]" />
                )}

                <h4 className="text-xs md:text-sm font-extrabold text-white tracking-tight truncate">
                  {item.title}
                </h4>
              </div>

              {/* Enterprise Severity Chip */}
              <span
                className={cn(
                  'text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border font-mono uppercase tracking-wider shrink-0 shadow-xs',
                  item.severity === 'Critical' &&
                    'bg-rose-500/20 text-rose-300 border-rose-500/40',
                  item.severity === 'Warning' &&
                    'bg-amber-500/20 text-amber-300 border-amber-500/40',
                  item.severity === 'Info' &&
                    'bg-sky-500/20 text-sky-300 border-sky-500/40'
                )}
              >
                {item.severity}
              </span>
            </div>

            {/* Diagnostic Explanation */}
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              {item.explanation}
            </p>

            {/* Fix Recommendation Box & Auto Fix Button */}
            <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-inner">
              <div className="flex items-start gap-2.5 min-w-0">
                <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5 filter drop-shadow-[0_0_4px_rgba(168,85,247,0.5)]" />
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-extrabold text-purple-300 uppercase tracking-wider">
                    Fix Recommendation
                  </span>
                  <span className="text-xs text-slate-200 font-semibold leading-relaxed mt-0.5">
                    {item.recommendedFix}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onFixClick?.(item.id)}
                className="shrink-0 self-end sm:self-center inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-600/20 hover:bg-purple-600 border border-purple-500/40 hover:border-purple-400 text-purple-200 hover:text-white text-xs font-extrabold transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md hover:shadow-purple-500/20 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Wrench className="w-3.5 h-3.5 text-purple-300 group-hover:text-white shrink-0" />
                <span>Auto Fix</span>
                <ArrowRight className="w-3.5 h-3.5 text-purple-300 group-hover:text-white shrink-0 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default AIRiskAnalysisCard

