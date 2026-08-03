import React from 'react'
import { Card } from '@/components/ui/Card'
import { ShieldCheck, Cpu } from 'lucide-react'
import { cn } from '@/lib/utils'

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
    {
      id: 'analysis',
      label: 'Analysis Confidence',
      score: confidenceData.analysisConfidence,
      strokeColor: '#a855f7',
      gradientId: 'purpleRingGrad',
      gradStops: { start: '#c084fc', end: '#7c3aed' },
      glowClass: 'drop-shadow-[0_0_6px_rgba(168,85,247,0.5)]',
      textColor: 'text-purple-300',
    },
    {
      id: 'ats',
      label: 'ATS Scanner Confidence',
      score: confidenceData.atsConfidence,
      strokeColor: '#10b981',
      gradientId: 'greenRingGrad',
      gradStops: { start: '#34d399', end: '#059669' },
      glowClass: 'drop-shadow-[0_0_6px_rgba(16,185,129,0.5)]',
      textColor: 'text-emerald-400',
    },
    {
      id: 'keyword',
      label: 'Keyword Match Confidence',
      score: confidenceData.keywordConfidence,
      strokeColor: '#38bdf8',
      gradientId: 'cyanRingGrad',
      gradStops: { start: '#38bdf8', end: '#0284c7' },
      glowClass: 'drop-shadow-[0_0_6px_rgba(56,189,248,0.5)]',
      textColor: 'text-sky-300',
    },
    {
      id: 'formatting',
      label: 'Formatting Parse Confidence',
      score: confidenceData.formattingConfidence,
      strokeColor: '#f97316',
      gradientId: 'orangeRingGrad',
      gradStops: { start: '#fb923c', end: '#ea580c' },
      glowClass: 'drop-shadow-[0_0_6px_rgba(249,115,22,0.5)]',
      textColor: 'text-amber-400',
    },
  ]

  // SVG ring dimensions
  const radius = 22
  const strokeWidth = 4.5
  const circumference = 2 * Math.PI * radius

  return (
    <Card className="bg-[#0b0c14]/95 border border-slate-800/90 p-5 rounded-2xl flex flex-col justify-between backdrop-blur-md shadow-xl select-none h-full">
      {/* Card Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 shadow-xs">
            <Cpu className="w-4 h-4 text-purple-300 shrink-0" />
          </div>
          <h3 className="text-xs font-extrabold text-white tracking-tight">
            AI Engine Confidence
          </h3>
        </div>
        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
          <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
          Verified
        </span>
      </div>

      {/* 2x2 Analytics Layout */}
      <div className="grid grid-cols-2 gap-2.5 flex-1 items-stretch">
        {items.map((item) => {
          const dashOffset = circumference * (1 - item.score / 100)

          return (
            <div
              key={item.id}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#121424]/90 border border-slate-800/80 shadow-sm hover:border-purple-500/40 hover:bg-[#17192d] transition-all duration-200 group text-center"
            >
              {/* Circular Progress Ring */}
              <div className="relative w-14 h-14 flex items-center justify-center">
                <svg viewBox="0 0 54 54" className="w-full h-full transform -rotate-90 overflow-visible">
                  <defs>
                    <linearGradient id={item.gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={item.gradStops.start} />
                      <stop offset="100%" stopColor={item.gradStops.end} />
                    </linearGradient>
                  </defs>

                  {/* Dark Track Ring */}
                  <circle
                    cx="27"
                    cy="27"
                    r={radius}
                    stroke="#1e293b"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeOpacity="0.8"
                  />

                  {/* Gradient Progress Ring */}
                  <circle
                    cx="27"
                    cy="27"
                    r={radius}
                    stroke={`url(#${item.gradientId})`}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    strokeLinecap="round"
                    className={cn('transition-all duration-1000 ease-out', item.glowClass)}
                  />
                </svg>

                {/* Percentage text inside circle */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-mono text-xs font-black text-white tracking-tighter">
                    {item.score}%
                  </span>
                </div>
              </div>

              {/* Metric Label Underneath */}
              <span className="text-[10.5px] font-bold text-slate-300 leading-tight mt-2 transition-colors group-hover:text-white">
                {item.label}
              </span>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

export default AIConfidenceCard

