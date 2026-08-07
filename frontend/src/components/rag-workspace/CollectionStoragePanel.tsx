import React from 'react'
import { HardDrive, Server, Layers, Cpu, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface CollectionStoragePanelProps {
  className?: string
}

export function CollectionStoragePanel({ className }: CollectionStoragePanelProps) {
  const collectionAllocations = [
    { name: 'System Architecture', size: '4.8 GB', percentage: 42, color: 'bg-purple-500' },
    { name: 'Core APIs & Protocols', size: '3.2 GB', percentage: 28, color: 'bg-indigo-500' },
    { name: 'Career Knowledge Base', size: '2.1 GB', percentage: 18, color: 'bg-cyan-500' },
    { name: 'User Resumes & Profiles', size: '1.4 GB', percentage: 12, color: 'bg-emerald-500' },
  ]

  return (
    <div className={cn('space-y-4 text-left select-none', className)}>
      {/* Main Storage Allocation Card */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-inner">
              <HardDrive size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Vector Storage Allocation</h3>
              <p className="text-[11px] font-medium text-slate-400">ChromaDB + HNSW Index Storage</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
            <ShieldCheck size={11} /> Healthy
          </span>
        </div>

        {/* Global Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-white font-bold">11.5 GB Used</span>
            <span className="text-slate-400">of 50.0 GB (23%)</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-950 border border-slate-800 overflow-hidden flex">
            {collectionAllocations.map((col, idx) => (
              <div
                key={idx}
                style={{ width: `${col.percentage}%` }}
                className={cn('h-full transition-all duration-500', col.color)}
                title={`${col.name}: ${col.size}`}
              />
            ))}
          </div>
        </div>

        {/* Collection Breakdown List */}
        <div className="space-y-2.5 pt-2">
          {collectionAllocations.map((col, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className={cn('w-2.5 h-2.5 rounded-full shrink-0', col.color)} />
                <span className="font-semibold text-slate-200 truncate max-w-[140px]">{col.name}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-slate-400 font-mono text-[11px]">{col.size}</span>
                <span className="font-bold text-purple-400 text-[11px] w-8 text-right">{col.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vector Engine Health & Metrics Summary */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md space-y-3">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Server size={13} className="text-purple-400" />
          Vector Storage Engine Stats
        </h4>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <Layers size={11} className="text-indigo-400" /> Index Type
            </div>
            <div className="font-bold text-white text-xs mt-0.5 font-mono">HNSW Lib</div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <Cpu size={11} className="text-cyan-400" /> Memory Footprint
            </div>
            <div className="font-bold text-white text-xs mt-0.5 font-mono">842 MB RAM</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CollectionStoragePanel
