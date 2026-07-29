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
    <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] backdrop-blur-md shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <Bot size={18} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[var(--heading)] tracking-tight">AI Assistant</h3>
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
          <p className="text-[var(--muted-color)] leading-relaxed">How can I help you today?</p>
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
            className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-[var(--surface-hover)]/40 border border-[var(--border)] text-xs text-[var(--heading)] placeholder:text-[var(--muted-color)] focus:outline-none focus:border-[var(--primary)]/50 focus-visible:ring-2 focus-visible:ring-[var(--primary)]/50"
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
              className="p-2 rounded-lg bg-[var(--surface-hover)]/40 border border-[var(--border)]/60 hover:border-purple-500/30 text-[11px] text-[var(--body)] cursor-pointer flex items-center justify-between group transition-colors"
            >
              <span className="truncate">{p}</span>
              <ChevronRight size={12} className="text-[var(--muted-color)] group-hover:text-purple-400 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})
export default AIAssistantWidget
