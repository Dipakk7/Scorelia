import React from 'react'
import { Download, Sparkles, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface HeroActionsProps {
  onDownloadRoadmap?: () => void
  onRegenerateRoadmap?: () => void
  className?: string
}

export function HeroActions({
  onDownloadRoadmap,
  onRegenerateRoadmap,
  className,
}: HeroActionsProps) {
  return (
    <div className={cn('flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto', className)}>
      {/* Secondary Action: Download / Export Roadmap */}
      <button
        type="button"
        onClick={onDownloadRoadmap}
        aria-label="Download Roadmap Document"
        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] text-xs font-semibold text-purple-300 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-xl transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none cursor-pointer"
      >
        <Download className="w-4 h-4 text-purple-400 shrink-0" aria-hidden="true" />
        <span>Download Roadmap</span>
      </button>

      {/* Primary CTA: Re-generate Roadmap */}
      <button
        type="button"
        onClick={onRegenerateRoadmap}
        aria-label="Re-generate AI Career Roadmap"
        className="inline-flex items-center justify-center gap-2 px-4.5 py-2.5 min-h-[44px] text-xs font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-purple-600/25 border border-purple-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none cursor-pointer"
      >
        <Sparkles className="w-4 h-4 text-purple-200 shrink-0" aria-hidden="true" />
        <span>Re-generate Roadmap</span>
        <ChevronDown className="w-3.5 h-3.5 text-purple-200/80 ml-0.5 shrink-0" aria-hidden="true" />
      </button>
    </div>
  )
}
export default HeroActions
