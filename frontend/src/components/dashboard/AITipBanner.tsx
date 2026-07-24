import React from 'react'
import { Sparkles, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface AITipBannerProps {
  tipText?: string
  actionLabel?: string
  actionTo?: string
}

export const AITipBanner: React.FC<AITipBannerProps> = React.memo(({
  tipText = 'Adding 3-5 quantifiable achievements can increase your ATS score by 10-15%',
  actionLabel = 'Update your resume',
  actionTo = '/resumes',
}) => {
  return (
    <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-pink-950/40 border border-purple-500/30 flex items-center justify-between gap-4 text-xs select-none shadow-lg">
      <div className="flex items-center gap-2.5 min-w-0">
        <Sparkles size={18} className="text-purple-400 shrink-0 animate-pulse" />
        <span className="truncate">
          <strong className="text-purple-300">AI Tip:</strong> {tipText}
        </span>
      </div>
      <Link
        to={actionTo}
        className="font-bold text-purple-400 hover:text-purple-300 shrink-0 flex items-center gap-1 transition-colors"
      >
        <span>{actionLabel}</span>
        <ChevronRight size={14} />
      </Link>
    </div>
  )
})
export default AITipBanner
