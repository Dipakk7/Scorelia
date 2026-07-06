import { Card, CardContent } from '@/components/ui/Card'
import type { CollectionResponse } from '@/types/rag'

interface SearchFiltersProps {
  collections: CollectionResponse[]
  selectedCollection: string
  setSelectedCollection: (c: string) => void
  threshold: number
  setThreshold: (t: number) => void
  topK: number
  setTopK: (k: number) => void
  documentFilter: string
  setDocumentFilter: (d: string) => void
}

export function SearchFilters({
  collections,
  selectedCollection,
  setSelectedCollection,
  threshold,
  setThreshold,
  topK,
  setTopK,
  documentFilter,
  setDocumentFilter
}: SearchFiltersProps) {
  return (
    <Card className="border-slate-200/60 dark:border-slate-800/40 bg-white/40 dark:bg-slate-900/30 backdrop-blur-md text-left">
      <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Collection Selector */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-display">
            Target Collection
          </label>
          <select
            value={selectedCollection}
            onChange={(e) => setSelectedCollection(e.target.value)}
            className="w-full text-xs py-2 px-3 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="">All Collections</option>
            {collections.map((col) => (
              <option key={col.name} value={col.name}>
                {col.name} {col.count !== undefined ? `(${col.count} chunks)` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Top K limit */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-display">
            Top K Results
          </label>
          <select
            value={topK}
            onChange={(e) => setTopK(Number(e.target.value))}
            className="w-full text-xs py-2 px-3 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            {[3, 5, 8, 12, 15].map((k) => (
              <option key={k} value={k}>
                Retrieve top {k} chunks
              </option>
            ))}
          </select>
        </div>

        {/* Relevance Score Cutoff Threshold slider */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-display">
              Relevance Cutoff
            </label>
            <span className="text-[10px] font-extrabold text-brand-600 dark:text-brand-400 font-display">
              {Math.round(threshold * 100)}%
            </span>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600"
            />
          </div>
        </div>

        {/* Target Document Filter text field */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-display">
            Target Document ID
          </label>
          <input
            type="text"
            placeholder="Specific doc ID (optional)..."
            value={documentFilter}
            onChange={(e) => setDocumentFilter(e.target.value)}
            className="w-full text-xs py-2 px-3 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </CardContent>
    </Card>
  )
}
export default SearchFilters
