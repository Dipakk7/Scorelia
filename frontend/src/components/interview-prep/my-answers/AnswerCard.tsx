import React from 'react'
import { motion } from 'framer-motion'
import { Bookmark, Star, Clock, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import type { AnswerHistoryItem } from '@/types/interviewPrep'

export interface AnswerCardProps {
  answer: AnswerHistoryItem
  isSelected: boolean
  onSelect: (answer: AnswerHistoryItem) => void
  onToggleBookmark: (id: string) => void
  onToggleFavorite: (id: string) => void
}

export function AnswerCard({
  answer,
  isSelected,
  onSelect,
  onToggleBookmark,
  onToggleFavorite,
}: AnswerCardProps) {
  const resultBadgeStyle =
    answer.resultTag === 'Excellent'
      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
      : answer.resultTag === 'Good'
      ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
      : 'bg-amber-500/15 text-amber-400 border-amber-500/30'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      onClick={() => onSelect(answer)}
      className={cn(
        'p-3.5 rounded-2xl border transition-all cursor-pointer select-none space-y-2.5 text-left',
        isSelected
          ? 'bg-purple-600/20 border-purple-500/50 shadow-md shadow-purple-900/20'
          : 'bg-[#10121e]/90 border-white/10 hover:border-white/20 hover:bg-[#141627]'
      )}
    >
      {/* Top Badges & Actions */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge className="bg-purple-500/15 text-purple-300 border-purple-500/30 text-[10px] font-bold py-0.5 px-2">
            {answer.source}
          </Badge>
          <Badge className={`text-[10px] font-bold py-0.5 px-2 rounded ${resultBadgeStyle}`}>
            {answer.resultTag}
          </Badge>
          <span className="text-[10px] text-slate-400 font-mono font-semibold">
            Attempt #{answer.attemptNumber}
          </span>
        </div>

        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onToggleFavorite(answer.id)}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              answer.isFavorite
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <Star className={`h-3.5 w-3.5 ${answer.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>
          <button
            onClick={() => onToggleBookmark(answer.id)}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              answer.isBookmarked
                ? 'bg-purple-600/30 text-purple-300 border-purple-500/40'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <Bookmark className={`h-3.5 w-3.5 ${answer.isBookmarked ? 'fill-purple-400 text-purple-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Question Title */}
      <h3 className="text-xs font-bold text-white leading-tight line-clamp-2">
        {answer.questionTitle}
      </h3>

      {/* Footer Info & Score */}
      <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[11px] text-slate-400">
        <div className="flex items-center gap-2 font-medium truncate">
          <span>{answer.companyName}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-slate-500" />
            {answer.durationText}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="font-bold text-emerald-400 font-mono text-xs">
            {answer.scorePercent}% Score
          </span>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        </div>
      </div>
    </motion.div>
  )
}
export default AnswerCard
