import React from 'react'
import { Star, FileText, ArrowUpRight, Trash2 } from 'lucide-react'

interface FavoriteReportItem {
  id: string
  name: string
  format: string
  updatedAt: string
}

interface FavoriteReportsPanelProps {
  favoriteReportIds?: string[]
  onOpenReport?: (id: string) => void
  onRemoveFavorite?: (id: string) => void
  className?: string
}

export function FavoriteReportsPanel({
  favoriteReportIds = ['rep_1', 'rep_2'],
  onOpenReport,
  onRemoveFavorite,
  className = '',
}: FavoriteReportsPanelProps) {
  const favoriteReports: FavoriteReportItem[] = [
    { id: 'rep_1', name: 'Q2 Executive Intelligence Digest', format: 'PDF', updatedAt: 'May 17, 2025' },
    { id: 'rep_2', name: 'ATS Compliance & Keyword Audit', format: 'Excel', updatedAt: 'May 16, 2025' },
  ].filter((r) => favoriteReportIds.includes(r.id))

  return (
    <div className={`space-y-3 text-left ${className}`}>
      <div>
        <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2 m-0">
          <Star size={14} className="text-yellow-400 fill-current" />
          Favorite Reports
        </h4>
        <p className="text-xs text-slate-400 font-medium m-0 mt-0.5">
          Quickly access your most frequently generated intelligence files
        </p>
      </div>

      <div className="space-y-2">
        {favoriteReports.length === 0 ? (
          <p className="text-xs text-slate-500 font-medium py-2 m-0">No favorite reports added yet.</p>
        ) : (
          favoriteReports.map((rep) => (
            <div
              key={rep.id}
              tabIndex={0}
              className="flex items-center justify-between p-2.5 rounded-xl bg-[#0f101c] border border-white/10 hover:border-purple-500/30 transition-all text-xs text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50"
            >
              <div className="flex items-center gap-2 min-w-0">
                <FileText size={14} className="text-purple-400 shrink-0" />
                <span className="font-bold text-slate-100 truncate">{rep.name}</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => onOpenReport?.(rep.id)}
                  className="p-1 rounded-lg bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 transition-colors cursor-pointer"
                  title="Open Report"
                >
                  <ArrowUpRight size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => onRemoveFavorite?.(rep.id)}
                  className="p-1 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                  title="Remove from Favorites"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default FavoriteReportsPanel
