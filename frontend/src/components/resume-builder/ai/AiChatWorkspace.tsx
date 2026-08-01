import React, { useState } from 'react'
import { Bot, Send, Trash2, Plus, Sparkles, User, RefreshCw } from 'lucide-react'
import { AiPromptLibrary } from './AiPromptLibrary'
import { AiStreamingCursor, AiEmptyState } from './AiStates'
import { cn } from '@/lib/utils'

export interface ChatMessage {
  id: string
  sender: 'user' | 'assistant'
  text: string
  timestamp: string
  isStreaming?: boolean
}

export const AiChatWorkspace: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: 'Hi Dipak! I am Scorelia AI. I can analyze your resume against target ATS schemas, rewrite bullet points with action verbs, and suggest high-impact keywords.',
      timestamp: '11:15 AM',
    },
  ])
  const [inputPrompt, setInputPrompt] = useState<string>('')
  const [isThinking, setIsThinking] = useState<boolean>(false)

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputPrompt
    if (!text.trim()) return

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    setInputPrompt('')
    setIsThinking(true)

    // Simulate AI response stream
    setTimeout(() => {
      setIsThinking(false)
      const aiReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: `Here is an optimized version based on your request:\n\n"Pioneered end-to-end AI pipelines for video deepfake detection, scaling model throughput by 35% with PyTorch & FastAPI."`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, aiReply])
    }, 1200)
  }

  const handleClearChat = () => {
    setMessages([])
  }

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden text-left font-sans p-4 space-y-3">
      {/* Top Controls Bar (Fixed Header with unclipped padding and vertical centering) */}
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-border-subtle/30 py-2 min-h-[48px] shrink-0 overflow-visible transition-colors">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 rounded-xl bg-purple-100 dark:bg-purple-600/30 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-500/40 shrink-0 flex items-center justify-center">
            <Bot size={16} />
          </div>
          <div className="flex flex-col justify-center min-w-0 py-0.5">
            <div className="flex items-center gap-1.5 leading-tight">
              <span className="text-xs font-bold text-slate-900 dark:text-white font-display leading-tight truncate">Scorelia AI Workspace</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse shrink-0" />
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono leading-tight truncate">Model: GPT-4o / Claude 3.5 Sonnet</span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handleClearChat}
            className="p-1.5 rounded-lg text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-slate-200 dark:hover:bg-white/5 transition-colors cursor-pointer focus:outline-none"
            title="Clear Chat Thread"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Messages Thread Container (Fills All Available Remaining Space & Scrolls) */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
        {messages.length === 0 ? (
          <AiEmptyState />
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex items-start gap-2.5 max-w-[92%]',
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              )}
            >
              {/* Avatar */}
              <div
                className={cn(
                  'w-7 h-7 rounded-[10px] flex items-center justify-center shrink-0 text-xs font-bold font-mono',
                  msg.sender === 'user'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-200 dark:bg-surface-l4 text-purple-700 dark:text-purple-300 border border-slate-300 dark:border-purple-500/30'
                )}
              >
                {msg.sender === 'user' ? <User size={13} /> : <Bot size={13} />}
              </div>

              {/* Message Bubble */}
              <div
                className={cn(
                  'p-3 rounded-[10px] text-xs leading-relaxed font-sans shadow-sm space-y-1',
                  msg.sender === 'user'
                    ? 'bg-purple-600 text-white rounded-tr-none'
                    : 'bg-slate-100 dark:bg-surface-l3 text-slate-900 dark:text-slate-200 border border-slate-200 dark:border-border-subtle rounded-tl-none'
                )}
              >
                <p className="m-0 whitespace-pre-wrap">{msg.text}</p>
                {msg.isStreaming && <AiStreamingCursor />}
                <div
                  className={cn(
                    'text-[9px] font-mono pt-1 text-right',
                    msg.sender === 'user' ? 'text-purple-200' : 'text-slate-500 dark:text-slate-400'
                  )}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))
        )}

        {/* Thinking Skeleton */}
        {isThinking && (
          <div className="flex items-center gap-2 p-2.5 rounded-[10px] bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-500/20 text-xs text-purple-800 dark:text-purple-300">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-purple-600 dark:border-purple-400 border-t-transparent animate-spin shrink-0" />
            <span className="font-mono text-[11px] animate-pulse">Scorelia AI is composing response...</span>
          </div>
        )}
      </div>

      {/* Bottom Anchored Section (Suggested Prompts + Prompt Input Pinned via mt-auto shrink-0) */}
      <div className="mt-auto shrink-0 space-y-3 pt-1">
        <AiPromptLibrary onSelectPrompt={(prompt) => handleSendMessage(prompt)} />

        <div className="relative flex items-center w-full">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            placeholder="Ask Scorelia AI to improve your resume..."
            className="w-full h-10 bg-slate-50 dark:bg-surface-l3 border border-slate-300/80 dark:border-border-subtle/80 rounded-[10px] pl-3.5 pr-11 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 caret-purple-600 dark:caret-purple-400 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus-visible:ring-2 focus-visible:ring-purple-500/80 transition-colors shadow-inner"
          />
          <button
            type="button"
            onClick={() => handleSendMessage()}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white cursor-pointer hover:opacity-95 active:scale-95 transition-all shadow-sm flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/80 shrink-0"
            title="Send prompt"
            aria-label="Send prompt"
          >
            <Send size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}
