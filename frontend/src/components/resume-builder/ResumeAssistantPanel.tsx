import React, { useState } from 'react'
import {
  Bot,
  Info,
  Send,
  Plus,
  Zap,
  ArrowRight,
  Palette,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AiSuggestionItem {
  id: string
  title: string
  description: string
  priority: 'High' | 'Medium' | 'Low'
  scoreImprovement: string
}

// Scorelia AI Card Sub-components
export const AssistantAvatar: React.FC = () => (
  <div className="w-7 h-7 rounded-xl bg-purple-600/20 dark:bg-purple-600/30 text-purple-600 dark:text-purple-300 flex items-center justify-center border border-purple-500/30 shrink-0">
    <Bot size={16} />
  </div>
)

export const AssistantHeader: React.FC = () => (
  <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/[0.08] pb-2.5">
    <div className="flex items-center gap-2">
      <AssistantAvatar />
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-900 dark:text-white font-display">Scorelia AI</span>
        <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-500 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Online
        </span>
      </div>
    </div>

    <button
      type="button"
      className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-[#1f2238] border border-slate-200 dark:border-white/[0.08] px-2.5 py-1 rounded-lg hover:bg-slate-200 dark:hover:bg-[#272a45] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80"
    >
      <Plus size={12} />
      <span>New Chat</span>
    </button>
  </div>
)

export const AssistantGreeting: React.FC = () => (
  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed m-0">
    Hi Dipak! I can help you build a stronger resume.
  </p>
)

interface SuggestionChipProps {
  label: string
  onClick: () => void
}

export const SuggestionChip: React.FC<SuggestionChipProps> = ({ label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="text-[11px] font-medium px-2.5 py-1 rounded-xl bg-purple-50 dark:bg-[#1a1c2e] text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/20 hover:border-purple-400/50 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80"
  >
    {label}
  </button>
)

interface SuggestionChipGroupProps {
  chips: string[]
  onSelectChip: (chip: string) => void
}

export const SuggestionChipGroup: React.FC<SuggestionChipGroupProps> = ({ chips, onSelectChip }) => (
  <div className="flex flex-wrap gap-1.5">
    {chips.map((chip) => (
      <SuggestionChip key={chip} label={chip} onClick={() => onSelectChip(chip)} />
    ))}
  </div>
)

interface SendButtonProps {
  onClick: () => void
}

export const SendButton: React.FC<SendButtonProps> = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="absolute right-1.5 p-1 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80"
    title="Send message"
    aria-label="Send message"
  >
    <Send size={12} />
  </button>
)

interface ChatInputProps {
  value: string
  onChange: (val: string) => void
  onSend: () => void
}

export const ChatInput: React.FC<ChatInputProps> = ({ value, onChange, onSend }) => (
  <div className="relative flex items-center pt-1">
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          onSend()
        }
      }}
      placeholder="Ask me anything about your resume..."
      className="w-full bg-slate-50 dark:bg-[#171a2b] border border-slate-200/80 dark:border-white/[0.08] rounded-xl pl-3 pr-9 py-2 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-purple-500/80 focus-visible:ring-2 focus-visible:ring-purple-500/80 transition-all"
    />
    <SendButton onClick={onSend} />
  </div>
)

// ATS Score Card Sub-components
export const ATSGauge: React.FC = () => (
  <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
      <path
        className="text-slate-200 dark:text-[#1f2238]"
        strokeWidth="3.5"
        stroke="currentColor"
        fill="none"
        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
      />
      <path
        className="text-emerald-500 dark:text-emerald-400"
        strokeDasharray="92, 100"
        strokeWidth="3.5"
        strokeLinecap="round"
        stroke="currentColor"
        fill="none"
        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
      />
    </svg>
    <div className="absolute flex flex-col items-center justify-center text-center">
      <span className="text-xl font-black text-slate-900 dark:text-white font-display leading-none">92</span>
      <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400">/100</span>
      <span className="text-[9px] font-bold text-emerald-500 dark:text-emerald-400 mt-0.5">Excellent</span>
    </div>
  </div>
)

