import React, { useState, useRef, useEffect, useMemo } from 'react'
import { MessageBubble } from './MessageBubble'
import { Send, Search, Sparkles, CornerDownLeft, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatPanelProps {
  messages: Array<{
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
    executionTimeMs?: number
    stepsCount?: number
    error?: boolean
  }>
  onSendMessage: (text: string) => void
  onRegenerate: (messageId: string) => void
  isSubmitting: boolean
  className?: string
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  onSendMessage,
  onRegenerate,
  isSubmitting,
  className,
}) => {
  const [input, setInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const chatBottomRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isSubmitting])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isSubmitting) return
    onSendMessage(input.trim())
    setInput('')
  }

  // Filter messages based on search query
  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) return messages
    return messages.filter((msg) =>
      msg.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [messages, searchQuery])

  // Suggested Prompts/Presets
  const suggestedPrompts = [
    'Optimize my resume for ATS compliance against a Frontend Lead Job Description.',
    'Formulate HR roadmap preparation questions for a Senior Architect role.',
    'Analyze my resume and write a custom company-specific internship cover letter.',
    'Recommend learning resources and certifications to bridge skills in Kubernetes and Go.',
  ]

  return (
    <div className={cn('flex flex-col flex-grow min-h-0 bg-[var(--surface)]/50 backdrop-blur-md rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm transition-all duration-300 text-left', className)}>
      {/* Search Header Panel */}
      <div className="px-5 py-3 border-b border-[var(--border)]/60 flex items-center justify-between gap-4 bg-[var(--surface)]/50 backdrop-blur-md text-left select-none">
        <span className="text-xs font-bold text-[var(--heading)] font-sans flex items-center gap-1.5 leading-none">
          <Sparkles size={13} className="text-[var(--primary)]" />
          <span>Interactive Orchestrator Console</span>
        </span>

        {/* Local Searchbox */}
        <div className="relative w-48 sm:w-64">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
          <input
            type="text"
            placeholder="Search chat transcript..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-[var(--border)] bg-[var(--background)]/60 rounded-lg text-[10px] font-sans text-[var(--body)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/20 transition-all duration-150 h-8 font-medium"
          />
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin text-left">
        {filteredMessages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            onRegenerate={() => onRegenerate(msg.id)}
          />
        ))}

        {/* Loading state bubble */}
        {isSubmitting && (
          <div className="flex gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] items-center select-none font-sans text-xs text-left">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
              <RefreshCw size={14} className="animate-spin" />
            </div>
            <div className="flex-1 flex flex-col gap-0.5 text-[var(--body)] leading-normal text-left font-sans font-medium">
              <span className="font-bold text-[var(--heading)]">
                Orchestrator Executing Task...
              </span>
              <span className="text-[9px] text-[var(--muted)] font-mono animate-pulse">
                Parsing variables, analyzing user intent, routing sub-agents...
              </span>
            </div>
          </div>
        )}

        {/* Empty state suggests prompt templates */}
        {filteredMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center select-none h-full max-w-2xl mx-auto">
            <div className="h-14 w-14 rounded-2xl bg-[var(--primary)]/10 border border-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)] mb-5 shadow-inner">
              <Sparkles size={24} className="animate-pulse" />
            </div>

            <h4 className="font-extrabold text-[var(--heading)] text-sm font-sans m-0 leading-none">
              Orchestrate AI Agent Workflows
            </h4>
            <p className="text-xs text-[var(--body)] max-w-md mt-2 leading-relaxed font-sans font-medium">
              Enter a task description to dispatch commands autonomously to ATS, Resume, Job Match, Interview Prep, Cover Letter, Career Coach, and Learning agents.
            </p>

            {/* suggestion grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl w-full mt-6 text-left font-sans">
              {suggestedPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => onSendMessage(prompt)}
                  className="p-3 text-[10px] leading-relaxed font-semibold bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] hover:border-[var(--primary)]/45 rounded-xl transition-all duration-200 cursor-pointer shadow-2xs focus:outline-none text-[var(--body)] hover:text-[var(--heading)] text-left h-full"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Message input footer */}
      <div className="p-4 bg-[var(--surface)]/80 dark:bg-[var(--surface)]/45 backdrop-blur-md border-t border-[var(--border)]/70 select-none">
        <form onSubmit={handleSend} className="relative flex items-center m-0 max-w-4xl mx-auto w-full">
          <input
            type="text"
            placeholder={isSubmitting ? 'Please wait for execution...' : 'Ask the orchestrator to perform an action...'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isSubmitting}
            className="w-full pl-4 pr-12 py-3 bg-[var(--background)] dark:bg-[var(--background)]/60 border border-[var(--border)] rounded-xl text-xs font-sans placeholder-[var(--muted)] text-[var(--heading)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/20 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-2xs h-11 font-medium"
          />

          <button
            type="submit"
            disabled={!input.trim() || isSubmitting}
            className={cn(
              'absolute right-2 p-2 rounded-lg transition-all duration-200 cursor-pointer focus:outline-none border-none disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center h-7 w-7',
              input.trim() && !isSubmitting
                ? 'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] shadow-sm'
                : 'text-[var(--muted)] bg-transparent'
            )}
            aria-label="Send message"
          >
            <Send size={13} />
          </button>
        </form>

        <div className="flex items-center gap-1.5 justify-end mt-2 text-[9px] font-black uppercase tracking-wider text-[var(--muted)] font-sans select-none leading-none max-w-4xl mx-auto w-full">
          <CornerDownLeft size={10} className="text-[var(--muted)]/60" />
          <span>Press Enter to dispatch execution request</span>
        </div>
      </div>
    </div>
  )
}
export default ChatPanel
