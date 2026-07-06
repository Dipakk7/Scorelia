import { useState } from 'react'
import {
  Tag,
  BookOpen,
  Award,
  BarChart4,
  Search,
  CheckCircle,
  AlertCircle,
  Plus,
  Clock,
  ExternalLink,
  ChevronRight,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import type { ResumeOptimizationResponse } from '@/types/resume-intelligence'

interface OptimizationCardProps {
  optimization: ResumeOptimizationResponse
}

export function OptimizationCard({ optimization }: OptimizationCardProps) {
  const [optTab, setOptTab] = useState<'keywords' | 'bullets' | 'skills' | 'readiness'>('keywords')

  const tabItems = [
    { id: 'keywords', label: 'ATS & Keywords', icon: Tag },
    { id: 'bullets', label: 'Bullet Point Improvements', icon: Award },
    { id: 'skills', label: 'Skills & Resources', icon: BookOpen },
    { id: 'readiness', label: 'Readiness & Industry', icon: BarChart4 },
  ] as const

  const getPriorityColor = (priority: string) => {
    switch (priority?.toUpperCase()) {
      case 'HIGH':
        return 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20'
      case 'MEDIUM':
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-655 dark:text-slate-400 border-slate-300/30'
    }
  }

  const getDifficultyColor = (diff: string) => {
    switch (diff?.toUpperCase()) {
      case 'HARD':
        return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20'
      case 'MEDIUM':
        return 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20'
      default:
        return 'bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/20'
    }
  }

  return (
    <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-bg shadow-md text-left font-sans">
      {/* Sub tabs */}
      <div className="flex border-b border-slate-100 dark:border-slate-850 overflow-x-auto scrollbar-none bg-slate-50/50 dark:bg-slate-900/30">
        {tabItems.map((item) => {
          const Icon = item.icon
          const isActive = optTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => setOptTab(item.id)}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                isActive
                  ? 'border-brand-500 text-brand-600 dark:text-brand-450 bg-white dark:bg-dark-bg'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50/40 dark:hover:bg-slate-900/40'
              }`}
            >
              <Icon size={14} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>

      <CardContent className="p-6">
        {/* ATS & Keywords */}
        {optTab === 'keywords' && (
          <div className="space-y-6">
            {/* ATS Overview */}
            {optimization.ats_optimization && (
              <div className="p-4 bg-slate-50 dark:bg-slate-900/20 border border-slate-150/40 dark:border-slate-800/80 rounded-xl grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div className="md:col-span-3 space-y-1">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-205 flex items-center gap-1.5">
                    <Search size={14} className="text-brand-500" />
                    <span>ATS Matching Diagnostic</span>
                  </h4>
                  <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed pr-2">
                    {optimization.ats_optimization.why_score_is_low ||
                      'Analyze keywords matching profile vs target jobs.'}
                  </p>
                </div>
                <div className="bg-brand-500/5 border border-brand-500/20 rounded-xl p-3.5 text-center flex flex-col justify-center h-full">
                  <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">
                    Expected Increase
                  </span>
                  <span className="text-xl font-extrabold text-brand-600 dark:text-brand-400 mt-0.5">
                    +{optimization.ats_optimization.expected_improvement || 0} pts
                  </span>
                  <span className="text-[9px] text-slate-500 leading-tight mt-1">
                    With recommended fixes
                  </span>
                </div>
              </div>
            )}

            {/* Keyword Density Pools */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Matched Keywords */}
              <div className="space-y-3 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 uppercase tracking-wide">
                  <CheckCircle size={13} />
                  <span>Matched Keywords ({optimization.keyword_optimization?.matched_keywords?.length || 0})</span>
                </h4>
                <div className="flex flex-wrap gap-1.5 max-h-[160px] overflow-y-auto pr-1">
                  {optimization.keyword_optimization?.matched_keywords?.map((kw) => (
                    <span
                      key={kw}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/15"
                    >
                      {kw}
                    </span>
                  ))}
                  {(!optimization.keyword_optimization?.matched_keywords ||
                    optimization.keyword_optimization.matched_keywords.length === 0) && (
                    <span className="text-xs text-slate-450 italic">None matched.</span>
                  )}
                </div>
              </div>

              {/* Missing Keywords */}
              <div className="space-y-3 p-4 bg-rose-500/5 border border-rose-500/10 rounded-xl">
                <h4 className="text-xs font-bold text-rose-700 dark:text-rose-455 flex items-center gap-1.5 uppercase tracking-wide">
                  <AlertCircle size={13} />
                  <span>Missing Keywords ({optimization.keyword_optimization?.missing_keywords?.length || 0})</span>
                </h4>
                <div className="flex flex-wrap gap-1.5 max-h-[160px] overflow-y-auto pr-1">
                  {optimization.keyword_optimization?.missing_keywords?.map((kw) => (
                    <span
                      key={kw}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/15"
                    >
                      {kw}
                    </span>
                  ))}
                  {(!optimization.keyword_optimization?.missing_keywords ||
                    optimization.keyword_optimization.missing_keywords.length === 0) && (
                    <span className="text-xs text-slate-450 italic">No missing keywords!</span>
                  )}
                </div>
              </div>

              {/* Strong Action Verbs */}
              <div className="space-y-3 p-4 bg-brand-500/5 border border-brand-500/10 rounded-xl">
                <h4 className="text-xs font-bold text-brand-700 dark:text-brand-400 flex items-center gap-1.5 uppercase tracking-wide">
                  <Plus size={13} />
                  <span>Action Verbs ({optimization.keyword_optimization?.strong_action_verbs?.length || 0})</span>
                </h4>
                <div className="flex flex-wrap gap-1.5 max-h-[160px] overflow-y-auto pr-1">
                  {optimization.keyword_optimization?.strong_action_verbs?.map((verb) => (
                    <span
                      key={verb}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-700 dark:text-brand-400 border border-brand-500/15"
                    >
                      {verb}
                    </span>
                  ))}
                  {(!optimization.keyword_optimization?.strong_action_verbs ||
                    optimization.keyword_optimization.strong_action_verbs.length === 0) && (
                    <span className="text-xs text-slate-455 italic">None found.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bullet Points */}
        {optTab === 'bullets' && (
          <div className="space-y-4">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Achievement & Bullet Point Enhancements
            </span>
            <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
              {optimization.achievement_optimization && optimization.achievement_optimization.length > 0 ? (
                optimization.achievement_optimization.map((bullet, idx) => (
                  <div
                    key={idx}
                    className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/30 dark:bg-slate-900/10 space-y-3.5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Original */}
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                          Original Bullet
                        </span>
                        <p className="text-xs text-slate-550 dark:text-slate-400 line-through bg-rose-500/5 p-3 rounded-lg border border-rose-500/10 leading-relaxed font-mono">
                          {bullet.original_bullet}
                        </p>
                      </div>

                      {/* Suggested */}
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-brand-500 uppercase tracking-wider">
                          AI Suggested Optimization
                        </span>
                        <p className="text-xs text-slate-800 dark:text-slate-200 bg-emerald-500/5 p-3 rounded-lg border border-emerald-500/15 leading-relaxed font-medium">
                          {bullet.suggested_bullet}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-dashed border-slate-200 dark:border-slate-800">
                      <div className="flex flex-wrap gap-2 text-[10px]">
                        <span
                          className={`px-2 py-0.5 rounded-md border font-bold ${
                            bullet.missing_metrics
                              ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20'
                              : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                          }`}
                        >
                          {bullet.missing_metrics ? '✗ Missing Metrics' : '✓ Has Metrics'}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md border font-bold ${
                            bullet.missing_impact
                              ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20'
                              : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                          }`}
                        >
                          {bullet.missing_impact ? '✗ Missing Impact' : '✓ Has Impact'}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md border font-bold ${
                            bullet.missing_business_value
                              ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20'
                              : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                          }`}
                        >
                          {bullet.missing_business_value ? '✗ Missing Business Value' : '✓ Has Value'}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        <span className="font-bold text-brand-655 dark:text-brand-400">Reason:</span> {bullet.reason}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400 italic text-xs">
                  No achievement bullet suggestions available.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Skills & Resources */}
        {optTab === 'skills' && (
          <div className="space-y-4">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Skill Deficiencies & Educational Material
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[480px] overflow-y-auto pr-1">
              {optimization.missing_skills && optimization.missing_skills.length > 0 ? (
                optimization.missing_skills.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 border border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/20 rounded-xl space-y-3 text-xs"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-slate-805 dark:text-slate-200 text-sm">
                        {item.skill}
                      </h4>
                      <div className="flex gap-1.5">
                        <span className={`px-2 py-0.5 rounded-md border text-[9px] font-bold ${getPriorityColor(item.priority)}`}>
                          Priority: {item.priority}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md border text-[9px] font-bold ${getDifficultyColor(item.difficulty)}`}>
                          {item.difficulty}
                        </span>
                      </div>
                    </div>

                    <p className="text-slate-550 dark:text-slate-400 leading-relaxed">
                      {item.why_it_matters}
                    </p>

                    <div className="pt-2.5 border-t border-slate-150/40 dark:border-slate-800 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-slate-500 font-semibold text-[9px] uppercase tracking-wider">
                        <Clock size={11} />
                        <span>Est. time to learn: {item.estimated_time || 'N/A'}</span>
                      </div>
                      {item.resources && item.resources.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold uppercase text-slate-400">
                            Recommended Courses:
                          </span>
                          <div className="flex flex-col gap-1">
                            {item.resources.map((res, ridx) => (
                              <a
                                key={ridx}
                                href={`https://www.google.com/search?q=${encodeURIComponent(res)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 font-medium cursor-pointer"
                              >
                                <span>{res}</span>
                                <ExternalLink size={9} />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-8 text-slate-400 italic text-xs">
                  No missing skills or study paths recommended.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Readiness */}
        {optTab === 'readiness' && (
          <div className="space-y-6">
            {/* Career Readiness meters */}
            {optimization.career_readiness && (
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">
                  Career Tier Readiness Diagnostics
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { key: 'internship_ready', label: 'Internship Ready' },
                    { key: 'entry_level_ready', label: 'Entry Level Ready' },
                    { key: 'mid_level_ready', label: 'Mid-Level Ready' },
                    { key: 'senior_ready', label: 'Senior Ready' },
                  ].map((tier) => {
                    const info = (optimization.career_readiness as any)[tier.key]
                    const isReady = info?.ready
                    return (
                      <div
                        key={tier.key}
                        className={`p-4 border rounded-xl flex flex-col justify-between h-32 text-xs transition-all ${
                          isReady
                            ? 'border-emerald-500/25 bg-emerald-500/5 dark:bg-emerald-500/10'
                            : 'border-rose-500/20 bg-rose-500/5 dark:bg-rose-500/10'
                        }`}
                      >
                        <div>
                          <h5 className="font-bold text-slate-800 dark:text-slate-200">
                            {tier.label}
                          </h5>
                          <p className="text-[10px] text-slate-500 mt-1.5 leading-tight line-clamp-3">
                            {info?.reasoning || 'No details analyzed.'}
                          </p>
                        </div>
                        <span
                          className={`text-[9px] font-bold self-end uppercase px-2 py-0.5 rounded-full border ${
                            isReady
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-450 border-emerald-250/20'
                              : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-455 border-rose-250/20'
                          }`}
                        >
                          {isReady ? 'Qualified' : 'Requires Focus'}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Industry Alignment percentages */}
            {optimization.industry_alignment && optimization.industry_alignment.length > 0 && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-850 space-y-3">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">
                  Top Recommended Industry Alignments
                </h4>
                <div className="space-y-3">
                  {optimization.industry_alignment.map((ind, index) => {
                    const confPercentage = Math.round(ind.confidence * 100)
                    return (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-xs font-medium text-slate-655 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <ChevronRight size={12} className="text-brand-500" />
                            {ind.industry}
                          </span>
                          <span>{confPercentage}% confidence</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand-550 dark:bg-brand-500 rounded-full"
                            style={{ width: `${confPercentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default OptimizationCard
