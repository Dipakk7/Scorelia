import React from 'react'
import { motion } from 'framer-motion'
import { Mic, FileText, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { InterviewModeOption } from '@/types/interviewPrep'

export interface InterviewModeSelectorProps {
  modes: InterviewModeOption[]
  selectedId: string
  onSelect: (id: 'voice' | 'text' | 'mixed') => void
}

export function InterviewModeSelector({ modes, selectedId, onSelect }: InterviewModeSelectorProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Mic':
        return Mic
      case 'FileText':
        return FileText
      case 'Sparkles':
        return Sparkles
      default:
        return Mic
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-300 block">
        Interview Interaction Mode
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {modes.map((m) => {
          const Icon = getIcon(m.iconName)
          const isSelected = m.id === selectedId

          return (
            <motion.button
              key={m.id}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(m.id)}
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
                <span className="text-xs font-bold text-white block leading-tight">{m.label}</span>
                <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                  {m.description}
                </p>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
export default InterviewModeSelector
