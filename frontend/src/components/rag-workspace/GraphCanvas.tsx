import React, { useState } from 'react'
import { motion } from 'framer-motion'
import type { GraphNode, GraphEdge, NodeType } from '@/data/ragKnowledgeGraphMockData'
import { useScoreliaReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

export interface GraphCanvasProps {
  nodes: GraphNode[]
  edges: GraphEdge[]
  selectedNodeId: string | null
  onSelectNode: (node: GraphNode | null) => void
  zoomLevel: number
  showLegend: boolean
  searchQuery: string
  nodeTypeFilter: NodeType | 'all'
  className?: string
}

const nodeColorMap: Record<NodeType, { fill: string; stroke: string; text: string; bg: string }> = {
  collection: { fill: '#a855f7', stroke: '#c084fc', text: 'Collection', bg: 'bg-purple-500' },
  document: { fill: '#3b82f6', stroke: '#60a5fa', text: 'Document', bg: 'bg-blue-500' },
  topic: { fill: '#10b981', stroke: '#34d399', text: 'Topic', bg: 'bg-emerald-500' },
  entity: { fill: '#f59e0b', stroke: '#fbbf24', text: 'Entity', bg: 'bg-amber-500' },
  embedding: { fill: '#ec4899', stroke: '#f472b6', text: 'Embedding', bg: 'bg-pink-500' }
}

export function GraphCanvas({
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
  zoomLevel,
  showLegend,
  searchQuery,
  nodeTypeFilter,
  className
}: GraphCanvasProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)

  // Filter nodes based on search & node type filter
  const filteredNodes = nodes.filter((n) => {
    const matchesSearch = !searchQuery || n.label.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = nodeTypeFilter === 'all' || n.type === nodeTypeFilter
    return matchesSearch && matchesType
  })

  const filteredNodeIds = new Set(filteredNodes.map((n) => n.id))

  // Filter edges where both source and target are visible
  const filteredEdges = edges.filter(
    (e) => filteredNodeIds.has(e.source) && filteredNodeIds.has(e.target)
  )

  const nodeMap = new Map(nodes.map((n) => [n.id, n]))

  return (
    <div
      className={cn(
        'relative w-full h-[600px] sm:h-[650px] lg:h-[680px] rounded-2xl bg-[#0b0c14] border border-white/10 overflow-hidden shadow-inner flex items-center justify-center select-none',
        className
      )}
    >
      {/* SVG Interactive Canvas */}
      <svg
        className="w-full h-full cursor-grab active:cursor-grabbing"
        viewBox="0 0 900 620"
        style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center', transition: 'transform 0.2s ease-out' }}
      >
        <defs>
          <radialGradient id="graphBgGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(168, 85, 247, 0.15)" />
            <stop offset="100%" stopColor="rgba(11, 12, 20, 0)" />
          </radialGradient>
        </defs>

        {/* Ambient Canvas Glow */}
        <rect x="0" y="0" width="900" height="550" fill="url(#graphBgGlow)" />

        {/* Render Edges */}
        <g className="edges">
          {filteredEdges.map((edge) => {
            const sourceNode = nodeMap.get(edge.source)
            const targetNode = nodeMap.get(edge.target)
            if (!sourceNode || !targetNode) return null

            const isHighlighted =
              hoveredNodeId === edge.source ||
              hoveredNodeId === edge.target ||
              selectedNodeId === edge.source ||
              selectedNodeId === edge.target

            return (
              <g key={edge.id}>
                <line
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke={isHighlighted ? '#c084fc' : 'rgba(255, 255, 255, 0.15)'}
                  strokeWidth={isHighlighted ? 2.5 : 1.2}
                  strokeDasharray={edge.label === 'vectorized' ? '4 4' : undefined}
                />
              </g>
            )
          })}
        </g>

        {/* Render Nodes */}
        <g className="nodes">
          {filteredNodes.map((node) => {
            const isSelected = node.id === selectedNodeId
            const isHovered = node.id === hoveredNodeId
            const colorConfig = nodeColorMap[node.type] || nodeColorMap.collection

            const radius = node.type === 'collection' ? 18 : node.type === 'document' ? 15 : 12

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => onSelectNode(isSelected ? null : node)}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                className="cursor-pointer transition-transform"
              >
                {/* Outer Glow Ring for Selected / Hovered */}
                {(isSelected || isHovered) && (
                  <circle
                    r={radius + 8}
                    fill="none"
                    stroke={colorConfig.stroke}
                    strokeWidth={2}
                    opacity={0.6}
                    className="animate-pulse"
                  />
                )}

                {/* Node Circle */}
                <circle
                  r={radius}
                  fill={colorConfig.fill}
                  stroke="#0b0c14"
                  strokeWidth={3}
                  className="transition-all hover:scale-125"
                />

                {/* Node Label */}
                <text
                  y={radius + 14}
                  textAnchor="middle"
                  fill={isSelected ? '#ffffff' : '#cbd5e1'}
                  fontSize={10}
                  fontWeight={isSelected ? 'bold' : 'normal'}
                  className="pointer-events-none font-sans"
                >
                  {node.label.length > 20 ? `${node.label.slice(0, 18)}...` : node.label}
                </text>
              </g>
            )
          })}
        </g>
      </svg>

      {/* Floating Legend */}
      {showLegend && (
        <div className="absolute bottom-3 left-3 p-3 rounded-xl bg-[#121320]/95 border border-white/10 text-left space-y-1.5 shadow-lg backdrop-blur-md">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Graph Legend</span>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] font-mono">
            {Object.entries(nodeColorMap).map(([typeKey, cfg]) => (
              <div key={typeKey} className="flex items-center gap-1.5">
                <span className={cn('w-2.5 h-2.5 rounded-full', cfg.bg)} />
                <span className="text-slate-300 capitalize">{cfg.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MiniMap Placeholder */}
      <div className="absolute bottom-3 right-3 w-28 h-20 rounded-xl bg-[#121320]/90 border border-white/10 hidden sm:flex flex-col items-center justify-center text-[10px] font-mono text-slate-400 p-2 pointer-events-none">
        <span className="text-purple-400 font-bold">MiniMap</span>
        <span>{filteredNodes.length} visible</span>
      </div>
    </div>
  )
}

export default GraphCanvas
