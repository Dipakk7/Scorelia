import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, TrendingUp, Award, CheckCircle2 } from 'lucide-react'
import { ScoreRing } from '@/components/ui/ScoreRing'
import { CountUpText } from '@/components/ui/CountUpText'
import { mockAtsOverviewData, type ATSOverviewData } from '@/lib/ats-mock-data'
import { useScoreliaReducedMotion, getCardVariants, getButtonVariants } from '@/lib/motion'

interface ATSHeroCardProps {
  data?: ATSOverviewData
  onAnalyzeClick?: () => void
}

export const ATSHeroCard: React.FC<ATSHeroCardProps> = memo(({
  data = mockAtsOverviewData,
  onAnalyzeClick,
}) => {
  const safeData = data || mockAtsOverviewData
  const scoreBreakdown = safeData?.scoreBreakdown ?? []
  const shouldReduceMotion = useScoreliaReducedMotion()
  const cardVariants = getCardVariants(shouldReduceMotion)
  const buttonVariants = getButtonVariants(shouldReduceMotion)

  return (
    <section aria-label="ATS Score Overview" className="w-full">
      <motion.div
        variants={cardVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950/95 border border-slate-800/90 p-4 sm:p-4.5 shadow-xl backdrop-blur-md transition-colors"
      >
        {/* Glow Accent Effects */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
          {/* Left Column: Overall ATS Score Circular Gauge */}
          <div className="lg:col-span-4 flex flex-col items-center justify-between text-center p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 shadow-inner h-full">
            <div className="flex items-center justify-between w-full text-xs text-slate-400 mb-0.5">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-purple-400" />
                ATS Score
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <TrendingUp className="w-3 h-3" />
                {safeData.trend || '+5%'}
              </span>
            </div>

            {/* Score Ring Visualization */}
            <div className="relative my-1 flex items-center justify-center">
              <ScoreRing
                value={safeData.overallScore ?? 92}
                max={safeData.maxScore ?? 100}
                size={136}
                strokeWidth={9}
                color="--success"
                trackColor="--border"
                subLabel="EXCELLENT"
              />
            </div>

            <div className="space-y-1 w-full">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                {safeData.percentile || 'Top 10%'}
              </span>

              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Your resume is highly likely to pass ATS screening across top enterprise platforms.
              </p>
            </div>

            <motion.button
              type="button"
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              onClick={onAnalyzeClick}
              className="mt-3 inline-flex items-center justify-center gap-2 w-full px-3.5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-purple-600/25 border border-purple-500/30 cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-200" />
              <span>Re-analyze Resume</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>

          {/* Right Column: Score Summary Breakdown across 6 criteria */}
          <div className="lg:col-span-8 flex flex-col justify-between p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 shadow-inner h-full space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  Score Summary
                </h3>
                <p className="text-xs text-slate-400">
                  Detailed breakdown across 6 key ATS performance factors.
                </p>
              </div>

              <span className="text-xs font-mono text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                Last analyzed: 2 min ago
              </span>
            </div>

            {/* 6 Category Breakdown Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-1">
              {scoreBreakdown.map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={shouldReduceMotion ? {} : { y: -2 }}
                  className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-1.5 group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-md bg-purple-500/15 border border-purple-500/30 text-purple-300 flex items-center justify-center text-[11px] font-bold font-mono">
                      {item.code}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {item.status}
                    </span>
                  </div>

                  <div>
                    <div className="text-xs text-slate-400 font-medium group-hover:text-slate-200 transition-colors">
                      {item.label}
                    </div>
                    <div className="text-lg font-extrabold text-white font-mono tracking-tight flex items-baseline gap-1">
                      <CountUpText value={item.score} duration={0.8} />
                      <span className="text-xs font-normal text-slate-500">/ 100</span>
                    </div>
                  </div>

                  {/* Progress Line */}
                  <div className="space-y-1">
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-purple-400 hover:underline font-medium">
                      Why this score?
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
})

ATSHeroCard.displayName = 'ATSHeroCard'
