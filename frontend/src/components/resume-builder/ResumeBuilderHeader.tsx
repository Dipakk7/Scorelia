import React from 'react'
import { Eye, Layout, Sparkles, ChevronDown, Clock } from 'lucide-react'

interface ResumeBuilderHeaderProps {
  resumeName?: string
  activeStep?: number
  totalSteps?: number
  completionPercentage?: number
  activeStepName?: string
  estTimeRemaining?: string
}

export const ResumeBuilderHeader: React.FC<ResumeBuilderHeaderProps> = ({
  resumeName = 'My Resume',
  activeStep = 1,
  totalSteps = 8,
  completionPercentage = 82,
  activeStepName = 'Personal Information',
  estTimeRemaining = '4 min remaining',
}) => {
  return (
    <div className="w-full flex flex-wrap items-center justify-between gap-3 shrink-0 flex-none text-left font-sans">
      {/* Primary Page Title & Dynamic Resume Subtitle */}
      <div className="flex flex-col text-left">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight m-0">
          Resume Builder
        </h1>
        <h2 className="text-xs md:text-sm font-semibold text-slate-300 mt-1 leading-normal m-0 truncate max-w-md">
          {resumeName?.trim() || 'Untitled Resume'}
        </h2>
      </div>

      {/* Progress Tracker & Action Controls */}
      <div className="flex flex-wrap items-center gap-3 shrink-0 ml-auto">
        {/* Completion Progress Tracker Card */}
        <div className="flex items-center gap-3 bg-[#121424] border border-slate-800/90 rounded-xl px-3.5 py-2 shadow-xs transition-colors">
          <div className="flex flex-col gap-1 min-w-[160px] text-left">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-white font-mono">{completionPercentage}% Complete</span>
              <span className="text-[11px] text-slate-400 font-mono font-medium">Step {activeStep} of {totalSteps}</span>
            </div>
            {/* Sleek Thin Progress Bar */}
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800/80">
              <div
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-0.5">
              <span className="text-slate-300 font-semibold truncate max-w-[110px]">{activeStepName}</span>
              <span className="flex items-center gap-1 text-[10px] text-slate-400 shrink-0 font-mono font-medium">
                <Clock size={11} className="text-purple-400" /> Est. {estTimeRemaining}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-1.5 min-h-[38px] px-3.5 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-[#141628] hover:bg-[#1c1f36] border border-slate-700/80 shadow-xs transition-all cursor-pointer active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          >
            <Eye size={14} className="text-purple-400 shrink-0" />
            <span>Preview</span>
          </button>

          <button
            type="button"
            className="flex items-center gap-1.5 min-h-[38px] px-3.5 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-[#141628] hover:bg-[#1c1f36] border border-slate-700/80 shadow-xs transition-all cursor-pointer active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          >
            <Layout size={14} className="text-purple-400 shrink-0" />
            <span>Templates</span>
          </button>

          <button
            type="button"
            className="flex items-center gap-1.5 min-h-[38px] px-4 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 border-0 shadow-md shadow-purple-950/40 transition-all cursor-pointer active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          >
            <Sparkles size={14} className="text-white shrink-0 filter drop-shadow-[0_0_4px_rgba(255,255,255,0.6)]" />
            <span>AI Optimize</span>
            <ChevronDown size={12} className="text-white/80 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  )
}
