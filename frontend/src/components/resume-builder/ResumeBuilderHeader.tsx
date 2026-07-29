import React from 'react'
import { Eye, Layout, Sparkles, ChevronDown, ChevronRight } from 'lucide-react'

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
    <div className="flex flex-col gap-2.5 text-left font-sans transition-all">
      {/* 1. Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
        <span className="hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer transition-colors">
          Resume Builder
        </span>
        <ChevronRight size={13} className="text-slate-400 dark:text-slate-500" />
        <span className="text-slate-900 dark:text-white font-semibold">{resumeName}</span>
      </div>

      {/* 2. Main Header Controls Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Title & Subtitle Section */}
        <div className="flex flex-col text-left">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight font-display m-0">
            Resume Builder
          </h1>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-1 font-sans">
            Create a professional resume that gets you noticed
          </p>
        </div>

        {/* 3. Progress Tracker Section */}
        <div className="flex items-center bg-white/95 dark:bg-[#121522] border border-slate-200/70 dark:border-white/[0.08] rounded-2xl p-3 px-4 shadow-sm min-w-[280px] lg:min-w-[340px] max-w-[400px]">
          <div className="flex flex-col gap-1.5 w-full text-left">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 dark:text-white tracking-tight font-display">
                {completionPercentage}% Complete
              </span>
            </div>

            {/* Smooth Animated Progress Bar */}
            <div className="w-full bg-slate-200 dark:bg-[#1f2238] h-2 rounded-full overflow-hidden p-0.5 border border-slate-300/40 dark:border-white/[0.08]">
              <div
                className="bg-gradient-to-r from-purple-600 via-indigo-500 to-pink-500 h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_12px_rgba(147,51,234,0.4)]"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-sans">
              <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[190px]">
                Step {activeStep} of {totalSteps} — {activeStepName}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 shrink-0 font-mono">
                Est. {estTimeRemaining}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 self-start lg:self-center">
          {/* Preview Button */}
          <button
            type="button"
            className="flex items-center gap-2 h-9 px-3.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white/95 dark:bg-[#1f2238] border border-slate-200/80 dark:border-white/[0.1] hover:bg-slate-100 dark:hover:bg-[#272a45] transition-all duration-150 ease-out active:scale-[0.98] cursor-pointer shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80"
          >
            <Eye size={14} className="text-slate-600 dark:text-slate-300" />
            <span>Preview</span>
          </button>

          {/* Templates Button */}
          <button
            type="button"
            className="flex items-center gap-2 h-9 px-3.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white/95 dark:bg-[#1f2238] border border-slate-200/80 dark:border-white/[0.1] hover:bg-slate-100 dark:hover:bg-[#272a45] transition-all duration-150 ease-out active:scale-[0.98] cursor-pointer shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80"
          >
            <Layout size={14} className="text-slate-600 dark:text-slate-300" />
            <span>Templates</span>
          </button>

          {/* AI Optimize Gradient Button */}
          <div className="flex items-center rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 p-[1px] shadow-md shadow-purple-950/30">
            <button
              type="button"
              className="flex items-center gap-2 h-9 px-3.5 rounded-xl text-xs font-bold text-white bg-transparent hover:opacity-90 transition-all duration-150 ease-out active:scale-[0.98] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80"
            >
              <Sparkles size={14} className="text-white" />
              <span>AI Optimize</span>
              <div className="w-px h-3.5 bg-white/30 ml-1 mr-0.5" />
              <ChevronDown size={13} className="text-white/90" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
