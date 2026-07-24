import React, { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { ArrowRight, CheckCircle2, XCircle } from 'lucide-react'

export interface KeywordCategoryItem {
  category: string
  matched: string[]
  missing: string[]
}

interface KeywordMatchCardProps {
  matchPercentage?: number
  matchedCount?: number
  missingCount?: number
  totalCount?: number
  categories?: KeywordCategoryItem[]
  onViewKeywords?: () => void
}

const defaultCategories: KeywordCategoryItem[] = [
  {
    category: 'AI & ML Core',
    matched: ['PyTorch', 'TensorFlow', 'Transformers', 'LLMs', 'NLP'],
    missing: ['Triton', 'vLLM'],
  },
  {
    category: 'Backend & APIs',
    matched: ['Python', 'FastAPI', 'Docker', 'PostgreSQL', 'Redis'],
    missing: ['Kubernetes', 'gRPC'],
  },
  {
    category: 'Cloud & DevOps',
    matched: ['AWS', 'S3', 'Docker', 'CI/CD'],
    missing: ['Terraform', 'GCP'],
  },
]

export const KeywordMatchCard: React.FC<KeywordMatchCardProps> = ({
  matchPercentage = 78,
  matchedCount = 78,
  missingCount = 22,
  totalCount = 100,
  categories = defaultCategories,
  onViewKeywords,
}) => {
  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState(0)

  const categoriesList = categories && categories.length > 0 ? categories : defaultCategories
  const activeCategory = categoriesList[selectedCategoryIdx] || categoriesList[0] || defaultCategories[0]

  const radius = 42
  const strokeWidth = 10
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (matchPercentage / 100) * circumference

  const matchedKeywordsList = activeCategory?.matched || []
  const missingKeywordsList = activeCategory?.missing || []

  return (
    <Card className="bg-[#0b0c14]/90 border-slate-800/80 p-5 rounded-2xl flex flex-col justify-between backdrop-blur-md h-full shadow-lg">
      {/* Screen Reader Text Description for Donut Chart */}
      <div className="sr-only">
        Keyword Match analysis: {matchPercentage}% keyword coverage match. {matchedCount} matched keywords, {missingCount} missing keywords out of {totalCount} total tracked skills.
      </div>

      <div className="flex items-center justify-between gap-2 mb-3">
        <h3 className="text-sm font-semibold text-slate-200 tracking-tight">
          Keyword Match
        </h3>
        <span className="text-[11px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
          {matchPercentage}% Coverage
        </span>
      </div>

      {/* Donut Chart & High-Level Breakdown */}
      <div className="flex items-center justify-between gap-4">
        {/* Donut Chart */}
        <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
          <svg className="w-24 h-24 -rotate-90 transform" viewBox="0 0 100 100" role="img" aria-label={`Keyword match donut chart: ${matchPercentage}%`}>
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#1e293b"
              strokeWidth={strokeWidth}
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#06b6d4"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out motion-reduce:transition-none"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xl font-extrabold text-white leading-none font-mono">
              {matchPercentage}%
            </span>
            <span className="text-[9px] text-cyan-400 font-semibold mt-0.5">Good Match</span>
          </div>
        </div>

        {/* High-level Counts */}
        <div className="flex flex-col gap-1.5 text-xs flex-1">
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-1">
            <span className="text-slate-400 font-medium">Matched Keywords</span>
            <span className="font-bold text-emerald-400 font-mono">{matchedCount}</span>
          </div>
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-1">
            <span className="text-slate-400 font-medium">Missing Keywords</span>
            <span className="font-bold text-rose-400 font-mono">{missingCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Total Tracked</span>
            <span className="font-bold text-slate-300 font-mono">{totalCount}</span>
          </div>
        </div>
      </div>

      {/* Category Pills Selector */}
      <div className="mt-3 flex flex-col gap-2">
        <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar no-scrollbar pb-1">
          {categoriesList.map((cat, idx) => (
            <button
              key={cat.category}
              onClick={() => setSelectedCategoryIdx(idx)}
              className={`px-3 py-2 min-h-[44px] rounded-lg text-[10px] font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
                selectedCategoryIdx === idx
                  ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
              aria-selected={selectedCategoryIdx === idx}
              aria-label={`Select ${cat.category} keyword category`}
            >
              {cat.category}
            </button>
          ))}
        </div>

        {/* Keyword Pills Preview Cloud */}
        {activeCategory && (
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto custom-scrollbar p-2 bg-slate-950/60 rounded-xl border border-slate-900">
            {matchedKeywordsList.slice(0, 4).map((kw) => (
              <span
                key={kw}
                className="inline-flex items-center gap-1 px-2 py-1 min-h-[32px] rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              >
                <CheckCircle2 className="w-2.5 h-2.5" />
                {kw}
              </span>
            ))}
            {missingKeywordsList.slice(0, 2).map((kw) => (
              <span
                key={kw}
                className="inline-flex items-center gap-1 px-2 py-1 min-h-[32px] rounded-md text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20"
              >
                <XCircle className="w-2.5 h-2.5" />
                {kw}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Link */}
      <div className="pt-3 mt-3 border-t border-slate-800/60 flex justify-center">
        <button
          onClick={onViewKeywords}
          className="inline-flex items-center gap-1.5 min-h-[44px] text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          aria-label="View Full Keyword Analysis Details"
        >
          <span>View Keywords</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </Card>
  )
}

export default KeywordMatchCard
