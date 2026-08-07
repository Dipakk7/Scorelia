import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, BookOpen, Building2, Briefcase, RefreshCw, AlertCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import type { QuestionBankStats } from '@/types/interviewPrep'

export interface QuestionBankCardProps {
  stats?: QuestionBankStats
  isLoading?: boolean
  isEmpty?: boolean
  isError?: boolean
}

export function QuestionBankCard({
  stats,
  isLoading = false,
  isEmpty = false,
  isError = false,
}: QuestionBankCardProps) {
  const getStatIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen':
        return BookOpen
      case 'Building2':
        return Building2
      case 'Briefcase':
        return Briefcase
      case 'RefreshCw':
        return RefreshCw
      default:
        return BookOpen
    }
  }

  if (isLoading) {
    return (
      <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-4 sm:p-4.5 h-full flex flex-col justify-between">
        <CardHeader className="p-0 pb-3 flex flex-row items-center justify-between">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-20" />
        </CardHeader>
        <CardContent className="p-0 space-y-3.5">
          <div className="flex flex-col space-y-3 w-full">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-4 sm:p-4.5">
        <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-300 text-xs font-semibold">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Failed to load Question Bank statistics.</span>
        </div>
      </Card>
    )
  }

  if (isEmpty || !stats) {
    return (
      <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-4 sm:p-4.5 text-center text-slate-400 text-xs font-medium">
        Question Bank data is unavailable.
      </Card>
    )
  }

  return (
    <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-5 sm:p-5.5 hover:border-purple-500/30 transition-all flex flex-col justify-between h-full text-left">
      <CardHeader className="p-0 pb-4.5 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm sm:text-base font-bold text-white tracking-tight">
            Question Bank
          </CardTitle>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Browse and practice questions by difficulty
          </p>
        </div>
        <button className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer whitespace-nowrap transition-colors">
          <span>View all</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </CardHeader>

      <CardContent className="p-0 space-y-4 flex-1 flex flex-col justify-between">
        {/* Difficulty Breakdown Cards: Stacked vertically in 1 column */}
        <div className="flex flex-col space-y-3.5 w-full my-auto">
          {stats.difficulties.map((diff, index) => {
            const dotColor =
              diff.accentColor === 'emerald'
                ? 'bg-emerald-500'
                : diff.accentColor === 'amber'
                ? 'bg-amber-500'
                : 'bg-rose-500'

            const borderHover =
              diff.accentColor === 'emerald'
                ? 'hover:border-emerald-500/40'
                : diff.accentColor === 'amber'
                ? 'hover:border-amber-500/40'
                : 'hover:border-rose-500/40'

            const btnStyle =
              diff.accentColor === 'emerald'
                ? 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50'
                : diff.accentColor === 'amber'
                ? 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/50'
                : 'border-rose-500/30 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/50'

            return (
              <motion.div
                key={diff.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.05 }}
                className={`bg-[#141627] border border-white/10 rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 ${borderHover} transition-all text-left w-full`}
              >
                {/* LEFT: Difficulty Dot & Label + Question Count */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`h-2.5 w-2.5 rounded-full ${dotColor}`} />
                    <span className="text-xs font-bold text-slate-300 w-16">{diff.label}</span>
                  </div>

                  <div className="flex items-baseline gap-1.5 border-l border-white/10 pl-3.5">
                    <span className="text-xl sm:text-2xl font-black text-white leading-none font-mono">
                      {diff.questionCount}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Questions</span>
                  </div>
                </div>

                {/* RIGHT: Avg Score + Practice Button */}
                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                  <div className="text-xs text-slate-400 font-medium whitespace-nowrap">
                    Avg Score: <span className="font-bold text-white font-mono">{diff.avgScorePercent}%</span>
                  </div>

                  <Button
                    variant="outline"
                    className={`h-8 px-4 text-xs font-bold rounded-xl transition-all cursor-pointer bg-transparent border ${btnStyle} whitespace-nowrap`}
                  >
                    Practice
                  </Button>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Footer Stats Bar (Preserved Exactly as original) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3.5 border-t border-white/10">
          {stats.libraryStats.map((stat, i) => {
            const Icon = getStatIcon(stat.iconName)
            return (
              <div key={i} className="flex items-center gap-2.5 bg-[#141627]/60 p-2.5 rounded-xl border border-white/5">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="truncate">
                  <span className="text-[10px] text-slate-400 font-medium block truncate">
                    {stat.title}
                  </span>
                  <span className="text-xs font-bold text-white truncate block leading-tight">
                    {stat.value}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
export default QuestionBankCard
