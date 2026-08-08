import React from 'react'
import { Bot, CheckCircle2, ShieldCheck, Zap, Database, Activity } from 'lucide-react'
import { AgentKPICard } from './AgentKPICard'
import { cn } from '@/lib/utils'

export interface KPIGridProps {
  className?: string
}

export function KPIGrid({ className }: KPIGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3.5 sm:gap-4 items-stretch text-left w-full max-w-full min-w-0',
        className
      )}
      role="region"
      aria-label="Agent Key Performance Indicators"
    >
      {/* 1. Total Agents */}
      <AgentKPICard
        id="total-agents"
        title="Total Agents"
        numericValue={8}
        subtitle="6 Active • 2 Idle"
        icon={Bot}
        iconBgClass="bg-purple-500/10 border-purple-500/20"
        iconColorClass="text-purple-400"
      />

      {/* 2. Tasks Completed */}
      <AgentKPICard
        id="tasks-completed"
        title="Tasks Completed"
        numericValue={1248}
        trendValue="24% vs last 7 days"
        trendDirection="up"
        icon={CheckCircle2}
        iconBgClass="bg-blue-500/10 border-blue-500/20"
        iconColorClass="text-blue-400"
      />

      {/* 3. Success Rate */}
      <AgentKPICard
        id="success-rate"
        title="Success Rate"
        numericValue={96.4}
        suffix="%"
        decimals={1}
        trendValue="6.2% vs last 7 days"
        trendDirection="up"
        icon={ShieldCheck}
        iconBgClass="bg-emerald-500/10 border-emerald-500/20"
        iconColorClass="text-emerald-400"
        isHighlighted
      />

      {/* 4. Avg. Response Time */}
      <AgentKPICard
        id="avg-response-time"
        title="Avg. Latency"
        numericValue={1.32}
        suffix="s"
        decimals={2}
        trendValue="18% vs last 7 days"
        trendDirection="down"
        icon={Zap}
        iconBgClass="bg-amber-500/10 border-amber-500/20"
        iconColorClass="text-amber-400"
      />

      {/* 5. Credits Used */}
      <AgentKPICard
        id="credits-used"
        title="API Credit Usage"
        numericValue={2450}
        subtitle="2,450 / 5,000 credits used"
        icon={Database}
        iconBgClass="bg-indigo-500/10 border-indigo-500/20"
        iconColorClass="text-indigo-400"
        progressProps={{
          current: 2450,
          total: 5000,
          percentage: 78,
        }}
      />

      {/* 6. System Health */}
      <AgentKPICard
        id="system-health"
        title="System Health"
        numericValue={99.8}
        suffix="%"
        decimals={1}
        trendValue="0.4% vs last 7 days"
        trendDirection="up"
        icon={Activity}
        iconBgClass="bg-teal-500/10 border-teal-500/20"
        iconColorClass="text-teal-400"
      />
    </div>
  )
}

export default KPIGrid
