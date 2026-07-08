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
import { cn } from '@/lib/utils'

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
        return 'bg-rose-500/10 text-rose-700 dark:text-rose-455 border-rose-500/20'
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
    <Card className="border border-slate-200/60 dark:border-slate-855 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md shadow-sm overflow-hidden font-sans rounded-2xl hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 text-left">
      {/* Sub tabs */}
      <div className="flex border-b border-slate-105 dark:border-slate-850/80 overflow-x-auto scrollbar-none bg-slate-50/20 dark:bg-slate-900/10">
        {tabItems.map((item) => {
          const Icon = item.icon
          const isActive = optTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => setOptTab(item.id)}
              className={cn(
                'flex items-center gap-2 px-5 py-3.5 text-xs font-bold whitespace-nowrap transition-all border-b-2 cursor-pointer',
                isActive
                  ? 'border-brand-500 text-brand-600 dark:text-brand-400 bg-white/40 dark:bg-slate-900/20'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-850/20'
              )}
            >
              <Icon size={13} className={isActive ? 'text-brand-500' : 'text-slate-455'} />
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
              <div className="p-4 bg-slate-50/30 dark:bg-slate-900/20 border border-slate-200/60 dark:border-slate-850 rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div className="md:col-span-3 space-y-1.5">
                  <h4 className="text-xs font-black text-slate-900 dark:text-slate-200 flex items-center gap-1.5 m-0 uppercase tracking-wider">
                    <Search size={14} className="text-brand-500" />
                    <span>ATS Matching Diagnostic</span>
                  </h4>
                  <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed pr-2 m-0 font-medium">
                    {optimization.ats_optimization.why_score_is_low ||
                      'Analyze keywords matching profile vs target jobs.'}
                  </p>
                </div>
                <div className="bg-brand-500/5 border border-brand-500/10 rounded-xl p-3.5 text-center flex flex-col justify-center h-full">
                  <span className="text-[9px] text-slate-450 dark:text-slate-500 font-extrabold uppercase tracking-wider">
                    Expected Increase
                  </span>
                  <span className="text-xl font-black text-brand-600 dark:text-brand-400 mt-0.5">
                    +{optimization.ats_optimization.expected_improvement || 0} pts
                  </span>
                  <span className="text-[9px] text-slate-500 dark:text-slate-455 leading-tight mt-1 font-semibold uppercase tracking-wider">
                    With recommended fixes
                  </span>
                </div>
              </div>
            )}

            {/* Keyword Density Pools */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Matched Keywords */}
              <div className="space-y-3.5 p-4 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 dark:border-emerald-500/20 rounded-2xl text-left">
                <h4 className="text-xs font-black text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider m-0">
                  <CheckCircle size={14} className="text-emerald-500" />
                  <span>Matched Keywords ({optimization.keyword_optimization?.matched_keywords?.length || 0})</span>
                </h4>
                <div className="flex flex-wrap gap-1.5 max-h-[160px] overflow-y-auto pr-1 scrollbar-none">
                  {optimization.keyword_optimization?.matched_keywords?.map((kw) => (
                    <span
                      key={kw}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/15"
                    >
                      {kw}
                    </span>
                  ))}
                  {(!optimization.keyword_optimization?.matched_keywords ||
                    optimization.keyword_optimization.matched_keywords.length === 0) && (
                    <span className="text-xs text-slate-450 dark:text-slate-500 italic">None matched.</span>
                  )}
                </div>
              </div>

              {/* Missing Keywords */}
              <div className="space-y-3.5 p-4 bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/10 dark:border-rose-500/20 rounded-2xl text-left">
                <h4 className="text-xs font-black text-rose-700 dark:text-rose-455 flex items-center gap-1.5 uppercase tracking-wider m-0">
                  <AlertCircle size={14} className="text-rose-500" />
                  <span>Missing Keywords ({optimization.keyword_optimization?.missing_keywords?.length || 0})</span>
                </h4>
                <div className="flex flex-wrap gap-1.5 max-h-[160px] overflow-y-auto pr-1 scrollbar-none">
                  {optimization.keyword_optimization?.missing_keywords?.map((kw) => (
                    <span
                      key={kw}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/15"
                    >
                      {kw}
                    </span>
                  ))}
                  {(!optimization.keyword_optimization?.missing_keywords ||
                    optimization.keyword_optimization.missing_keywords.length === 0) && (
                    <span className="text-xs text-slate-450 dark:text-slate-500 italic">No missing keywords!</span>
                  )}
                </div>
              </div>

              {/* Strong Action Verbs */}
              <div className="space-y-3.5 p-4 bg-brand-500/5 dark:bg-brand-500/10 border border-brand-500/10 dark:border-brand-500/20 rounded-2xl text-left">
                <h4 className="text-xs font-black text-brand-700 dark:text-brand-400 flex items-center gap-1.5 uppercase tracking-wider m-0">
                  <Plus size={14} className="text-brand-500" />
                  <span>Action Verbs ({optimization.keyword_optimization?.strong_action_verbs?.length || 0})</span>
                </h4>
                <div className="flex flex-wrap gap-1.5 max-h-[160px] overflow-y-auto pr-1 scrollbar-none">
                  {optimization.keyword_optimization?.strong_action_verbs?.map((verb) => (
                    <span
                      key={verb}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-brand-500/10 text-brand-700 dark:text-brand-400 border border-brand-500/15"
                    >
                      {verb}
                    </span>
                  ))}
                  {(!optimization.keyword_optimization?.strong_action_verbs ||
                    optimization.keyword_optimization.strong_action_verbs.length === 0) && (
                    <span className="text-xs text-slate-455 dark:text-slate-500 italic">None found.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bullet Points */}
        {optTab === 'bullets' && (
          <div className="space-y-4">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-widest block">
              Achievement & Bullet Point Enhancements
            </span>
            <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1 scrollbar-none">
              {optimization.achievement_optimization && optimization.achievement_optimization.length > 0 ? (
                optimization.achievement_optimization.map((bullet, idx) => (
                  <div
                    key={idx}
                    className="p-4 border border-slate-200/80 dark:border-slate-800 bg-white/30 dark:bg-slate-900/10 rounded-2xl space-y-3.5 hover:border-brand-500/10 transition-colors duration-200"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Original */}
                      <div className="space-y-1 text-left">
                        <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                          Original Bullet
                        </span>
                        <p className="text-xs text-slate-500 dark:text-slate-450 line-through bg-rose-500/5 p-3 rounded-xl border border-rose-500/10 leading-relaxed font-sans m-0">
                          {bullet.original_bullet}
                        </p>
                      </div>

                      {/* Suggested */}
                      <div className="space-y-1 text-left">
                        <span className="text-[9px] font-bold text-brand-500 uppercase tracking-wider block">
                          AI Suggested Optimization
                        </span>
                        <p className="text-xs text-slate-800 dark:text-slate-200 bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/15 leading-relaxed font-semibold font-sans m-0">
                          {bullet.suggested_bullet}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3.5 border-t border-dashed border-slate-200 dark:border-slate-800">
                      <div className="flex flex-wrap gap-2 text-[9px] font-black uppercase tracking-wider">
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded-lg border',
                            bullet.missing_metrics
                              ? 'bg-rose-500/10 text-rose-700 dark:text-rose-455 border-rose-500/20'
                              : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                          )}
                        >
                          {bullet.missing_metrics ? '✗ Missing Metrics' : '✓ Has Metrics'}
                        </span>
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded-lg border',
                            bullet.missing_impact
                              ? 'bg-rose-500/10 text-rose-700 dark:text-rose-455 border-rose-500/20'
                              : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                          )}
                        >
                          {bullet.missing_impact ? '✗ Missing Impact' : '✓ Has Impact'}
                        </span>
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded-lg border',
                            bullet.missing_business_value
                              ? 'bg-rose-500/10 text-rose-700 dark:text-rose-455 border-rose-500/20'
                              : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                          )}
                        >
                          {bullet.missing_business_value ? '✗ Missing Business Value' : '✓ Has Value'}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                        <span className="font-bold text-brand-655 dark:text-brand-400">Reason:</span> {bullet.reason}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-405 italic text-xs">
                  No achievement bullet suggestions available.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Skills & Resources */}
        {optTab === 'skills' && (
          <div className="space-y-4">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-widest block">
              Skill Deficiencies & Educational Material
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[480px] overflow-y-auto pr-1 scrollbar-none">
              {optimization.missing_skills && optimization.missing_skills.length > 0 ? (
                optimization.missing_skills.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 border border-slate-200/60 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/20 rounded-2xl space-y-3.5 text-xs text-left"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-extrabold text-slate-900 dark:text-slate-200 text-sm m-0 leading-tight">
                        {item.skill}
                      </h4>
                      <div className="flex gap-1.5 shrink-0">
                        <span className={cn('px-2 py-0.5 rounded-lg border text-[9px] font-black uppercase tracking-wider', getPriorityColor(item.priority))}>
                          Priority: {item.priority}
                        </span>
                        <span className={cn('px-2 py-0.5 rounded-lg border text-[9px] font-black uppercase tracking-wider', getDifficultyColor(item.difficulty))}>
                          {item.difficulty}
                        </span>
                      </div>
                    </div>

                    <p className="text-slate-655 dark:text-slate-350 leading-relaxed font-medium m-0">
                      {item.why_it_matters}
                    </p>

                    <div className="pt-3 border-t border-slate-150/40 dark:border-slate-800/80 space-y-2">
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-455 font-bold text-[9px] uppercase tracking-wider">
                        <Clock size={11} className="text-brand-500" />
                        <span>Est. time to learn: {item.estimated_time || 'N/A'}</span>
                      </div>
                      {item.resources && item.resources.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                            Recommended Courses:
                          </span>
                          <div className="flex flex-col gap-1.5">
                            {item.resources.map((res, ridx) => (
                              <a
                                key={ridx}
                                href={`https://www.google.com/search?q=${encodeURIComponent(res)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
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
                <h4 className="text-xs font-black text-slate-900 dark:text-slate-200 uppercase tracking-wider m-0 text-left">
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
                        className={cn(
                          'p-4 border rounded-2xl flex flex-col justify-between h-36 text-xs text-left transition-all duration-300 hover:scale-[1.01]',
                          isReady
                            ? 'border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10'
                            : 'border-rose-500/15 bg-rose-500/5 dark:bg-rose-500/10'
                        )}
                      >
                        <div>
                          <h5 className="font-extrabold text-slate-905 dark:text-slate-200 m-0">
                            {tier.label}
                          </h5>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed line-clamp-3 font-medium">
                            {info?.reasoning || 'No details analyzed.'}
                          </p>
                        </div>
                        <span
                          className={cn(
                            'text-[9px] font-black uppercase tracking-wider self-end px-2.5 py-0.5 rounded-lg border',
                            isReady
                              ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-450 border-emerald-250/20'
                              : 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-455 border-rose-250/20'
                          )}
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
              <div className="pt-4 border-t border-slate-100 dark:border-slate-850 space-y-3.5 text-left">
                <h4 className="text-xs font-black text-slate-900 dark:text-slate-200 uppercase tracking-wider m-0">
                  Recommended Industry Alignments
                </h4>
                <div className="space-y-3">
                  {optimization.industry_alignment.map((ind, index) => {
                    const confPercentage = Math.round(ind.confidence * 100)
                    return (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-slate-655 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <ChevronRight size={12} className="text-brand-500" />
                            {ind.industry}
                          </span>
                          <span>{confPercentage}% confidence</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand-500 rounded-full"
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
