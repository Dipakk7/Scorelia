import React, { useState } from 'react'
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react'

export interface PromptCategory {
  category: string
  prompts: string[]
}

const PROMPT_LIBRARY_DATA: PromptCategory[] = [
  {
    category: 'ATS & Keywords',
    prompts: [
      'Make my resume more ATS friendly',
      'Optimize for AI Engineer',
      'Optimize for ML Engineer',
      'Optimize for Data Scientist',
      'Find missing technical keywords',
    ],
  },
  {
    category: 'Content Enhancement',
    prompts: [
      'Improve my summary',
      'Rewrite work experience professionally',
      'Add measurable achievements & metrics',
      'Improve technical skills presentation',
      'Enhance project bullet points',
    ],
  },
]

interface AiPromptLibraryProps {
  onSelectPrompt: (promptText: string) => void
}

export const AiPromptLibrary: React.FC<AiPromptLibraryProps> = ({ onSelectPrompt }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false)

  return (
    <div className="space-y-2 text-left">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5 font-display">
          <Sparkles size={13} className="text-purple-400" />
          <span>Suggested AI Prompts</span>
        </span>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[10px] text-purple-400 hover:underline flex items-center gap-1 cursor-pointer font-mono"
        >
          <span>{isExpanded ? 'Show Fewer' : 'Browse All'}</span>
          {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>

      {/* Primary Prompt Chips */}
      <div className="flex flex-wrap gap-1.5">
        {(isExpanded
          ? PROMPT_LIBRARY_DATA.flatMap((c) => c.prompts)
          : PROMPT_LIBRARY_DATA[0].prompts.slice(0, 4)
        ).map((promptText) => (
          <button
            key={promptText}
            type="button"
            onClick={() => onSelectPrompt(promptText)}
            className="px-2.5 py-1 rounded-xl text-[11px] font-medium bg-white/5 hover:bg-purple-600/20 text-slate-300 hover:text-purple-200 border border-white/10 hover:border-purple-500/40 transition-all cursor-pointer text-left"
          >
            {promptText}
          </button>
        ))}
      </div>
    </div>
  )
}
