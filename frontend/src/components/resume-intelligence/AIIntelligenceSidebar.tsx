import React, { useState } from 'react'
import { Card } from '@/components/ui/Card'
import {
  Bot,
  Plus,
  Send,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Maximize2,
  Sparkles,
  Zap,
  ArrowRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { MOCK_AI_INSIGHTS_DATA } from '@/lib/mock-ai-insights'
import toast from 'react-hot-toast'

interface AIIntelligenceSidebarProps {
  userName?: string
  onSendMessage?: (msg: string) => void
  onSelectPromptPill?: (prompt: string) => void
}

const quickActionTemplates = [
  { label: 'Improve Summary', badge: '+6 ATS' },
  { label: 'Add Achievements', badge: '+5 PTS' },
  { label: 'FAANG Mode', badge: 'Elite' },
  { label: 'Startup Mode', badge: 'Agile' },
  { label: 'Optimize Keywords', badge: '+4 ATS' },
  { label: 'Executive Tone', badge: 'Senior' },
]

export const AIIntelligenceSidebar: React.FC<AIIntelligenceSidebarProps> = ({
  userName = 'Dipak',
  onSendMessage,
  onSelectPromptPill,
}) => {
  const [activeTab, setActiveTab] = useState<'insights' | 'action-plan'>('insights')
  const [inputMessage, setInputMessage] = useState('')
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: `Hi ${userName}! I've analyzed your resume deeply. Here are key insights and recommendations.`,
    },
  ])

  const handleSend = () => {
    if (!inputMessage.trim()) return
    const text = inputMessage.trim()
    setMessages((prev) => [...prev, { sender: 'user', text }])
    onSendMessage?.(text)
    setInputMessage('')
  }

  const handlePillClick = (pill: string) => {
    setInputMessage(pill)
    onSelectPromptPill?.(pill)
    toast.success(`Loaded quick action prompt: ${pill}`)
  }

  return (
    <aside aria-label="AI Assistant and Insights Panel" className="flex flex-col gap-5 h-full">
      {/* 1. Scorelia AI Assistant Card */}
      <Card className="bg-[#0b0c14]/90 border-slate-800/80 p-4 md:p-5 rounded-2xl flex flex-col gap-4 backdrop-blur-md shadow-lg relative overflow-hidden">
        {/* AI Header */}
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400">
              <Bot className="w-4 h-4 text-purple-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-100">Scorelia AI Assistant</span>
                <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() =>
              setMessages([
                {
                  sender: 'ai',
                  text: `Hi ${userName}! I've analyzed your resume deeply. Here are key insights and recommendations.`,
                },
              ])
            }
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Chat Bubbles */}
        <div className="flex flex-col gap-2.5 max-h-44 overflow-y-auto custom-scrollbar pr-1">
          {messages.map((m, i) => (
            <div
              key={i}
              className={cn(
                'p-3 rounded-xl text-xs leading-relaxed max-w-[95%]',
                m.sender === 'ai'
                  ? 'bg-purple-950/30 border border-purple-900/40 text-slate-200 self-start rounded-tl-none'
                  : 'bg-purple-600 text-white font-medium self-end rounded-tr-none'
              )}
            >
              {m.text}
            </div>
          ))}
        </div>

        {/* Quick Action Pills Grid */}
        <div className="grid grid-cols-2 gap-1.5 pt-1">
          {quickActionTemplates.map((item) => (
            <button
              key={item.label}
              onClick={() => handlePillClick(item.label)}
              className="text-left px-2 py-1.5 rounded-lg bg-slate-900/80 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-800/40 text-[11px] font-medium text-slate-300 hover:text-purple-200 transition-all truncate cursor-pointer flex items-center justify-between gap-1"
            >
              <span className="truncate">{item.label}</span>
              <span className="text-[9px] font-bold text-purple-400 shrink-0 font-mono">
                {item.badge}
              </span>
            </button>
          ))}
        </div>

        {/* Chat Input Field */}
        <div className="relative mt-1">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything about your resume..."
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2 pr-9 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
          />
          <button
            onClick={handleSend}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-lg text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
            aria-label="Send Message"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </Card>

      {/* 2. Insights & Action Plan Section */}
      <Card className="bg-[#0b0c14]/90 border-slate-800/80 p-4 md:p-5 rounded-2xl flex flex-col gap-4 backdrop-blur-md shadow-lg flex-1">
        {/* Header Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
          <div className="flex items-center gap-4 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('insights')}
              className={cn(
                'pb-2 relative transition-colors cursor-pointer',
                activeTab === 'insights'
                  ? 'text-white font-bold border-b-2 border-purple-500'
                  : 'text-slate-400 hover:text-slate-200'
              )}
            >
              Insights
            </button>
            <button
              onClick={() => setActiveTab('action-plan')}
              className={cn(
                'pb-2 relative transition-colors flex items-center gap-1.5 cursor-pointer',
                activeTab === 'action-plan'
                  ? 'text-white font-bold border-b-2 border-purple-500'
                  : 'text-slate-400 hover:text-slate-200'
              )}
            >
              <span>Action Plan</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {MOCK_AI_INSIGHTS_DATA.priorityRecommendations.length}
              </span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'insights' ? (
          <div className="flex flex-col gap-4 flex-1">
            {/* Strengths with Confidence indicators */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Strengths</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 font-mono">
                    {MOCK_AI_INSIGHTS_DATA.strengths.length}
                  </span>
                </div>
                <Maximize2 className="w-3 h-3 text-slate-500 cursor-pointer" />
              </div>

              <ul className="flex flex-col gap-2 pt-1">
                {MOCK_AI_INSIGHTS_DATA.strengths.map((item) => (
                  <li key={item.id} className="flex flex-col gap-0.5 text-xs text-slate-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="font-semibold text-slate-200">{item.title}</span>
                      </div>
                      <span className="text-[10px] text-purple-300 font-mono font-bold">
                        {item.confidence}% AI Confidence
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 pl-5 leading-snug">
                      {item.explanation}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* High Priority Improvements */}
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-800/60">
              <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>High Priority Fixes</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/10 text-amber-400 font-mono">
                    {MOCK_AI_INSIGHTS_DATA.priorityRecommendations.length}
                  </span>
                </div>
                <Maximize2 className="w-3 h-3 text-slate-500 cursor-pointer" />
              </div>

              <ul className="flex flex-col gap-2 pt-1">
                {MOCK_AI_INSIGHTS_DATA.priorityRecommendations.map((item) => (
                  <li key={item.id} className="flex flex-col gap-1 p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="font-semibold text-slate-100">{item.title}</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded-full">
                        {item.impactText}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 pl-5 leading-snug">
                      {item.explanation}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 text-xs text-slate-300">
            <p className="text-slate-400">High impact priority action steps for your resume:</p>
            {MOCK_AI_INSIGHTS_DATA.priorityRecommendations.map((rec) => (
              <div key={rec.id} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-2">
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-200">{rec.title}</span>
                  <span className="text-[11px] text-slate-400">{rec.explanation}</span>
                </div>
                <button
                  onClick={() => toast.success(`Executing: ${rec.suggestedAction}`)}
                  className="px-2.5 py-1 rounded-lg bg-purple-600/30 text-purple-300 border border-purple-500/40 text-[10px] font-semibold whitespace-nowrap hover:bg-purple-600/50 transition-colors cursor-pointer"
                >
                  {rec.suggestedAction}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Footer Recruiter Feedback Trust Notice */}
        <div className="pt-3 border-t border-slate-800/60 flex items-start gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <span>All recommendations are based on best practices and real recruiter feedback.</span>
        </div>
      </Card>
    </aside>
  )
}

export default AIIntelligenceSidebar
