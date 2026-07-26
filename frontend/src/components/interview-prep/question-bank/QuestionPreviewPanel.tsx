import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Clock, Lightbulb, Target, Play, Bookmark, Building2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import type { QuestionBankItem } from '@/types/interviewPrep'

export interface QuestionPreviewPanelProps {
  question: QuestionBankItem | null
  onClose: () => void
  onToggleBookmark: (id: string) => void
}

export function QuestionPreviewPanel({ question, onClose, onToggleBookmark }: QuestionPreviewPanelProps) {
  if (!question) return null

  const diffBadgeStyle =
    question.difficulty === 'Easy'
      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
      : question.difficulty === 'Medium'
      ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
      : 'bg-rose-500/15 text-rose-400 border-rose-500/30'

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl"
        >
          <Card className="bg-[#10121e] border border-purple-500/30 rounded-2xl p-6 shadow-2xl space-y-5 text-left max-h-[90vh] overflow-y-auto custom-scrollbar">
            {/* Header */}
            <CardHeader className="p-0 pb-3 flex flex-row items-start justify-between border-b border-white/10">
              <div className="space-y-1 pr-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={`text-xs font-bold px-2.5 py-0.5 rounded ${diffBadgeStyle}`}>
                    {question.difficulty}
                  </Badge>
                  <Badge className="bg-purple-500/15 text-purple-300 border-purple-500/30 text-xs font-bold">
                    {question.categoryLabel}
                  </Badge>
                  <Badge className="bg-white/5 text-slate-300 border-white/10 text-xs font-semibold">
                    {question.questionType}
                  </Badge>
                </div>
                <CardTitle className="text-lg font-bold text-white leading-snug pt-1">
                  {question.title}
                </CardTitle>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onToggleBookmark(question.id)}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    question.isBookmarked
                      ? 'bg-purple-600/30 text-purple-300 border-purple-500/40'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <Bookmark className={`h-4 w-4 ${question.isBookmarked ? 'fill-purple-400 text-purple-400' : ''}`} />
                </button>

                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </CardHeader>

            <CardContent className="p-0 space-y-4 text-xs">
              {/* Short Description */}
              <div className="p-3.5 rounded-xl bg-[#141627] border border-white/5 text-slate-300 leading-relaxed font-medium">
                {question.shortDescription}
              </div>

              {/* Target Companies & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#141627]/70 border border-white/5 space-y-1">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider flex items-center gap-1">
                    <Building2 className="h-3 w-3 text-purple-400" /> Target Companies
                  </span>
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {question.companyTags.map((comp, i) => (
                      <span key={i} className="text-[11px] font-bold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded">
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#141627]/70 border border-white/5 space-y-1">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider flex items-center gap-1">
                    <Clock className="h-3 w-3 text-purple-400" /> Expected Duration
                  </span>
                  <span className="text-xs font-bold text-white block">
                    {question.expectedDurationText}
                  </span>
                </div>
              </div>

              {/* Hints Section */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Lightbulb className="h-4 w-4 text-amber-400" />
                  Key Hints & Approach Points
                </span>
                <ul className="space-y-1.5 pl-4 list-disc text-slate-400 font-medium">
                  {question.hints.map((hint, i) => (
                    <li key={i} className="leading-relaxed">{hint}</li>
                  ))}
                </ul>
              </div>

              {/* Learning Objectives */}
              <div className="space-y-2 pt-1 border-t border-white/5">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Target className="h-4 w-4 text-emerald-400" />
                  Skills & Learning Objectives Tested
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {question.skillsTested.map((skill, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA Action */}
              <div className="pt-3 border-t border-white/10 flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 border-white/15 bg-white/5 rounded-xl cursor-pointer"
                >
                  Close Preview
                </Button>
                <Button
                  onClick={onClose}
                  className="px-6 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all cursor-pointer border-none flex items-center gap-2 shadow-md shadow-purple-900/30"
                >
                  <Play className="h-3.5 w-3.5 fill-white" />
                  <span>Start Practice Session</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
export default QuestionPreviewPanel