export const ATSMiniChart: React.FC = () => (
  <div className="flex-1 space-y-1.5 text-right">
    <svg className="w-full h-12" viewBox="0 0 120 40">
      <defs>
        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path
        d="M 5 30 L 30 25 L 55 18 L 80 22 L 105 10 L 115 12 L 115 40 L 5 40 Z"
        fill="url(#chartGradient)"
      />
      <path
        d="M 5 30 L 30 25 L 55 18 L 80 22 L 105 10 L 115 12"
        fill="none"
        stroke="#10b981"
        strokeWidth="2"
      />
      <circle cx="105" cy="10" r="3" fill="#10b981" />
    </svg>
    <div className="flex justify-between text-[9px] text-slate-400 font-mono">
      <span>May 14</span>
      <span>May 21</span>
      <span>May 28</span>
      <span>Jun 4</span>
    </div>
  </div>
)

export const ATSScoreCard: React.FC = () => (
  <div className="bg-white/95 dark:bg-[#121522] border border-slate-200/70 dark:border-white/[0.07] rounded-2xl p-4 shadow-sm space-y-3 transition-colors">
    <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/[0.08] pb-2">
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-bold text-slate-900 dark:text-white font-display">ATS Score</span>
        <Info size={13} className="text-slate-400 cursor-pointer" />
      </div>
      <span className="text-[10px] font-mono text-slate-400">Updated just now</span>
    </div>

    <div className="flex items-center justify-between gap-3">
      <ATSGauge />
      <ATSMiniChart />
    </div>

    <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
      <span>Top 18% of candidates</span>
    </div>

    <button
      type="button"
      className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:opacity-95 transition-opacity shadow-sm cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80"
    >
      <span>Improve for ATS</span>
      <ArrowRight size={14} />
    </button>
  </div>
)

