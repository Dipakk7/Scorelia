import React from 'react'
import { Info, CheckCircle2, AlertCircle, ArrowRight, Target, FileCheck, BarChart2 } from 'lucide-react'

export const AtsInsightsPanel: React.FC = () => {
  return (
    <div className="space-y-4 text-left font-sans">
      {/* ATS Score Overview Card */}
      <div className="bg-[#121424]/95 border border-slate-800/90 rounded-2xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <div className="flex items-center gap-1.5">
            <Target size={14} className="text-purple-400" />
            <span className="text-xs font-extrabold text-white font-display">ATS Score Breakdown</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">Updated Just Now</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          {/* Circular Gauge */}
          <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-400"
                strokeDasharray="92, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-xl font-black text-white font-display leading-none">92</span>
              <span className="text-[9px] font-mono text-slate-400">/100</span>
            </div>
          </div>

          {/* Sub Metrics */}
          <div className="flex-1 space-y-1.5 text-xs">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-300 font-medium">Skills Coverage</span>
              <span className="font-extrabold text-white font-mono">94%</span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800/80">
              <div className="bg-emerald-400 h-full rounded-full w-[94%]" />
            </div>

            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-300 font-medium">Experience Strength</span>
              <span className="font-extrabold text-white font-mono">88%</span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800/80">
              <div className="bg-purple-500 h-full rounded-full w-[88%]" />
            </div>
          </div>
        </div>
      </div>

      {/* Missing Keywords Card */}
      <div className="bg-[#121424]/95 border border-slate-800/90 rounded-2xl p-4 space-y-2.5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-white font-display flex items-center gap-1.5">
            <AlertCircle size={14} className="text-amber-400" />
            <span>Missing Industry Keywords</span>
          </span>
          <span className="text-[10px] font-mono text-slate-400 font-medium">Target: AI/ML Engineer</span>
        </div>

        <p className="text-[11px] text-slate-300 m-0 leading-relaxed font-medium">
          Adding these missing keywords will improve your match rate for Senior AI Engineer positions:
        </p>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {['MLOps', 'Kubernetes', 'BERT', 'Model Optimization', 'CI/CD Pipelines'].map((kw) => (
            <span
              key={kw}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-950/40 text-amber-300 border border-amber-500/35 flex items-center gap-1 font-mono"
            >
              <span>+ {kw}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Formatting & Readability Checks */}
      <div className="bg-[#121424]/95 border border-slate-800/90 rounded-2xl p-4 space-y-2.5 shadow-sm">
        <span className="text-xs font-extrabold text-white font-display flex items-center gap-1.5">
          <FileCheck size={14} className="text-purple-400" />
          <span>ATS Formatting Checks</span>
        </span>

        <div className="space-y-2 text-xs">
          {[
            { label: 'Clean A4 Proportions & Margins', status: 'Passed', pass: true },
            { label: 'No Complex Tables or Graphics', status: 'Passed', pass: true },
            { label: 'Standard Section Heading Syntax', status: 'Passed', pass: true },
            { label: 'Quantified Bullet Metrics Ratio', status: '80% (3 of 4 bullets)', pass: true },
          ].map((check, idx) => (
            <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-[#0e101c] border border-slate-800/90">
              <span className="text-slate-200 text-[11px] font-semibold">{check.label}</span>
              <div className="flex items-center gap-1 text-[10px] font-bold font-mono text-emerald-400">
                <CheckCircle2 size={12} />
                <span>{check.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
