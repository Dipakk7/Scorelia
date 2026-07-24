import React, { useState } from 'react'
import { Bot, Send, ChevronRight } from 'lucide-react'

interface AIAssistantWidgetProps {
  displayName: string
  onSendQuery?: (query: string) => void
}

const DEFAULT_PROMPTS = [
  'Improve my resume for AI roles',
  'Find high match AI jobs',
  'Why is my ATS score low?',
  'Prepare me for system design',
]

export const AIAssistantWidget: React.FC<AIAssistantWidgetProps> = React.memo(({
  displayName,
  onSendQuery,
}) => {
  const [query, setQuery] = useState('')

  const handleSend = () => {
    if (!query.trim()) return
    if (onSendQuery) onSendQuery(query)
    setQuery('')
  }

  const handlePromptClick = (p: string) => {
    setQuery(p)
    if (onSendQuery) onSendQuery(p)
  }

  return (
    <div className="p-5 rounded-2xl bg-[#0f101d]/95 border border-purple-500/20 backdrop-blur-md shadow-xl space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <Bot size={18} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white tracking-tight">AI Assistant</h3>
            <span className="text-[9px] font-mono text-purple-400 uppercase tracking-widest block">Scorelia Copilot</span>
          </div>
        </div>
        <span className="text-[9px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
          BETA
        </span>
      </div>

      <div className="space-y-3">
        <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs space-y-1">
          <span className="font-bold text-purple-300 block">Hi {displayName}! 👋</span>
          <p className="text-slate-400 leading-relaxed">How can I help you today?</p>
        </div>

        {/* Input box */}
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend() }}
            placeholder="Ask Scorelia AI anything..."
            aria-label="Ask Scorelia AI query input"
            className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 focus-visible:ring-2 focus-visible:ring-purple-500/50"
          />
          <button
            onClick={handleSend}
            aria-label="Send AI query"
            className="absolute right-2 top-2 p-1 rounded-lg bg-purple-600 text-white hover:bg-purple-500 active:scale-95 cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50"
          >
            <Send size={14} />
          </button>
        </div>

        {/* Quick Prompts */}
        <div className="space-y-1.5 pt-1">
          {DEFAULT_PROMPTS.map((p, i) => (
            <div
              key={i}
              onClick={() => handlePromptClick(p)}
              className="p-2 rounded-lg bg-white/[0.03] border border-white/5 hover:border-purple-500/30 text-[11px] text-slate-300 cursor-pointer flex items-center justify-between group transition-colors"
            >
              <span className="truncate">{p}</span>
              <ChevronRight size={12} className="text-slate-500 group-hover:text-purple-400 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})
export default AIAssistantWidget
