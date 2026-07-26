import React from 'react'
import { FileText, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function TopRetrievedDocsCard() {
  const docs = [
    { name: 'Gradient Descent Algorithm Explained', collection: 'AI/ML Interview Guide', score: '0.96' },
    { name: 'ML Algorithms Comparison', collection: 'Machine Learning Concepts', score: '0.94' },
    { name: 'Optimization Techniques Overview', collection: 'Machine Learning Concepts', score: '0.91' },
    { name: 'Stochastic Gradient Descent Guide', collection: 'AI/ML Interview Guide', score: '0.89' },
    { name: 'Deep Learning Optimization Methods', collection: 'Machine Learning Concepts', score: '0.87' }
  ]

  return (
    <div className="p-5 rounded-2xl bg-[#0e0f1a]/90 border border-white/10 shadow-lg text-left space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white tracking-tight">Top Retrieved Documents</h3>
        <button type="button" className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1">
          <span>View all</span>
          <ArrowRight size={13} />
        </button>
      </div>

      <div className="space-y-2">
        {docs.map((doc, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#121320] border border-white/5 hover:border-white/10 transition-colors group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
                <FileText size={14} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-purple-300 transition-colors">
                  {doc.name}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {doc.collection}
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold shrink-0">
              {doc.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TopRetrievedDocsCard
