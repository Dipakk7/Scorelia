
export interface KeywordCloudItem {
  text: string
  type: 'matched' | 'missing' | 'suggested'
  count?: number
}

interface KeywordCloudProps {
  keywords: KeywordCloudItem[]
}

export function KeywordCloud({ keywords }: KeywordCloudProps) {
  if (!keywords || keywords.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-900/10 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
        No keywords detected to visualize.
      </div>
    )
  }

  // Get color styles for tag types
  const getTagStyle = (type: 'matched' | 'missing' | 'suggested') => {
    switch (type) {
      case 'matched':
        return 'bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-350 border-emerald-500/20 dark:border-emerald-500/30'
      case 'missing':
        return 'bg-rose-500/10 text-rose-700 dark:bg-rose-500/20 dark:text-rose-455 border-rose-500/20 dark:border-rose-500/30'
      case 'suggested':
      default:
        return 'bg-brand-500/10 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400 border-brand-500/20 dark:border-brand-500/30'
    }
  }

  // Determine tag sizing
  const getTagSize = (count?: number) => {
    if (!count) return 'text-xs px-2.5 py-1'
    if (count > 5) return 'text-lg px-4 py-2 font-black tracking-tight'
    if (count > 3) return 'text-base px-3.5 py-1.5 font-bold'
    if (count > 1) return 'text-sm px-3 py-1 font-semibold'
    return 'text-xs px-2.5 py-1'
  }

  return (
    <div className="p-6 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-205 dark:border-slate-855 shadow-sm hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 text-center font-sans">
      <div className="flex flex-wrap gap-2.5 justify-center items-center">
        {keywords.map((kw, i) => (
          <div
            key={`${kw.text}-${i}`}
            className={`inline-flex items-center rounded-xl border transition-all duration-300 hover:scale-105 select-none cursor-default ${getTagStyle(
              kw.type
            )} ${getTagSize(kw.count)}`}
            title={`${kw.text} (${kw.type}${kw.count ? `, count: ${kw.count}` : ''})`}
          >
            <span>{kw.text}</span>
            {kw.count && kw.count > 0 && (
              <span className="ml-1.5 px-1 bg-current/10 text-[10px] rounded-md font-mono opacity-80">
                {kw.count}
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-center flex-wrap gap-4 mt-6 border-t border-slate-100 dark:border-slate-800/60 pt-4 text-[10px] font-bold uppercase tracking-wider">
        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Matched Keywords</span>
        </div>
        <div className="flex items-center gap-1.5 text-rose-650 dark:text-rose-500">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          <span>Missing Keywords</span>
        </div>
        <div className="flex items-center gap-1.5 text-brand-600 dark:text-brand-400">
          <span className="w-2 h-2 rounded-full bg-brand-500" />
          <span>Suggested Keywords</span>
        </div>
      </div>
    </div>
  )
}

export default KeywordCloud
