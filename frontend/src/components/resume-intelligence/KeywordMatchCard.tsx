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
    <Card className="bg-[#0b0c14]/95 border border-slate-800/90 p-5 md:p-6 rounded-2xl flex flex-col justify-between backdrop-blur-md h-full shadow-xl select-none">
      {/* Screen Reader Text Description for Donut Chart */}
      <div className="sr-only">
        Keyword Match analysis: {matchPercentage}% keyword coverage match. {matchedCount} matched keywords, {missingCount} missing keywords out of {totalCount} total tracked skills.
      </div>

      <div className="flex items-center justify-between gap-3 mb-4">
        <h3 className="text-base font-extrabold text-white tracking-tight">
          Keyword Match
        </h3>
        <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full shadow-xs">
          {matchPercentage}% Coverage
        </span>
      </div>

      {/* Donut Chart & High-Level Breakdown */}
      <div className="flex items-center justify-between gap-5 my-2">
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
            <span className="text-[10px] text-cyan-400 font-bold mt-1">Good Match</span>
          </div>
        </div>

        {/* High-level Counts */}
        <div className="flex flex-col gap-2 text-xs flex-1">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
            <span className="text-slate-400 font-medium">Matched Keywords</span>
            <span className="font-extrabold text-emerald-400 font-mono">{matchedCount}</span>
          </div>
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
            <span className="text-slate-400 font-medium">Missing Keywords</span>
            <span className="font-extrabold text-rose-400 font-mono">{missingCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Total Tracked</span>
            <span className="font-extrabold text-slate-200 font-mono">{totalCount}</span>
          </div>
        </div>
      </div>

      {/* Category Pills Selector */}
      <div className="mt-4 flex flex-col gap-3">
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar no-scrollbar pb-1">
          {categoriesList.map((cat, idx) => (
            <button
              key={cat.category}
              onClick={() => setSelectedCategoryIdx(idx)}
              className={`px-3.5 py-2 min-h-[38px] rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
                selectedCategoryIdx === idx
                  ? 'bg-purple-600/30 text-white border border-purple-500/50 shadow-md shadow-purple-950/40'
                  : 'bg-[#0e101c] text-slate-400 border border-slate-800/80 hover:text-white hover:bg-slate-900/80 hover:border-slate-700/80'
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
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto custom-scrollbar p-3.5 bg-[#0e101c] rounded-2xl border border-slate-800/90 shadow-sm">
            {matchedKeywordsList.slice(0, 5).map((kw) => (
              <span
                key={kw}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-xs transition-all hover:bg-emerald-500/20 hover:border-emerald-500/40 cursor-default"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                {kw}
              </span>
            ))}
            {missingKeywordsList.slice(0, 3).map((kw) => (
              <span
                key={kw}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 shadow-xs transition-all hover:bg-rose-500/20 hover:border-rose-500/40 cursor-default"
              >
                <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                {kw}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Link */}
      <div className="pt-3 mt-4 border-t border-slate-800/80 flex justify-center">
        <button
          onClick={onViewKeywords}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          aria-label="View Full Keyword Analysis Details"
        >
          <span>View Keywords</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </Card>
  )
}

export default KeywordMatchCard
