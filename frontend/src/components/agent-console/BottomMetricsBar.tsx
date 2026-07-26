import React from 'react'
import { HardDrive, Cpu, Zap, BookOpen, ShieldCheck, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface BottomMetricsBarProps {
  className?: string
}

export function BottomMetricsBar({ className }: BottomMetricsBarProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 p-4 rounded-2xl bg-[#0e101d] border border-white/10 text-left shadow-xl',
        className
      )}
    >
      {/* 1. Storage Used */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-[#141628] border border-white/5">
        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
          <HardDrive size={18} />
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex justify-between text-[11px] font-semibold">
            <span className="text-slate-400">Storage Used</span>
            <span className="text-white font-bold">1.2 GB <span className="text-slate-500 font-normal">/ 10 GB</span></span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full" style={{ width: '12%' }} />
          </div>
        </div>
      </div>

      {/* 2. API Calls */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-[#141628] border border-white/5">
        <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
          <Cpu size={18} />
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex justify-between text-[11px] font-semibold">
            <span className="text-slate-400">API Calls (Today)</span>
            <span className="text-white font-bold">342 <span className="text-slate-500 font-normal">/ 1,000</span></span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-400 rounded-full" style={{ width: '34.2%' }} />
          </div>
        </div>
      </div>

      {/* 3. Automations Running */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-[#141628] border border-white/5">
        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
          <Zap size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[11px] font-semibold text-slate-400 block">Automations Running</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-black text-white">6</span>
            <span className="text-[10px] text-slate-400">Active workflows</span>
          </div>
        </div>
      </div>

      {/* 4. Knowledge Base Size */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-[#141628] border border-white/5">
        <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
          <BookOpen size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[11px] font-semibold text-slate-400 block">Knowledge Base Size</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-black text-white">12,540</span>
            <span className="text-[10px] text-slate-400">Documents</span>
          </div>
        </div>
      </div>

      {/* 5. System Status */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-[#141628] border border-white/5">
        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
          <ShieldCheck size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[11px] font-semibold text-slate-400 block">System Status</span>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-200">All Systems Operational</span>
          </div>
        </div>
      </div>

      {/* 6. Auto-refresh Toggle */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-[#141628] border border-white/5">
        <div className="flex items-center gap-2">
          <RefreshCw size={15} className="text-slate-400 animate-spin-slow" />
          <span className="text-xs font-semibold text-slate-300">Auto-refresh</span>
        </div>
        <div className="inline-flex items-center p-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold px-2 py-0.5">
          <span>On</span>
        </div>
      </div>
    </div>
  )
}

export default BottomMetricsBar
