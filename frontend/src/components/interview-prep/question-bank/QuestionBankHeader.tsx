import React from 'react'
import { BookOpen, Sparkles, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export interface QuestionBankHeaderProps {
  totalQuestions?: number
  lastUpdatedText?: string
  onStartPractice?: () => void
}

export function QuestionBankHeader({
  totalQuestions = 1250,
  lastUpdatedText = 'Updated today',
  onStartPractice,
}: QuestionBankHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#10121e]/90 border border-white/10 p-5 rounded-2xl hover:border-purple-500/30 transition-all">
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
            <BookOpen className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Question Bank
            <Sparkles className="h-4 w-4 text-purple-400" />
          </h2>
          <Badge className="bg-purple-500/15 text-purple-300 border-purple-500/30 text-xs font-bold font-mono px-2.5 py-0.5">
            {totalQuestions.toLocaleString()}+ Questions
          </Badge>
        </div>
        <p className="text-xs text-slate-400 font-medium">
          Browse, filter, and practice real-world technical and behavioral interview questions tailored to top tech companies.
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <RefreshCw className="h-3.5 w-3.5 text-emerald-400" />
          <span>{lastUpdatedText}</span>
        </div>
        <Button
          onClick={onStartPractice}
          className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all cursor-pointer border-none shadow-md shadow-purple-900/30"
        >
          Practice Now
        </Button>
      </div>
    </div>
  )
}
export default QuestionBankHeader
