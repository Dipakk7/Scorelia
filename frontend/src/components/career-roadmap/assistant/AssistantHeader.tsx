import React from 'react'
import { Bot, RotateCw, PlusCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AssistantHeaderProps {
  onNewChat?: () => void
  onClearChat?: () => void
  className?: string
}

export function AssistantHeader({
  onNewChat,
  onClearChat,
  className,
}: AssistantHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-3 pb-3 border-b border-white/10 text-left select-none', className)}>
      <div className="flex items-center justify-between gap-2">
        {/* Left: AI Avatar & Title */}
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-950/50 shrink-0">
            <Bot className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2 m-0">
              <span>Career AI Assistant</span>
              <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online
              </span>
            </h3>
            <span className="text-[11px] text-slate-400 font-medium block">
              Active Context: <strong className="text-slate-200">AI/ML Engineer Roadmap</strong>
            </span>
          </div>
        </div>

        {/* Right: Header Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onNewChat}
            className="flex items-center gap-1 text-[11px] font-semibold text-slate-300 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 min-h-[36px]"
            aria-label="Start new chat"
          >
            <PlusCircle className="h-3.5 w-3.5 text-purple-400 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
          <button
            type="button"
            onClick={onClearChat}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 min-h-[36px] min-w-[36px] flex items-center justify-center"
            title="Clear chat session"
            aria-label="Clear chat history"
          >
            <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
export default AssistantHeader
