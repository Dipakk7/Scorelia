import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wand2,
  Briefcase,
  Minimize2,
  Maximize2,
  SpellCheck,
  Target,
  Sparkles,
  Zap,
  Check,
  Loader2,
} from 'lucide-react'
import { useScoreliaReducedMotion } from '@/lib/motion'

export interface AIToolAction {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  colorClass: string
}

export interface AIEnhancementToolsCardProps {
  onApplyToolTransformation?: (toolId: string) => void
}

export const AIEnhancementToolsCard: React.FC<AIEnhancementToolsCardProps> = ({
  onApplyToolTransformation,
}) => {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const [activeToolId, setActiveToolId] = useState<string | null>(null)
  const [processingToolId, setProcessingToolId] = useState<string | null>(null)
  const [activeMessage, setActiveMessage] = useState<string | null>(null)

  const tools: AIToolAction[] = [
    {
      id: 'improve-writing',
      title: 'Improve Writing',
      description: 'Enhance overall flow & tone',
      icon: <Wand2 size={16} />,
      colorClass: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
    },
    {
      id: 'make-professional',
      title: 'Make Professional',
      description: 'Refine executive tone',
      icon: <Briefcase size={16} />,
      colorClass: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    },
    {
      id: 'shorten',
      title: 'Shorten',
      description: 'Make text concise',
      icon: <Minimize2 size={16} />,
      colorClass: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    },
    {
      id: 'expand',
      title: 'Expand',
      description: 'Elaborate key details',
      icon: <Maximize2 size={16} />,
      colorClass: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
    },
    {
      id: 'fix-grammar',
      title: 'Fix Grammar',
      description: 'Ensure 100% accuracy',
      icon: <SpellCheck size={16} />,
      colorClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    },
    {
      id: 'add-keywords',
      title: 'Add Keywords',
      description: 'Insert missing skills',
      icon: <Target size={16} />,
      colorClass: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
    },
    {
      id: 'stronger-closing',
      title: 'Stronger Closing',
      description: 'Boost recruiter impact',
      icon: <Sparkles size={16} />,
      colorClass: 'bg-pink-500/15 text-pink-400 border-pink-500/20',
    },
    {
      id: 'ats-optimization',
      title: 'ATS Optimization',
      description: 'Align with recruiter bots',
      icon: <Zap size={16} />,
      colorClass: 'bg-teal-500/15 text-teal-400 border-teal-500/20',
    },
  ]

  const handleToolClick = (tool: AIToolAction) => {
    setProcessingToolId(tool.id)
    setActiveMessage(`Processing AI Transformation: ${tool.title}...`)

    setTimeout(() => {
      setProcessingToolId(null)
      setActiveToolId(tool.id)
      onApplyToolTransformation?.(tool.id)
      setActiveMessage(`Applied "${tool.title}" AI enhancement to cover letter preview!`)

      setTimeout(() => {
        setActiveToolId(null)
        setActiveMessage(null)
      }, 2500)
    }, 700)
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-[var(--shadow-sm)] space-y-4 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="font-display font-extrabold text-sm sm:text-base text-[var(--heading)] m-0 flex items-center gap-2">
            <Sparkles size={16} className="text-purple-400" />
            <span>AI Enhancement Actions</span>
          </h3>
          <p className="text-xs text-[var(--muted)] font-medium m-0 mt-0.5">
            Click any AI tool to trigger live processing and transform your cover letter preview.
          </p>
        </div>

        <AnimatePresence>
          {activeMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold"
            >
              {processingToolId ? <Loader2 size={13} className="animate-spin text-purple-400" /> : <Check size={13} />}
              <span>{activeMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Grid of 8 AI Enhancement Tools */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {tools.map((tool) => {
          const isProcessing = processingToolId === tool.id
          const isSelected = activeToolId === tool.id

          return (
            <motion.button
              key={tool.id}
              whileHover={shouldReduceMotion ? {} : { y: -2 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
              type="button"
              onClick={() => handleToolClick(tool)}
              disabled={isProcessing}
              className={`flex items-start gap-3 p-3 rounded-xl border transition-all text-left cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-500/15 shadow-sm'
                  : isProcessing
                  ? 'border-[var(--primary)] bg-[var(--primary)]/15 shadow-sm animate-pulse'
                  : 'border-[var(--border)] bg-[var(--surface-hover)]/40 hover:bg-[var(--surface-hover)] hover:border-[var(--primary)]/40'
              }`}
            >
              <div
                className={`p-2 rounded-lg border ${tool.colorClass} shrink-0 transition-transform group-hover:scale-105`}
              >
                {isProcessing ? <Loader2 size={16} className="animate-spin" /> : isSelected ? <Check size={16} className="text-emerald-400" /> : tool.icon}
              </div>
              <div className="space-y-0.5 min-w-0">
                <span className="block font-bold text-xs text-[var(--heading)] leading-tight group-hover:text-[var(--primary)] transition-colors">
                  {tool.title}
                </span>
                <span className="block text-[11px] text-[var(--muted)] font-medium leading-tight truncate">
                  {tool.description}
                </span>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

export default AIEnhancementToolsCard
