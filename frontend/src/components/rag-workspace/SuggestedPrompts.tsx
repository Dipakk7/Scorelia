import React from 'react'
import { Sparkles } from 'lucide-react'
import { MOCK_SUGGESTED_PROMPTS } from '@/data/ragQueryMockData'
import { cn } from '@/lib/utils'

export interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void
  prompts?: string[]
  className?: string
}

export function SuggestedPrompts({
  onSelectPrompt,
  prompts = MOCK_SUGGESTED_PROMPTS,
  className
}: SuggestedPromptsProps) {
  return (
    <div className={cn('space-y-2 text-left select-none', className)}>
      <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
        <Sparkles size={13} className="text-purple-400 shrink-0" />
        <span className="font-bold uppercase tracking-wider text-[10px]">Suggested Prompts</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {prompts.map((prompt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSelectPrompt(prompt)}
            className="px-3 py-1.5 rounded-xl bg-[var(--surface-hover)] border border-[var(--border)] hover:border-purple-500/40 hover:bg-purple-500/10 text-xs font-medium text-[var(--heading)] hover:text-purple-300 transition-all duration-200 cursor-pointer truncate max-w-xs active:scale-95 shadow-sm border-none"
          >
            ✨ {prompt}
          </button>
        ))}
      </div>
    </div>
  )
}

export default SuggestedPrompts
