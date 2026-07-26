import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { getContainerVariants, getListItemVariants, useScoreliaReducedMotion } from '@/lib/motion'
import { suggestedPromptsMockData } from '@/data/careerRoadmapMockData'
import { cn } from '@/lib/utils'

export interface SuggestedPromptsProps {
  prompts?: string[]
  onSelectPrompt: (prompt: string) => void
  className?: string
}

export function SuggestedPrompts({
  prompts = suggestedPromptsMockData,
  onSelectPrompt,
  className,
}: SuggestedPromptsProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const containerVariants = getContainerVariants(shouldReduceMotion)
  const itemVariants = getListItemVariants(shouldReduceMotion)

  return (
    <div className={cn('space-y-2 text-left select-none', className)}>
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
        <Sparkles className="h-3.5 w-3.5 text-purple-400 shrink-0" aria-hidden="true" />
        <span>Suggested AI Prompts</span>
      </div>

      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="flex flex-wrap gap-1.5"
      >
        {prompts.map((prompt, idx) => (
          <motion.button
            key={idx}
            type="button"
            variants={itemVariants}
            onClick={() => onSelectPrompt(prompt)}
            className="px-2.5 py-1.5 rounded-xl bg-[#0b0c14] border border-white/10 text-[11px] font-medium text-slate-300 hover:text-white hover:border-purple-500/40 hover:bg-white/5 transition-all duration-200 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 min-h-[36px]"
          >
            {prompt}
          </motion.button>
        ))}
      </motion.div>
    </div>
  )
}
export default SuggestedPrompts
