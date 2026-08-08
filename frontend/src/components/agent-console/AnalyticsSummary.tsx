import React from 'react'
import { CountUpText } from '@/components/ui/CountUpText'
import { useScoreliaReducedMotion } from '@/lib/motion'
import { CheckCircle2, Clock, ShieldCheck, Bot, TrendingUp, TrendingDown } from 'lucide-react'
import { mockAnalyticsSummary } from '@/data/performanceAnalyticsMockData'
import { cn } from '@/lib/utils'

export interface AnalyticsSummaryProps {
  timeRange?: '24h' | '7d' | '30d' | '90d'
  className?: string
}

export function AnalyticsSummary({ timeRange = '7d', className }: AnalyticsSummaryProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()

  // Period-specific telemetry variations
  const is24h = timeRange === '24h'
  const is30d = timeRange === '30d'
  const is90d = timeRange === '90d'

  const executionValue = is24h ? 325 : is30d ? 7840 : is90d ? 24500 : mockAnalyticsSummary.totalExecutions
  const executionLabel = is24h ? '24h Executions' : is30d ? '30d Executions' : is90d ? '90d Executions' : 'Period Executions'

  const throughputValue = is24h ? 18 : is30d ? 42 : is90d ? 65 : 28
  const throughputLabel = 'Peak Throughput'

  const successValue = is24h ? 98.4 : is30d ? 96.5 : is90d ? 95.8 : mockAnalyticsSummary.successRate
  const latencyValue = is24h ? 0.98 : is30d ? 1.34 : is90d ? 1.42 : mockAnalyticsSummary.avgLatency

  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left select-none', className)}>
      {/* 1. Period Execution Volume */}
      <div className="p-4 rounded-2xl bg-[#111322] border border-white/10 shadow-lg space-y-3 flex flex-col justify-between hover:-translate-y-0.5 transition-transform h-full">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">{executionLabel}</span>
            <span className="text-2xl font-black text-white">
              <CountUpText value={executionValue} duration={shouldReduceMotion ? 0 : 800} />
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <CheckCircle2 size={18} />
          </div>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
          <TrendingUp size={12} className="stroke-[2.5]" />
          <span>{mockAnalyticsSummary.totalExecutionsTrend} vs prev period ({timeRange})</span>
        </div>
      </div>

      {/* 2. Peak Throughput */}
      <div className="p-4 rounded-2xl bg-[#111322] border border-white/10 shadow-lg space-y-3 flex flex-col justify-between hover:-translate-y-0.5 transition-transform h-full">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">{throughputLabel}</span>
            <span className="text-2xl font-black text-white font-mono">
              <CountUpText value={throughputValue} suffix=" req/s" duration={shouldReduceMotion ? 0 : 800} />
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Bot size={18} />
          </div>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-semibold text-purple-300">
          <span>Concurrency load optimal</span>
        </div>
      </div>

      {/* 3. Period Success Rate */}
      <div className="p-4 rounded-2xl bg-gradient-to-b from-[#111322] to-emerald-950/20 border border-emerald-500/50 ring-1 ring-emerald-500/20 shadow-lg shadow-emerald-950/20 space-y-3 flex flex-col justify-between hover:-translate-y-0.5 transition-transform h-full">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Period Success Rate</span>
            <span className="text-2xl font-black text-white">
              <CountUpText value={successValue} decimals={1} suffix="%" duration={shouldReduceMotion ? 0 : 800} />
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <ShieldCheck size={18} />
          </div>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
          <TrendingUp size={12} className="stroke-[2.5]" />
          <span>{mockAnalyticsSummary.successRateTrend} vs SLA target</span>
        </div>
      </div>

      {/* 4. Active Telemetry Latency */}
      <div className="p-4 rounded-2xl bg-[#111322] border border-white/10 shadow-lg space-y-3 flex flex-col justify-between hover:-translate-y-0.5 transition-transform h-full">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Telemetry Latency</span>
            <span className="text-2xl font-black text-white font-mono">
              <CountUpText value={latencyValue} decimals={2} suffix="s" duration={shouldReduceMotion ? 0 : 800} />
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Clock size={18} />
          </div>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
          <TrendingDown size={12} className="stroke-[2.5]" />
          <span>{mockAnalyticsSummary.avgLatencyTrend} faster response speed</span>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsSummary
