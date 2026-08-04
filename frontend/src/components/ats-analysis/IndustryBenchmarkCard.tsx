import React from 'react'
import { Award, TrendingUp, CheckCircle2, BarChart2 } from 'lucide-react'
import { mockIndustryBenchmark, type BenchmarkData } from '@/lib/ats-ai-mock-data'
import { cn } from '@/lib/utils'

interface IndustryBenchmarkCardProps {
  data?: BenchmarkData
}

export const IndustryBenchmarkCard: React.FC<IndustryBenchmarkCardProps> = ({
  data = mockIndustryBenchmark,
}) => {
  const safeData = data || mockIndustryBenchmark
  const benchmarks = safeData?.benchmarks ?? []
  const categoryComparison = safeData?.categoryComparison ?? []

  return (
    <div className="rounded-2xl bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-slate-800/90 p-5 shadow-xl space-y-4 h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 shadow-sm shrink-0 flex items-center justify-center">
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-100 tracking-tight">
              Industry Benchmark & Peer Comparison
            </h3>
            <p className="text-xs text-slate-400 font-normal mt-0.5">
              Compare your ATS score against candidate cohorts in Senior Software & AI Engineering.
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-sm shrink-0 self-start sm:self-auto">
          <TrendingUp className="w-3.5 h-3.5" />
          Candidate: {safeData?.candidatePercentile ?? 92}nd Percentile
        </span>
      </div>

      {/* 4 Level Cohort Comparison Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 items-stretch">
        {benchmarks.map((bm, idx) => {
          const isCandidateLevel = bm.score === 92

          return (
            <div
              key={idx}
              className={cn(
                'p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between space-y-2.5 h-full',
                isCandidateLevel
                  ? 'bg-gradient-to-b from-purple-950/40 via-slate-950/90 to-slate-950/95 border-purple-500/40 shadow-md ring-1 ring-purple-500/30'
                  : 'bg-slate-950/80 border-slate-800/80 shadow-inner'
              )}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-100">{bm.level}</span>
                <span className="text-[10px] font-mono font-bold text-purple-300 px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">{bm.percentile}</span>
              </div>

              <div className="text-xl sm:text-2xl font-extrabold font-mono text-white">{bm.score}%</div>

              <div className="h-1.5 w-full bg-slate-950/80 border border-slate-800/60 rounded-full overflow-hidden p-0.5 shadow-inner">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500 shadow-sm',
                    isCandidateLevel ? 'bg-gradient-to-r from-purple-500 to-emerald-400' : 'bg-slate-700'
                  )}
                  style={{ width: `${bm.score}%` }}
                />
              </div>

              {isCandidateLevel && (
                <div className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" /> Your Current Score
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Category Comparative Breakdown */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 shadow-sm shrink-0 flex items-center justify-center">
            <BarChart2 className="w-4 h-4 text-purple-400" />
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-100 tracking-tight">
            Category Performance vs Senior Benchmark Average
          </h4>
        </div>

        <div className="space-y-2.5">
          {categoryComparison.map((cat, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2 shadow-inner">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-100">{cat.category}</span>
                <div className="flex items-center gap-3 font-mono text-[11px]">
                  <span className="text-purple-300 font-bold px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">You: {cat.candidateScore}%</span>
                  <span className="text-slate-400 font-medium">Benchmark: {cat.benchmarkScore}%</span>
                </div>
              </div>

              {/* Dual Progress Bar */}
              <div className="relative h-2 w-full bg-slate-950 border border-slate-800/80 rounded-full overflow-hidden p-0.5 shadow-inner">
                <div
                  className="absolute h-full bg-slate-800/90 rounded-full"
                  style={{ width: `${cat.benchmarkScore}%` }}
                />
                <div
                  className="absolute h-full bg-gradient-to-r from-purple-500 to-emerald-400 rounded-full shadow-sm transition-all duration-500"
                  style={{ width: `${cat.candidateScore}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
