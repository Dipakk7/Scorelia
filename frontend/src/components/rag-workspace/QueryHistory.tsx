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
    <div className={cn('p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] text-left space-y-3.5 select-none', className)}>
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-2.5">
        <div className="flex items-center gap-2">
          <History size={15} className="text-purple-400 shrink-0" />
          <h3 className="text-xs font-bold text-[var(--heading)] uppercase tracking-wider">
            Recent Query History
          </h3>
        </div>
      </div>

      <div className="space-y-2">
        {historyItems.map((item) => (
          <div
            key={item.id}
            className="p-3 rounded-xl bg-[var(--surface-hover)] border border-[var(--border)] hover:border-purple-500/30 flex items-center justify-between gap-3 group transition-colors"
          >
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[var(--heading)] truncate group-hover:text-purple-300 transition-colors">
                "{item.query}"
              </p>
              <div className="flex items-center gap-2 text-[10px] text-[var(--muted)] font-mono mt-0.5">
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
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[var(--surface)] hover:bg-purple-600 hover:text-white text-[var(--heading)] text-xs font-semibold transition-all cursor-pointer shrink-0 border border-[var(--border)]"
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

