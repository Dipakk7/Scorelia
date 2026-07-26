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
    <aside aria-label="ATS Analysis Sidebar" className="space-y-5">
      {/* 1. Analysis Summary Card */}
      <div className="rounded-2xl bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-slate-800/90 p-5 shadow-lg space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-slate-100">Analysis Summary</h3>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Grade: {mockSidebarData.analysisSummary.overallGrade}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60 space-y-0.5">
            <span className="text-slate-500 font-sans text-[11px]">Total Checks</span>
            <div className="text-sm font-bold text-white">
              {mockSidebarData.analysisSummary.totalChecks}
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60 space-y-0.5">
            <span className="text-slate-500 font-sans text-[11px]">Passed Checks</span>
            <div className="text-sm font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {mockSidebarData.analysisSummary.passedChecks}
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60 space-y-0.5">
            <span className="text-slate-500 font-sans text-[11px]">Warnings</span>
            <div className="text-sm font-bold text-amber-400 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              {mockSidebarData.analysisSummary.warningChecks}
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60 space-y-0.5">
            <span className="text-slate-500 font-sans text-[11px]">Passed Rate</span>
            <div className="text-sm font-bold text-purple-300">90%</div>
          </div>
        </div>
      </div>

      {/* 2. Resume Information Details Card */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800/90 p-5 shadow-lg space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-400" />
            Resume Details
          </h3>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
            v1.0
          </span>
        </div>

        <div className="space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/60">
            <span className="text-slate-400 font-sans">File Name</span>
            <span className="text-slate-200 truncate max-w-[140px]" title="Software_Engineer_Resume.pdf">
              Software_Engineer_Resume.pdf
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/60">
            <span className="text-slate-400 font-sans">Last Analyzed</span>
            <span className="text-emerald-400 font-sans text-[11px] font-semibold">May 18, 2026</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/60">
            <span className="text-slate-400 font-sans">Page Count</span>
            <span className="text-slate-300 font-sans">2 Pages</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/60">
            <span className="text-slate-400 font-sans">File Size</span>
            <span className="text-slate-300 font-sans">185 KB</span>
          </div>
        </div>
      </div>

      {/* 3. Recent Reports Scans History Card */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800/90 p-5 shadow-lg space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-400" />
            Recent Reports
          </h3>
          <span className="text-[10px] font-mono text-slate-400">History</span>
        </div>

        <div className="space-y-2">
          {mockSidebarData.recentReports.map((rep) => (
            <div
              key={rep.id}
              className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/60 hover:border-purple-500/30 transition-colors flex items-center justify-between cursor-pointer"
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
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800/90 p-5 shadow-lg space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple-400" />
            Quick Actions
          </h3>
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={onStartAnalysis}
            className="flex items-center justify-between w-full p-2.5 rounded-xl bg-purple-600/15 hover:bg-purple-600/25 border border-purple-500/30 text-purple-200 text-xs font-medium transition-all group cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none"
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
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800/90 p-5 shadow-lg space-y-3">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-purple-400" />
          Helpful Resources
        </h3>

        <div className="space-y-1.5 text-xs">
          {mockSidebarData.resources.map((res, idx) => (
            <a
              key={idx}
              href={res.link}
              onClick={(e) => e.preventDefault()}
              className="flex items-center justify-between p-2 rounded-lg text-slate-300 hover:text-purple-300 hover:bg-purple-500/10 transition-colors"
            >
              <span className="truncate max-w-[200px]">{res.title}</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            </a>
          ))}
        </div>
      </div>
    </aside>
  )
}
