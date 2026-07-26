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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-4 flex flex-col justify-between h-36">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-10 w-full rounded-lg" />
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-4 flex flex-col justify-between hover:border-purple-500/30 hover:scale-[1.01] transition-all h-full">
            <CardContent className="p-0 space-y-2 flex flex-col justify-between h-full">
              <span className="text-xs text-slate-400 font-medium block truncate">
                {metric.title}
              </span>

              {/* Special Case 1: Overall Readiness Score Arc */}
              {metric.id === 'readiness' ? (
                <div className="flex flex-col items-center justify-center my-0.5">
                  <div className="relative w-28 h-16 flex items-end justify-center">
                    <svg className="w-28 h-28 transform -rotate-180" viewBox="0 0 100 100">
                      <path
                        d="M 10,50 A 40,40 0 0,1 90,50"
                        fill="none"
                        stroke="#1e2030"
                        strokeWidth="10"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 10,50 A 40,40 0 0,1 90,50"
                        fill="none"
                        stroke="url(#readiness-gradient)"
                        strokeWidth="10"
                        strokeDasharray="125"
                        strokeDashoffset="16"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="readiness-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-end pb-0.5">
                      <div className="flex items-baseline">
                        <span className="text-2xl font-black text-white leading-none">
                          <CountUpText value={Number(metric.value) || 87} />
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold ml-0.5">{metric.unit}</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider leading-none mt-0.5">
                        {metric.readinessTag || 'Excellent'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 font-medium pt-1.5 border-t border-white/5 w-full mt-1">
                    <span>{metric.candidatePercentile || 'Top 18% of candidates'}</span>
                    <Info className="h-3 w-3 text-slate-500 cursor-pointer hover:text-slate-300" />
                  </div>
                </div>
              ) : (
                <>
                  {/* Metric Value & Subtext */}
                  <div className="flex items-baseline gap-1.5">
                    {typeof metric.value === 'number' ? (
                      <span className="text-2xl font-black text-white flex items-center gap-1">
                        {metric.id === 'streak' && <Flame className="h-5 w-5 text-orange-500 fill-orange-500" />}
                        <CountUpText value={metric.value} />
                      </span>
                    ) : (
                      <span className="text-2xl font-black text-white">{metric.value}</span>
                    )}
                    {metric.unit && (
                      <span className="text-[11px] text-slate-400 font-medium truncate">{metric.unit}</span>
                    )}
                  </div>

                  {/* Sparkline chart if present */}
                  {metric.sparklinePoints && (
                    <div className="h-8 w-full my-0.5">
                      <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
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

                  {/* Trend Indicator or Badge */}
                  {metric.trend ? (
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 pt-1 border-t border-white/5">
                      <TrendingUp className="h-3 w-3" />
                      <span>{metric.trend}</span>
                    </div>
                  ) : metric.badge ? (
                    <div className="pt-1">
                      <Badge
                        className={
                          metric.badgeVariant === 'success'
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px] font-bold rounded-lg py-0.5 px-2.5'
                            : metric.badgeVariant === 'warning'
                            ? 'bg-amber-500/15 text-amber-400 border-amber-500/30 text-[10px] font-bold rounded-lg py-0.5 px-2.5'
                            : 'bg-orange-500/15 text-orange-400 border-orange-500/30 text-[10px] font-bold rounded-lg py-0.5 px-2.5'
                        }
                      >
                        {metric.badge}
                      </Badge>
                    </div>
                  ) : null}
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
export default MetricsGrid
