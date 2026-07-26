import React, { useState } from 'react'
import { AIAssistant } from './AIAssistant'
import {
  Sparkles,
  ArrowRight,
  FilePlus,
  FolderPlus,
  Target,
  Network
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function SidebarContainer() {
  const [activeTab, setActiveTab] = useState<'insights' | 'actionPlan'>('insights')

  const recentQueries = [
    { query: 'What is gradient descent?', time: 'Today, 10:24 AM', score: 'High (0.96)', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    { query: 'Explain Docker containers', time: 'Today, 09:45 AM', score: 'Medium (0.62)', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    { query: 'How does attention mechanism work?', time: 'Today, 08:30 AM', score: 'High (0.91)', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    { query: 'Kubernetes best practices', time: 'May 17, 2026', score: 'Low (0.31)', badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
    { query: 'What is vector embedding?', time: 'May 17, 2026', score: 'High (0.97)', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' }
  ]

  const quickActions = [
    { label: 'Add Documents', sub: 'Upload & index', icon: FilePlus, color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    { label: 'Create Collection', sub: 'Organize knowledge', icon: FolderPlus, color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    { label: 'Test Retrieval', sub: 'Evaluate results', icon: Target, color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    { label: 'View Knowledge Graph', sub: 'Visualize relationships', icon: Network, color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' }
  ]

  return (
    <div className="space-y-6">
      {/* 1. Interactive AI Assistant Module */}
      <AIAssistant />

      {/* 2. Insights & Action Plan Card */}
      <div className="p-5 rounded-2xl bg-[#0e0f1a]/90 border border-white/10 shadow-lg text-left space-y-4">
        <div className="flex items-center gap-4 border-b border-white/10 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('insights')}
            className={cn(
              'text-xs font-bold transition-colors relative pb-1 cursor-pointer',
              activeTab === 'insights' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-slate-400 hover:text-slate-200'
            )}
          >
            Insights
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('actionPlan')}
            className={cn(
              'text-xs font-bold transition-colors relative pb-1 cursor-pointer',
              activeTab === 'actionPlan' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-slate-400 hover:text-slate-200'
            )}
          >
            Action Plan
          </button>
        </div>

        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Recent Queries</h4>
          <button type="button" className="text-[11px] font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer">
            <span>View all</span>
            <ArrowRight size={12} />
          </button>
        </div>
        <p className="text-[11px] text-slate-400 -mt-2">Relevance score indicates retrieval confidence</p>

        <div className="space-y-2">
          {recentQueries.map((q, i) => (
            <div key={i} className="p-2.5 rounded-xl bg-[#121320] border border-white/5 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate">{q.query}</p>
                <p className="text-[10px] text-slate-400">{q.time}</p>
              </div>
              <span className={cn('px-2 py-0.5 rounded-md text-[10px] font-mono font-bold shrink-0 border', q.badge)}>
                {q.score}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Quick Actions Card */}
      <div className="p-5 rounded-2xl bg-[#0e0f1a]/90 border border-white/10 shadow-lg text-left space-y-4">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Actions</h4>
        <div className="grid grid-cols-2 gap-2.5">
          {quickActions.map((act, i) => {
            const Icon = act.icon
            return (
              <button
                key={i}
                type="button"
                className="p-3 rounded-xl bg-[#121320] border border-white/5 hover:border-white/20 text-left transition-all group cursor-pointer"
              >
                <div className={cn('p-2 rounded-xl border w-fit mb-2 group-hover:scale-105 transition-transform', act.color)}>
                  <Icon size={16} />
                </div>
                <p className="text-xs font-bold text-slate-200 group-hover:text-purple-300 transition-colors leading-tight">
                  {act.label}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                  {act.sub}
                </p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default SidebarContainer
