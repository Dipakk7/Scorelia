import React from 'react'
import { ChevronRight, Code2 } from 'lucide-react'
import { githubAnalyticsMockData, type LanguageMetric } from '@/data/githubAnalyticsMockData'
import { LanguageProgressBar } from './LanguageProgressBar'
import { cn } from '@/lib/utils'

export interface TopLanguagesPanelProps {
  languages?: LanguageMetric[]
  onViewAll?: () => void
  className?: string
}

export const TopLanguagesPanel: React.FC<TopLanguagesPanelProps> = ({
  languages = githubAnalyticsMockData.languages,
  onViewAll,
  className,
}) => {
  return (
    <div
      className={cn(
        'p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md shadow-sm flex flex-col justify-between space-y-4 text-left font-sans',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Code2 size={16} className="text-purple-400" />
            <h3 className="font-bold text-sm text-[var(--heading)] m-0">Top Languages</h3>
          </div>
          <p className="text-[11px] text-[var(--muted)] m-0 mt-0.5">By lines of code</p>
        </div>
      </div>

      <div className="space-y-1.5 py-1">
        {languages.map((lang) => (
          <LanguageProgressBar key={lang.language} language={lang} />
        ))}
      </div>

      <div className="pt-2 text-center border-t border-[var(--border)]/50">
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-semibold text-purple-400 hover:text-purple-300 inline-flex items-center gap-1 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-md px-2 py-1"
        >
          View all languages <ChevronRight size={13} />
        </button>
      </div>
    </div>
  )
}
