import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useScoreliaReducedMotion } from '@/lib/motion'

interface CollapsibleSectionProps {
  id: string
  title: string
  subtitle?: string
  icon?: React.ElementType
  badgeText?: string
  defaultOpen?: boolean
  isOpen?: boolean
  onToggle?: (isOpen: boolean) => void
  children: React.ReactNode
  className?: string
}

export function CollapsibleSection({
  id,
  title,
  subtitle,
  icon: Icon,
  badgeText,
  defaultOpen = true,
  isOpen: controlledIsOpen,
  onToggle,
  children,
  className = '',
}: CollapsibleSectionProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen)
  const isExpanded = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen
  const shouldReduceMotion = useScoreliaReducedMotion()

  const handleToggle = () => {
    const next = !isExpanded
    if (onToggle) onToggle(next)
    else setInternalIsOpen(next)
  }

  return (
    <div className={`w-full text-left space-y-3 ${className}`}>
      {/* Section Header Bar */}
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isExpanded}
        aria-controls={`collapsible-section-content-${id}`}
        id={`collapsible-section-header-${id}`}
        className="w-full flex items-center justify-between p-3 sm:p-3.5 rounded-2xl bg-[#0f101c] border border-white/10 hover:border-purple-500/30 transition-all cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {Icon && (
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
              <Icon size={16} className="stroke-[2]" aria-hidden="true" />
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-100 m-0 group-hover:text-purple-300 transition-colors truncate">
                {title}
              </h3>
              {badgeText && (
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold border border-purple-500/30 shrink-0">
                  {badgeText}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-slate-400 font-medium m-0 mt-0.5 truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <ChevronDown
          size={16}
          className={`text-slate-400 group-hover:text-slate-200 transition-transform duration-200 shrink-0 ${
            isExpanded ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </button>

      {/* Collapsible Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id={`collapsible-section-content-${id}`}
            role="region"
            aria-labelledby={`collapsible-section-header-${id}`}
            initial={shouldReduceMotion ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={shouldReduceMotion ? { opacity: 0, height: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pt-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CollapsibleSection
