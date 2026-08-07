import React, { useState } from 'react'
import { Stethoscope, CheckCircle2, AlertTriangle, RefreshCw, Sparkles } from 'lucide-react'
import type { DiagnosticsReport } from '@/data/ragAnalyticsMockData'
import { MOCK_DIAGNOSTICS_REPORT } from '@/data/ragAnalyticsMockData'
import { cn } from '@/lib/utils'

export interface DiagnosticsPanelProps {
  report?: DiagnosticsReport
  className?: string
}

export function DiagnosticsPanel({
  report = MOCK_DIAGNOSTICS_REPORT,
  className
}: DiagnosticsPanelProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [currentScore, setCurrentScore] = useState(report.overallScore)

  const handleRunDiagnostics = () => {
    setIsRunning(true)
    setTimeout(() => {
      setIsRunning(false)
      setCurrentScore(99)
    }, 1500)
  }

  return (
    <div className={cn('p-5 rounded-2xl bg-gradient-to-b from-[#14162a] via-[#111324] to-[#0d0f1e] border border-white/10 shadow-2xl text-left space-y-4 backdrop-blur-md', className)}>
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <Stethoscope size={18} className="text-purple-400 shrink-0" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Index & Integrity Diagnostics
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          Last Scan: {report.lastRun}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
        {/* Score Ring */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">Overall Health</span>
          <span className="text-2xl font-black text-emerald-400 font-mono mt-0.5">{currentScore}/100</span>
        </div>

        {/* Index Consistency */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">Index Consistency</span>
          <span className="text-base font-bold text-white font-mono">{report.indexConsistencyPercent}%</span>
          <span className="text-[10px] text-emerald-400 block font-semibold">100% Synced</span>
        </div>

        {/* Missing Embeddings */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">Missing Vectors</span>
          <span className="text-base font-bold text-white font-mono">{report.missingEmbeddingsCount}</span>
          <span className="text-[10px] text-emerald-400 block font-semibold">0 Missing</span>
        </div>

        {/* Duplicate Chunks */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">Duplicates</span>
          <span className="text-base font-bold text-amber-400 font-mono">{report.duplicateChunksCount}</span>
          <span className="text-[10px] text-amber-400 block font-semibold">Minor Overlap</span>
        </div>

        {/* Broken References */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">Broken Refs</span>
          <span className="text-base font-bold text-white font-mono">{report.brokenReferencesCount}</span>
          <span className="text-[10px] text-emerald-400 block font-semibold">Healthy</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <p className="text-xs text-slate-400">
          Run automated structural checks on vector embeddings, collection schemas, and chunk relations.
        </p>
        <button
          type="button"
          onClick={handleRunDiagnostics}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-900/40 cursor-pointer disabled:opacity-50 min-h-[44px]"
        >
          <RefreshCw size={14} className={cn(isRunning && 'animate-spin')} />
          <span>{isRunning ? 'Running Full Scan...' : 'Run Diagnostics'}</span>
        </button>
      </div>
    </div>
  )
}

export default DiagnosticsPanel
