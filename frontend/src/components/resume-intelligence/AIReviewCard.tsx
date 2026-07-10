import { useState } from 'react'
import {
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  FileText,
  Bookmark,
  CheckCircle,
  HelpCircle,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import type { ResumeReviewResponse } from '@/types/resume-intelligence'
import { cn } from '@/lib/utils'

interface AIReviewCardProps {
  review: ResumeReviewResponse
}

export function AIReviewCard({ review }: AIReviewCardProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'grammar' | 'ats' | 'technical' | 'career'>('summary')

  const tabItems = [
    { id: 'summary', label: 'Overall Review', icon: Sparkles },
    { id: 'grammar', label: 'Grammar & Formatting', icon: FileText },
    { id: 'ats', label: 'ATS Analysis', icon: CheckCircle },
    { id: 'technical', label: 'Technical Assessment', icon: Bookmark },
    { id: 'career', label: 'Career Alignment', icon: HelpCircle },
  ] as const

  return (
    <Card className="border border-border/60 bg-card/70 backdrop-blur-md shadow-sm overflow-hidden font-sans rounded-2xl hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 text-left">
      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-105 dark:border-slate-850/80 overflow-x-auto scrollbar-none bg-slate-50/20 dark:bg-slate-900/10">
        {tabItems.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-5 py-3.5 text-xs font-bold whitespace-nowrap transition-all border-b-2 cursor-pointer',
                isActive
                  ? 'border-brand-500 text-brand-600 dark:text-brand-400 bg-white/40 dark:bg-slate-900/20'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-850/20'
              )}
            >
              <Icon size={13} className={isActive ? 'text-brand-500' : 'text-slate-455'} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      <CardContent className="p-6">
        {/* Summary Tab */}
        {activeTab === 'summary' && (
          <div className="space-y-6">
            {/* Overall Assessment */}
            <div className="space-y-2">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-widest block">
                Executive Assessment
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed bg-slate-50/30 dark:bg-slate-955/20 p-4 rounded-xl border border-slate-200/50 dark:border-slate-850 font-sans m-0">
                {review.overall_summary || 'No review summary generated yet.'}
              </p>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Strengths */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <ThumbsUp size={14} className="stroke-[2]" />
                  <h4 className="text-xs font-black uppercase tracking-wider m-0">Strengths</h4>
                </div>
                <ul className="space-y-2 p-0 m-0">
                  {review.strengths && review.strengths.length > 0 ? (
                    review.strengths.map((str, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-muted-foreground bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 dark:border-emerald-500/20 p-3 rounded-xl flex items-start gap-2.5 list-none"
                      >
                        <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0 animate-pulse" />
                        <span>{str}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-xs text-slate-450 italic list-none">No specific strengths listed yet.</li>
                  )}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-destructive">
                  <ThumbsDown size={14} className="stroke-[2]" />
                  <h4 className="text-xs font-black uppercase tracking-wider m-0">Areas for Improvement</h4>
                </div>
                <ul className="space-y-2 p-0 m-0">
                  {review.weaknesses && review.weaknesses.length > 0 ? (
                    review.weaknesses.map((weak, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-muted-foreground bg-destructive/5 border border-destructive/10 dark:border-destructive/20 p-3 rounded-xl flex items-start gap-2.5 list-none"
                      >
                        <span className="h-1.5 w-1.5 bg-destructive rounded-full mt-1.5 shrink-0" />
                        <span>{weak}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-xs text-slate-455 italic list-none">No weak areas identified.</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Missing Sections warning */}
            {review.missing_sections && review.missing_sections.length > 0 && (
              <div className="p-4 border border-warning/20 bg-warning/5 rounded-xl flex gap-3 shadow-2xs">
                <AlertTriangle size={18} className="text-warning shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-black text-warning m-0">
                    Missing Resume Sections ({review.missing_sections.length})
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 m-0">
                    We noticed these key sections are missing or couldn't be parsed:
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {review.missing_sections.map((sect) => (
                      <span
                        key={sect}
                        className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                      >
                        {sect}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Grammar & Formatting */}
        {activeTab === 'grammar' && (
          <div className="space-y-4">
            <span className="text-[10px] text-slate-400 dark:text-slate-505 font-extrabold uppercase tracking-widest block">
              Grammatical & Format Review
            </span>
            <div className="text-xs text-muted-foreground leading-relaxed bg-slate-50/30 dark:bg-slate-955/20 p-4 rounded-xl border border-slate-205 dark:border-slate-850 font-sans whitespace-pre-line m-0">
              {review.grammar_feedback || 'No specific grammatical feedback generated.'}
            </div>
          </div>
        )}

        {/* ATS Analysis */}
        {activeTab === 'ats' && (
          <div className="space-y-4">
            <span className="text-[10px] text-slate-400 dark:text-slate-505 font-extrabold uppercase tracking-widest block">
              ATS Compatibility Assessment
            </span>
            <div className="text-xs text-muted-foreground leading-relaxed bg-slate-50/30 dark:bg-slate-955/20 p-4 rounded-xl border border-slate-205 dark:border-slate-850 font-sans whitespace-pre-line m-0">
              {review.ats_feedback || 'No specific ATS recommendations generated.'}
            </div>
          </div>
        )}

        {/* Technical Assessment */}
        {activeTab === 'technical' && (
          <div className="space-y-4">
            <span className="text-[10px] text-slate-400 dark:text-slate-555 font-extrabold uppercase tracking-widest block">
              Technical Skill Presentation
            </span>
            <div className="text-xs text-muted-foreground leading-relaxed bg-slate-50/30 dark:bg-slate-955/20 p-4 rounded-xl border border-slate-205 dark:border-slate-850 font-sans whitespace-pre-line m-0">
              {review.technical_feedback || 'No specific technical feedback available.'}
            </div>
          </div>
        )}

        {/* Career Alignment */}
        {activeTab === 'career' && (
          <div className="space-y-4">
            <span className="text-[10px] text-slate-400 dark:text-slate-555 font-extrabold uppercase tracking-widest block">
              Career Path Suitability
            </span>
            <div className="text-xs text-muted-foreground leading-relaxed bg-slate-50/30 dark:bg-slate-955/20 p-4 rounded-xl border border-slate-205 dark:border-slate-850 font-sans whitespace-pre-line m-0">
              {review.career_feedback || 'No specific career feedback available.'}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default AIReviewCard
