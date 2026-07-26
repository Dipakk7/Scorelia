import React from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import type { DifficultyOption } from '@/types/interviewPrep'

export interface DifficultySelectorProps {
  difficulties: DifficultyOption[]
  selectedId: string
  onSelect: (id: 'easy' | 'medium' | 'hard' | 'adaptive') => void
}

export function DifficultySelector({ difficulties, selectedId, onSelect }: DifficultySelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-300 block">
        Select Difficulty Level
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {difficulties.map((diff) => {
          const isSelected = diff.id === selectedId

          const badgeStyle =
            diff.badgeVariant === 'emerald'
              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
              : diff.badgeVariant === 'amber'
              ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
              : diff.badgeVariant === 'rose'
              ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
              : 'bg-purple-500/15 text-purple-400 border-purple-500/30'

          return (
            <motion.button
              key={diff.id}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(diff.id)}
              className={cn(
                'p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer select-none space-y-2',
                isSelected
                  ? 'bg-purple-600/20 border-purple-500/50 shadow-md shadow-purple-900/20'
                  : 'bg-[#141627] border-white/10 hover:border-white/20'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{diff.label}</span>
                <Badge className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${badgeStyle}`}>
                  {diff.label}
                </Badge>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                {diff.description}
              </p>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
export default DifficultySelector
