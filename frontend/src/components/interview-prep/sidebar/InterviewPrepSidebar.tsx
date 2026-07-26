import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Bot,
  Plus,
  Send,
  ArrowRight,
  Brain,
  Code2,
  Database,
  Network,
  Cpu,
  Boxes,
  Award,
  AlertCircle,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils'
import type { AIAssistantConfig } from '@/types/interviewPrep'

export interface InterviewPrepSidebarProps {
  sidebarData?: AIAssistantConfig
  isLoading?: boolean
  isEmpty?: boolean
  isError?: boolean
}

export function InterviewPrepSidebar({
  sidebarData,
  isLoading = false,
  isEmpty = false,
  isError = false,
}: InterviewPrepSidebarProps) {
  const [activeTab, setActiveTab] = useState<'insights' | 'action-plan'>('insights')
  const [inputValue, setInputValue] = useState('')

  const getSkillIcon = (iconName: string) => {
    switch (iconName) {
      case 'Brain':
        return Brain
      case 'Code2':
        return Code2
      case 'Database':
        return Database
      case 'Network':
        return Network
      case 'Cpu':
        return Cpu
      case 'Boxes':
        return Boxes
      default:
        return Brain
    }
  }

  if (isLoading) {
    return (
      <aside className="space-y-4">
        <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-5 space-y-4">
          <Skeleton className="h-8 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </Card>
        <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-5 space-y-3">
          <Skeleton className="h-6 w-full rounded-xl" />
          <Skeleton className="h-36 w-full rounded-xl" />
        </Card>
      </aside>
    )
  }

  if (isError) {
    return (
      <aside className="space-y-4">
        <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-5">
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-300 text-xs font-semibold">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>Failed to load AI Assistant & Insights sidebar.</span>
          </div>
        </Card>
      </aside>
    )
  }

  const data = sidebarData || {
    assistantName: 'Scorelia AI Assistant',
    status: 'Online' as const,
    greeting: 'Hi Dipak! I can help you prepare for your interviews and improve your performance.',
    quickPrompts: [
      'Generate practice questions',
      'Review my last interview',
      'How to answer "Tell me about yourself?"',
      'Explain a technical concept',
    ],
    coreSkills: [
      { label: 'Machine Learning', percentage: 92, iconName: 'Brain' },
      { label: 'Python', percentage: 88, iconName: 'Code2' },
      { label: 'SQL', percentage: 76, iconName: 'Database' },
      { label: 'System Design', percentage: 72, iconName: 'Network' },
      { label: 'Deep Learning', percentage: 61, iconName: 'Cpu' },
      { label: 'Data Structures', percentage: 58, iconName: 'Boxes' },
    ],
    recentPerformance: [
      { id: '1', title: 'AI/ML Engineer Mock', date: 'May 18, 2026', scorePercent: 86 },
      { id: '2', title: 'Machine Learning Mock', date: 'May 16, 2026', scorePercent: 82 },
      { id: '3', title: 'Python Technical Mock', date: 'May 14, 2026', scorePercent: 78 },
    ],
  }

  return (
    <aside className="space-y-4">
      {/* 1. Scorelia AI Assistant Card */}
      <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-5 hover:border-purple-500/30 transition-all">
        <CardHeader className="p-0 pb-4 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-white leading-none">
                {data.assistantName}
              </CardTitle>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-semibold text-emerald-400">{data.status}</span>
              </div>
            </div>
          </div>

          <button className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white rounded-lg transition-all cursor-pointer">
            <Plus className="h-3 w-3" />
            <span>New Chat</span>
          </button>
        </CardHeader>

        <CardContent className="p-0 space-y-3.5">
          {/* Chat Message Bubble */}
          <div className="p-3.5 rounded-xl bg-[#141627] border border-white/5 text-xs text-slate-300 leading-relaxed font-medium">
            {data.greeting}
          </div>

          {/* Quick Prompts */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-400 block">Try asking me:</span>
            <div className="space-y-1.5">
              {data.quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => setInputValue(prompt)}
                  className="w-full text-left p-2 rounded-xl bg-[#141627]/70 hover:bg-purple-600/15 border border-white/5 hover:border-purple-500/30 text-xs text-purple-300 font-medium transition-all cursor-pointer truncate"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Input */}
          <div className="relative pt-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything..."
              className="w-full bg-[#141627] border border-white/10 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 transition-all"
            />
            <button className="absolute right-2 top-3 -translate-y-1/2 p-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-all cursor-pointer">
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* 2. Insights & Action Plan Tab Card */}
      <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-5 hover:border-purple-500/30 transition-all space-y-4">
        {/* Tab Header */}
        <div className="flex items-center border-b border-white/10 pb-2">
          <button
            onClick={() => setActiveTab('insights')}
            className={cn(
              'flex-1 text-center py-1.5 text-xs font-bold transition-all cursor-pointer border-b-2 -mb-2.5',
              activeTab === 'insights'
                ? 'text-purple-400 border-purple-500'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            )}
          >
            Insights
          </button>
          <button
            onClick={() => setActiveTab('action-plan')}
            className={cn(
              'flex-1 text-center py-1.5 text-xs font-bold transition-all cursor-pointer border-b-2 -mb-2.5',
              activeTab === 'action-plan'
                ? 'text-purple-400 border-purple-500'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            )}
          >
            Action Plan
          </button>
        </div>

        {/* Tab Body */}
        {activeTab === 'insights' ? (
          <div className="space-y-5 pt-1">
            {/* Core Skills Progress */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white tracking-tight">
                  Core Skills Progress
                </h4>
                <button className="text-[11px] font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-0.5 cursor-pointer">
                  <span>View all</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>

              <div className="space-y-2.5">
                {data.coreSkills.map((skill, i) => {
                  const Icon = getSkillIcon(skill.iconName)
                  return (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-slate-300 font-medium">
                          <Icon className="h-3.5 w-3.5 text-purple-400" />
                          <span>{skill.label}</span>
                        </div>
                        <span className="font-bold text-white font-mono">{skill.percentage}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.percentage}%` }}
                          transition={{ duration: 0.5, delay: i * 0.05 }}
                          className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Recent Performance */}
            <div className="space-y-3 pt-2 border-t border-white/5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white tracking-tight">
                  Recent Performance
                </h4>
                <button className="text-[11px] font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-0.5 cursor-pointer">
                  <span>View all</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>

              <div className="space-y-2">
                {data.recentPerformance.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#141627] border border-white/5 hover:border-white/15 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                        <Award className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block leading-tight">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium block">
                          {item.date}
                        </span>
                      </div>
                    </div>

                    <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px] font-bold rounded-lg px-2 py-0.5 font-mono">
                      {item.scorePercent}%
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center text-slate-400 text-xs font-medium space-y-2">
            <p>Your personalized action plan is updated weekly.</p>
            <Button className="px-3 py-1 text-xs font-bold text-white bg-purple-600 rounded-lg">
              View Action Tasks
            </Button>
          </div>
        )}
      </Card>

      {/* 3. Try Interview Copilot CTA */}
      <Button className="w-full py-3 text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-900/30 rounded-2xl transition-all cursor-pointer border-none flex items-center justify-center gap-2">
        <span>Try Interview Copilot</span>
        <ArrowRight className="h-4 w-4" />
      </Button>
    </aside>
  )
}
export default InterviewPrepSidebar
