import React, { useState } from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from '@/components/ui/Drawer'
import { StatusBadge } from './StatusBadge'
import { SuccessProgress } from './SuccessProgress'
import DeleteDialog from '@/components/ui/DeleteDialog'
import type { AgentConsoleItem } from '@/data/agentConsoleMockData'
import { Bot, Pause, Play, Copy, Trash2, CheckCircle2, Clock, Zap, Database } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AgentDetailsDrawerProps {
  agent: AgentConsoleItem | null
  isOpen: boolean
  onClose: () => void
  onTogglePause?: (agentId: string) => void
  onDeleteAgent?: (agentId: string) => void
}

export function AgentDetailsDrawer({
  agent,
  isOpen,
  onClose,
  onTogglePause,
  onDeleteAgent,
}: AgentDetailsDrawerProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  if (!agent) return null

  const isPaused = agent.status === 'paused'

  const handleConfirmDelete = async () => {
    onDeleteAgent?.(agent.id)
    onClose()
  }

  return (
    <>
      <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent className="max-w-lg bg-[#0e101d] border-l border-white/10 p-6 overflow-y-auto text-left font-sans text-slate-200">
          {/* Header Area */}
          <DrawerHeader className="space-y-4 text-left border-b border-white/10 pb-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={cn('h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0', agent.iconBg)}>
                  <Bot size={24} />
                </div>
                <div>
                  <DrawerTitle className="text-xl font-bold text-white tracking-tight">
                    {agent.name}
                  </DrawerTitle>
                  <span className="text-xs font-semibold text-purple-400 font-mono">
                    Category: {agent.category}
                  </span>
                </div>
              </div>
              <StatusBadge status={agent.status} />
            </div>
            <DrawerDescription className="text-xs text-slate-300 leading-relaxed font-normal">
              {agent.description}
            </DrawerDescription>
          </DrawerHeader>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 my-5">
            <div className="p-3 rounded-xl bg-[#141628] border border-white/5 space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Tasks Completed</span>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-blue-400" />
                <span className="text-base font-black text-white">{agent.tasksCompleted}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#141628] border border-white/5 space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Success Rate</span>
              <SuccessProgress rate={agent.successRate} />
            </div>

            <div className="p-3 rounded-xl bg-[#141628] border border-white/5 space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Avg Response</span>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-amber-400" />
                <span className="text-base font-black text-white">{agent.avgResponseTime}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#141628] border border-white/5 space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Credits Used</span>
              <div className="flex items-center gap-2">
                <Database size={16} className="text-purple-400" />
                <span className="text-base font-black text-white">{agent.creditsUsed}</span>
              </div>
            </div>
          </div>

          {/* Capabilities Section */}
          <div className="space-y-2 mb-5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Agent Capabilities</h4>
            <div className="flex flex-wrap gap-1.5">
              {agent.capabilities.map((cap) => (
                <span
                  key={cap}
                  className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[11px] font-medium"
                >
                  {cap}
                </span>
              ))}
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="space-y-2.5 mb-6">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Recent Activity Audit</h4>
            <div className="space-y-2">
              {agent.recentActivity.map((act) => (
                <div key={act.id} className="p-2.5 rounded-xl bg-[#141628] border border-white/5 flex items-start justify-between gap-2 text-xs">
                  <span className="text-slate-300 leading-snug">{act.action}</span>
                  <span className="text-[10px] font-mono text-slate-500 shrink-0">{act.timestamp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Footer */}
          <DrawerFooter className="border-t border-white/10 pt-4 flex-row gap-2">
            <button
              type="button"
              onClick={() => onTogglePause?.(agent.id)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#141628] border border-white/10 hover:border-white/20 text-slate-200 text-xs font-bold transition-all cursor-pointer"
            >
              {isPaused ? <Play size={14} className="text-emerald-400" /> : <Pause size={14} className="text-amber-400" />}
              <span>{isPaused ? 'Resume' : 'Pause'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowDeleteDialog(true)}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 text-xs font-bold transition-all cursor-pointer"
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <DeleteDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        title={`Delete "${agent.name}"?`}
        description="Are you sure you want to delete this AI agent permanently?"
      />
    </>
  )
}

export default AgentDetailsDrawer
