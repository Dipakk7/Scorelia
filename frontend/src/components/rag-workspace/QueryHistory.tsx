import React from 'react'
import { History, Play, Clock } from 'lucide-react'
import type { QueryHistoryItem } from '@/data/ragQueryMockData'
import { MOCK_QUERY_HISTORY } from '@/data/ragQueryMockData'
import { cn } from '@/lib/utils'

export interface QueryHistoryProps {
  onRunQuery: (query: string) => void
  historyItems?: QueryHistoryItem[]
  className?: string
}

export function QueryHistory({
  onRunQuery,
  historyItems = MOCK_QUERY_HISTORY,
  className
}: QueryHistoryProps) {
  return (
    <div className={cn('p-5 rounded-2xl bg-[#0e0f1a]/90 border border-white/10 shadow-lg text-left space-y-3.5', className)}>
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <History size={15} className="text-purple-400 shrink-0" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Recent Query History
          </h3>
        </div>
      </div>

      <div className="space-y-2">
        {historyItems.map((item) => (
          <div
            key={item.id}
            className="p-3 rounded-xl bg-[#121320] border border-white/5 hover:border-white/10 flex items-center justify-between gap-3 group transition-colors"
          >
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-purple-300 transition-colors">
                "{item.query}"
              </p>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                <span className="flex items-center gap-1">
                  <Clock size={10} /> {item.timestamp}
                </span>
                <span>•</span>
                <span className="px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-400 font-bold">
                  {item.searchType}
                </span>
                <span>•</span>
                <span>Top-{item.topK}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onRunQuery(item.query)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-purple-600 hover:text-white text-slate-300 text-xs font-semibold transition-all cursor-pointer shrink-0"
              aria-label={`Run query: ${item.query}`}
            >
              <Play size={12} fill="currentColor" />
              <span className="hidden sm:inline">Run again</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default QueryHistory
