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
      <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-4 sm:p-4.5 h-full flex flex-col justify-between">
        <CardHeader className="p-0 pb-3 flex flex-row items-center justify-between">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col space-y-3 w-full">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-[#141627] border border-white/10 rounded-xl p-3.5 space-y-3 w-full">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-8 w-full" />
              </div>
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
          <span>Failed to load recommendations.</span>
        </div>
      </Card>
    )
  }

  if (isEmpty || !recommendations || recommendations.length === 0) {
    return (
      <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-4 sm:p-4.5 text-center text-slate-400 text-xs font-medium">
        No recommendations available at this time.
      </Card>
    )
  }

  return (
    <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-4 sm:p-4.5 hover:border-purple-500/30 transition-all flex flex-col justify-between h-full text-left">
      <CardHeader className="p-0 pb-3.5 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm sm:text-base font-bold text-white tracking-tight">
            Recommended for You
          </CardTitle>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Personalized practice based on target role & resume
          </p>
        </div>
        <button className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer whitespace-nowrap transition-colors">
          <span>View all</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </CardHeader>

      <CardContent className="p-0 flex-1 flex flex-col justify-start">
        {/* 3 Vertical Rows (Card 1 ↓ Card 2 ↓ Card 3) occupying full section width */}
        <div className="flex flex-col space-y-3.5 w-full">
          {recommendations.map((item, index) => {
            const Icon = getIcon(item.iconName)
            const isBookmarked = bookmarkedMap[item.id] ?? item.isBookmarked

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.05 }}
                className="bg-[#141627] border border-white/10 rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4 hover:border-purple-500/30 transition-all text-left w-full"
              >
                {/* LEFT: Icon + Title + Description + Progress */}
                <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                  {/* Icon */}
                  <div className="p-2.5 rounded-xl border bg-purple-500/15 text-purple-300 border-purple-500/30 shrink-0 my-auto">
                    <Icon className="h-4.5 w-4.5" />
                  </div>

                  {/* Info Stack */}
                  <div className="space-y-1 min-w-0 flex-1">
                    {/* Title */}
                    <h4 className="text-sm font-bold text-white leading-tight tracking-tight truncate">
                      {item.title}
                    </h4>

                    {/* Short Description */}
                    <p className="text-xs text-slate-400 font-medium line-clamp-1 leading-normal">
                      {item.description}
                    </p>

                    {/* Progress Bar & Label */}
                    <div className="flex items-center gap-3 pt-0.5 max-w-md">
                      <span className="text-[11px] text-slate-300 font-semibold shrink-0">
                        {item.currentPracticed}/{item.totalQuestions} Questions Practiced ({Math.round((item.currentPracticed / item.totalQuestions) * 100)}%)
                      </span>
                      <div className="h-1.5 flex-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full transition-all duration-300"
                          style={{ width: `${(item.currentPracticed / item.totalQuestions) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT: Status Badge + Action Buttons */}
                <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-center gap-2.5 shrink-0 pt-2.5 sm:pt-0 border-t sm:border-t-0 border-white/10 my-auto">
                  <Badge
                    className={
                      item.badgeVariant === 'success'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] sm:text-xs font-bold rounded-md py-0.5 px-2.5 shrink-0 whitespace-nowrap'
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] sm:text-xs font-bold rounded-md py-0.5 px-2.5 shrink-0 whitespace-nowrap'
                    }
                  >
                    {item.badgeText}
                  </Badge>

                  <div className="flex items-center gap-2">
                    <Button className="h-8.5 px-4 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all cursor-pointer border-none shadow-md shadow-purple-900/20 whitespace-nowrap">
                      Start Practice
                    </Button>
                    <button
                      onClick={() => toggleBookmark(item.id)}
                      aria-label="Bookmark recommendation"
                      className={`h-8.5 w-8.5 shrink-0 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                        isBookmarked
                          ? 'bg-purple-600/25 text-purple-300 border-purple-500/40'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-purple-400 text-purple-400' : ''}`} />
                    </button>
                  </div>
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
