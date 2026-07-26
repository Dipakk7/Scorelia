import React from 'react'
import { CountUpText } from '@/components/ui/CountUpText'
import { useScoreliaReducedMotion } from '@/lib/motion'
import { CheckCircle2, Clock, ShieldCheck, Bot, TrendingUp, TrendingDown } from 'lucide-react'
import { mockAnalyticsSummary } from '@/data/performanceAnalyticsMockData'
import { cn } from '@/lib/utils'

export interface AnalyticsSummaryProps {
  className?: string
}

export function AnalyticsSummary({ className }: AnalyticsSummaryProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()

  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left select-none', className)}>
      {/* 1. Total Executions */}
      <div className="p-4 rounded-2xl bg-[#111322] border border-white/10 shadow-lg space-y-3 flex flex-col justify-between hover:-translate-y-0.5 transition-transform">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Executions</span>
            <span className="text-2xl font-black text-white">
              <CountUpText value={mockAnalyticsSummary.totalExecutions} duration={shouldReduceMotion ? 0 : 800} />
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <CheckCircle2 size={18} />
          </div>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
          <TrendingUp size={12} className="stroke-[2.5]" />
          <span>{mockAnalyticsSummary.totalExecutionsTrend} vs last period</span>
        </div>
      </div>

      {/* 2. Average Latency */}
      <div className="p-4 rounded-2xl bg-[#111322] border border-white/10 shadow-lg space-y-3 flex flex-col justify-between hover:-translate-y-0.5 transition-transform">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Average Latency</span>
            <span className="text-2xl font-black text-white font-mono">
              <CountUpText value={mockAnalyticsSummary.avgLatency} decimals={2} suffix="s" duration={shouldReduceMotion ? 0 : 800} />
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Clock size={18} />
          </div>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
          <TrendingDown size={12} className="stroke-[2.5]" />
          <span>{mockAnalyticsSummary.avgLatencyTrend} faster</span>
        </div>
      </div>

      {/* 3. Success Rate (Highlighted Card) */}
      <div className="p-4 rounded-2xl bg-gradient-to-b from-[#111322] to-emerald-950/20 border border-emerald-500/50 ring-1 ring-emerald-500/20 shadow-lg shadow-emerald-950/20 space-y-3 flex flex-col justify-between hover:-translate-y-0.5 transition-transform">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Success Rate</span>
            <span className="text-2xl font-black text-white">
              <CountUpText value={mockAnalyticsSummary.successRate} decimals={1} suffix="%" duration={shouldReduceMotion ? 0 : 800} />
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <ShieldCheck size={18} />
          </div>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
          <TrendingUp size={12} className="stroke-[2.5]" />
          <span>{mockAnalyticsSummary.successRateTrend} vs target benchmark</span>
        </div>
      </div>

      {/* 4. Active Agents */}
      <div className="p-4 rounded-2xl bg-[#111322] border border-white/10 shadow-lg space-y-3 flex flex-col justify-between hover:-translate-y-0.5 transition-transform">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Active Agents</span>
            <span className="text-2xl font-black text-white">
              <CountUpText value={mockAnalyticsSummary.activeAgents} duration={shouldReduceMotion ? 0 : 800} />
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Bot size={18} />
          </div>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-semibold text-purple-400">
          <span>{mockAnalyticsSummary.activeAgentsTrend} new agents deployed</span>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsSummary
