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
    <div className={cn('space-y-2 text-left', className)}>
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <Sparkles size={13} className="text-purple-400 shrink-0" />
        <span className="font-semibold uppercase tracking-wider text-[10px]">Suggested Prompts</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {prompts.map((prompt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSelectPrompt(prompt)}
            className="px-3 py-1.5 rounded-xl bg-[#121320] border border-white/5 hover:border-purple-500/30 hover:bg-purple-950/20 text-xs font-medium text-slate-300 hover:text-purple-300 transition-all cursor-pointer truncate max-w-xs active:scale-95"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  )
}

export default SuggestedPrompts
