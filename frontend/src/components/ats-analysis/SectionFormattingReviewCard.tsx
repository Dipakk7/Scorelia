import React, { useState, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, CheckCircle2, AlertTriangle, ChevronDown, HelpCircle } from 'lucide-react'
import type { SectionFormatCheckItem } from '@/lib/ats-section-mock-data'
import { useScoreliaReducedMotion, getAccordionVariants } from '@/lib/motion'
import { cn } from '@/lib/utils'

interface SectionFormattingReviewCardProps {
  formattingChecks?: SectionFormatCheckItem[]
}

export const SectionFormattingReviewCard: React.FC<SectionFormattingReviewCardProps> = memo(({
  formattingChecks = [],
}) => {
  const safeChecks = Array.isArray(formattingChecks) ? formattingChecks : []
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const shouldReduceMotion = useScoreliaReducedMotion()
  const accordionVariants = getAccordionVariants(shouldReduceMotion)

  const toggleExpand = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }, [])

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800/90 p-5 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-purple-400" />
            Section Formatting Audit Review
          </h3>
          <p className="text-xs text-slate-400">
            Audit checks for Heading, Font, Spacing, Bullet Points, Dates, Alignment, and Consistency.
          </p>
        </div>

        <span className="text-xs font-mono text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
          {safeChecks.length} Formatting Rules
        </span>
      </div>

      {/* Grid of Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {safeChecks.map((item) => {
          const isExpanded = expandedId === item.id
          const isPass = item.status === 'pass'
          const contentId = `format-check-content-${item.id}`

          return (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => toggleExpand(item.id)}
              aria-expanded={isExpanded}
              aria-controls={contentId}
              whileTap={shouldReduceMotion ? {} : { scale: 0.99 }}
              className={cn(
                'p-3.5 min-h-[44px] rounded-xl bg-slate-950/60 border text-left transition-all duration-200 cursor-pointer space-y-2 focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none w-full',
                isExpanded
                  ? 'border-purple-500/50 bg-purple-950/20 shadow-md'
                  : 'border-slate-800/80 hover:border-purple-500/30'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isPass ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                  <span className="text-xs font-bold text-slate-200">{item.title}</span>
                </div>

                <span
                  className={cn(
                    'text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border',
                    isPass
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  )}
                >
                  {isPass ? 'PASS' : 'WARNING'}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>{item.rule}</span>
                <ChevronDown
                  className={cn('w-4 h-4 text-slate-500 transition-transform duration-200', isExpanded && 'rotate-180')}
                />
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    id={contentId}
                    variants={accordionVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="overflow-hidden pt-2 border-t border-slate-800/80 text-xs text-slate-300 space-y-1"
                  >
                    <p className="text-slate-400">{item.details}</p>
                    <p className="text-purple-300 font-medium flex items-start gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                      <span>Tip: {item.tip}</span>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
})

SectionFormattingReviewCard.displayName = 'SectionFormattingReviewCard'
