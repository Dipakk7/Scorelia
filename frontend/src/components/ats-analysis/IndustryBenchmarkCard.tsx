import React from 'react'
import { Award, TrendingUp, CheckCircle2, BarChart2 } from 'lucide-react'
import { mockIndustryBenchmark, type BenchmarkData } from '@/lib/ats-ai-mock-data'

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
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800/90 p-4 sm:p-5 shadow-lg space-y-3.5 h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-400" />
            Industry Benchmark & Peer Comparison
          </h3>
          <p className="text-xs text-slate-400">
            Compare your ATS score against candidate cohorts in Senior Software & AI Engineering.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30 shrink-0">
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
              className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between space-y-2 h-full ${
                isCandidateLevel
                  ? 'bg-purple-950/30 border-purple-500/50 shadow-md ring-1 ring-purple-500/30'
                  : 'bg-slate-950/60 border-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">{bm.level}</span>
                <span className="text-[10px] font-mono text-purple-400">{bm.percentile}</span>
              </div>

              <div className="text-xl font-bold font-mono text-white">{bm.score}%</div>

              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    isCandidateLevel ? 'bg-gradient-to-r from-purple-500 to-emerald-400' : 'bg-slate-600'
                  }`}
                  style={{ width: `${bm.score}%` }}
                />
              </div>

              {isCandidateLevel && (
                <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Your Current Score
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Category Comparative Breakdown */}
      <div className="space-y-3 pt-2">
        <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-purple-400" />
          Category Performance vs Senior Benchmark Average
        </div>

        <div className="space-y-2.5">
          {categoryComparison.map((cat, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-300">{cat.category}</span>
                <div className="flex items-center gap-3 font-mono text-[11px]">
                  <span className="text-purple-300 font-bold">You: {cat.candidateScore}%</span>
                  <span className="text-slate-500">Benchmark: {cat.benchmarkScore}%</span>
                </div>
              </div>

              {/* Dual Progress Bar */}
              <div className="relative h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="absolute h-full bg-slate-600 rounded-full opacity-40"
                  style={{ width: `${cat.benchmarkScore}%` }}
                />
                <div
                  className="absolute h-full bg-gradient-to-r from-purple-500 to-emerald-400 rounded-full"
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
