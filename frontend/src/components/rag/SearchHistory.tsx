import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Bookmark, BookmarkCheck, Trash2, Clock, Play } from 'lucide-react'

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
      {/* Recent Searches */}
      <Card className="border-slate-200/60 dark:border-slate-800/40 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md">
        <CardHeader className="pb-3 flex flex-row items-center justify-between gap-4">
          <CardTitle className="text-sm font-bold font-display text-slate-900 dark:text-white flex items-center gap-2 m-0">
            <Clock className="text-slate-400 h-4 w-4" />
            <span>Recent Queries</span>
          </CardTitle>
          {recentSearches.length > 0 && (
            <button
              onClick={onClearRecent}
              className="text-[10px] font-bold text-red-500 hover:text-red-700 transition-colors uppercase cursor-pointer"
            >
              Clear All
            </button>
          )}
        </CardHeader>
        <CardContent className="space-y-2">
          {recentSearches.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-4">No recent queries found.</p>
          ) : (
            recentSearches.map((item, idx) => {
              const isSaved = savedSearches.includes(item)
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 p-2 bg-slate-50 dark:bg-slate-950/20 border border-slate-200/40 dark:border-slate-850 rounded-lg hover:bg-slate-100/50 dark:hover:bg-slate-900/40 transition-colors"
                >
                  <button
                    onClick={() => onSelectSearch(item)}
                    className="flex-1 flex items-center gap-2.5 text-left text-xs text-slate-700 dark:text-slate-300 font-sans truncate cursor-pointer focus:outline-none"
                  >
                    <Play size={10} className="text-slate-400 fill-slate-400" />
                    <span className="truncate">{item}</span>
                  </button>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => onToggleSave(item)}
                      className="p-1 rounded-md text-slate-400 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer"
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
                      className="p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer"
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
      <Card className="border-slate-200/60 dark:border-slate-800/40 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold font-display text-slate-900 dark:text-white flex items-center gap-2 m-0">
            <Bookmark className="text-brand-500 h-4 w-4" />
            <span>Saved Searches</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {savedSearches.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-4">No bookmarked searches yet.</p>
          ) : (
            savedSearches.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-3 p-2 bg-slate-50 dark:bg-slate-950/20 border border-slate-200/40 dark:border-slate-850 rounded-lg hover:bg-slate-100/50 dark:hover:bg-slate-900/40 transition-colors"
              >
                <button
                  onClick={() => onSelectSearch(item)}
                  className="flex-1 flex items-center gap-2.5 text-left text-xs text-slate-700 dark:text-slate-300 font-sans truncate cursor-pointer focus:outline-none"
                >
                  <Play size={10} className="text-brand-500 fill-brand-500" />
                  <span className="truncate">{item}</span>
                </button>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => onToggleSave(item)}
                    className="p-1 rounded-md text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer"
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
