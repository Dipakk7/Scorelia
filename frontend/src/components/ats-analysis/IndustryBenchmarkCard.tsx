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
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3.5">
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

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-sm shrink-0 self-start sm:self-auto">
          <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
          <span>Candidate: <strong className="text-emerald-400 font-extrabold">{safeData?.candidatePercentile ?? 92}nd Percentile</strong></span>
        </div>
      </div>

      {/* 2. 4-Level Cohort Comparison Analytics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 items-stretch">
        {benchmarks.map((bm, idx) => {
          const isCandidateLevel = bm.score === 92

          return isCandidateLevel ? (
            <div
              key={idx}
              className="p-4 rounded-xl bg-gradient-to-b from-purple-950/50 via-slate-950/90 to-slate-950/95 border border-purple-500/50 shadow-md ring-1 ring-purple-500/40 flex flex-col justify-between space-y-3 relative overflow-hidden group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-purple-300 font-sans tracking-tight">{bm.level}</span>
                <span className="text-[10px] font-mono font-bold text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 shadow-sm">{bm.percentile}</span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">{bm.score}<span className="text-sm text-purple-300 font-bold">%</span></div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1 shadow-sm">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" /> Your Score
                  </span>
                </div>

                <div className="h-2 w-full bg-slate-950 border border-slate-800/80 rounded-full overflow-hidden p-0.5 shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 via-indigo-400 to-emerald-400 rounded-full shadow-sm transition-all duration-500"
                    style={{ width: `${bm.score}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700/80 transition-all duration-200 shadow-inner flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 font-sans">{bm.level}</span>
                <span className="text-[10px] font-mono font-bold text-slate-400 px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800">{bm.percentile}</span>
              </div>

              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-100 tracking-tight">{bm.score}<span className="text-xs text-slate-500 font-normal">%</span></div>
                <div className="h-1.5 w-full bg-slate-900 border border-slate-800/80 rounded-full overflow-hidden p-0.5 shadow-inner">
                  <div
                    className="h-full bg-slate-600 rounded-full transition-all duration-500"
                    style={{ width: `${bm.score}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* 3. Category Comparative Breakdown */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 shadow-sm shrink-0 flex items-center justify-center">
              <BarChart2 className="w-4 h-4 text-purple-400" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-100 tracking-tight">
              Category Performance vs Senior Benchmark Average
            </h4>
          </div>
          <span className="text-[10px] font-mono text-slate-400 hidden sm:inline-block">KPI Delta Analysis</span>
        </div>

        <div className="space-y-2.5">
          {categoryComparison.map((cat, idx) => {
            const delta = cat.candidateScore - cat.benchmarkScore
            const isPositive = delta >= 0

            return (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700/80 transition-all duration-200 space-y-2 shadow-inner">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-100 font-sans">{cat.category}</span>
                  <div className="flex items-center gap-2.5 font-mono text-[11px]">
                    <span className="text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">You: {cat.candidateScore}%</span>
                    <span className="text-slate-400 font-medium">Avg: {cat.benchmarkScore}%</span>
                    <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded font-mono', isPositive ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 'text-amber-400 bg-amber-500/10 border border-amber-500/20')}>
                      {isPositive ? `+${delta}%` : `${delta}%`}
                    </span>
                  </div>
                </div>

                {/* Dual Progress Track */}
                <div className="relative h-2.5 w-full bg-slate-950 border border-slate-800/90 rounded-full overflow-hidden p-0.5 shadow-inner">
                  <div
                    className="absolute h-full bg-slate-800/90 rounded-full"
                    style={{ width: `${cat.benchmarkScore}%` }}
                  />
                  <div
                    className="absolute h-full bg-gradient-to-r from-purple-500 via-indigo-400 to-emerald-400 rounded-full shadow-sm transition-all duration-500"
                    style={{ width: `${cat.candidateScore}%` }}
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
