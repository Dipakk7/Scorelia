import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import type { SuggestedPromptItem } from '@/types/interviewPrep'

export interface SuggestedPromptsProps {
  prompts: SuggestedPromptItem[]
  onSelectPrompt: (promptText: string) => void
}

export function SuggestedPrompts({ prompts, onSelectPrompt }: SuggestedPromptsProps) {
  return (
    <div className="space-y-1.5 text-left">
      <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1">
        <Sparkles className="h-3 w-3 text-purple-400" /> Suggested Quick Prompts
      </span>

      <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar no-scrollbar py-1">
        {prompts.map((item, index) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: index * 0.04 }}
            onClick={() => onSelectPrompt(item.promptText)}
            className="px-3 py-1.5 rounded-xl bg-[#141627] border border-white/10 hover:border-purple-500/40 hover:bg-purple-600/15 text-xs text-slate-300 hover:text-purple-300 font-medium whitespace-nowrap transition-all cursor-pointer shrink-0"
          >
            {item.label}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
export default SuggestedPrompts
