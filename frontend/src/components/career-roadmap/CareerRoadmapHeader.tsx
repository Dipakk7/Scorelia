import React from 'react'
import { Sparkles, Download, ChevronDown, CheckCircle2, RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Breadcrumb } from './Breadcrumb'

export interface CareerRoadmapHeaderProps {
  onDownloadRoadmap?: () => void
  onRegenerateRoadmap?: () => void
}

export function CareerRoadmapHeader({
  onDownloadRoadmap,
  onRegenerateRoadmap,
}: CareerRoadmapHeaderProps) {
  return (
    <header className="space-y-4 text-left">
      {/* Top Bar: Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <Breadcrumb />
      </div>

      {/* Main Title Banner & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
        {/* Title & Subtitle */}
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2 m-0">
              <span>Your Career Roadmap</span>
              <Sparkles className="h-6 w-6 text-purple-400 fill-purple-400/20 shrink-0 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-medium m-0">
            Personalized path to achieve your dream role with step-by-step guidance.
          </p>
        </div>

        {/* Status Badge & UI Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Last Updated Status Indicator */}
          <div
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400"
            aria-label="Last updated indicator"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Last updated: 2 days ago</span>
          </div>

          {/* Download Roadmap Button (Placeholder) */}
          <Button
            variant="outline"
            onClick={onDownloadRoadmap}
            className="flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-xs font-semibold text-slate-200 border-white/15 bg-[#121320] hover:bg-white/10 hover:text-white rounded-xl transition-all cursor-pointer shadow-sm focus-visible:ring-2 focus-visible:ring-purple-500/50"
            aria-label="Download Roadmap"
          >
            <Download className="h-4 w-4 text-slate-300 shrink-0" />
            <span>Download Roadmap</span>
          </Button>

          {/* Re-generate Roadmap Button (Placeholder) */}
          <Button
            onClick={onRegenerateRoadmap}
            className="flex items-center gap-2 px-5 py-2.5 min-h-[44px] text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-rose-500 hover:from-purple-500 hover:to-rose-400 shadow-lg shadow-purple-900/30 rounded-xl transition-all cursor-pointer border-none focus-visible:ring-2 focus-visible:ring-purple-500/50"
            aria-label="Re-generate Roadmap"
          >
            <Sparkles className="h-4 w-4 text-white shrink-0" />
            <span>Re-generate Roadmap</span>
            <ChevronDown className="h-3.5 w-3.5 text-white/80 ml-1 shrink-0" />
          </Button>
        </div>
      </div>
    </header>
  )
}
export default CareerRoadmapHeader
