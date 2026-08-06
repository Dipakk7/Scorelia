import React from 'react'
import { Sparkles, Download, Video, ChevronDown, CheckCircle2 } from 'lucide-react'

export interface InterviewPrepHeaderProps {
  onDownloadReport?: () => void
  onStartMockInterview?: () => void
}

export function InterviewPrepHeader({
  onDownloadReport,
  onStartMockInterview,
}: InterviewPrepHeaderProps) {
  return (
    <header className="flex flex-col gap-4 text-left">
      {/* Top Hero Card (Matches ATS Analysis Hero Card Architecture) */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 md:p-6 rounded-2xl bg-[#121426] border border-white/10 bg-gradient-to-r from-[#14162a] via-[#111324] to-[#14162a] shadow-lg shadow-purple-950/10 transition-all duration-200">
        {/* Left Side: Title, Status Badge, & Subtitle */}
        <div className="space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white drop-shadow-xs flex items-center gap-2">
              Interview Prep
              <Sparkles className="w-6 h-6 text-purple-400 fill-purple-400/20 shrink-0" />
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              Last practiced: 2 days ago
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Prepare smarter, practice better, and ace your next interview.
          </p>
        </div>

        {/* Right Side: Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 w-full md:w-auto">
          {/* Download Report Button */}
          <button
            type="button"
            onClick={onDownloadReport}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] text-xs font-semibold text-purple-300 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-xl transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none cursor-pointer"
          >
            <Download className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Download Report</span>
          </button>

          {/* Primary CTA: Start Mock Interview */}
          <button
            type="button"
            onClick={onStartMockInterview}
            className="inline-flex items-center justify-center gap-2 px-4.5 py-2.5 min-h-[44px] text-xs font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-purple-600/25 border border-purple-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none cursor-pointer"
          >
            <Video className="w-4 h-4 text-purple-200 shrink-0" />
            <span>Start Mock Interview</span>
            <ChevronDown className="w-4 h-4 ml-0.5 text-white/80 shrink-0" />
          </button>
        </div>
      </div>
    </header>
  )
}
export default InterviewPrepHeader
