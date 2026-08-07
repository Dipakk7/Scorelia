import React from 'react'
import { CollectionsWorkspace } from '../CollectionsWorkspace'
import { Send, Search } from 'lucide-react'

export function CollectionsWorkspacePlaceholder() {
  return (
    <div className="space-y-6">
      {/* Primary Collections Management Workspace */}
      <CollectionsWorkspace />

      {/* Query Playground Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] text-left space-y-4">
        <div>
          <h2 className="text-base font-bold text-[var(--heading)] tracking-tight">Query Playground</h2>
          <p className="text-xs text-[var(--muted)]">Test your queries and see real-time results from your knowledge base.</p>
        </div>

        {/* Query Input Container */}
        <div className="relative">
          <textarea
            rows={2}
            placeholder="Ask anything from your knowledge base..."
            readOnly
            aria-label="Query input prompt"
            className="w-full bg-[var(--surface-hover)] border border-[var(--border)] rounded-xl p-3 text-xs text-[var(--heading)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
          />
          <button
            type="button"
            aria-label="Send query"
            className="absolute right-3 bottom-3.5 p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-colors cursor-pointer shadow-md shadow-purple-900/40 border-none"
          >
            <Send size={14} />
          </button>
        </div>

        {/* Filter & Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Search Type */}
            <div className="flex items-center gap-1.5">
              <span className="text-[var(--muted)] text-[11px]">Search Type</span>
              <select aria-label="Select search type" defaultValue="hybrid" className="bg-[var(--surface-hover)] border border-[var(--border)] text-xs text-[var(--heading)] px-2.5 py-1.5 rounded-xl focus:outline-none cursor-pointer">
                <option value="hybrid">Hybrid (Semantic + Keyword)</option>
                <option value="semantic">Semantic Only</option>
                <option value="keyword">BM25 Keyword</option>
              </select>
            </div>

            {/* Top K */}
            <div className="flex items-center gap-1.5">
              <span className="text-[var(--muted)] text-[11px]">Top K</span>
              <select aria-label="Select top K results" defaultValue="5" className="bg-[var(--surface-hover)] border border-[var(--border)] text-xs text-[var(--heading)] px-2.5 py-1.5 rounded-xl focus:outline-none cursor-pointer">
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
              </select>
            </div>

            {/* Rerank Toggle */}
            <div className="flex items-center gap-1.5 bg-[var(--surface-hover)] border border-[var(--border)] px-2.5 py-1 rounded-xl">
              <span className="text-[var(--muted)] text-[11px]">Rerank</span>
              <span className="text-[10px] font-bold text-purple-400 bg-purple-500/20 px-1.5 py-0.5 rounded">ON</span>
            </div>

            {/* Source Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[var(--muted)] text-[11px]">Source Filter</span>
              <select aria-label="Filter sources" defaultValue="all" className="bg-[var(--surface-hover)] border border-[var(--border)] text-xs text-[var(--heading)] px-2.5 py-1.5 rounded-xl focus:outline-none cursor-pointer">
                <option value="all">All Sources</option>
                <option value="pdf">PDF Documents</option>
                <option value="code">Code Repository</option>
              </select>
            </div>
          </div>

          {/* Search Button */}
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-900/40 cursor-pointer border-none"
          >
            <Search size={14} />
            <span>Search</span>
          </button>
        </div>
      </div>

    </div>
  )
}

export default CollectionsWorkspacePlaceholder
