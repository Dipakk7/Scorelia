import React, { useState } from 'react'
import { Card } from '@/components/ui/Card'
import {
  FileCheck2,
  CheckCircle,
  LayoutGrid,
  KeyRound,
  Trophy,
  BookOpen,
  GraduationCap,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface BreakdownItem {
  id: string
  label: string
  score: number
  maxScore: number
  statusText?: string
  color: string
  trackColor: string
}

interface ScoreBreakdownCardProps {
  items?: BreakdownItem[]
  onViewTips?: () => void
}

const defaultItems: BreakdownItem[] = [
  {
    id: 'ats-compatibility',
    label: 'ATS Compatibility',
    score: 98,
    maxScore: 100,
    statusText: 'Optimal',
    color: 'text-emerald-400',
    trackColor: 'from-emerald-500 to-teal-400',
  },
  {
    id: 'content-quality',
    label: 'Content Quality',
    score: 88,
    maxScore: 100,
    statusText: 'Strong',
    color: 'text-purple-400',
    trackColor: 'from-purple-500 to-pink-500',
  },
  {
    id: 'readability',
    label: 'Readability & Flow',
    score: 89,
    maxScore: 100,
    statusText: 'Good',
    color: 'text-teal-400',
    trackColor: 'from-teal-500 to-cyan-400',
  },
  {
    id: 'skills-keywords',
    label: 'Skills & Keywords',
    score: 90,
    maxScore: 100,
    statusText: 'High Match',
    color: 'text-amber-400',
    trackColor: 'from-amber-500 to-orange-400',
  },
  {
    id: 'experience-impact',
    label: 'Experience & Impact',
    score: 92,
    maxScore: 100,
    statusText: 'Quantified',
    color: 'text-indigo-400',
    trackColor: 'from-indigo-500 to-purple-500',
  },
  {
    id: 'projects-relevance',
    label: 'Project Relevance',
    score: 91,
    maxScore: 100,
    statusText: 'Verified',
    color: 'text-sky-400',
    trackColor: 'from-sky-500 to-blue-500',
  },
  {
    id: 'education-certs',
    label: 'Education & Certs',
    score: 85,
    maxScore: 100,
    statusText: 'Standard',
    color: 'text-blue-400',
    trackColor: 'from-blue-500 to-indigo-400',
  },
  {
    id: 'structure-formatting',
    label: 'Formatting & Layout',
    score: 93,
    maxScore: 100,
    statusText: 'Clean',
    color: 'text-cyan-400',
    trackColor: 'from-cyan-500 to-sky-400',
  },
]

const getMetricIcon = (id: string) => {
  switch (id) {
    case 'ats-compatibility':
      return CheckCircle
    case 'content-quality':
      return FileCheck2
    case 'readability':
      return BookOpen
    case 'skills-keywords':
      return KeyRound
    case 'experience-impact':
      return Trophy
    case 'projects-relevance':
      return Sparkles
    case 'education-certs':
      return GraduationCap
    case 'structure-formatting':
    default:
      return LayoutGrid
  }
}

export const ScoreBreakdownCard: React.FC<ScoreBreakdownCardProps> = ({
  items = defaultItems,
  onViewTips,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <Card className="bg-[#0b0c14]/90 border-slate-800/80 p-5 md:p-6 rounded-2xl flex flex-col justify-between backdrop-blur-md h-full shadow-lg">
      {/* Card Header */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-200 tracking-tight">
          Score Breakdown
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Detailed breakdown of how your resume performs across 8 key areas.
        </p>
      </div>

      {/* Progress Bars Grid List */}
      <div className="flex flex-col gap-3 flex-1 justify-center">
        {items.map((item) => {
          const Icon = getMetricIcon(item.id)
          const percentage = Math.round((item.score / item.maxScore) * 100)
          const isHovered = hoveredId === item.id

          return (
            <div
              key={item.id}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={cn(
                'flex flex-col gap-1 p-1.5 rounded-xl transition-all',
                isHovered ? 'bg-slate-900/60' : 'bg-transparent'
              )}
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-slate-900 border border-slate-800">
                    <Icon className={cn('w-3.5 h-3.5', item.color)} />
                  </div>
                  <span className="font-semibold text-slate-200 tracking-tight">
                    {item.label}
                  </span>
                  {item.statusText && (
                    <span className="text-[10px] text-slate-400 font-normal hidden sm:inline-block">
                      ({item.statusText})
                    </span>
                  )}
                </div>
                <span className="font-mono font-bold text-slate-200">
                  {item.score}/{item.maxScore}
                </span>
              </div>

              {/* Progress Bar Container with ARIA accessibility */}
              <div
                role="progressbar"
                aria-valuenow={item.score}
                aria-valuemin={0}
                aria-valuemax={item.maxScore}
                aria-label={`${item.label} score ${item.score} of ${item.maxScore}`}
                className="h-2 w-full bg-slate-900/90 rounded-full overflow-hidden border border-slate-800/80 p-0.5"
              >
                <div
                  className={cn(
                    'h-full rounded-full bg-gradient-to-r transition-all duration-1000 ease-out',
                    item.trackColor
                  )}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer Link */}
      <div className="pt-3 mt-2 border-t border-slate-800/60 flex justify-center">
        <button
          onClick={onViewTips}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors cursor-pointer focus:outline-none"
        >
          <span>View Improvement Tips</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </Card>
  )
}

export default ScoreBreakdownCard
