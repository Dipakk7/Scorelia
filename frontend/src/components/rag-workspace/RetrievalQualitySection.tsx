import React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts'
import {
  MOCK_SIMILARITY_DISTRIBUTION,
  MOCK_CONFIDENCE_BREAKDOWN
} from '@/data/ragAnalyticsMockData'
import { Target, CheckCircle2, ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface RetrievalQualitySectionProps {
  className?: string
}

export function RetrievalQualitySection({ className }: RetrievalQualitySectionProps) {
  return (
    <div className={cn('grid grid-cols-1 lg:grid-cols-12 gap-6 select-none', className)}>
      {/* 1. Similarity Distribution Histogram (7 Columns on Desktop) */}
      <div className="lg:col-span-7 p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] text-left space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target size={16} className="text-emerald-400 shrink-0" />
            <h3 className="text-xs font-bold text-[var(--heading)] uppercase tracking-wider">
              Cosine Similarity Score Distribution
            </h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-bold">
            Mean: 0.91
          </span>
        </div>

        <div className="h-56 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_SIMILARITY_DISTRIBUTION} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="bucket" stroke="var(--muted)" fontSize={10} tickLine={false} />
              <YAxis stroke="var(--muted)" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--surface-hover)', borderColor: 'var(--border)', borderRadius: '12px', fontSize: '11px', color: 'var(--heading)' }}
              />
              <Bar dataKey="count" name="Chunks Count" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Precision/Recall & Confidence Breakdown (5 Columns on Desktop) */}
      <div className="lg:col-span-5 space-y-4">
        {/* Precision vs Recall Card */}
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] text-left space-y-3">
          <h3 className="text-xs font-bold text-[var(--heading)] uppercase tracking-wider">
            Precision vs. Recall Benchmark
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[var(--surface-hover)] border border-[var(--border)] space-y-1">
              <span className="text-[10px] text-[var(--muted)] uppercase font-mono block">Precision@5</span>
              <span className="text-xl font-black text-emerald-400 font-mono">94.8%</span>
              <span className="text-[10px] text-[var(--muted)] block font-mono">Top-5 relevance</span>
            </div>

            <div className="p-3 rounded-xl bg-[var(--surface-hover)] border border-[var(--border)] space-y-1">
              <span className="text-[10px] text-[var(--muted)] uppercase font-mono block">Recall@10</span>
              <span className="text-xl font-black text-purple-400 font-mono">97.3%</span>
              <span className="text-[10px] text-[var(--muted)] block font-mono">Knowledge capture</span>
            </div>
          </div>
        </div>

        {/* Confidence Breakdown Stacked Visualization */}
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] text-left space-y-3">
          <h3 className="text-xs font-bold text-[var(--heading)] uppercase tracking-wider">
            Query Confidence Distribution
          </h3>

          <div className="w-full bg-[var(--border)] h-3 rounded-full overflow-hidden flex">
            {MOCK_CONFIDENCE_BREAKDOWN.map((item, idx) => (
              <div
                key={idx}
                style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                className="h-full transition-all"
                title={`${item.label}: ${item.percentage}%`}
              />
            ))}
          </div>

          <div className="space-y-1.5 pt-1 text-xs">
            {MOCK_CONFIDENCE_BREAKDOWN.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[var(--heading)] font-medium">{item.label}</span>
                </div>
                <span className="font-mono text-[var(--heading)] font-bold">{item.percentage}% ({item.count})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RetrievalQualitySection

