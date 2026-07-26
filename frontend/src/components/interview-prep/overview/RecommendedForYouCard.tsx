import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Bookmark, Bot, Brain, Cpu, Layers, AlertCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import type { RecommendationItem } from '@/types/interviewPrep'

export interface RecommendedForYouCardProps {
  recommendations?: RecommendationItem[]
  isLoading?: boolean
  isEmpty?: boolean
  isError?: boolean
}

export function RecommendedForYouCard({
  recommendations = [],
  isLoading = false,
  isEmpty = false,
  isError = false,
}: RecommendedForYouCardProps) {
  const [bookmarkedMap, setBookmarkedMap] = useState<Record<string, boolean>>({})

  const toggleBookmark = (id: string) => {
    setBookmarkedMap((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Brain':
        return Brain
      case 'Cpu':
        return Cpu
      case 'Layers':
        return Layers
      default:
        return Bot
    }
  }

  if (isLoading) {
    return (
      <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-5 h-full flex flex-col justify-between">
        <CardHeader className="p-0 pb-4 flex flex-row items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-[#141627] border border-white/10 rounded-xl p-4 space-y-3">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-9 w-full rounded-xl" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-5">
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-300 text-xs font-semibold">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>Failed to load recommendations.</span>
        </div>
      </Card>
    )
  }

  if (isEmpty || !recommendations || recommendations.length === 0) {
    return (
      <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-5 text-center text-slate-400 text-xs font-medium">
        No recommendations available at this time.
      </Card>
    )
  }

  return (
    <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-5 hover:border-purple-500/30 transition-all flex flex-col justify-between h-full">
      <CardHeader className="p-0 pb-4 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-bold text-white tracking-tight">
            Recommended for You
          </CardTitle>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Personalized practice based on your target role and resume
          </p>
        </div>
        <button className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer whitespace-nowrap">
          <span>View all recommendations</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </CardHeader>

      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {recommendations.map((item, index) => {
            const Icon = getIcon(item.iconName)
            const isBookmarked = bookmarkedMap[item.id] ?? item.isBookmarked

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
                className="bg-[#141627] border border-white/10 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-white/20 transition-all"
              >
                {/* Icon & Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="p-2.5 rounded-xl border bg-purple-500/20 text-purple-300 border-purple-500/30">
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge
                    className={
                      item.badgeVariant === 'success'
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px] font-bold rounded-lg py-0.5 px-2'
                        : 'bg-amber-500/15 text-amber-400 border-amber-500/30 text-[10px] font-bold rounded-lg py-0.5 px-2'
                    }
                  >
                    {item.badgeText}
                  </Badge>
                </div>

                {/* Title & Description */}
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white leading-tight">{item.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>

                {/* Progress Indicator */}
                <div className="space-y-1">
                  <div className="text-[11px] text-slate-400 font-medium flex justify-between">
                    <span>{item.currentPracticed}/{item.totalQuestions} Questions Practiced</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${(item.currentPracticed / item.totalQuestions) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <Button className="flex-1 py-1.5 px-3 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all cursor-pointer border-none shadow-md shadow-purple-900/20">
                    Start Practice
                  </Button>
                  <button
                    onClick={() => toggleBookmark(item.id)}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      isBookmarked
                        ? 'bg-purple-600/30 text-purple-300 border-purple-500/40'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-purple-400 text-purple-400' : ''}`} />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
export default RecommendedForYouCard
