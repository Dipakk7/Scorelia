import React, { useState } from 'react'
import {
  User,
  Bot,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Code
} from 'lucide-react'
import type { ChatMessage } from '@/data/ragQueryMockData'
import { CitationCard } from './CitationCard'
import { ConfidenceBadge } from './ConfidenceBadge'
import { cn } from '@/lib/utils'

export interface ConversationProps {
  messages: ChatMessage[]
  onRegenerate?: () => void
  onCopyResponse?: (text: string) => void
  className?: string
}

export function Conversation({
  messages,
  onRegenerate,
  onCopyResponse,
  className
}: ConversationProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<Record<string, 'like' | 'dislike'>>({})

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    if (onCopyResponse) onCopyResponse(text)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleFeedback = (id: string, type: 'like' | 'dislike') => {
    setFeedback((prev) => ({
      ...prev,
      [id]: prev[id] === type ? (undefined as any) : type
    }))
  }

  return (
    <div className={cn('space-y-4 text-left custom-scrollbar overflow-y-auto max-h-[600px] pr-1', className)}>
      {messages.map((msg) => {
        const isUser = msg.sender === 'user'

        return (
          <div
            key={msg.id}
            className={cn('flex items-start gap-3 group', isUser ? 'flex-row-reverse' : 'flex-row')}
          >
            {/* Avatar */}
            <div
              className={cn(
                'p-2 rounded-xl shrink-0 flex items-center justify-center border',
                isUser
                  ? 'bg-purple-600/20 border-purple-500/30 text-purple-300'
                  : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
              )}
            >
              {isUser ? <User size={16} /> : <Bot size={16} />}
            </div>

            {/* Bubble Container */}
            <div className={cn('max-w-[85%] space-y-2', isUser ? 'text-right' : 'text-left')}>
              {/* Sender & Timestamp Header */}
              <div className={cn('flex items-center gap-2 text-[10px] text-slate-400 font-mono', isUser && 'justify-end')}>
                <span className="font-bold text-slate-300">{isUser ? 'You' : 'Scorelia AI'}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
                {msg.confidenceScore && (
                  <ConfidenceBadge score={msg.confidenceScore} />
                )}
              </div>

              {/* Message Content Card */}
              <div
                className={cn(
                  'p-4 rounded-2xl text-xs sm:text-sm leading-relaxed border font-sans shadow-md',
                  isUser
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-500/30 font-medium'
                    : 'bg-[#121320] text-slate-200 border-white/10'
                )}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Optional Code Snippet Block */}
                {msg.codeSnippet && (
                  <div className="mt-3 p-3 rounded-xl bg-[#0b0c14] border border-white/10 font-mono text-xs text-slate-300 relative group/code overflow-x-auto custom-scrollbar text-left">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pb-1.5 border-b border-white/5 mb-2 select-none">
                      <span className="flex items-center gap-1 font-bold text-purple-400">
                        <Code size={12} /> TypeScript Code Snippet
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(`${msg.id}-code`, msg.codeSnippet!)}
                        className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        {copiedId === `${msg.id}-code` ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        <span>{copiedId === `${msg.id}-code` ? 'Copied' : 'Copy code'}</span>
                      </button>
                    </div>
                    <pre className="text-[11px] leading-relaxed">{msg.codeSnippet}</pre>
                  </div>
                )}

                {/* Inline Citations */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/10 space-y-2 text-left">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Referenced Sources ({msg.citations.length})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.citations.map((cit) => (
                        <CitationCard key={cit.id} citation={cit} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Message Actions Bar (for Assistant) */}
              {!isUser && (
                <div className="flex items-center gap-2 pt-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => handleCopy(msg.id, msg.content)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                    title="Copy response text"
                  >
                    {copiedId === msg.id ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFeedback(msg.id, 'like')}
                    className={cn(
                      'p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer',
                      feedback[msg.id] === 'like' && 'text-emerald-400 bg-emerald-500/10'
                    )}
                    aria-label="Like response"
                  >
                    <ThumbsUp size={13} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFeedback(msg.id, 'dislike')}
                    className={cn(
                      'p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer',
                      feedback[msg.id] === 'dislike' && 'text-rose-400 bg-rose-500/10'
                    )}
                    aria-label="Dislike response"
                  >
                    <ThumbsDown size={13} />
                  </button>

                  {onRegenerate && (
                    <button
                      type="button"
                      onClick={onRegenerate}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-purple-600/30 text-slate-400 hover:text-purple-300 text-[11px] flex items-center gap-1 transition-colors cursor-pointer ml-auto"
                    >
                      <RotateCcw size={13} />
                      <span>Regenerate</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Conversation
