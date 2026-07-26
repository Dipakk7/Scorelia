import React from 'react'
import {
  X,
  Layers,
  GitFork,
  ExternalLink,
  Target,
  User,
  Clock,
  Sparkles
} from 'lucide-react'
import type { GraphNode } from '@/data/ragKnowledgeGraphMockData'
import { ConfidenceBadge } from './ConfidenceBadge'
import { cn } from '@/lib/utils'

export interface NodeInspectorProps {
  node: GraphNode | null
  onClose: () => void
  onFocusNode?: (nodeId: string) => void
  className?: string
}

export function NodeInspector({
  node,
  onClose,
  onFocusNode,
  className
}: NodeInspectorProps) {
  if (!node) return null

  return (
    <div
      aria-label="Graph Node Inspector Drawer"
      className={cn(
        'p-5 rounded-2xl bg-[#0e0f1a]/95 border border-white/10 shadow-2xl text-left space-y-4 font-sans backdrop-blur-md',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
            <Layers size={18} />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-white truncate">{node.label}</h3>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 border border-white/10 text-purple-300">
              {node.type}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close Inspector"
        >
          <X size={16} />
        </button>
      </div>

      {/* Node Description */}
      {node.description && (
        <div className="p-3 rounded-xl bg-[#121320] border border-white/5 text-xs text-slate-300 leading-relaxed">
          {node.description}
        </div>
      )}

      {/* Metadata Metrics */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 rounded-xl bg-[#121320] border border-white/5 space-y-0.5">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">Connected Edges</span>
          <span className="font-bold text-slate-200 font-mono block">{node.connectedCount} Nodes</span>
        </div>

        {node.similarityScore !== undefined && (
          <div className="p-2.5 rounded-xl bg-[#121320] border border-white/5 space-y-0.5">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Similarity Score</span>
            <ConfidenceBadge score={node.similarityScore} />
          </div>
        )}
      </div>

      {/* Owner & Timestamps */}
      <div className="space-y-1.5 text-xs text-slate-400 font-mono pt-1 border-t border-white/10">
        {node.owner && (
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1"><User size={12} /> Owner</span>
            <strong className="text-slate-200">{node.owner}</strong>
          </div>
        )}
        {node.created && (
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1"><Clock size={12} /> Created</span>
            <strong className="text-slate-200">{node.created}</strong>
          </div>
        )}
      </div>

      {/* Quick Action Buttons */}
      <div className="flex items-center gap-2 pt-2">
        <button
          type="button"
          onClick={() => onFocusNode?.(node.id)}
          className="flex-1 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-900/40 cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Target size={14} />
          <span>Focus Node</span>
        </button>

        <button
          type="button"
          className="py-2 px-3 rounded-xl bg-[#121320] border border-white/10 hover:border-white/20 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5"
        >
          <ExternalLink size={14} />
          <span>Open</span>
        </button>
      </div>
    </div>
  )
}

export default NodeInspector
