// frontend/src/components/agents/ChatPanel.tsx

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
    <div className={cn('flex flex-col h-[calc(100vh-160px)] bg-slate-50/40 dark:bg-dark-bg/20 rounded-lg border border-slate-200 dark:border-dark-border overflow-hidden glass-card shadow-md', className)}>
      {/* Search Header Panel */}
      <div className="px-5 py-3 border-b border-slate-200 dark:border-dark-border/40 flex items-center justify-between gap-4 bg-white/60 dark:bg-dark-card/60">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-200 font-display flex items-center gap-1.5">
          <Sparkles size={14} className="text-brand-500" />
          <span>Interactive Orchestrator Chat</span>
        </span>

        {/* Local Searchbox */}
        <div className="relative w-48 sm:w-64">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search chat transcript..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1 border border-slate-200 dark:border-dark-border bg-white dark:bg-slate-900 rounded-md text-xxs font-sans text-slate-700 dark:text-slate-250 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 transition-all duration-150"
          />
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin">
        {filteredMessages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            onRegenerate={() => onRegenerate(msg.id)}
          />
        ))}

        {/* Loading state bubble */}
        {isSubmitting && (
          <div className="flex gap-4 p-5 rounded-lg border border-slate-200 dark:border-dark-border/60 bg-white dark:bg-dark-card shadow-xs items-center select-none font-sans text-xs">
            <div className="h-9 w-9 rounded-md flex items-center justify-center flex-shrink-0 bg-brand-500 text-white border border-brand-600 shadow-md">
              <RefreshCw size={18} className="animate-spin" />
            </div>
            <div className="flex-1 flex flex-col gap-1 text-slate-500 dark:text-slate-400 leading-normal">
              <span className="font-semibold text-slate-655 dark:text-slate-350">
                Orchestrator Executing task...
              </span>
              <span className="text-xxs text-slate-400 font-mono animate-pulse">
                Parsing variables, analyzing user intent, routing sub-agents...
              </span>
            </div>
          </div>
        )}

        {/* Empty state suggests prompt templates */}
        {filteredMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center select-none h-full">
            <div className="h-12 w-12 rounded-md bg-brand-50/50 dark:bg-brand-950/20 border border-brand-100 dark:border-brand-900/10 flex items-center justify-center text-brand-500 mb-4 animate-float">
              <Sparkles size={24} />
            </div>

            <h4 className="font-bold text-slate-800 dark:text-slate-205 text-sm font-display">
              Orchestrate AI Agent Workflows
            </h4>
            <p className="text-xs text-slate-455 max-w-sm mt-1.5 leading-relaxed font-sans">
              Enter a task description to dispatch commands autonomously to ATS, Resume, Job Match, Interview Prep, Cover Letter, Career Coach, and Learning agents.
            </p>

            {/* suggestion grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-xl w-full mt-8 text-left font-sans">
              {suggestedPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => onSendMessage(prompt)}
                  className="p-3 text-xxs leading-relaxed font-medium bg-white dark:bg-dark-card/45 hover:bg-slate-55/70 dark:hover:bg-slate-900 border border-slate-200/80 dark:border-dark-border/60 hover:border-brand-400/40 rounded-md transition-all duration-150 cursor-pointer shadow-xxs focus:outline-none text-slate-600 dark:text-slate-400 dark:hover:text-slate-200"
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
      <div className="p-4 bg-white/60 dark:bg-dark-card/60 border-t border-slate-200 dark:border-dark-border/40 select-none">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            placeholder={isSubmitting ? 'Please wait for execution...' : 'Type orchestration command (e.g. review resume id 123 for software engineer role)...'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isSubmitting}
            className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border rounded-md text-xs font-sans placeholder-slate-405 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/25 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
          />

          <button
            type="submit"
            disabled={!input.trim() || isSubmitting}
            className={cn(
              'absolute right-2.5 p-2 rounded-lg transition-all duration-200 cursor-pointer focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed',
              input.trim() && !isSubmitting
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/10 hover:bg-brand-600'
                : 'text-slate-400 bg-transparent'
            )}
            aria-label="Send message"
          >
            <Send size={14} />
          </button>
        </form>

        <div className="flex items-center gap-1.5 justify-end mt-2 text-xxs text-slate-450 font-sans select-none">
          <CornerDownLeft size={10} />
          <span>Press Enter to dispatch execution request</span>
        </div>
      </div>
    </div>
  )
}
