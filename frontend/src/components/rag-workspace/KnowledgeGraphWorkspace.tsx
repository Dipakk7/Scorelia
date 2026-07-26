import React, { useState } from 'react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { useScoreliaReducedMotion } from '@/lib/motion'
import type { GraphNode, NodeType } from '@/data/ragKnowledgeGraphMockData'
import { useRAGKnowledgeGraph } from '@/hooks/useRAGKnowledgeGraph'
import { GraphHeader } from './GraphHeader'
import { GraphToolbar } from './GraphToolbar'
import type { GraphLayoutMode } from './GraphToolbar'
import { GraphCanvas } from './GraphCanvas'
import { NodeInspector } from './NodeInspector'
import { cn } from '@/lib/utils'

export interface KnowledgeGraphWorkspaceProps {
  className?: string
}

export function KnowledgeGraphWorkspace({ className }: KnowledgeGraphWorkspaceProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const { nodes, edges } = useRAGKnowledgeGraph()

  const [zoomLevel, setZoomLevel] = useState(1.0)
  const [layoutMode, setLayoutMode] = useState<GraphLayoutMode>('Force')
  const [nodeTypeFilter, setNodeTypeFilter] = useState<NodeType | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showLegend, setShowLegend] = useState(true)
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.15, 2.0))
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.15, 0.5))
  const handleResetView = () => {
    setZoomLevel(1.0)
    setSelectedNode(null)
    setSearchQuery('')
    setNodeTypeFilter('all')
  }

  const containerVariants: Variants = {
    hidden: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-label="Knowledge Graph Workspace"
      className={cn('space-y-6 text-left', className)}
    >
      {/* 1. Header */}
      <GraphHeader
        totalNodes={nodes.length}
        totalRelationships={edges.length}
      />

      {/* 2. Toolbar */}
      <GraphToolbar
        zoomLevel={zoomLevel}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetView={handleResetView}
        onFitToScreen={handleResetView}
        layoutMode={layoutMode}
        onLayoutModeChange={setLayoutMode}
        selectedNodeType={nodeTypeFilter}
        onNodeTypeFilterChange={setNodeTypeFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showLegend={showLegend}
        onToggleLegend={() => setShowLegend(!showLegend)}
      />

      {/* 3. Main Graph Grid (Canvas + Node Inspector Side Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className={cn(selectedNode ? 'lg:col-span-8' : 'lg:col-span-12', 'transition-all duration-300')}>
          <GraphCanvas
            nodes={nodes}
            edges={edges}
            selectedNodeId={selectedNode?.id || null}
            onSelectNode={setSelectedNode}
            zoomLevel={zoomLevel}
            showLegend={showLegend}
            searchQuery={searchQuery}
            nodeTypeFilter={nodeTypeFilter}
          />
        </div>

        {selectedNode && (
          <div className="lg:col-span-4">
            <NodeInspector
              node={selectedNode}
              onClose={() => setSelectedNode(null)}
            />
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default KnowledgeGraphWorkspace
