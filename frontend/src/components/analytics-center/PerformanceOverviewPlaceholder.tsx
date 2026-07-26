import React from 'react'
import { ArrowRight } from 'lucide-react'

const performanceMetrics = [
  {
    label: 'Avg. Response Time',
    value: '1.32s',
    trend: '↓ 12.5%',
    isPositive: true,
  },
  {
    label: 'Uptime',
    value: '99.9%',
    trend: '↑ 0.1%',
    isPositive: true,
  },
  {
    label: 'Error Rate',
    value: '0.12%',
    trend: '↓ 18.2%',
    isPositive: true,
  },
  {
    label: 'API Success Rate',
    value: '99.6%',
    trend: '↑ 1.3%',
    isPositive: true,
  },
]

export function PerformanceOverviewPlaceholder({
  onViewDetails,
}: {
  onViewDetails?: () => void
}) {
  return (
    <div className="flex flex-col justify-between h-full p-5 rounded-2xl bg-[#0f101c] border border-white/10 text-left">
      {/* Header */}
      <div>
        <h3 className="text-sm sm:text-base font-bold text-slate-100 m-0 tracking-tight">
          Performance Overview
        </h3>
        <p className="text-xs text-slate-400 font-medium m-0 mt-0.5">
          Key platform performance metrics
        </p>
      </div>

      {/* 2x2 Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        {performanceMetrics.map((item) => (
          <div
            key={item.label}
            className="p-3.5 rounded-xl bg-[#141526] border border-white/5 flex flex-col justify-between text-left"
          >
            <span className="text-[11px] font-semibold text-slate-400 block truncate">
              {item.label}
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-slate-100 font-mono my-1.5 block">
              {item.value}
            </span>
            <span className="text-xs font-bold text-emerald-400 block">
              {item.trend}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom Link */}
      <div className="pt-2 border-t border-white/5 flex justify-start">
        <button
          type="button"
          onClick={onViewDetails}
          className="flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors cursor-pointer group"
        >
          <span>View performance details</span>
          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  )
}

export default PerformanceOverviewPlaceholder
