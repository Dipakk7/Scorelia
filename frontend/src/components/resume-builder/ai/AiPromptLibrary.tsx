import React, { useState } from 'react'
import { Sparkles, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

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

  return (
    <div className="text-left bg-[#121424]/60 border border-slate-800/80 rounded-xl p-2.5 space-y-2 transition-all duration-200">
      {/* Compact Header Bar (Single 40px Row Default) */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5 font-display select-none">
          <Sparkles size={13} className="text-purple-400" />
          <span>Suggested AI Prompts</span>
        </span>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[10px] text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1 cursor-pointer font-mono focus:outline-none transition-all px-2 py-0.5 rounded-lg hover:bg-purple-500/10"
        >
          <span>{isExpanded ? 'Show Less' : 'Browse All'}</span>
          <ChevronDown
            size={12}
            className={cn('transition-transform duration-200 shrink-0', isExpanded && 'rotate-180')}
          />
        </button>
      </div>

      {/* Expandable Prompt Chips Library */}
      <div
        className={cn(
          'transition-all duration-200 ease-out overflow-hidden',
          isExpanded ? 'max-h-96 opacity-100 pt-1' : 'max-h-0 opacity-0 pt-0'
        )}
      >
        <div className="flex flex-wrap gap-1.5">
          {PROMPTS_LIST.map((promptText) => (
            <button
              key={promptText}
              type="button"
              onClick={() => onSelectPrompt(promptText)}
              className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-[#0e101c] hover:bg-slate-900 text-slate-200 hover:text-white border border-slate-800/90 hover:border-purple-500/50 transition-all cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 shadow-xs"
            >
              {promptText}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
