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
        'p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] text-left space-y-4 font-sans backdrop-blur-md select-none',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-[var(--border)] pb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
            <Layers size={18} />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-[var(--heading)] truncate">{node.label}</h3>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[var(--surface-hover)] border border-[var(--border)] text-purple-400">
              {node.type}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--heading)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer border-none"
          aria-label="Close Inspector"
        >
          <X size={16} />
        </button>
      </div>

      {/* Node Description */}
      {node.description && (
        <div className="p-3 rounded-xl bg-[var(--surface-hover)] border border-[var(--border)] text-xs text-[var(--heading)] leading-relaxed">
          {node.description}
        </div>
      )}

      {/* Metadata Metrics */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 rounded-xl bg-[var(--surface-hover)] border border-[var(--border)] space-y-0.5">
          <span className="text-[10px] text-[var(--muted)] uppercase font-mono block">Connected Edges</span>
          <span className="font-bold text-[var(--heading)] font-mono block">{node.connectedCount} Nodes</span>
        </div>

        {node.similarityScore !== undefined && (
          <div className="p-2.5 rounded-xl bg-[var(--surface-hover)] border border-[var(--border)] space-y-0.5">
            <span className="text-[10px] text-[var(--muted)] uppercase font-mono block">Similarity Score</span>
            <ConfidenceBadge score={node.similarityScore} />
          </div>
        )}
      </div>

      {/* Owner & Timestamps */}
      <div className="space-y-1.5 text-xs text-[var(--muted)] font-mono pt-1 border-t border-[var(--border)]">
        {node.owner && (
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1"><User size={12} /> Owner</span>
            <strong className="text-[var(--heading)]">{node.owner}</strong>
          </div>
        )}
        {node.created && (
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1"><Clock size={12} /> Created</span>
            <strong className="text-[var(--heading)]">{node.created}</strong>
          </div>
        )}
      </div>

      {/* Quick Action Buttons */}
      <div className="flex items-center gap-2 pt-2">
        <button
          type="button"
          onClick={() => onFocusNode?.(node.id)}
          className="flex-1 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-900/40 cursor-pointer flex items-center justify-center gap-1.5 border-none min-h-[38px]"
        >
          <Target size={14} />
          <span>Focus Node</span>
        </button>

        <button
          type="button"
          className="py-2 px-3 rounded-xl bg-[var(--surface-hover)] border border-[var(--border)] hover:border-purple-500/30 text-[var(--heading)] text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 min-h-[38px]"
        >
          <ExternalLink size={14} />
          <span>Open</span>
        </button>
      </div>
    </div>
  )
}

export default NodeInspector

