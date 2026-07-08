import { Card, CardContent } from '@/components/ui/Card'
import type { CollectionResponse } from '@/types/rag'
import { cn } from '@/lib/utils'

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
    <Card className="border border-slate-205 dark:border-slate-855 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl shadow-sm hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 overflow-hidden text-left font-sans text-xs">
      <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        {/* Collection Selector */}
        <div className="space-y-1.5 text-left">
          <label className="text-[9px] font-black uppercase tracking-widest text-slate-455 dark:text-slate-500 leading-none">
            Target Collection
          </label>
          <select
            value={selectedCollection}
            onChange={(e) => setSelectedCollection(e.target.value)}
            className="w-full text-xs py-2.5 px-3 border border-slate-250 dark:border-slate-800 rounded-xl bg-white/70 dark:bg-slate-900/50 text-slate-950 dark:text-slate-150 focus:outline-none focus:ring-1 focus:ring-brand-500 font-bold transition-colors cursor-pointer shadow-2xs"
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
        <div className="space-y-1.5 text-left">
          <label className="text-[9px] font-black uppercase tracking-widest text-slate-455 dark:text-slate-500 leading-none">
            Top K Results
          </label>
          <select
            value={topK}
            onChange={(e) => setTopK(Number(e.target.value))}
            className="w-full text-xs py-2.5 px-3 border border-slate-250 dark:border-slate-800 rounded-xl bg-white/70 dark:bg-slate-900/50 text-slate-950 dark:text-slate-150 focus:outline-none focus:ring-1 focus:ring-brand-500 font-bold transition-colors cursor-pointer shadow-2xs"
          >
            {[3, 5, 8, 12, 15].map((k) => (
              <option key={k} value={k}>
                Retrieve top {k} chunks
              </option>
            ))}
          </select>
        </div>

        {/* Relevance Score Cutoff Threshold slider */}
        <div className="space-y-1.5 text-left">
          <div className="flex justify-between items-center">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-455 dark:text-slate-500 leading-none">
              Relevance Cutoff
            </label>
            <span className="text-[10px] font-extrabold text-brand-655 dark:text-brand-400 font-sans leading-none">
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
        <div className="space-y-1.5 text-left">
          <label className="text-[9px] font-black uppercase tracking-widest text-slate-455 dark:text-slate-500 leading-none">
            Target Document ID
          </label>
          <input
            type="text"
            placeholder="Specific doc ID (optional)..."
            value={documentFilter}
            onChange={(e) => setDocumentFilter(e.target.value)}
            className="w-full text-xs py-2.5 px-3 border border-slate-250 dark:border-slate-800 rounded-xl bg-white/70 dark:bg-slate-900/50 text-slate-950 dark:text-slate-150 focus:outline-none focus:ring-1 focus:ring-brand-500 font-sans font-medium transition-colors shadow-2xs"
          />
        </div>
      </CardContent>
    </Card>
  )
}
export default SearchFilters
