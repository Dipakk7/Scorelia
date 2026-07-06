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
    <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-bg shadow-md text-left font-sans">
      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-100 dark:border-slate-850 overflow-x-auto scrollbar-none bg-slate-50/50 dark:bg-slate-900/30">
        {tabItems.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                isActive
                  ? 'border-brand-500 text-brand-600 dark:text-brand-450 bg-white dark:bg-dark-bg'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50/40 dark:hover:bg-slate-900/40'
              }`}
            >
              <Icon size={14} />
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
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Executive Assessment
              </span>
              <p className="text-xs text-slate-655 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-150/40 dark:border-slate-800/60 font-sans">
                {review.overall_summary || 'No review summary generated yet.'}
              </p>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Strengths */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <ThumbsUp size={14} />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Strengths</h4>
                </div>
                <ul className="space-y-2">
                  {review.strengths && review.strengths.length > 0 ? (
                    review.strengths.map((str, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-slate-600 dark:text-slate-350 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/15 p-3 rounded-lg flex items-start gap-2.5"
                      >
                        <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0" />
                        <span>{str}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-xs text-slate-450 italic">No specific strengths listed yet.</li>
                  )}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-rose-500 dark:text-rose-400">
                  <ThumbsDown size={14} />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Areas for Improvement</h4>
                </div>
                <ul className="space-y-2">
                  {review.weaknesses && review.weaknesses.length > 0 ? (
                    review.weaknesses.map((weak, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-slate-600 dark:text-slate-350 bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/15 p-3 rounded-lg flex items-start gap-2.5"
                      >
                        <span className="h-1.5 w-1.5 bg-rose-500 rounded-full mt-1.5 shrink-0" />
                        <span>{weak}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-xs text-slate-455 italic">No weak areas identified.</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Missing Sections warning */}
            {review.missing_sections && review.missing_sections.length > 0 && (
              <div className="p-4 border border-amber-250 dark:border-amber-900 bg-amber-500/5 rounded-xl flex gap-3">
                <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400">
                    Missing Resume Sections ({review.missing_sections.length})
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    We noticed these key sections are missing or couldn't be parsed:
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {review.missing_sections.map((sect) => (
                      <span
                        key={sect}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
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
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Grammatical & Format Review
            </span>
            <div className="text-xs text-slate-655 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-150/40 dark:border-slate-800/60 font-sans whitespace-pre-line">
              {review.grammar_feedback || 'No specific grammatical feedback generated.'}
            </div>
          </div>
        )}

        {/* ATS Analysis */}
        {activeTab === 'ats' && (
          <div className="space-y-4">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              ATS Compatibility Assessment
            </span>
            <div className="text-xs text-slate-655 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-150/40 dark:border-slate-800/60 font-sans whitespace-pre-line">
              {review.ats_feedback || 'No specific ATS recommendations generated.'}
            </div>
          </div>
        )}

        {/* Technical Assessment */}
        {activeTab === 'technical' && (
          <div className="space-y-4">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Technical Skill Presentation
            </span>
            <div className="text-xs text-slate-655 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-150/40 dark:border-slate-800/60 font-sans whitespace-pre-line">
              {review.technical_feedback || 'No specific technical feedback available.'}
            </div>
          </div>
        )}

        {/* Career Alignment */}
        {activeTab === 'career' && (
          <div className="space-y-4">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Career Path Suitability
            </span>
            <div className="text-xs text-slate-655 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-150/40 dark:border-slate-800/60 font-sans whitespace-pre-line">
              {review.career_feedback || 'No specific career feedback available.'}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default AIReviewCard
