import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Bookmark, BookmarkCheck, Trash2, Clock, Play } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchHistoryProps {
  recentSearches: string[]
  savedSearches: string[]
  onSelectSearch: (query: string) => void
  onToggleSave: (query: string) => void
  onDeleteRecent: (query: string) => void
  onClearRecent: () => void
}

export function SearchHistory({
  recentSearches,
  savedSearches,
  onSelectSearch,
  onToggleSave,
  onDeleteRecent,
  onClearRecent
}: SearchHistoryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left font-sans text-xs">
      {/* Recent Searches */}
      <Card className="border border-border bg-card/70 backdrop-blur-md rounded-2xl shadow-sm hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 overflow-hidden text-left">
        <CardHeader className="pb-4 border-b border-border/60 text-left flex flex-row items-center justify-between gap-4">
          <CardTitle className="text-xs font-black uppercase tracking-wider text-foreground m-0 leading-none flex items-center gap-2">
            <Clock className="text-slate-400 h-4 w-4" />
            <span>Recent Queries</span>
          </CardTitle>
          {recentSearches.length > 0 && (
            <button
              onClick={onClearRecent}
              className="text-[9px] font-black text-rose-500 hover:text-rose-600 transition-colors uppercase tracking-wider cursor-pointer border-none bg-transparent p-0 leading-none"
            >
              Clear All
            </button>
          )}
        </CardHeader>
        <CardContent className="space-y-2 pt-4 text-left">
          {recentSearches.length === 0 ? (
            <p className="text-xs text-muted-foreground italic py-4 m-0">No recent queries found.</p>
          ) : (
            recentSearches.map((item, idx) => {
              const isSaved = savedSearches.includes(item)
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 p-2 bg-slate-55/30 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-850 rounded-xl hover:bg-slate-100/50 dark:hover:bg-slate-900/40 transition-colors text-left"
                >
                  <button
                    onClick={() => onSelectSearch(item)}
                    className="flex-1 flex items-center gap-2.5 text-left text-xs text-slate-705 dark:text-slate-300 font-sans truncate cursor-pointer focus:outline-none border-none bg-transparent font-medium"
                  >
                    <Play size={10} className="text-slate-400 fill-slate-400 shrink-0" />
                    <span className="truncate">{item}</span>
                  </button>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => onToggleSave(item)}
                      className="p-1 rounded-md text-slate-400 hover:text-brand-500 hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-all cursor-pointer border-none bg-transparent flex items-center"
                      title={isSaved ? 'Remove from Bookmarks' : 'Bookmark query'}
                    >
                      {isSaved ? (
                        <BookmarkCheck size={14} className="text-brand-500" />
                      ) : (
                        <Bookmark size={14} />
                      )}
                    </button>
                    <button
                      onClick={() => onDeleteRecent(item)}
                      className="p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-all cursor-pointer border-none bg-transparent flex items-center"
                      title="Delete query record"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>

      {/* Saved Searches */}
      <Card className="border border-border bg-card/70 backdrop-blur-md rounded-2xl shadow-sm hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 overflow-hidden text-left">
        <CardHeader className="pb-4 border-b border-border/60 text-left flex flex-row items-center justify-between gap-4">
          <CardTitle className="text-xs font-black uppercase tracking-wider text-foreground m-0 leading-none flex items-center gap-2">
            <Bookmark className="text-brand-500 h-4 w-4 animate-pulse" />
            <span>Saved Searches</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-4 text-left">
          {savedSearches.length === 0 ? (
            <p className="text-xs text-muted-foreground italic py-4 m-0">No bookmarked searches yet.</p>
          ) : (
            savedSearches.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-3 p-2 bg-slate-55/30 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-850 rounded-xl hover:bg-slate-100/50 dark:hover:bg-slate-900/40 transition-colors text-left"
              >
                <button
                  onClick={() => onSelectSearch(item)}
                  className="flex-1 flex items-center gap-2.5 text-left text-xs text-slate-705 dark:text-slate-300 font-sans truncate cursor-pointer focus:outline-none border-none bg-transparent font-medium"
                >
                  <Play size={10} className="text-brand-500 fill-brand-500 shrink-0" />
                  <span className="truncate">{item}</span>
                </button>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => onToggleSave(item)}
                    className="p-1 rounded-md text-brand-500 hover:bg-slate-105 dark:hover:bg-slate-900 cursor-pointer border-none bg-transparent flex items-center"
                    title="Remove bookmark"
                  >
                    <BookmarkCheck size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
export default SearchHistory