// AI Suggestions Card Sub-components
interface PriorityBadgeProps {
  priority: 'High' | 'Medium' | 'Low'
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => (
  <span
    className={cn(
      'text-[9px] font-bold px-1.5 py-0.2 rounded-md font-mono',
      priority === 'High' && 'bg-emerald-500/20 text-emerald-400',
      priority === 'Medium' && 'bg-amber-500/20 text-amber-400',
      priority === 'Low' && 'bg-blue-500/20 text-blue-400'
    )}
  >
    {priority}
  </span>
)

interface ScoreBadgeProps {
  scoreImprovement: string
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({ scoreImprovement }) => (
  <span className="text-[10px] font-mono font-bold text-emerald-500">{scoreImprovement}</span>
)

interface SuggestionItemProps {
  suggestion: AiSuggestionItem
}

export const SuggestionItem: React.FC<SuggestionItemProps> = ({ suggestion }) => (
  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#171a2b] border border-slate-200/60 dark:border-white/[0.06] space-y-1 hover:border-purple-500/30 transition-all cursor-pointer">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <Zap size={12} className="text-purple-500" />
        <span className="text-xs font-bold text-slate-900 dark:text-white">{suggestion.title}</span>
        <PriorityBadge priority={suggestion.priority} />
      </div>
      <ScoreBadge scoreImprovement={suggestion.scoreImprovement} />
    </div>
    <p className="text-[11px] text-slate-500 dark:text-slate-400 m-0 pl-4">
      {suggestion.description}
    </p>
  </div>
)

interface ViewAllButtonProps {
  onClick?: () => void
}

export const ViewAllButton: React.FC<ViewAllButtonProps> = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full py-2 rounded-xl text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-[#1f2238] border border-purple-200 dark:border-purple-500/30 hover:bg-purple-100 dark:hover:bg-[#272a45] transition-colors cursor-pointer flex items-center justify-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80"
  >
    <span>View All Suggestions</span>
    <ArrowRight size={13} />
  </button>
)

interface AISuggestionsCardProps {
  suggestions: AiSuggestionItem[]
}

export const AISuggestionsCard: React.FC<AISuggestionsCardProps> = ({ suggestions }) => (
  <div className="bg-white/95 dark:bg-[#121522] border border-slate-200/70 dark:border-white/[0.07] rounded-2xl p-4 shadow-sm space-y-3 transition-colors">
    <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/[0.08] pb-2">
      <span className="text-xs font-bold text-slate-900 dark:text-white font-display">AI Suggestions</span>
      <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-semibold">
        {suggestions.length} new suggestions
      </span>
    </div>

    <div className="space-y-2.5">
      {suggestions.map((sug) => (
        <SuggestionItem key={sug.id} suggestion={sug} />
      ))}
    </div>

    <ViewAllButton />
  </div>
)

// Active Template Card Sub-components
export const TemplateThumbnail: React.FC = () => (
  <div className="w-14 h-16 rounded-lg bg-slate-100 dark:bg-[#1f2238] border border-slate-200 dark:border-white/10 overflow-hidden shrink-0 flex flex-col p-1 space-y-1 justify-center items-center shadow-inner">
    <div className="w-full h-2 bg-purple-500/40 rounded" />
    <div className="w-full h-1 bg-slate-400 dark:bg-slate-600 rounded" />
    <div className="w-full h-1 bg-slate-400 dark:bg-slate-600 rounded" />
    <div className="w-3/4 h-1 bg-slate-400 dark:bg-slate-600 rounded" />
  </div>
)

interface ChangeTemplateButtonProps {
  onClick?: () => void
}

export const ChangeTemplateButton: React.FC<ChangeTemplateButtonProps> = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer pt-0.5 block focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80 rounded"
  >
    Change Template
  </button>
)

export const TemplateInfo: React.FC = () => (
  <div className="space-y-1 min-w-0 flex-1">
    <h4 className="text-xs font-bold text-slate-900 dark:text-white font-display m-0">
      Professional
    </h4>
    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-2 m-0">
      Clean and modern design for all industries
    </p>
    <ChangeTemplateButton />
  </div>
)

export const ActiveTemplateCard: React.FC = () => (
  <div className="bg-white/95 dark:bg-[#121522] border border-slate-200/70 dark:border-white/[0.07] rounded-2xl p-4 shadow-sm space-y-3 transition-colors">
    <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/[0.08] pb-2">
      <div className="flex items-center gap-1.5">
        <Palette size={13} className="text-purple-500" />
        <span className="text-xs font-bold text-slate-900 dark:text-white font-display">Active Template</span>
      </div>
    </div>

    <div className="flex items-center gap-3">
      <TemplateThumbnail />
      <TemplateInfo />
    </div>

    <div className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1 border-t border-slate-200/80 dark:border-white/[0.06] pt-2">
      <span>💡 Templates don't affect your content or scores.</span>
    </div>
  </div>
)

export const ResumeAssistantPanel: React.FC = () => {
  const [inputPrompt, setInputPrompt] = useState<string>('')
  const [suggestions] = useState<AiSuggestionItem[]>([
    {
      id: 'sug-1',
      title: 'Add measurable achievements',
      description: 'Include numbers and impact in your experience',
      priority: 'High',
      scoreImprovement: '+12 ATS',
    },
    {
      id: 'sug-2',
      title: 'Include more relevant keywords',
      description: 'Add 4–6 industry-specific keywords',
      priority: 'Medium',
      scoreImprovement: '+5 ATS',
    },
    {
      id: 'sug-3',
      title: 'Add certification details',
      description: 'Include relevant certifications',
      priority: 'Low',
      scoreImprovement: '+2 ATS',
    },
  ])

  const promptOptions = [
    'Improve my summary',
    'Add achievements',
    'Rewrite experience',
    'Optimize for ATS',
    'Find missing keywords',
  ]

  const handleSend = () => {
    setInputPrompt('')
  }

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto custom-scrollbar text-left font-sans pb-2">
      {/* 1. Scorelia AI Assistant Card */}
      <div className="bg-white/95 dark:bg-[#121522] border border-slate-200/70 dark:border-white/[0.07] rounded-2xl p-4 shadow-sm space-y-3 transition-colors">
        <AssistantHeader />
        <AssistantGreeting />
        <SuggestionChipGroup chips={promptOptions} onSelectChip={(chip) => setInputPrompt(chip)} />
        <ChatInput value={inputPrompt} onChange={setInputPrompt} onSend={handleSend} />
      </div>

      {/* 2. ATS Score Card */}
      <ATSScoreCard />

      {/* 3. AI Suggestions Card */}
      <AISuggestionsCard suggestions={suggestions} />

      {/* 4. Active Template Card */}
      <ActiveTemplateCard />
    </div>
  )
}
