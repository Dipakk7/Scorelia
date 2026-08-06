import React from 'react'
import { motion } from 'framer-motion'
import { Award, Video, BookOpen, Target, TrendingUp, Clock } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { AnalyticsSummaryCardItem } from '@/types/interviewPrep'

export interface AnalyticsSummaryCardsProps {
  cards: AnalyticsSummaryCardItem[]
}

export function AnalyticsSummaryCards({ cards }: AnalyticsSummaryCardsProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Video':
        return Video
      case 'BookOpen':
        return BookOpen
      case 'Target':
        return Target
      case 'TrendingUp':
        return TrendingUp
      case 'Clock':
        return Clock
      default:
        return Award
    }
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card, index) => {
        const Icon = getIcon(card.iconName)

        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.04 }}
          >
            <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-3.5 hover:border-purple-500/30 hover:scale-[1.01] transition-all flex flex-col justify-between h-full space-y-2.5 text-left">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-purple-500/15 text-purple-300 border border-purple-500/20 shrink-0">
                  <Icon className="h-4 w-4" />
                </div>

                {card.badgeText && (
                  <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0">
                    {card.badgeText}
                  </Badge>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block truncate">
                  {card.title}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-white font-mono leading-none">
                    {card.value}
                  </span>
                  {card.unit && (
                    <span className="text-[11px] text-slate-400 font-medium">
                      {card.unit}
                    </span>
                  )}
                </div>
              </div>

              {card.trendText && (
                <div className="text-[11px] text-emerald-400 font-semibold pt-1.5 border-t border-white/10 truncate">
                  {card.trendText}
                </div>
              )}
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
export default AnalyticsSummaryCards
