import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Copy, Check, FileText } from 'lucide-react'
import { useScoreliaReducedMotion, getButtonVariants } from '@/lib/motion'

interface SectionATSRewriteCardProps {
  currentContent: string
  suggestedRewrite: string
}

export const SectionATSRewriteCard: React.FC<SectionATSRewriteCardProps> = ({
  currentContent,
  suggestedRewrite,
}) => {
  const [copied, setCopied] = useState(false)
  const shouldReduceMotion = useScoreliaReducedMotion()
  const buttonVariants = getButtonVariants(shouldReduceMotion)

  const handleCopy = () => {
    navigator.clipboard.writeText(suggestedRewrite)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-2xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-500/30 p-4 sm:p-5 shadow-xl space-y-4 h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 border border-purple-400/30 text-purple-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              AI ATS-Friendly Rewrite Preview
            </h3>
            <p className="text-xs text-purple-200/80">
              Compare current section text with an ATS-optimized version designed to maximize parser token scores.
            </p>
          </div>
        </div>

        <motion.button
          type="button"
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          onClick={handleCopy}
          aria-label="Copy ATS-Friendly Optimized Text"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[44px] text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-md transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none shrink-0"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Optimized Text</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Side-by-Side Dual Panel Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch flex-1">
        {/* Left Panel: Current Section Content */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 border-b border-slate-800 pb-2">
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" /> Current Section Text
            </span>
            <span className="text-[10px] font-mono text-slate-500">Original Draft</span>
          </div>
          <pre className="font-sans text-xs text-slate-300 whitespace-pre-wrap leading-relaxed min-h-[160px] max-h-64 overflow-y-auto p-3 rounded-lg bg-slate-900/60 border border-slate-800/50 flex-1">
            {currentContent}
          </pre>
        </div>

        {/* Right Panel: Suggested ATS-Friendly Version */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-purple-500/30 space-y-2 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between text-xs font-semibold text-purple-300 border-b border-slate-800 pb-2">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Suggested ATS-Friendly Version
            </span>
            <span className="text-[10px] font-mono text-emerald-400">Highlighted Diff</span>
          </div>
          <pre className="font-sans text-xs text-slate-200 whitespace-pre-wrap leading-relaxed min-h-[160px] max-h-64 overflow-y-auto p-3 rounded-lg bg-purple-950/20 border border-purple-500/20 text-purple-100 flex-1">
            {suggestedRewrite}
          </pre>
        </div>
      </div>
    </div>
  )
}
