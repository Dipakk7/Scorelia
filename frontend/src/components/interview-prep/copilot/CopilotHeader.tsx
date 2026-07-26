import React from 'react'
import { Bot, Sparkles, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export interface CopilotHeaderProps {
  onNewConversation?: () => void
  onClearConversation?: () => void
  contextText?: string
}

export function CopilotHeader({
  onNewConversation,
  onClearConversation,
  contextText = 'Google AI/ML Engineer Context Active',
}: CopilotHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#10121e]/90 border border-white/10 p-5 rounded-2xl hover:border-purple-500/30 transition-all">
      <div className="space-y-1 text-left">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
            <Bot className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Interview Copilot
            <Sparkles className="h-4 w-4 text-purple-400" />
          </h2>
          <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs font-bold font-mono px-2.5 py-0.5 flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            AI Online
          </Badge>
        </div>
        <p className="text-xs text-slate-400 font-medium">
          Your interactive AI career assistant. Ask technical questions, format STAR behavioral answers, review code, or request mock interview practice.
        </p>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <Badge className="hidden md:flex bg-purple-500/10 text-purple-300 border-purple-500/20 text-xs font-semibold py-1 px-3">
          {contextText}
        </Badge>

        <Button
          onClick={onNewConversation}
          className="px-3.5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all cursor-pointer border-none flex items-center gap-1.5 shadow-md shadow-purple-900/30"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Chat</span>
        </Button>

        <Button
          variant="outline"
          onClick={onClearConversation}
          className="p-2 text-slate-400 hover:text-white border-white/10 bg-white/5 rounded-xl cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
export default CopilotHeader
