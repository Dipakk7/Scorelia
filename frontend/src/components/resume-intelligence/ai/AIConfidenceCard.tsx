import React from 'react'
import { Card } from '@/components/ui/Card'
import { ShieldCheck, Cpu } from 'lucide-react'

interface AIConfidenceCardProps {
  confidenceData?: {
    analysisConfidence: number
    atsConfidence: number
    keywordConfidence: number
    formattingConfidence: number
  }
}

const defaultConfidence = {
  analysisConfidence: 96,
  atsConfidence: 98,
  keywordConfidence: 92,
  formattingConfidence: 95,
}

export const AIConfidenceCard: React.FC<AIConfidenceCardProps> = ({
  confidenceData = defaultConfidence,
}) => {
  const items = [
    { label: 'Analysis Confidence', score: confidenceData.analysisConfidence, color: 'from-purple-500 to-indigo-500' },
    { label: 'ATS Scanner Confidence', score: confidenceData.atsConfidence, color: 'from-emerald-500 to-teal-400' },
    { label: 'Keyword Match Confidence', score: confidenceData.keywordConfidence, color: 'from-amber-500 to-orange-400' },
    { label: 'Formatting Parse Confidence', score: confidenceData.formattingConfidence, color: 'from-cyan-500 to-blue-500' },
  ]

  return (
    <Card className="bg-[#0b0c14]/90 border-slate-800/80 p-5 rounded-2xl flex flex-col justify-between backdrop-blur-md shadow-lg">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-600/20 border border-purple-500/30 text-purple-300">
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-semibold text-slate-200 tracking-tight">
            AI Engine Confidence
          </h3>
        </div>
        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
          <ShieldCheck className="w-3 h-3" />
          Verified
        </span>
      </div>

      <div className="flex flex-col gap-2.5 flex-1 justify-center">
        {items.map((item, idx) => (
          <div key={idx} className="flex flex-col gap-1 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-[11px] font-medium">{item.label}</span>
              <span className="font-mono font-bold text-slate-100">{item.score}%</span>
            </div>

            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800/60 p-0.5">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-1000 ease-out`}
                style={{ width: `${item.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default AIConfidenceCard
