import React from 'react'
import { motion } from 'framer-motion'
import {
  Layers,
  Code2,
  Database,
  Brain,
  Cpu,
  Boxes,
  Network,
  MessageSquare,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import type { QuestionCategory } from '@/types/interviewPrep'

export interface QuestionCategorySidebarProps {
  categories: QuestionCategory[]
  selectedCategoryId: string
  onSelectCategory: (id: string) => void
}

export function QuestionCategorySidebar({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: QuestionCategorySidebarProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2':
        return Code2
      case 'Database':
        return Database
      case 'Brain':
        return Brain
      case 'Cpu':
        return Cpu
      case 'Boxes':
        return Boxes
      case 'Network':
        return Network
      case 'MessageSquare':
        return MessageSquare
      default:
        return Layers
    }
  }

  return (
    <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-4 hover:border-purple-500/30 transition-all space-y-3">
      <CardHeader className="p-0 pb-2 border-b border-white/10">
        <CardTitle className="text-xs font-bold text-white tracking-tight uppercase">
          Categories & Topics
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 space-y-1">
        {categories.map((cat, index) => {
          const Icon = getIcon(cat.iconName)
          const isSelected = cat.id === selectedCategoryId

          return (
            <motion.button
              key={cat.id}
              type="button"
              whileHover={{ x: 2 }}
              onClick={() => onSelectCategory(cat.id)}
              className={cn(
                'w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer select-none',
                isSelected
                  ? 'bg-purple-600/20 border-purple-500/40 text-purple-300 shadow-sm shadow-purple-900/20'
                  : 'bg-[#141627]/60 border-white/5 text-slate-300 hover:bg-white/5 hover:text-white'
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`p-1.5 rounded-lg shrink-0 ${isSelected ? 'bg-purple-500/30 text-purple-300' : 'bg-white/5 text-slate-400'}`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="truncate">
                  <span className="text-xs font-bold block truncate leading-tight">{cat.label}</span>
                  <div className="h-1 w-16 bg-white/5 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${cat.completionPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              <span className="text-[10px] font-bold font-mono text-slate-400 shrink-0 ml-2">
                {cat.totalQuestions}
              </span>
            </motion.button>
          )
        })}
      </CardContent>
    </Card>
  )
}
export default QuestionCategorySidebar
