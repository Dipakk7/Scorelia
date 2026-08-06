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
  SlidersHorizontal,
  Flame,
  CheckCircle2,
} from 'lucide-react'
import { useScoreliaReducedMotion } from '@/lib/motion'

export interface CategorizedAITool {
  id: string
  title: string
  description: string
  category: 'tone' | 'impact' | 'precision' | 'ats'
  categoryLabel: string
  impactBadge: string
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
  const [activeCategory, setActiveCategory] = useState<'all' | 'tone' | 'impact' | 'precision' | 'ats'>('all')
  const [activeToolId, setActiveToolId] = useState<string | null>(null)
  const [processingToolId, setProcessingToolId] = useState<string | null>(null)
  const [activeMessage, setActiveMessage] = useState<string | null>(null)

  const tools: CategorizedAITool[] = [
    {
      id: 'improve-writing',
      title: 'Improve Flow & Tone',
      description: 'Enhance overall readability and narrative cadence',
      category: 'tone',
      categoryLabel: 'Tone & Style',
      impactBadge: '+12% Readability',
      icon: <Wand2 className="w-4 h-4" />,
      colorClass: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
    },
    {
      id: 'make-professional',
      title: 'Make Executive',
      description: 'Refine phrasing for senior corporate leadership',
      category: 'tone',
      categoryLabel: 'Tone & Style',
      impactBadge: 'Executive Level',
      icon: <Briefcase className="w-4 h-4" />,
      colorClass: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    },
    {
      id: 'shorten',
      title: 'Shorten & Concise',
      description: 'Trim fluff and condense key achievements',
      category: 'impact',
      categoryLabel: 'Length & Impact',
      impactBadge: '-25% Length',
      icon: <Minimize2 className="w-4 h-4" />,
      colorClass: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    },
    {
      id: 'expand',
      title: 'Elaborate Achievements',
      description: 'Expand bullet points with technical depth',
      category: 'impact',
      categoryLabel: 'Length & Impact',
      impactBadge: '+18% Technical Depth',
      icon: <Maximize2 className="w-4 h-4" />,
      colorClass: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
    },
    {
      id: 'fix-grammar',
      title: 'Fix Grammar & Mechanics',
      description: 'Eliminate typos, syntax issues & punctuation errors',
      category: 'precision',
      categoryLabel: 'Precision',
      impactBadge: '100% Accuracy',
      icon: <SpellCheck className="w-4 h-4" />,
      colorClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    },
    {
      id: 'add-keywords',
      title: 'Target Skills Match',
      description: 'Inject missing JD competencies seamlessly',
      category: 'ats',
      categoryLabel: 'ATS & Skills',
      impactBadge: '+14% Skill Match',
      icon: <Target className="w-4 h-4" />,
      colorClass: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
    },
    {
      id: 'stronger-closing',
      title: 'Strong Call-to-Action',
      description: 'Craft an impactful final paragraph for recruiters',
      category: 'tone',
      categoryLabel: 'Tone & Style',
      impactBadge: 'High Recruiter Impact',
      icon: <Sparkles className="w-4 h-4" />,
      colorClass: 'bg-pink-500/15 text-pink-400 border-pink-500/20',
    },
    {
      id: 'ats-optimization',
      title: 'ATS Scanner Optimization',
      description: 'Format keywords and headers for recruiter parsing bots',
      category: 'ats',
      categoryLabel: 'ATS & Skills',
      impactBadge: 'ATS 95%+ Aligned',
      icon: <Zap className="w-4 h-4" />,
      colorClass: 'bg-teal-500/15 text-teal-400 border-teal-500/20',
    },
  ]

  const filteredTools = tools.filter((tool) => {
    if (activeCategory === 'all') return true
    return tool.category === activeCategory
  })

  const handleToolClick = (tool: CategorizedAITool) => {
    setProcessingToolId(tool.id)
    setActiveMessage(`Processing AI Action: ${tool.title}...`)

    setTimeout(() => {
      setProcessingToolId(null)
      setActiveToolId(tool.id)
      onApplyToolTransformation?.(tool.id)
      setActiveMessage(`Applied "${tool.title}" transformation to cover letter draft!`)

      setTimeout(() => {
        setActiveToolId(null)
        setActiveMessage(null)
      }, 2500)
    }, 600)
  }

