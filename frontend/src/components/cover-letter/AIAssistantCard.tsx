import React, { useState } from 'react'
import { Bot, Send, RotateCcw, Sparkles, User, Lightbulb } from 'lucide-react'
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
      text: 'Hi Dipak! I am your AI Writing Coach. I can help refine your paragraphs, explain suggestions, or align your tone for Google. Pick a quick prompt below or ask anything!',
    },
  ])
  const [inputMsg, setInputMsg] = useState('')

  const quickPills = [
    'Explain suggestion #1',
    'Strengthen opening hook',
    'Add quantified metrics',
    'Tailor for Google AI role',
  ]

  const handlePromptClick = (prompt: string) => {
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, sender: 'user', text: prompt }
    const responseText =
      mockAssistantResponses[prompt] ||
      `Analyzing cover letter draft for "${prompt}"... Here is my recommendation: Emphasize your PyTorch and system architecture accomplishments in paragraph 2 to boost your ATS match score to 94%.`

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
        text: 'Chat reset. What aspect of your cover letter would you like to refine next?',
      },
    ])
  }

  return (
    <div className="rounded-2xl bg-[#121426] border border-white/10 bg-gradient-to-br from-[#14162a] via-[#111324] to-[#14162a] p-4 sm:p-5 shadow-lg shadow-purple-950/10 space-y-3.5 text-left">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-purple-400" />
          <h3 className="font-extrabold text-sm text-white tracking-tight m-0">
            Scorelia AI Co-Pilot
          </h3>
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Online
          </span>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer border-none bg-transparent"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Chat History Container */}
      <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 rounded-xl text-xs leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-purple-600 text-white ml-6 font-semibold shadow-sm'
                : 'bg-slate-900/90 text-slate-200 border border-slate-800 mr-3'
            }`}
          >
            <div className="flex items-center gap-1.5 pb-1 mb-1 border-b border-slate-800/60 text-[10px] font-bold text-slate-400">
              {msg.sender === 'user' ? (
                <>
                  <User className="w-3 h-3 text-purple-200" />
                  <span className="text-white">You</span>
                </>
              ) : (
                <>
                  <Bot className="w-3 h-3 text-purple-400" />
                  <span className="text-purple-300">AI Writing Coach</span>
                </>
              )}
            </div>
            {msg.text}
          </div>
        ))}
      </div>

      {/* Prompt Shortcut Chips */}
      <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-400" />
          <span>Suggested Co-Pilot Prompts</span>
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          {quickPills.map((pill) => (
            <button
              key={pill}
              type="button"
              onClick={() => handlePromptClick(pill)}
              className="p-2 rounded-xl text-[11px] font-semibold text-slate-200 bg-slate-900/80 hover:bg-purple-600/20 hover:text-purple-300 border border-slate-800 transition-colors text-center cursor-pointer focus:outline-none truncate"
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
          placeholder="Ask AI writing coach anything..."
          className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 pl-3.5 pr-9 py-2 text-xs font-medium text-white placeholder-slate-500 shadow-sm focus:border-purple-500 focus:outline-none"
        />
        <button
          type="submit"
          className="absolute right-2.5 top-3 text-purple-400 hover:text-white transition-colors cursor-pointer border-none bg-transparent p-0"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  )
}

export default AIAssistantCard
