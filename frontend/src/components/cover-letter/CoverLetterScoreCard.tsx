import React, { useState } from 'react'
import {
  Award,
  CheckCircle2,
  AlertCircle,
  Download,
  Copy,
  Printer,
  Share2,
  FileText,
  Sparkles,
  Check,
  ShieldCheck,
  Building,
  Briefcase,
  SpellCheck,
  Target,
} from 'lucide-react'
import { mockScoreBreakdown } from '@/lib/cover-letter-mock-data'

export interface CoverLetterScoreCardProps {
  onExportClick?: () => void
  onCopyClick?: () => void
}

export const CoverLetterScoreCardComponent: React.FC<CoverLetterScoreCardProps> = ({
  onExportClick,
  onCopyClick,
}) => {
  const {
    overallScore,
    readability,
    professionalTone,
    atsCompatibility,
    grammar,
    structure,
    keywordsMatch,
    benchmarkText,
  } = mockScoreBreakdown

  const [copiedStatus, setCopiedStatus] = useState(false)
  const [checklist, setChecklist] = useState([
    { id: 'c1', label: 'Target Company Name Verified ("Google")', checked: true },
    { id: 'c2', label: 'Target Position Title Verified ("Senior AI Engineer")', checked: true },
    { id: 'c3', label: 'Grammar & Syntax 100% Passed', checked: true },
    { id: 'c4', label: 'ATS Skill Keyword Match Optimal (12 Extracted Skills)', checked: true },
    { id: 'c5', label: 'Executive Tone Harmony Confirmed', checked: true },
    { id: 'c6', label: 'Document Layout & Typography Validated', checked: true },
  ])

  const handleToggleCheck = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    )
  }

  const handleCopy = () => {
    onCopyClick?.()
    setCopiedStatus(true)
    setTimeout(() => setCopiedStatus(false), 2000)
  }

  const metrics = [
    { label: 'ATS Compatibility', score: atsCompatibility, color: 'bg-emerald-500' },
    { label: 'Professional Tone', score: professionalTone, color: 'bg-purple-500' },
    { label: 'Readability', score: readability, color: 'bg-blue-500' },
    { label: 'Grammar & Mechanics', score: grammar, color: 'bg-teal-500' },
    { label: 'Structure & Flow', score: structure, color: 'bg-indigo-500' },
    { label: 'Keyword Matching', score: keywordsMatch, color: 'bg-amber-500' },
  ]

  const verifiedCount = checklist.filter((c) => c.checked).length

  return (
    <div className="rounded-2xl bg-[#121426] border border-white/10 bg-gradient-to-r from-[#14162a] via-[#111324] to-[#14162a] p-4 sm:p-5 md:p-6 shadow-lg shadow-purple-950/10 space-y-4 sm:space-y-5 text-left transition-all">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-800/80">
        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap min-w-0">
            <Award className="w-5 h-5 text-purple-400 shrink-0" />
            <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight truncate m-0">
              Executive Final Review Center
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap inline-flex items-center gap-1 shrink-0">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Ready to Apply</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium m-0 truncate">
            Comprehensive quality score breakdown, pre-export verification checklist, and export triggers.
          </p>
        </div>

        <button
          type="button"
          onClick={onExportClick}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md border border-purple-500/30 transition-all cursor-pointer whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-purple-200" />
          <span>Export Document</span>
        </button>
      </div>

      {/* 1. HERO READINESS GAUGE */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl border border-slate-800 bg-slate-900/80 w-full min-w-0">
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 text-white font-black text-lg shadow-lg shrink-0">
            <span>{overallScore}</span>
            <span className="absolute -bottom-1 text-[9px] font-extrabold bg-slate-950 px-1.5 py-0.2 rounded-full border border-slate-700">
              /100
            </span>
          </div>

          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <span className="font-extrabold text-sm text-white truncate">
                Executive Application Ready
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap shrink-0">
                100% Validated
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium m-0 truncate">
              {benchmarkText}
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold whitespace-nowrap shrink-0 self-start sm:self-auto">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Verified for Submission</span>
        </div>
      </div>

      {/* 2. SUB-METRICS PROGRESS GAUGES GRID */}
      <div className="space-y-2 pt-1">
        <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
          Quality & Readiness Metrics
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {metrics.map((m) => (
            <div key={m.label} className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">{m.label}</span>
                <span className="text-white">{m.score}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full ${m.color}`}
                  style={{ width: `${m.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. INTERACTIVE PRE-EXPORT CHECKLIST */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>Pre-Export Verification Checklist</span>
          </span>
          <span className="text-[11px] font-bold text-slate-400 bg-slate-900 px-2.5 py-0.5 rounded-md border border-slate-800">
            {verifiedCount} / {checklist.length} Passed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {checklist.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleToggleCheck(item.id)}
              className={`flex items-center gap-2.5 p-3 rounded-xl border transition-colors cursor-pointer text-left ${
                item.checked
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-slate-200'
                  : 'bg-slate-900/50 border-slate-800 text-slate-400'
              }`}
            >
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-md text-xs font-bold shrink-0 transition-colors ${
                  item.checked ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'
                }`}
              >
                {item.checked ? '✓' : ''}
              </div>
              <span className="text-xs font-semibold leading-tight">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. UNIFIED EXPORT COMMAND PANEL */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/90 space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Download className="w-4 h-4 text-purple-400" />
            <span>Export & Distribution Options</span>
          </span>
          <span className="text-[10px] font-bold text-emerald-400">High-Resolution Formats</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <button
            type="button"
            onClick={onExportClick}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 text-purple-200 font-extrabold border border-purple-500/30 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-purple-300" />
            <span>PDF Document</span>
          </button>

          <button
            type="button"
            onClick={onExportClick}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold border border-slate-700 transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4 text-indigo-400" />
            <span>Word (.docx)</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold border border-slate-700 transition-colors cursor-pointer"
          >
            {copiedStatus ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-emerald-400" />}
            <span>{copiedStatus ? 'Copied!' : 'Copy Text'}</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold border border-slate-700 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Print Document</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export const CoverLetterScoreCard = React.memo(CoverLetterScoreCardComponent)
export default CoverLetterScoreCard
