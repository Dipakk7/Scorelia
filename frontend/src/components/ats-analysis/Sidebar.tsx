import React from 'react'
import {
  FileText,
  Clock,
  ChevronRight,
  ShieldCheck,
  Zap,
  BookOpen,
  HelpCircle,
  ExternalLink,
  Award,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'
import { mockSidebarData } from '@/lib/ats-mock-data'

interface SidebarProps {
  onStartAnalysis?: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ onStartAnalysis }) => {
  return (
    <aside aria-label="ATS Analysis Sidebar" className="space-y-5 flex flex-col justify-between h-full">
      {/* 1. Analysis Summary Card */}
      <div className="rounded-2xl bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-slate-800/90 p-5 shadow-lg space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 shadow-sm shrink-0 flex items-center justify-center">
              <Award className="w-4 h-4 text-purple-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-100 tracking-tight">Analysis Summary</h3>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30 shadow-sm shrink-0">
            Grade: {mockSidebarData.analysisSummary.overallGrade}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1 shadow-inner">
            <span className="text-slate-400 font-sans text-[11px]">Total Checks</span>
            <div className="text-base font-bold text-white">
              {mockSidebarData.analysisSummary.totalChecks}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1 shadow-inner">
            <span className="text-slate-400 font-sans text-[11px]">Passed Checks</span>
            <div className="text-base font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {mockSidebarData.analysisSummary.passedChecks}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1 shadow-inner">
            <span className="text-slate-400 font-sans text-[11px]">Warnings</span>
            <div className="text-base font-bold text-amber-400 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              {mockSidebarData.analysisSummary.warningChecks}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1 shadow-inner">
            <span className="text-slate-400 font-sans text-[11px]">Passed Rate</span>
            <div className="text-base font-bold text-purple-300">90%</div>
          </div>
        </div>
      </div>

      {/* 2. Resume Information Details Card */}
      <div className="rounded-2xl bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-slate-800/90 p-5 shadow-lg space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 shadow-sm shrink-0 flex items-center justify-center">
              <FileText className="w-4 h-4 text-purple-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-100 tracking-tight">Resume Details</h3>
          </div>
          <span className="text-[10px] font-mono text-slate-300 bg-slate-800/90 px-2 py-0.5 rounded border border-slate-700 shrink-0">
            v1.0
          </span>
        </div>

        <div className="space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 gap-2 shadow-inner">
            <span className="text-slate-400 font-sans shrink-0">File Name</span>
            <span className="text-slate-100 truncate text-right font-medium" title="Software_Engineer_Resume.pdf">
              Software_Engineer_Resume.pdf
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 shadow-inner">
            <span className="text-slate-400 font-sans">Last Analyzed</span>
            <span className="text-emerald-400 font-sans text-[11px] font-semibold">May 18, 2026</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 shadow-inner">
            <span className="text-slate-400 font-sans">Page Count</span>
            <span className="text-slate-200 font-sans">2 Pages</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 shadow-inner">
            <span className="text-slate-400 font-sans">File Size</span>
            <span className="text-slate-200 font-sans">185 KB</span>
          </div>
        </div>
      </div>

      {/* 3. Recent Reports Scans History Card */}
      <div className="rounded-2xl bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-slate-800/90 p-5 shadow-lg space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 shadow-sm shrink-0 flex items-center justify-center">
              <Clock className="w-4 h-4 text-purple-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-100 tracking-tight">Recent Reports</h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400 shrink-0">History</span>
        </div>

        <div className="space-y-2">
          {mockSidebarData.recentReports.map((rep) => (
            <div
              key={rep.id}
              className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-purple-500/30 transition-all duration-200 flex items-center justify-between cursor-pointer shadow-sm"
            >
              <div className="space-y-0.5">
                <div className="text-xs font-semibold text-slate-200">{rep.target}</div>
                <div className="text-[10px] text-slate-400 font-mono">{rep.date}</div>
              </div>
              <span className="text-xs font-bold font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {rep.score}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Quick Actions Card */}
      <div className="rounded-2xl bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-slate-800/90 p-5 shadow-lg space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 shadow-sm shrink-0 flex items-center justify-center">
              <Zap className="w-4 h-4 text-purple-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-100 tracking-tight">Quick Actions</h3>
          </div>
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={onStartAnalysis}
            className="flex items-center justify-between w-full p-2.5 rounded-xl bg-purple-600/15 hover:bg-purple-600/25 border border-purple-500/30 text-purple-200 text-xs font-medium transition-all group cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Re-analyze Resume</span>
            </div>
            <ChevronRight className="w-4 h-4 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* 5. Helpful Resources Card */}
      <div className="rounded-2xl bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-slate-800/90 p-5 shadow-lg space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 shadow-sm shrink-0 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-purple-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-100 tracking-tight">Helpful Resources</h3>
          </div>
          <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 shrink-0">
            Guide
          </span>
        </div>

        <div className="space-y-2 text-xs">
          {mockSidebarData.resources.map((res, idx) => {
            const descriptions = [
              'Essential rules for section structure & font parsing',
              'Power verbs to boost accomplishment metric impact',
              'Detailed breakdown of keyword extraction engines',
            ]
            const subtext = descriptions[idx] || 'Professional resume optimization guide'

            return (
              <a
                key={idx}
                href={res.link}
                onClick={(e) => e.preventDefault()}
                className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-purple-500/40 hover:bg-slate-900/90 transition-all duration-200 shadow-sm flex items-center justify-between gap-3 group cursor-pointer"
              >
                <div className="space-y-0.5 min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-200 group-hover:text-purple-300 transition-colors truncate">
                    {res.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-sans truncate">
                    {subtext}
                  </p>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 group-hover:text-purple-300 group-hover:border-purple-500/30 group-hover:bg-purple-500/10 transition-all shrink-0">
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
