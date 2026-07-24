import React from 'react'
import { Card } from '@/components/ui/Card'
import { ShieldAlert, AlertCircle, Info, Wrench } from 'lucide-react'
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
    <Card className="bg-[#0b0c14]/90 border-slate-800/80 p-5 md:p-6 rounded-2xl flex flex-col justify-between backdrop-blur-md h-full shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-rose-600/20 border border-rose-500/30 text-rose-300">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 tracking-tight">
              ATS Risk & Formatting Diagnostics
            </h3>
            <p className="text-[11px] text-slate-400">
              Flags potential issues that cause ATS parsing rejections
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono">
          {warningsList.length} Risks Flagged
        </span>
      </div>

      {/* Warnings List */}
      <div className="flex flex-col gap-3 flex-1 justify-center">
        {warningsList.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2 hover:border-slate-700/80 transition-all"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {item.severity === 'Critical' && (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                {item.severity === 'Warning' && (
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                )}
                {item.severity === 'Info' && (
                  <Info className="w-4 h-4 text-sky-400 shrink-0" />
                )}

                <span className="text-xs font-bold text-slate-100 tracking-tight">
                  {item.title}
                </span>
              </div>

              <span
                className={cn(
                  'text-[10px] font-bold px-2 py-0.2 rounded-full border font-mono',
                  item.severity === 'Critical' &&
                    'bg-rose-500/10 text-rose-400 border-rose-500/20',
                  item.severity === 'Warning' &&
                    'bg-amber-500/10 text-amber-400 border-amber-500/20',
                  item.severity === 'Info' &&
                    'bg-sky-500/10 text-sky-400 border-sky-500/20'
                )}
              >
                {item.severity}
              </span>
            </div>

            <p className="text-xs text-slate-300 pl-6 leading-relaxed">
              {item.explanation}
            </p>

            <div className="ml-6 mt-1 p-2 rounded-lg bg-slate-950/60 border border-slate-900 flex items-center justify-between gap-2 text-xs">
              <span className="text-purple-300 font-medium truncate">
                💡 <strong className="font-semibold text-slate-200">Fix:</strong> {item.recommendedFix}
              </span>

              <button
                onClick={() => onFixClick?.(item.id)}
                className="shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
              >
                <Wrench className="w-3 h-3" />
                <span>Auto Fix</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default AIRiskAnalysisCard
