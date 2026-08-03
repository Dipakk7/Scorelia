import React from 'react'
import { Eye, Layout, Sparkles, ChevronDown, Clock, FileText } from 'lucide-react'

interface ResumeBuilderHeaderProps {
  resumeName?: string
  activeStep?: number
  totalSteps?: number
  completionPercentage?: number
  activeStepName?: string
  estTimeRemaining?: string
}

export const ResumeBuilderHeader: React.FC<ResumeBuilderHeaderProps> = ({
  resumeName = 'Dipak_Khandagale_AI_Engineer_Resume.pdf',
  activeStep = 1,
  totalSteps = 8,
  completionPercentage = 82,
  activeStepName = 'Personal Information',
  estTimeRemaining = '4 min remaining',
}) => {
  const displayFilename =
    resumeName && !resumeName.endsWith('.pdf') && !resumeName.endsWith('.docx')
      ? `${resumeName.replace(/\s+/g, '_')}.pdf`
      : resumeName || 'Dipak_Khandagale_AI_Engineer_Resume.pdf'

  return (
    <header aria-label="Resume Builder Hero Section" className="w-full shrink-0 flex-none text-left font-sans">
      {/* Outer Hero Container matching Resume Intelligence Header exactly */}
      <div className="relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 md:p-6 rounded-2xl bg-[#121426] border border-white/10 bg-gradient-to-r from-[#14162a] via-[#111324] to-[#14162a] shadow-lg shadow-purple-950/10 transition-all duration-200">
        {/* Background Purple Radial Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Left Side: Title & Subtitle Filename */}
        <div className="relative z-10 flex flex-col text-left">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-white drop-shadow-xs m-0">
            Resume Builder
          </h1>
          <div className="flex items-center gap-2 mt-1.5 text-xs md:text-sm font-semibold text-slate-300">
            <FileText className="w-4 h-4 text-purple-400 shrink-0" />
            <span className="truncate max-w-sm md:max-w-md text-slate-300 font-mono font-medium">
              {displayFilename}
            </span>
          </div>
        </div>

        {/* Center: Embedded Completion Progress Widget */}
        <div className="relative z-10 flex items-center justify-center my-auto">
          <div className="flex items-center gap-3 bg-[#0e101c] border border-slate-700/80 rounded-xl px-4 py-2.5 shadow-sm transition-colors min-w-[220px] sm:min-w-[240px]">
            <div className="flex flex-col gap-1.5 w-full text-left">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-white font-mono">{completionPercentage}% Complete</span>
                <span className="text-[11px] text-slate-400 font-mono font-medium">Step {activeStep} of {totalSteps}</span>
              </div>
              {/* Sleek Thin Progress Bar */}
              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800/80">
                <div
                  className="bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-0.5">
                <span className="text-slate-200 font-semibold truncate max-w-[120px]">{activeStepName}</span>
                <span className="flex items-center gap-1 text-[10px] text-slate-400 shrink-0 font-mono font-medium">
                  <Clock size={11} className="text-purple-400" /> Est. {estTimeRemaining}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Action Controls (Matching Resume Intelligence Buttons) */}
        <div className="relative z-10 flex items-center gap-2.5 shrink-0 flex-wrap md:flex-nowrap">
          <button
            type="button"
            className="flex items-center gap-2 h-10 px-4 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-[#141628] hover:bg-[#1c1f36] border border-slate-700/80 shadow-xs transition-all cursor-pointer active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          >
            <Eye size={14} className="text-purple-400 shrink-0" />
            <span>Preview</span>
          </button>

          <button
            type="button"
            className="flex items-center gap-2 h-10 px-4 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-[#141628] hover:bg-[#1c1f36] border border-slate-700/80 shadow-xs transition-all cursor-pointer active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          >
            <Layout size={14} className="text-purple-400 shrink-0" />
            <span>Templates</span>
          </button>

          <button
            type="button"
            className="flex items-center gap-2 h-10 px-5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 border-0 shadow-md shadow-purple-950/40 transition-all cursor-pointer active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          >
            <Sparkles size={14} className="text-white shrink-0 filter drop-shadow-[0_0_4px_rgba(255,255,255,0.6)]" />
            <span>AI Optimize</span>
            <ChevronDown size={12} className="text-white/80 shrink-0" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default ResumeBuilderHeader

