import React, { useState } from 'react'
import { Bot, Sparkles, Target, Layout, ArrowRight } from 'lucide-react'
import { AiChatWorkspace } from './ai/AiChatWorkspace'
import { AiActionsList } from './ai/AiActionsList'
import { AtsInsightsPanel } from './ai/AtsInsightsPanel'
import { AiSuggestionCard } from './ai/AiSuggestionCard'
import type { AiSuggestionItem } from './ai/AiSuggestionCard'
import { TEMPLATES_LIST } from './templates/types'
import { cn } from '@/lib/utils'

export const ResumeAssistantPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'actions' | 'ats' | 'template'>('chat')

  const [suggestions, setSuggestions] = useState<AiSuggestionItem[]>([
    {
      id: 'sug-1',
      title: 'Add measurable achievements',
      description: 'Include hard numbers and impact metrics in your experience bullet points.',
      detailText: 'Quantified accomplishments (e.g. "Increased throughput by 40%") signal high accountability and boost ATS score significantly.',
      priority: 'High',
      category: 'Experience',
      scoreImprovement: '+12 ATS',
    },
    {
      id: 'sug-2',
      title: 'Include missing MLOps keywords',
      description: 'Add Docker, Kubernetes, and CI/CD pipelines to your skills section.',
      detailText: '85% of Senior AI Engineer job descriptions require MLOps toolchain keywords.',
      priority: 'Medium',
      category: 'Keywords',
      scoreImprovement: '+5 ATS',
    },
    {
      id: 'sug-3',
      title: 'Add certification details',
      description: 'Include AWS Machine Learning Specialty credential link.',
      detailText: 'Verified accreditation links boost recruiter confidence during profile evaluation.',
      priority: 'Low',
      category: 'Certifications',
      scoreImprovement: '+2 ATS',
    },
  ])

  const handleDismissSuggestion = (id: string) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id))
  }

  return (
    <div className="flex flex-col h-full min-h-0 bg-[#0b0c14]/95 border border-slate-800/90 rounded-2xl shadow-xl overflow-hidden text-left font-sans transition-colors">
      {/* Workspace Tabs Header Bar (Fixed Top) */}
      <div className="h-[48px] min-h-[48px] flex items-center gap-1.5 p-2 bg-[#0e101c] border-b border-slate-800/80 shrink-0 flex-none overflow-x-auto custom-scrollbar box-border" role="tablist" aria-label="AI Assistant workspace tabs">
        {[
          { id: 'chat', label: 'AI Chat', icon: Bot },
          { id: 'actions', label: 'Actions', icon: Sparkles },
          { id: 'ats', label: 'ATS Insights', icon: Target },
          { id: 'template', label: 'Active Template', icon: Layout },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`${tab.label} workspace tab`}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500',
                isActive
                  ? 'bg-purple-600/20 text-white border-purple-500/50 shadow-xs'
                  : 'bg-transparent text-slate-400 border-transparent hover:bg-slate-900/60 hover:text-slate-200'
              )}
            >
              <Icon size={13} className={isActive ? 'text-purple-400' : 'text-slate-400'} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Workspace Active Content Area (Redistributed Flex Height) */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        {activeTab === 'chat' && <AiChatWorkspace />}
        {activeTab === 'actions' && <AiActionsList />}
        {activeTab === 'ats' && (
          <div className="flex-1 min-h-0 overflow-y-auto p-4 custom-scrollbar space-y-4">
            <AtsInsightsPanel />

            {/* AI Suggestions Cards Stack */}
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-border-subtle">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white font-display flex items-center gap-1.5">
                  <Sparkles size={13} className="text-purple-600 dark:text-purple-400" />
                  <span>AI Suggestions</span>
                </span>
                <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-bold">
                  {suggestions.length} Available
                </span>
              </div>

              {suggestions.map((sug) => (
                <AiSuggestionCard
                  key={sug.id}
                  suggestion={sug}
                  onDismiss={handleDismissSuggestion}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'template' && (
          <div className="flex-1 min-h-0 overflow-y-auto p-4 custom-scrollbar space-y-4">
            <div className="bg-slate-50 dark:bg-surface-l3 border border-slate-200 dark:border-border-subtle rounded-xl p-4 space-y-3 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-border-subtle pb-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white font-display">Active Template Card</span>
                <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-semibold">Corporate</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-16 h-20 rounded-lg bg-slate-200 dark:bg-surface-l4 border border-slate-300 dark:border-border-subtle overflow-hidden shrink-0 flex flex-col p-1 space-y-1 justify-center items-center shadow-inner">
                  <div className="w-full h-2 bg-blue-500/40 rounded" />
                  <div className="w-full h-1 bg-slate-400 dark:bg-slate-600 rounded" />
                  <div className="w-full h-1 bg-slate-400 dark:bg-slate-600 rounded" />
                  <div className="w-3/4 h-1 bg-slate-400 dark:bg-slate-600 rounded" />
                </div>

                <div className="space-y-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white font-display m-0">
                    Professional Template
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug line-clamp-2 m-0">
                    Clean, corporate layout with classic navy headers and formal dividers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
