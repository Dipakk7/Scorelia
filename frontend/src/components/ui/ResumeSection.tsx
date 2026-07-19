import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useScoreliaReducedMotion, getAccordionVariants } from '@/lib/motion'

interface ResumeSectionProps {
  title: string
  icon: React.ReactNode
  badge?: React.ReactNode
  isOpen?: boolean
  onToggle?: () => void
  children: React.ReactNode
  className?: string
}

export default function ResumeSection({
  title,
  icon,
  badge,
  isOpen: propsIsOpen,
  onToggle,
  children,
  className,
}: ResumeSectionProps) {
  const [localIsOpen, setLocalIsOpen] = useState(true)
  const shouldReduceMotion = useScoreliaReducedMotion()
  const isExpanded = onToggle ? propsIsOpen : localIsOpen
  const toggle = onToggle ? onToggle : () => setLocalIsOpen(!localIsOpen)

  return (
    <div
      className={cn(
        'border border-border bg-card rounded-2xl overflow-hidden shadow-sm hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300',
        className
      )}
    >
      {/* Header */}
      <div
        onClick={toggle}
        className="p-4 flex items-center justify-between cursor-pointer select-none bg-slate-50/50 dark:bg-slate-900/30 hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white dark:bg-slate-800 text-muted-foreground border border-slate-150 dark:border-slate-700 rounded-xl">
            {icon}
          </div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold font-display text-foreground m-0">
              {title}
            </h3>
            {badge && <div className="text-xs font-sans">{badge}</div>}
          </div>
        </div>

        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.18, ease: 'easeInOut' }}
          className="text-slate-400 dark:text-slate-500"
        >
          <ChevronDown size={16} />
        </motion.div>
      </div>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            variants={getAccordionVariants(shouldReduceMotion)}
            initial="initial"
            animate="animate"
            exit="exit"
            className="overflow-hidden"
          >
            <div className="p-5 border-t border-[var(--border)] font-sans">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
