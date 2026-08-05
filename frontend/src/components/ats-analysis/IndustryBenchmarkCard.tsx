import React, { useState } from 'react'
import { Award, TrendingUp, CheckCircle2, BarChart2 } from 'lucide-react'
import { mockIndustryBenchmark, type BenchmarkData } from '@/lib/ats-ai-mock-data'
import { cn } from '@/lib/utils'

interface IndustryBenchmarkCardProps {
  data?: BenchmarkData
  onSelectBenchmark?: (level: string) => void
}

export const IndustryBenchmarkCard: React.FC<IndustryBenchmarkCardProps> = ({
  data = mockIndustryBenchmark,
  onSelectBenchmark,
}) => {
  const safeData = data || mockIndustryBenchmark
  const benchmarks = safeData?.benchmarks ?? []
  const categoryComparison = safeData?.categoryComparison ?? []
  const candidatePercentile = safeData?.candidatePercentile ?? 92

  // Default active selection to Candidate level ("Top Candidates" or score === candidatePercentile)
  const defaultSelectedIndex = benchmarks.findIndex(
    (bm) => bm.score === candidatePercentile || bm.level === 'Top Candidates'
  )
  const [selectedIndex, setSelectedIndex] = useState<number>(
    defaultSelectedIndex >= 0 ? defaultSelectedIndex : benchmarks.length - 1
  )

  const handleCardClick = (idx: number, level: string) => {
    setSelectedIndex(idx)
    if (onSelectBenchmark) {
      onSelectBenchmark(level)
    }
  }

  return (
    <div className="rounded-2xl bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-slate-800/90 p-4 sm:p-5 shadow-xl space-y-4 h-full flex flex-col justify-between">
      {/* 1. Header Section */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="p-1.5 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 shadow-sm shrink-0 flex items-center justify-center mt-0.5">
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-slate-100 tracking-tight leading-snug">
              Industry Benchmark & Peer Comparison
            </h3>
            <p className="text-xs text-slate-400 font-normal mt-0.5 leading-normal">
              Compare your ATS score against Senior Software & AI Engineering cohorts.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-sm shrink-0">
          <TrendingUp className="w-3.5 h-3.5 text-purple-400 shrink-0" />
          <span className="whitespace-nowrap">
            <strong className="text-emerald-400 font-extrabold">{candidatePercentile}nd</strong> Percentile
          </span>
        </div>
      </div>

      {/* 2. Interactive 4 Benchmark KPI Cards */}
      <div className="@container">
        <div className="grid grid-cols-2 @[480px]:grid-cols-4 gap-2.5 items-stretch">
          {benchmarks.map((bm, idx) => {
            const isSelected = idx === selectedIndex
            const isCandidateLevel = bm.score === candidatePercentile || bm.level === 'Top Candidates'

            return (
              <div
                key={idx}
                onClick={() => handleCardClick(idx, bm.level)}
                className={cn(
                  'p-3 rounded-xl flex flex-col justify-between space-y-2 transition-all duration-200 ease-in-out shadow-sm min-w-0 cursor-pointer select-none group h-full relative overflow-hidden',
                  isSelected
                    ? 'bg-gradient-to-b from-purple-950/40 via-slate-950/90 to-slate-950/95 border border-purple-500/50 shadow-md shadow-purple-950/20 ring-1 ring-purple-500/30 hover:border-purple-400/80 hover:shadow-purple-950/40 hover:-translate-y-0.5'
                    : 'bg-slate-950/80 border border-slate-800/80 hover:border-purple-500/40 hover:bg-slate-900/90 hover:shadow-md hover:shadow-purple-500/10 hover:-translate-y-0.5'
                )}
              >
                {/* Header: Level Name & Percentile Badge */}
                <div className="flex items-center justify-between gap-1 min-w-0 h-4">
                  <div className="flex items-center gap-1.5 min-w-0 truncate">
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
                    )}
                    <span
                      className={cn(
                        'text-[11px] font-bold tracking-tight truncate transition-colors duration-200',
                        isSelected ? 'text-purple-200' : 'text-slate-300 group-hover:text-slate-100'
                      )}
                    >
                      {bm.level}
                    </span>
                  </div>

                  <span
                    className={cn(
                      'text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border shrink-0 transition-colors duration-200',
                      isSelected
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-sm'
                        : 'bg-slate-900 text-slate-400 border-slate-800 group-hover:border-slate-700 group-hover:text-slate-300'
                    )}
                  >
                    {bm.percentile}
                  </span>
                </div>

                {/* Score & Candidate / Active Indicator */}
                <div className="space-y-1.5">
                  <div className="flex items-baseline justify-between gap-1">
                    <div className="flex items-baseline gap-0.5">
                      <span
                        className={cn(
                          'text-xl font-extrabold font-mono tracking-tight leading-none transition-colors duration-200',
                          isSelected ? 'text-white' : 'text-slate-100 group-hover:text-white'
                        )}
                      >
                        {bm.score}
                      </span>
                      <span
                        className={cn(
                          'text-[10px] font-semibold font-mono transition-colors duration-200',
                          isSelected ? 'text-purple-300' : 'text-slate-500'
                        )}
                      >
                        %
                      </span>
                    </div>

                    {isCandidateLevel ? (
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 rounded shrink-0 shadow-sm">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                        <span>You</span>
                      </span>
                    ) : isSelected ? (
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-mono font-bold text-purple-300 bg-purple-500/15 border border-purple-500/30 px-1.5 py-0.5 rounded shrink-0 shadow-sm">
                        <span>Active</span>
                      </span>
                    ) : null}
                  </div>

                  {/* Progress Indicator Track */}
                  <div className="h-1.5 w-full bg-slate-950 border border-slate-800/90 rounded-full overflow-hidden shadow-inner">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-300',
                        isSelected
                          ? 'bg-gradient-to-r from-purple-500 via-indigo-400 to-emerald-400 shadow-sm'
                          : 'bg-slate-600 group-hover:bg-purple-400/80'
                      )}
                      style={{ width: `${bm.score}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 3. Category Comparative Breakdown */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 shadow-sm shrink-0 flex items-center justify-center">
              <BarChart2 className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <h4 className="text-xs font-bold text-slate-100 tracking-tight">
              Category Performance vs Senior Benchmark Average
            </h4>
          </div>
        </div>

        <div className="space-y-2">
          {categoryComparison.map((cat, idx) => {
            const delta = cat.candidateScore - cat.benchmarkScore
            const isPositive = delta >= 0

            return (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700/90 hover:bg-slate-900/60 transition-all duration-200 space-y-2 shadow-inner group"
              >
                {/* Header Row */}
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-slate-200 font-sans truncate min-w-0 text-xs group-hover:text-white transition-colors">
                    {cat.category}
                  </span>

                  <div className="flex items-center gap-2.5 shrink-0 font-mono text-[11px]">
                    <span className="text-slate-400 font-medium">
                      Avg: <strong className="text-slate-300 font-semibold">{cat.benchmarkScore}%</strong>
                    </span>
                    <span className="text-slate-700">•</span>
                    <span className="text-emerald-400 font-bold">
                      You: {cat.candidateScore}%
                    </span>
                    <span
                      className={cn(
                        'text-[10px] font-bold px-1.5 py-0.5 rounded font-mono border shadow-sm min-w-[42px] text-center shrink-0',
                        isPositive
                          ? 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30'
                          : 'text-amber-400 bg-amber-500/15 border-amber-500/30'
                      )}
                    >
                      {isPositive ? `+${delta}%` : `${delta}%`}
                    </span>
                  </div>
                </div>

                {/* Progress Bar with Identical Start/End & Benchmark Marker */}
                <div className="relative h-1.5 w-full bg-slate-950 border border-slate-800/90 rounded-full overflow-hidden shadow-inner">
                  {/* Candidate Score Progress Fill */}
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 via-indigo-400 to-emerald-400 rounded-full shadow-sm transition-all duration-500"
                    style={{ width: `${cat.candidateScore}%` }}
                  />

                  {/* Benchmark Average Marker Line */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-slate-200 z-10 shadow-sm pointer-events-none"
                    style={{ left: `${cat.benchmarkScore}%` }}
                    title={`Benchmark Average: ${cat.benchmarkScore}%`}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

