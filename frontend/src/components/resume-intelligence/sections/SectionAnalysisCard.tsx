import React, { useState } from 'react'
import { Card } from '@/components/ui/Card'
import {
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  UserCheck,
  History,
  Copy,
  Check,
  RefreshCw,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { SectionAnalysisData } from '@/lib/mock-section-analysis'

interface SectionAnalysisCardProps {
  section: SectionAnalysisData
  isDefaultExpanded?: boolean
  onToggleExpand?: (id: string) => void
}

export const SectionAnalysisCard: React.FC<SectionAnalysisCardProps> = ({
  section,
  isDefaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(isDefaultExpanded)
  const [activeSubTab, setActiveSubTab] = useState<'review' | 'rewrite' | 'ats' | 'timeline'>('review')
  const [copied, setCopied] = useState(false)
  const [accepted, setAccepted] = useState(false)

  const handleCopy = () => {
    const textToCopy = section?.rewritePreview?.aiImprovedVersion || section?.rewritePreview?.aiImprovedText || ''
    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    toast.success(`Copied AI rewrite for ${section.sectionName}`)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleAccept = () => {
    setAccepted(true)
    toast.success(`Accepted AI suggestion for ${section.sectionName}`)
    setTimeout(() => setAccepted(false), 2500)
  }

  return (
    <Card
      id={`section-${section.id}`}
      className={cn(
        'bg-[#0b0c14]/90 border-slate-800/80 rounded-2xl flex flex-col backdrop-blur-md shadow-lg transition-all duration-300 overflow-hidden',
        isExpanded ? 'p-5 md:p-6 border-purple-500/30' : 'p-4 hover:border-slate-700/80'
      )}
    >
      {/* 1. Header & Score Bar (Always Visible) */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between gap-3 cursor-pointer select-none"
      >
        <div className="flex items-center gap-3">
          {/* Score Badge Pill */}
          <div
            className={cn(
              'px-3 py-1.5 rounded-xl font-mono font-extrabold text-sm border flex items-center gap-1.5 shrink-0',
              section.score >= 90
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : section.score >= 80
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
            )}
          >
            <span>{section.score}</span>
            <span className="text-[10px] text-slate-400 font-normal">/100</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-100 tracking-tight">
                {section.sectionName}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                {section.status}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
              <span>{section.confidence}% AI Confidence</span>
              <span>•</span>
              <span className="text-emerald-400 font-mono font-semibold flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                {section.trend}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Collapsed view summary */}
          {!isExpanded && (
            <span className="text-xs text-slate-400 hidden sm:inline-block max-w-xs truncate">
              {section.strengths[0]}
            </span>
          )}

          <button
            aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900/60 transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5 text-purple-400" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 2. Expanded Detail View */}
      {isExpanded && (
        <div className="flex flex-col gap-5 mt-5 pt-4 border-t border-slate-800/60">
          {/* Sub-Navigation Tabs */}
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
            <div className="flex items-center gap-4 text-xs font-semibold">
              <button
                onClick={() => setActiveSubTab('review')}
                className={cn(
                  'pb-2 transition-colors cursor-pointer',
                  activeSubTab === 'review'
                    ? 'text-white font-bold border-b-2 border-purple-500'
                    : 'text-slate-400 hover:text-slate-200'
                )}
              >
                AI Review & Issues ({section.issuesFound.length})
              </button>
              <button
                onClick={() => setActiveSubTab('rewrite')}
                className={cn(
                  'pb-2 transition-colors cursor-pointer flex items-center gap-1',
                  activeSubTab === 'rewrite'
                    ? 'text-white font-bold border-b-2 border-purple-500'
                    : 'text-slate-400 hover:text-slate-200'
                )}
              >
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>AI Rewrite Diff</span>
              </button>
              <button
                onClick={() => setActiveSubTab('ats')}
                className={cn(
                  'pb-2 transition-colors cursor-pointer',
                  activeSubTab === 'ats'
                    ? 'text-white font-bold border-b-2 border-purple-500'
                    : 'text-slate-400 hover:text-slate-200'
                )}
              >
                ATS & Recruiter Skim
              </button>
              <button
                onClick={() => setActiveSubTab('timeline')}
                className={cn(
                  'pb-2 transition-colors cursor-pointer',
                  activeSubTab === 'timeline'
                    ? 'text-white font-bold border-b-2 border-purple-500'
                    : 'text-slate-400 hover:text-slate-200'
                )}
              >
                Improvement & History
              </button>
            </div>
          </div>

          {/* Sub-Tab 1: AI Review & Issues */}
          {activeSubTab === 'review' && (
            <div className="flex flex-col gap-4">
              {/* Strengths vs Weaknesses Split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <span className="text-xs font-bold text-emerald-400 block mb-2">Section Strengths</span>
                  <ul className="flex flex-col gap-1.5 text-xs text-slate-300">
                    {section.strengths.map((st, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{st}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <span className="text-xs font-bold text-amber-400 block mb-2">Areas for Improvement</span>
                  <ul className="flex flex-col gap-1.5 text-xs text-slate-300">
                    {section.weaknesses.map((wk, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{wk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommendations Cards */}
              {section.recommendations.map((rec) => (
                <div key={rec.id} className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-800/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-slate-100 block">{rec.recommendation}</span>
                      <span className="text-[11px] text-slate-400">Estimated implementation time: ~{rec.estimatedMinutes} mins</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      +{rec.expectedScoreIncrease} Score / +{rec.expectedAtsIncrease} ATS
                    </span>
                    <button
                      onClick={() => toast.success(`Applied fix for ${section.sectionName}`)}
                      className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Apply Fix
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sub-Tab 2: AI Rewrite Diff */}
          {activeSubTab === 'rewrite' && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-900 flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Section Draft</span>
                  <p className="text-xs text-slate-300 leading-relaxed line-through decoration-rose-500/50">
                    {section.rewritePreview.currentVersion}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/40 flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    AI Improved Version
                  </span>
                  <p className="text-xs text-white leading-relaxed font-medium">
                    {section.rewritePreview.aiImprovedText}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-1.5">
                  {section.rewritePreview.highlightedImprovements.map((hi, i) => (
                    <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-purple-300">
                      ✓ {hi}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={handleAccept}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold"
                  >
                    {accepted ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                    <span>{accepted ? 'Accepted' : 'Accept Rewrite'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 3: ATS & Recruiter Skim */}
          {activeSubTab === 'ats' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-2">
                <div className="flex items-center justify-between font-bold text-slate-100 border-b border-slate-800/60 pb-2">
                  <span className="flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-emerald-400" />
                    ATS Scanner Metrics
                  </span>
                  <span className="text-emerald-400 font-mono">{section.atsAnalysis.atsCompatibilityScore}% Compatible</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Keyword Density:</span>
                  <span className="font-semibold text-slate-200">{section.atsAnalysis.keywordDensity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Section Length:</span>
                  <span className="font-semibold text-emerald-400">{section.atsAnalysis.sectionLengthStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Formatting Score:</span>
                  <span className="font-semibold text-slate-200">{section.atsAnalysis.formattingScore}/100</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-2">
                <div className="flex items-center justify-between font-bold text-slate-100 border-b border-slate-800/60 pb-2">
                  <span className="flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-purple-400" />
                    Recruiter Skim Analysis
                  </span>
                  <span className="text-purple-300 font-mono">~{section.recruiterAnalysis.estimatedReadingTimeSeconds}s Skim Time</span>
                </div>
                <p className="text-slate-300 italic">{section.recruiterAnalysis.overallImpressionText}</p>
                <div className="flex justify-between text-slate-400 pt-1">
                  <span>Top Strength: <strong className="text-slate-200">{section.recruiterAnalysis.topStrength}</strong></span>
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 4: Improvement & History */}
          {activeSubTab === 'timeline' && (
            <div className="flex flex-col gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-2">
                <span className="font-bold text-slate-100 flex items-center gap-1.5">
                  <History className="w-4 h-4 text-purple-400" />
                  Section Version History
                </span>
                <div className="flex flex-col gap-2 mt-1">
                  {section.versionHistory.map((ver) => (
                    <div key={ver.versionNumber} className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-900">
                      <div>
                        <span className="font-bold text-slate-200">{ver.versionLabel} ({ver.dateText})</span>
                        <p className="text-[11px] text-slate-400">{ver.changeSummary}</p>
                      </div>
                      <span className="font-mono font-bold text-purple-300">{ver.scoreAtVersion} pts</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

export default SectionAnalysisCard
