import React from 'react'
import { Plus, Trash2, Download, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ConversationActionsProps {
  onNewChat?: () => void
  onClearConversation?: () => void
  onExportChat?: () => void
  onCopyConversation?: () => void
  className?: string
}

export function ConversationActions({
  onNewChat,
  onClearConversation,
  onExportChat,
  onCopyConversation,
  className
}: ConversationActionsProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <button
        type="button"
        onClick={onNewChat}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-purple-900/30"
      >
        <Plus size={14} />
        <span>New Chat</span>
      </button>

      <button
        type="button"
        onClick={onCopyConversation}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#121320] border border-white/10 hover:border-white/20 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
      >
        <Copy size={13} />
        <span>Copy</span>
      </button>

      <button
        type="button"
        onClick={onExportChat}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#121320] border border-white/10 hover:border-white/20 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
      >
        <Download size={13} />
        <span>Export</span>
      </button>

      <button
        type="button"
        onClick={onClearConversation}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold transition-all cursor-pointer"
      >
        <Trash2 size={13} />
        <span>Clear</span>
      </button>
    </div>
  )
}

export default ConversationActions
