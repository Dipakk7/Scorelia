import React, { useState } from 'react'
import { Sparkles, AlertCircle, CheckCircle2, Lightbulb, Target, ArrowRight, Check } from 'lucide-react'

export interface SmartSuggestionItem {
  id: string
  title: string
  whyItHelps: string
  atsBoost: string
  confidence: string
  impactBadge: string
  applied: boolean
}

export const SmartSuggestionsCard: React.FC = () => {
  const [suggestions, setSuggestions] = useState<SmartSuggestionItem[]>([
    {
      id: 'sug-1',
      title: 'Quantify Technical Accomplishments in Paragraph 2',
      whyItHelps: 'Adding specific metric percentages (e.g. "improved model throughput by 35%") gives recruiters verifiable evidence of your engineering impact.',
      atsBoost: '+8% ATS Score',
      confidence: '98% Confidence',
      impactBadge: 'High Impact',
      applied: false,
    },
    {
      id: 'sug-2',
      title: 'Align Opening Hook with Target Company Core Values',
      whyItHelps: 'Mentions Google\'s AI principles directly in paragraph 1, creating immediate cultural alignment for hiring managers.',
      atsBoost: '+5% ATS Score',
      confidence: '94% Confidence',
      impactBadge: 'High Impact',
      applied: true,
    },
    {
      id: 'sug-3',
      title: 'Inject Missing JD Skill Competency: "PyTorch Architecture"',
      whyItHelps: 'The job posting lists PyTorch 4 times. Including it explicitly in your technical summary ensures bot parser keyword matching.',
      atsBoost: '+6% ATS Score',
      confidence: '96% Confidence',
      impactBadge: 'Medium Impact',
      applied: false,
    },
  ])

  const handleToggleApply = (id: string) => {
    setSuggestions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, applied: !item.applied } : item))
    )
  }

  const handleApplyAll = () => {
    setSuggestions((prev) => prev.map((item) => ({ ...item, applied: true })))
  }

  const appliedCount = suggestions.filter((s) => s.applied).length
  const allApplied = suggestions.every((s) => s.applied)

  return (
    <div className="rounded-2xl bg-[#121426] border border-white/10 bg-gradient-to-br from-[#14162a] via-[#111324] to-[#14162a] p-4 sm:p-5 shadow-lg shadow-purple-950/10 space-y-4 text-left">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <h3 className="font-extrabold text-sm text-white tracking-tight m-0">
            Actionable Smart Suggestions
          </h3>
        </div>
        <span className="text-[11px] font-bold text-slate-400 bg-slate-900 px-2.5 py-0.5 rounded-full border border-slate-800">
          {appliedCount} / {suggestions.length} Applied
        </span>
      </div>

      {/* Suggestion List */}
      <div className="space-y-3">
        {suggestions.map((item, index) => (
          <div
            key={item.id}
            className={`p-3.5 rounded-xl border transition-all space-y-2.5 ${
              item.applied
                ? 'bg-emerald-500/10 border-emerald-500/20 opacity-90'
                : 'bg-slate-900/70 border-slate-800 hover:border-purple-500/40 hover:bg-slate-900'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold shrink-0 ${
                    item.applied ? 'bg-emerald-500 text-white' : 'bg-purple-500/20 text-purple-300'
                  }`}
                >
                  {item.applied ? '✓' : index + 1}
                </span>
                <span className="font-extrabold text-xs text-white truncate">{item.title}</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {item.atsBoost}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  {item.confidence}
                </span>
              </div>
            </div>

            {/* Why This Helps explanation box */}
            <div className="pl-7 text-[11px] space-y-1">
              <div className="flex items-start gap-1.5 text-slate-300 font-medium leading-relaxed bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-200">Why this helps: </span>
                  <span>{item.whyItHelps}</span>
                </div>
              </div>
            </div>

            {/* Action Trigger */}
            <div className="pl-7 pt-0.5 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleToggleApply(item.id)}
                className={`text-[11px] font-extrabold cursor-pointer border-none bg-transparent p-0 flex items-center gap-1.5 transition-colors ${
                  item.applied ? 'text-emerald-400' : 'text-purple-300 hover:text-white'
                }`}
              >
                {item.applied ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Applied to Letter Draft</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>Apply Suggestion to Draft</span>
                    <ArrowRight className="w-3 h-3 ml-0.5" />
                  </>
                )}
              </button>

              <span className="text-[10px] font-bold text-slate-500">{item.impactBadge}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Apply All CTA */}
      <button
        type="button"
        onClick={handleApplyAll}
        disabled={allApplied}
        className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md border border-purple-500/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
      >
        <span>{allApplied ? 'All Smart Suggestions Applied' : 'Apply All Smart Suggestions'}</span>
        <Sparkles className="w-3.5 h-3.5 text-purple-200" />
      </button>
    </div>
  )
}

export default SmartSuggestionsCard
