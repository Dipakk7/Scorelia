import React from 'react'
import { motion } from 'framer-motion'
import { Info, TrendingUp, Flame, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { CountUpText } from '@/components/ui/CountUpText'
import type { DashboardMetric } from '@/types/interviewPrep'

export interface MetricsGridProps {
  metrics?: DashboardMetric[]
  isLoading?: boolean
  isEmpty?: boolean
  isError?: boolean
}

export function MetricsGrid({ metrics = [], isLoading = false, isEmpty = false, isError = false }: MetricsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-stretch">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-5 w-full rounded-lg" />
          </Card>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-300 text-xs font-semibold">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <span>Failed to load dashboard metrics. Please check connection.</span>
      </div>
    )
  }

  if (isEmpty || !metrics || metrics.length === 0) {
    return (
      <div className="p-6 bg-[#10121e] border border-white/10 rounded-2xl text-center text-slate-400 text-xs font-medium">
        No metrics data available yet. Start practicing to generate stats!
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-stretch">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: index * 0.04 }}
          className="h-full"
        >
          {metric.id === 'readiness' ? (
            /* Perfectly Proportioned Overall Readiness Score KPI Card */
            <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-4 sm:p-4.5 flex flex-col justify-between hover:border-purple-500/30 hover:scale-[1.01] transition-all duration-200 h-full text-left">
              <CardContent className="p-0 flex flex-col justify-between h-full space-y-3">
                {/* 1. Title (Top Left - Never Truncated) */}
                <div className="flex items-center justify-start min-h-[20px]">
                  <span className="text-xs font-bold text-slate-300 tracking-tight leading-tight whitespace-nowrap">
                    Overall Readiness Score
                  </span>
                </div>

                {/* 2. Large Center Area: Perfect Semicircle Gauge, Score, /100, Excellent */}
                <div className="flex flex-col items-center justify-center my-auto space-y-1.5 py-1">
                  {/* Gauge Arc with Score & /100 inside SVG */}
                  <div className="flex items-center justify-center">
                    <svg className="w-24 h-13" viewBox="0 0 100 56">
                      <defs>
                        <linearGradient id="readiness-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                      </defs>
                      {/* Background Arc Track */}
                      <path
                        d="M 14,48 A 36,36 0 0,1 86,48"
                        fill="none"
                        stroke="#1e2030"
                        strokeWidth="6"
                        strokeLinecap="round"
                      />
                      {/* Colored Progress Arc */}
                      <path
                        d="M 14,48 A 36,36 0 0,1 86,48"
                        fill="none"
                        stroke="url(#readiness-gradient)"
                        strokeWidth="6"
                        strokeDasharray="113.1"
                        strokeDashoffset="14.7"
                        strokeLinecap="round"
                      />
                      {/* Score Value */}
                      <text x="50" y="33" textAnchor="middle" className="text-xl font-black font-mono fill-white">
                        {Number(metric.value) || 87}
                      </text>
                      {/* /100 Label */}
                      <text x="50" y="45" textAnchor="middle" className="text-[9.5px] font-semibold fill-slate-400">
                        /100
                      </text>
                    </svg>
                  </div>

                  {/* Excellent Label beneath /100 */}
                  <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-md h-5 mt-1.5">
                    {metric.readinessTag || 'Excellent'}
                  </Badge>
                </div>

                {/* 3. Divider & Footer Row */}
                <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] font-medium text-slate-400 h-6 shrink-0 w-full">
                  <span className="text-slate-300 font-medium whitespace-nowrap">
                    {metric.candidatePercentile || 'Top 18% of candidates'}
                  </span>
                  <Info className="h-3.5 w-3.5 text-slate-400 shrink-0 cursor-pointer hover:text-slate-200 transition-colors ml-auto" />
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Other Perfectly Proportioned Metric Cards */
            <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-4 sm:p-4.5 flex flex-col justify-between hover:border-purple-500/30 hover:scale-[1.01] transition-all duration-200 h-full text-left">
              <CardContent className="p-0 flex flex-col justify-between h-full space-y-3">
                {/* Header: Title (Never Truncated) */}
                <div className="flex items-center justify-between min-h-[20px]">
                  <span className="text-xs font-bold text-slate-300 tracking-tight leading-tight whitespace-nowrap">
                    {metric.title}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-1.5 my-1">
                  <div className="flex items-baseline gap-1.5 min-h-[30px]">
                    {typeof metric.value === 'number' ? (
                      <span className="text-2xl font-black text-white font-mono flex items-center gap-1.5 leading-none">
                        {metric.id === 'streak' && <Flame className="h-5 w-5 text-amber-500 fill-amber-500 shrink-0" />}
                        <CountUpText value={metric.value} />
                      </span>
                    ) : (
                      <span className="text-2xl font-black text-white font-mono leading-none">{metric.value}</span>
                    )}
                    {metric.unit && (
                      <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">{metric.unit}</span>
                    )}
                  </div>

                  {/* Sparkline chart if present */}
                  {metric.sparklinePoints && (
                    <div className="h-7 w-full py-0.5">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
                        <path
                          d="M 0,25 Q 20,10 40,20 T 80,8 T 100,5"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        <circle cx="100" cy="5" r="3" fill="#10b981" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] font-medium text-slate-400 h-6 shrink-0">
                  {metric.trend ? (
                    <div className="flex items-center gap-1 text-emerald-400 font-semibold whitespace-nowrap">
                      <TrendingUp className="h-3.5 w-3.5 shrink-0" />
                      <span>{metric.trend}</span>
                    </div>
                  ) : metric.badge ? (
                    <Badge
                      className={
                        metric.badgeVariant === 'success'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-md h-5 shrink-0'
                          : metric.badgeVariant === 'warning'
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-md h-5 shrink-0'
                          : 'bg-purple-500/15 text-purple-300 border border-purple-500/30 text-[10px] font-bold px-2 py-0.5 rounded-md h-5 shrink-0'
                      }
                    >
                      {metric.badge}
                    </Badge>
                  ) : (
                    <span className="text-slate-400 font-medium whitespace-nowrap">
                      {metric.subtext || 'Updated recently'}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      ))}
    </div>
  )
}
export default MetricsGrid
