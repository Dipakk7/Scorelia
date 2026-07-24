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
    <div className="flex flex-col h-full space-y-3 text-left font-sans">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-purple-600/30 text-purple-300 border border-purple-500/40">
            <Bot size={16} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white font-display">Scorelia AI Workspace</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Model: GPT-4o / Claude 3.5 Sonnet</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleClearChat}
            className="p-1.5 rounded-lg text-slate-400 hover:text-pink-400 hover:bg-white/5 transition-colors cursor-pointer"
            title="Clear Chat Thread"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Messages Thread Container */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[360px] custom-scrollbar">
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
                  'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold font-mono',
                  msg.sender === 'user'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-800 text-purple-300 border border-purple-500/30'
                )}
              >
                {msg.sender === 'user' ? <User size={13} /> : <Bot size={13} />}
              </div>

              {/* Message Bubble */}
              <div
                className={cn(
                  'p-3 rounded-xl text-xs leading-relaxed font-sans shadow-sm space-y-1',
                  msg.sender === 'user'
                    ? 'bg-purple-600 text-white rounded-tr-none'
                    : 'bg-slate-900/90 text-slate-200 border border-white/10 rounded-tl-none'
                )}
              >
                <p className="m-0 whitespace-pre-wrap">{msg.text}</p>
                {msg.isStreaming && <AiStreamingCursor />}
                <div
                  className={cn(
                    'text-[9px] font-mono pt-1 text-right',
                    msg.sender === 'user' ? 'text-purple-200' : 'text-slate-400'
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
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-purple-300">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-purple-400 border-t-transparent animate-spin shrink-0" />
            <span className="font-mono text-[11px] animate-pulse">Scorelia AI is composing response...</span>
          </div>
        )}
      </div>

      {/* Suggested Prompt Chips */}
      <AiPromptLibrary onSelectPrompt={(prompt) => handleSendMessage(prompt)} />

      {/* Prompt Composer Box */}
      <div className="relative flex items-center pt-1">
        <textarea
          rows={2}
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSendMessage()
            }
          }}
          placeholder="Ask Scorelia AI to improve your resume..."
          className="w-full bg-slate-950/90 border border-white/10 rounded-xl pl-3 pr-10 py-2.5 text-xs font-medium text-slate-100 focus:outline-none focus:border-purple-500/80 resize-none"
        />
        <button
          type="button"
          onClick={() => handleSendMessage()}
          className="absolute right-2 top-3 p-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white cursor-pointer hover:opacity-90 transition-opacity shadow-sm"
        >
          <Send size={13} />
        </button>
      </div>
    </div>
  )
}
