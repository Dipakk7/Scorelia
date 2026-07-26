import React from 'react'
import { motion } from 'framer-motion'
import { Code2, UserCheck, MessageSquare, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { InterviewTypeOption } from '@/types/interviewPrep'

export interface InterviewTypeSelectorProps {
  types: InterviewTypeOption[]
  selectedId: string
  onSelect: (id: 'technical' | 'hr' | 'behavioral' | 'mixed') => void
}

export function InterviewTypeSelector({ types, selectedId, onSelect }: InterviewTypeSelectorProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2':
        return Code2
      case 'UserCheck':
        return UserCheck
      case 'MessageSquare':
        return MessageSquare
      case 'Layers':
        return Layers
      default:
        return Code2
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-300 block">
        Interview Round Type
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {types.map((t) => {
          const Icon = getIcon(t.iconName)
          const isSelected = t.id === selectedId

          return (
            <motion.button
              key={t.id}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(t.id)}
              className={cn(
                'p-3 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer select-none',
                isSelected
                  ? 'bg-purple-600/20 border-purple-500/50 shadow-md shadow-purple-900/20'
                  : 'bg-[#141627] border-white/10 hover:border-white/20'
              )}
            >
              <div className={`p-2 rounded-lg shrink-0 ${isSelected ? 'bg-purple-500/30 text-purple-300' : 'bg-white/5 text-slate-400'}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block leading-tight">{t.label}</span>
                <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                  {t.description}
                </p>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
export default InterviewTypeSelector
