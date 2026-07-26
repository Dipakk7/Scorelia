import React from 'react'
import { Download, Sparkles, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
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
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      {/* Download Roadmap Button (Placeholder) */}
      <Button
        variant="outline"
        onClick={onDownloadRoadmap}
        className="flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-xs font-semibold text-slate-200 border-white/15 bg-[#121320] hover:bg-white/10 hover:text-white rounded-xl transition-all cursor-pointer shadow-sm focus-visible:ring-2 focus-visible:ring-purple-500/50"
        aria-label="Download Roadmap"
      >
        <Download className="h-4 w-4 text-slate-300 shrink-0" aria-hidden="true" />
        <span>Download Roadmap</span>
      </Button>

      {/* Re-generate Roadmap Button (Placeholder) */}
      <Button
        onClick={onRegenerateRoadmap}
        className="flex items-center gap-2 px-5 py-2.5 min-h-[44px] text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-rose-500 hover:from-purple-500 hover:to-rose-400 shadow-lg shadow-purple-900/30 rounded-xl transition-all cursor-pointer border-none focus-visible:ring-2 focus-visible:ring-purple-500/50"
        aria-label="Re-generate Roadmap"
      >
        <Sparkles className="h-4 w-4 text-white shrink-0" aria-hidden="true" />
        <span>Re-generate Roadmap</span>
        <ChevronDown className="h-3.5 w-3.5 text-white/80 ml-1 shrink-0" aria-hidden="true" />
      </Button>
    </div>
  )
}
export default HeroActions
