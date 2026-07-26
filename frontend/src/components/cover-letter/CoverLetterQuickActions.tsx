import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Copy,
  CopyPlus,
  RotateCcw,
  Star,
  Download,
  Share2,
  Check,
} from 'lucide-react'
import { useScoreliaReducedMotion } from '@/lib/motion'

export interface CoverLetterQuickActionsProps {
  onCopyText?: () => void
  onDuplicateVersion?: () => void
  onResetDraft?: () => void
  onToggleFavorite?: () => void
  onDownloadClick?: () => void
  isFavorite?: boolean
}

export const CoverLetterQuickActions: React.FC<CoverLetterQuickActionsProps> = ({
  onCopyText,
  onDuplicateVersion,
  onResetDraft,
  onToggleFavorite,
  onDownloadClick,
  isFavorite = false,
}) => {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const [copied, setCopied] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 2500)
  }

  const handleCopy = () => {
    setCopied(true)
    onCopyText?.()
    showToast('Cover letter text copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDuplicate = () => {
    onDuplicateVersion?.()
    showToast('Created duplicate version draft!')
  }

  const handleReset = () => {
    onResetDraft?.()
    showToast('Reset cover letter draft!')
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3.5 sm:p-4 shadow-[var(--shadow-sm)] space-y-2 text-left relative">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-[var(--heading)] uppercase tracking-wider">
            Quick Actions
          </span>
          <AnimatePresence>
            {toastMessage && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1"
              >
                <Check size={11} />
                <span>{toastMessage}</span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Copy Action */}
          <motion.button
            whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            type="button"
            onClick={handleCopy}
            className="min-h-[44px] sm:min-h-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40 hover:bg-[var(--surface-hover)] text-xs font-bold text-[var(--heading)] transition-all cursor-pointer"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </motion.button>

          {/* Duplicate Action */}
          <motion.button
            whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            type="button"
            onClick={handleDuplicate}
            className="min-h-[44px] sm:min-h-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40 hover:bg-[var(--surface-hover)] text-xs font-bold text-[var(--heading)] transition-all cursor-pointer"
          >
            <CopyPlus size={13} />
            <span>Duplicate</span>
          </motion.button>

          {/* Favorite Action */}
          <motion.button
            whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            type="button"
            onClick={onToggleFavorite}
            className="min-h-[44px] sm:min-h-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40 hover:bg-[var(--surface-hover)] text-xs font-bold text-[var(--heading)] transition-all cursor-pointer"
          >
            <Star
              size={13}
              className={isFavorite ? 'fill-amber-400 text-amber-400' : 'text-[var(--muted)]'}
            />
            <span>{isFavorite ? 'Favorited' : 'Favorite'}</span>
          </motion.button>

          {/* Reset Action */}
          <motion.button
            whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            type="button"
            onClick={handleReset}
            className="min-h-[44px] sm:min-h-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40 hover:bg-[var(--surface-hover)] text-xs font-bold text-[var(--heading)] transition-all cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </motion.button>

          {/* Download Action (Active Export Trigger) */}
          <motion.button
            whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            type="button"
            onClick={onDownloadClick}
            className="min-h-[44px] sm:min-h-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--primary)] bg-[var(--primary)]/15 text-xs font-bold text-[var(--primary)] hover:bg-[var(--primary)]/20 transition-all cursor-pointer"
          >
            <Download size={13} />
            <span>Export / Download</span>
          </motion.button>
        </div>
      </div>
    </div>
  )
}

export default CoverLetterQuickActions