  return (
    <div className="rounded-2xl bg-[#121426] border border-white/10 bg-gradient-to-r from-[#14162a] via-[#111324] to-[#14162a] p-4 sm:p-6 shadow-lg shadow-purple-950/10 space-y-4 text-left transition-all">
      {/* Title Header & Notification Alert */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight m-0">
              Categorized AI Action Suite
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
              Smart Actions
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium m-0 mt-1">
            Categorized AI actions designed to optimize tone, impact, syntax precision, and ATS score.
          </p>
        </div>

        <AnimatePresence>
          {activeMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold shrink-0"
            >
              {processingToolId ? <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{activeMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Category Navigation Tabs */}
      <div className="flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 text-xs font-bold overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer border-none whitespace-nowrap ${
            activeCategory === 'all'
              ? 'bg-purple-600/40 text-white border border-purple-500/50 shadow-md'
              : 'text-slate-400 hover:text-slate-200 bg-transparent'
          }`}
        >
          All Smart Actions ({tools.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveCategory('tone')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer border-none whitespace-nowrap ${
            activeCategory === 'tone'
              ? 'bg-purple-600/40 text-white border border-purple-500/50 shadow-md'
              : 'text-slate-400 hover:text-slate-200 bg-transparent'
          }`}
        >
          Tone & Executive Style
        </button>
        <button
          type="button"
          onClick={() => setActiveCategory('impact')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer border-none whitespace-nowrap ${
            activeCategory === 'impact'
              ? 'bg-purple-600/40 text-white border border-purple-500/50 shadow-md'
              : 'text-slate-400 hover:text-slate-200 bg-transparent'
          }`}
        >
          Length & Impact
        </button>
        <button
          type="button"
          onClick={() => setActiveCategory('precision')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer border-none whitespace-nowrap ${
            activeCategory === 'precision'
              ? 'bg-purple-600/40 text-white border border-purple-500/50 shadow-md'
              : 'text-slate-400 hover:text-slate-200 bg-transparent'
          }`}
        >
          Precision & Mechanics
        </button>
        <button
          type="button"
          onClick={() => setActiveCategory('ats')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer border-none whitespace-nowrap ${
            activeCategory === 'ats'
              ? 'bg-purple-600/40 text-white border border-purple-500/50 shadow-md'
              : 'text-slate-400 hover:text-slate-200 bg-transparent'
          }`}
        >
          ATS & Competencies
        </button>
      </div>

      {/* Grid of Categorized AI Tools */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {filteredTools.map((tool) => {
          const isProcessing = processingToolId === tool.id
          const isSelected = activeToolId === tool.id

          return (
            <motion.button
              key={tool.id}
              whileHover={shouldReduceMotion ? {} : { y: -2 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
              type="button"
              onClick={() => handleToolClick(tool)}
              disabled={isProcessing}
              className={`flex flex-col justify-between p-3.5 rounded-xl border transition-all text-left cursor-pointer group focus:outline-none ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-500/15 shadow-md ring-1 ring-emerald-500/30'
                  : isProcessing
                  ? 'border-purple-500 bg-purple-500/15 shadow-md animate-pulse'
                  : 'border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-purple-500/40'
              }`}
            >
              <div className="space-y-2.5 w-full">
                <div className="flex items-center justify-between gap-2">
                  <div className={`p-2 rounded-lg border ${tool.colorClass} shrink-0`}>
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : isSelected ? <Check className="w-4 h-4 text-emerald-400" /> : tool.icon}
                  </div>

                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {tool.categoryLabel}
                  </span>
                </div>

                <div>
                  <span className="block font-bold text-xs text-white leading-tight group-hover:text-purple-300 transition-colors">
                    {tool.title}
                  </span>
                  <span className="block text-[11px] text-slate-400 font-medium leading-relaxed mt-1">
                    {tool.description}
                  </span>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-slate-800/80 mt-3 w-full text-[11px] font-bold">
                <span className="text-emerald-400">{tool.impactBadge}</span>
                <span className="text-purple-300 group-hover:underline">Apply Action →</span>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

export default AIEnhancementToolsCard
