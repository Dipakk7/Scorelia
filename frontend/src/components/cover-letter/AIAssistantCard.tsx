import React, { useState } from 'react'
import { Bot, Send, RotateCcw, Sparkles } from 'lucide-react'
import SidebarCard from './SidebarCard'
import { mockAssistantResponses } from '@/lib/cover-letter-mock-data'

export interface ChatMessage {
  id: string
  sender: 'assistant' | 'user'
  text: string
}

export const AIAssistantCard: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: 'Hi Dipak! I can help optimize your cover letter. Choose a quick action below or ask me any question.',
    },
  ])
  const [inputMsg, setInputMsg] = useState('')

  const quickPills = [
    'Strengthen opening',
    'Add measurable achievements',
    'Improve closing',
    'Increase keyword relevance',
  ]

  const handlePromptClick = (prompt: string) => {
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, sender: 'user', text: prompt }
    const responseText =
      mockAssistantResponses[prompt] ||
      `Analyzing cover letter draft for "${prompt}"... Applied AI refinement suggestion!`

    const assistantMsg: ChatMessage = { id: `a-${Date.now()}`, sender: 'assistant', text: responseText }
    setMessages((prev) => [...prev, userMsg, assistantMsg])
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMsg.trim()) return
    const text = inputMsg
    setInputMsg('')
    handlePromptClick(text)
  }

  const handleReset = () => {
    setMessages([
      {
        id: 'm1',
        sender: 'assistant',
        text: 'Chat reset. What would you like to refine next on your cover letter?',
      },
    ])
  }

  return (
    <SidebarCard
      title={
        <div className="flex items-center gap-2">
          <Bot size={16} className="text-purple-400" />
          <span className="font-extrabold text-sm text-[var(--heading)]">Scorelia AI Assistant</span>
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Online
          </span>
        </div>
      }
      action={
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1 text-[11px] font-semibold text-[var(--muted)] hover:text-[var(--heading)] transition-colors cursor-pointer border-none bg-transparent"
        >
          <RotateCcw size={11} />
          <span>Reset</span>
        </button>
      }
    >
      <div className="space-y-3.5 text-left">
        {/* Chat History Box */}
        <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[var(--primary)] text-white ml-6 font-semibold shadow-sm'
                  : 'bg-[var(--surface-hover)]/70 text-[var(--body)] border border-[var(--border)] mr-4'
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Quick Action Prompt Pills */}
        <div className="space-y-1 pt-1 border-t border-[var(--border)]">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1">
            <Sparkles size={10} className="text-purple-400" />
            <span>Suggested AI Prompts</span>
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {quickPills.map((pill) => (
              <button
                key={pill}
                type="button"
                onClick={() => handlePromptClick(pill)}
                className="p-2 rounded-xl text-[11px] font-semibold text-[var(--heading)] bg-[var(--surface-hover)]/40 hover:bg-[var(--primary)]/15 hover:text-[var(--primary)] border border-[var(--border)] transition-colors text-center cursor-pointer focus:outline-none truncate"
              >
                {pill}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input Form */}
        <form onSubmit={handleSend} className="relative pt-1">
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="Ask anything about your cover letter..."
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/50 pl-3.5 pr-9 py-2 text-xs font-medium text-[var(--heading)] placeholder-[var(--muted)] shadow-sm focus:border-[var(--primary)] focus:outline-none"
          />
          <button
            type="submit"
            className="absolute right-2.5 top-3 text-[var(--primary)] hover:opacity-80 transition-opacity cursor-pointer border-none bg-transparent p-0"
          >
            <Send size={14} />
          </button>
        </form>
      </div>
    </SidebarCard>
  )
}

export default AIAssistantCard
