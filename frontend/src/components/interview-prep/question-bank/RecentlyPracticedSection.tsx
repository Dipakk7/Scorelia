import React from 'react'
import { motion } from 'framer-motion'
import { History, ArrowRight, Award } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { RecentlyPracticedQuestionItem } from '@/types/interviewPrep'

export interface RecentlyPracticedSectionProps {
  recentItems: RecentlyPracticedQuestionItem[]
  onSelect: (item: RecentlyPracticedQuestionItem) => void
}

export function RecentlyPracticedSection({ recentItems, onSelect }: RecentlyPracticedSectionProps) {
  if (!recentItems || recentItems.length === 0) return null

  return (
    <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-5 hover:border-purple-500/30 transition-all space-y-4">
      <CardHeader className="p-0 pb-3 flex flex-row items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
            <History className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-white tracking-tight">
              Recently Practiced Questions
            </CardTitle>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Pick up right where you left off
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 space-y-2">
        {recentItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.05 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-[#141627] border border-white/5 hover:border-white/15 transition-all gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
                <Award className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block leading-tight">
                  {item.questionTitle}
                </span>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                  <Badge className="bg-white/5 text-slate-300 border-white/10 text-[9px] font-semibold px-1.5 py-0.5">
                    {item.categoryLabel}
                  </Badge>
                  <span>•</span>
                  <span>{item.completionDate}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 justify-between sm:justify-end">
              <span className="text-xs font-bold text-emerald-400 font-mono">
                {item.practiceScorePercent}% Score
              </span>
              <Button
                variant="outline"
                onClick={() => onSelect(item)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-300 border-white/15 bg-white/5 hover:bg-white/10 hover:text-white rounded-xl transition-all cursor-pointer flex items-center gap-1"
              >
                <span>Continue</span>
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}
export default RecentlyPracticedSection
