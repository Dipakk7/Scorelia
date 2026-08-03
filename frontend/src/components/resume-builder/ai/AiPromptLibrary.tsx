import React, { useState } from 'react'
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react'

const PROMPTS_LIST: string[] = [
  'Make my resume more ATS friendly',
  'Optimize for AI Engineer',
  'Optimize for ML Engineer',
  'Optimize for Data Scientist',
  'Find missing technical keywords',
  'Improve my summary',
  'Rewrite work experience professionally',
  'Add measurable achievements & metrics',
  'Improve technical skills presentation',
  'Enhance project bullet points',
]

interface AiPromptLibraryProps {
  onSelectPrompt: (promptText: string) => void
}

export const AiPromptLibrary: React.FC<AiPromptLibraryProps> = ({ onSelectPrompt }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false)

  const visiblePrompts = isExpanded ? PROMPTS_LIST : PROMPTS_LIST.slice(0, 3)

  return (
    <div className="space-y-2 text-left">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5 font-display">
          <Sparkles size={13} className="text-purple-400" />
          <span>Suggested AI Prompts</span>
        </span>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[10px] text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1 cursor-pointer font-mono focus:outline-none transition-colors"
        >
          <span>{isExpanded ? 'Show Less ▲' : 'Browse All ▼'}</span>
        </button>
      </div>

      {/* Primary Prompt Chips Stack with Smooth Transition */}
      <div className="flex flex-wrap gap-1.5 transition-all duration-200 ease-out">
        {visiblePrompts.map((promptText) => (
          <button
            key={promptText}
            type="button"
            onClick={() => onSelectPrompt(promptText)}
            className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-[#121424] hover:bg-slate-900 text-slate-200 hover:text-white border border-slate-800/90 hover:border-purple-500/50 transition-all cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 shadow-xs"
          >
            {promptText}
          </button>
        ))}
      </div>
    </div>
  )
}
