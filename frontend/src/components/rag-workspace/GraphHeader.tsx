import React from 'react'
import { Network, Database, Layers, GitFork } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface GraphHeaderProps {
  currentCollection?: string
  totalNodes?: number
  totalRelationships?: number
  className?: string
}

export function GraphHeader({
  currentCollection = 'AI Research Papers',
  totalNodes = 35,
  totalRelationships = 45,
  className
}: GraphHeaderProps) {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left', className)}>
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 font-sans">
          <Network className="w-5 h-5 text-purple-400 shrink-0" />
          Knowledge Graph
        </h2>
        <p className="text-xs text-slate-400">
          Visualize relationships between collections, documents, entities, and embeddings.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
        {/* Active Collection Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 font-medium">
          <Database size={13} className="shrink-0" />
          <span>{currentCollection}</span>
        </div>

        {/* Nodes Count */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold">
          <Layers size={13} className="shrink-0" />
          <span>{totalNodes} Nodes</span>
        </div>

        {/* Relationships Count */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">
          <GitFork size={13} className="shrink-0" />
          <span>{totalRelationships} Edges</span>
        </div>
      </div>
    </div>
  )
}

export default GraphHeader
