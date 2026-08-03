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
      text: "Hi Dipak! 👋\nLet's optimize your resume for ATS, recruiters, and your target role. Choose a prompt below or ask me anything.",
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
    <div className="flex flex-col h-full min-h-0 overflow-hidden text-left font-sans p-4 space-y-3.5 bg-[#0b0c14]">
      {/* Top Controls Bar (Fixed Header) */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 min-h-[48px] shrink-0 overflow-visible">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 shrink-0 flex items-center justify-center shadow-xs">
            <Bot size={16} />
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-white tracking-tight leading-tight truncate">Scorelia AI Workspace</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" title="Online" />
            </div>
            <span className="text-[10px] text-slate-400 font-mono font-medium leading-tight truncate mt-0.5">Model: GPT-4o / Claude 3.5 Sonnet</span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handleClearChat}
            className="p-1.5 rounded-lg text-slate-400 hover:text-pink-400 hover:bg-slate-800/80 transition-colors cursor-pointer focus:outline-none"
            title="Clear Chat Thread"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Messages Thread Container */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
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
                  'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold font-mono transition-all',
                  msg.sender === 'user'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-gradient-to-br from-purple-600 to-indigo-700 text-white border border-purple-400/30 shadow-md shadow-purple-500/20'
                )}
              >
                {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>

              {/* Message Bubble */}
              <div
                className={cn(
                  'p-4 rounded-[18px] text-xs sm:text-[13px] leading-relaxed font-sans space-y-1 transition-all',
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-tr-none shadow-md shadow-purple-950/30 font-semibold'
                    : 'bg-gradient-to-br from-purple-950/40 via-[#121424] to-indigo-950/30 text-slate-100 border border-purple-500/30 hover:border-purple-500/50 rounded-tl-none shadow-md shadow-purple-950/40 font-medium'
                )}
              >
                <p className="m-0 whitespace-pre-wrap">{msg.text}</p>
                {msg.isStreaming && <AiStreamingCursor />}
                <div
                  className={cn(
                    'text-[10px] font-mono mt-2 text-right',
                    msg.sender === 'user' ? 'text-purple-200' : 'text-purple-300/70'
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
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-purple-950/30 border border-purple-500/30 text-xs text-purple-300">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-purple-400 border-t-transparent animate-spin shrink-0" />
            <span className="font-mono text-[11px] animate-pulse">Scorelia AI is composing response...</span>
          </div>
        )}
      </div>

      {/* Bottom Anchored Section (Suggested Prompts + Scorelia Chat Input) */}
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
            className="w-full h-10 bg-[#0e101c] border border-slate-800/90 hover:border-slate-700/80 rounded-xl pl-3.5 pr-11 text-xs font-semibold text-white placeholder:text-slate-400/80 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 shadow-inner box-border"
          />
          <button
            type="button"
            onClick={() => handleSendMessage()}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white cursor-pointer hover:opacity-95 hover:scale-[1.03] active:scale-95 transition-all duration-200 shadow-md shadow-purple-950/40 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 shrink-0"
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
