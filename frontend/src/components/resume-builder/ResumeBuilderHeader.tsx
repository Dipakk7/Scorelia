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
    <header className="w-full bg-transparent border-b border-slate-200/80 dark:border-border-subtle/50 pb-4 mb-1 transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Title & Breadcrumb Block */}
        <div className="flex flex-col text-left">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
            <span className="hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer transition-colors">Dashboard</span>
            <ChevronRight size={12} className="text-slate-400 dark:text-slate-600" />
            <span className="hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer transition-colors">Resumes</span>
            <ChevronRight size={12} className="text-slate-400 dark:text-slate-600" />
            <span className="text-purple-600 dark:text-purple-400 font-semibold font-mono">{resumeName}</span>
          </nav>

          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-display m-0 flex items-center gap-2">
            Resume Builder
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 m-0 font-sans">
            Craft an ATS-optimized, high-scoring professional resume
          </p>
        </div>

        {/* Middle/Right Cluster: Progress Tracker & Action Controls */}
        <div className="flex flex-wrap items-center gap-3 shrink-0 self-start lg:self-center">
          {/* Completion Progress Tracker Card */}
          <div className="flex items-center gap-3 bg-slate-100/70 dark:bg-surface-l2 border border-slate-200/80 dark:border-border-subtle rounded-xl px-3.5 py-2 shadow-none transition-colors">
            <div className="flex flex-col gap-1 min-w-[160px] text-left">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-900 dark:text-white font-mono">{completionPercentage}% Complete</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Step {activeStep} of {totalSteps}</span>
              </div>
              {/* Sleek Thin Progress Bar */}
              <div className="w-full bg-slate-200 dark:bg-surface-l4 h-1.5 rounded-full overflow-hidden border border-slate-300/30 dark:border-border-subtle/50">
                <div
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[110px]">{activeStepName}</span>
                <span className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 shrink-0 font-mono">
                  <Clock size={10} className="text-purple-600 dark:text-purple-400" /> Est. {estTimeRemaining}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-surface-l4 border border-slate-200 dark:border-border-subtle hover:bg-slate-200 dark:hover:bg-surface-l3 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80"
            >
              <Eye size={13} className="text-purple-600 dark:text-purple-400" />
              <span>Preview</span>
            </button>

            <button
              type="button"
              className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-surface-l4 border border-slate-200 dark:border-border-subtle hover:bg-slate-200 dark:hover:bg-surface-l3 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80"
            >
              <Layout size={13} className="text-purple-600 dark:text-purple-400" />
              <span>Templates</span>
            </button>

            <button
              type="button"
              className="flex items-center gap-1.5 h-8 px-3.5 rounded-lg text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 border border-purple-500/30 shadow-sm transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80"
            >
              <Sparkles size={13} className="animate-pulse" />
              <span>AI Optimize</span>
              <ChevronDown size={12} className="text-white/80" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
