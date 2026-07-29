import React from 'react'
import { Eye, Layout, Sparkles, ChevronDown, ChevronRight, Clock } from 'lucide-react'

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
    <div className="flex flex-col gap-4 bg-white/90 dark:bg-[#0b0c14]/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 p-4 lg:p-5 rounded-2xl shadow-xl transition-colors">
      {/* Top Breadcrumb & Main Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Title & Breadcrumb */}
        <div className="flex flex-col text-left">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
            <span className="hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer transition-colors">Resume Builder</span>
            <ChevronRight size={13} className="text-slate-400 dark:text-slate-500" />
            <span className="text-purple-600 dark:text-purple-400 font-bold">{resumeName}</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight font-display m-0 flex items-center gap-2.5">
            Resume Builder
          </h1>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-1 font-sans">
            Create a professional resume that gets you noticed
          </p>
        </div>

        {/* Completion Progress Tracker Pill */}
        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-2xl p-3 px-4 shadow-sm">
          <div className="flex flex-col gap-1 min-w-[170px] text-left">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 dark:text-white tracking-tight">{completionPercentage}% Complete</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Step {activeStep} of {totalSteps}</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden p-0.5 border border-slate-300/40 dark:border-white/5">
              <div
                className="bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[120px]">{activeStepName}</span>
              <span className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 shrink-0">
                <Clock size={11} className="text-purple-600 dark:text-purple-400" /> Est. {estTimeRemaining}
              </span>
            </div>
          </div>
        </div>

        {/* Right Header Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 self-start lg:self-center">
          <button
            type="button"
            className="flex items-center gap-2 h-9 px-3.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all duration-150 ease-out cursor-pointer shadow-sm active:scale-[0.98] transform-gpu motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80"
          >
            <Eye size={14} className="text-purple-600 dark:text-purple-400" />
            <span>Preview</span>
          </button>

          <button
            type="button"
            className="flex items-center gap-2 h-9 px-3.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all duration-150 ease-out cursor-pointer shadow-sm active:scale-[0.98] transform-gpu motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80"
          >
            <Layout size={14} className="text-purple-600 dark:text-purple-400" />
            <span>Templates</span>
          </button>

          <button
            type="button"
            className="flex items-center gap-2 h-9 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-md shadow-purple-950/30 border border-purple-400/30 transition-all duration-150 ease-out cursor-pointer active:scale-[0.98] transform-gpu motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80"
          >
            <Sparkles size={14} className="animate-pulse" />
            <span>AI Optimize</span>
            <ChevronDown size={13} className="text-white/80" />
          </button>
        </div>
      </div>
    </div>
  )
}
