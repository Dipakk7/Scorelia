import React from 'react'
import type { LanguageMetric } from '@/data/githubAnalyticsMockData'
import { cn } from '@/lib/utils'

export interface LanguageProgressBarProps {
  language: LanguageMetric
  className?: string
}

export const LanguageProgressBar: React.FC<LanguageProgressBarProps> = ({
  language,
  className,
}) => {
  return (
    <div
      tabIndex={0}
      role="group"
      aria-label={`${language.language}: ${language.percentage}%, ${language.linesOfCode.toLocaleString()} lines of code`}
      className={cn(
        'group space-y-1.5 p-2 rounded-xl transition-all duration-200 hover:bg-slate-900/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 select-none',
        className
      )}
    >
      <div className="flex items-center justify-between text-xs font-medium">
        <span className="flex items-center gap-2 text-white font-semibold">
          <span
            className="h-2.5 w-2.5 rounded-full shrink-0 shadow-sm"
            style={{ backgroundColor: language.color }}
          />
          {language.language}
        </span>
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="text-slate-400 group-hover:text-slate-300 transition-colors">
            {language.linesOfCode.toLocaleString()} LOC
          </span>
          <span className="font-bold text-white">{language.percentage}%</span>
        </div>
      </div>

      <div className="h-2 w-full rounded-full bg-slate-900 overflow-hidden border border-slate-800">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${language.percentage}%`,
            backgroundColor: language.color,
          }}
        />
      </div>
    </div>
  )
}

export default LanguageProgressBar
