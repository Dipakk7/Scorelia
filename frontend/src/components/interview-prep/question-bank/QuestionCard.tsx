import React from 'react'
import { motion } from 'framer-motion'
import { Bookmark, Clock, CheckCircle2, Eye, Play } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { QuestionBankItem } from '@/types/interviewPrep'

export interface QuestionCardProps {
  question: QuestionBankItem
  onPreview: (question: QuestionBankItem) => void
  onToggleBookmark: (id: string) => void
}

export function QuestionCard({ question, onPreview, onToggleBookmark }: QuestionCardProps) {
  const diffBadgeStyle =
    question.difficulty === 'Easy'
      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
      : question.difficulty === 'Medium'
      ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
      : 'bg-rose-500/15 text-rose-400 border-rose-500/30'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-4 hover:border-purple-500/30 transition-all flex flex-col justify-between space-y-3 h-full">
        {/* Top Badge & Action Icons */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge className={`text-[10px] font-bold px-2 py-0.5 rounded ${diffBadgeStyle}`}>
              {question.difficulty}
            </Badge>
            <Badge className="bg-white/5 text-slate-300 border-white/10 text-[10px] font-semibold px-2 py-0.5">
              {question.categoryLabel}
            </Badge>
            {question.isCompleted && (
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
                <CheckCircle2 className="h-3 w-3" /> Completed
              </span>
            )}
          </div>

          <button
            onClick={() => onToggleBookmark(question.id)}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              question.isBookmarked
                ? 'bg-purple-600/30 text-purple-300 border-purple-500/40'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <Bookmark className={`h-3.5 w-3.5 ${question.isBookmarked ? 'fill-purple-400 text-purple-400' : ''}`} />
          </button>
        </div>

        {/* Question Title & Description */}
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-white leading-tight hover:text-purple-300 transition-colors cursor-pointer" onClick={() => onPreview(question)}>
            {question.title}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 font-medium">
            {question.shortDescription}
          </p>
        </div>

        {/* Company & Role Tags */}
        <div className="flex flex-wrap items-center gap-1 pt-1">
          {question.companyTags.map((comp, i) => (
            <span key={i} className="text-[10px] font-semibold text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded">
              {comp}
            </span>
          ))}
          {question.roleTags.map((role, i) => (
            <span key={i} className="text-[10px] font-semibold text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
              {role}
            </span>
          ))}
        </div>

        {/* Footer Duration & CTAs */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5 gap-2">
          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
            <Clock className="h-3.5 w-3.5 text-purple-400" />
            <span>{question.estimatedTimeMinutes} Min Practice</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => onPreview(question)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-300 border-white/15 bg-white/5 hover:bg-white/10 hover:text-white rounded-xl transition-all cursor-pointer flex items-center gap-1"
            >
              <Eye className="h-3.5 w-3.5 text-slate-400" />
              <span>Preview</span>
            </Button>
            <Button
              onClick={() => onPreview(question)}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all cursor-pointer border-none flex items-center gap-1"
            >
              <Play className="h-3.5 w-3.5 fill-white" />
              <span>Practice</span>
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
export default QuestionCard
