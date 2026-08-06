import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Target, Info } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import type { PerformanceTrendPoint } from '@/types/interviewPrep'

export interface PerformanceTrendChartProps {
  trendPoints: PerformanceTrendPoint[]
}

export function PerformanceTrendChart({ trendPoints }: PerformanceTrendChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<PerformanceTrendPoint | null>(null)

  const width = 520
  const height = 180
  const padding = 42

  const maxVal = 100
  const minVal = 50

  const getX = (i: number) => padding + (i * (width - padding * 2)) / (trendPoints.length - 1)
  const getY = (val: number) => height - padding - ((val - minVal) * (height - padding * 2)) / (maxVal - minVal)

  const scorePath = trendPoints.reduce(
    (acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(pt.score)}`,
    ''
  )

  const targetPath = trendPoints.reduce(
    (acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(pt.targetScore)}`,
    ''
  )

  return (
    <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-5 hover:border-purple-500/30 transition-all space-y-4 text-left">
      <CardHeader className="p-0 pb-3 flex flex-row items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 shrink-0">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-white tracking-tight">
              Score Progression & Trajectory Chart
            </CardTitle>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Weekly score evolution compared against target benchmark
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-purple-300">
            <span className="h-2.5 w-2.5 rounded-full bg-purple-500 shadow-sm shadow-purple-500/50" />
            <span>Your Score</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
            <span>Target Benchmark</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 space-y-3">
        {/* SVG Line Chart */}
        <div className="relative w-full overflow-hidden" onMouseLeave={() => setHoveredPoint(null)}>
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 overflow-visible">
            {/* Grid lines */}
            {[60, 70, 80, 90, 100].map((val) => (
              <g key={val}>
                <line
                  x1={padding}
                  y1={getY(val)}
                  x2={width - padding}
                  y2={getY(val)}
                  stroke="#ffffff12"
                  strokeDasharray="3 3"
                />
                <text
                  x={padding - 10}
                  y={getY(val) + 3}
                  fill="#94a3b8"
                  fontSize="10"
                  textAnchor="end"
                  className="font-mono font-medium"
                >
                  {val}%
                </text>
              </g>
            ))}

            {/* Target Line */}
            <motion.path
              d={targetPath}
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              strokeDasharray="4 4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8 }}
            />

            {/* Score Line */}
            <motion.path
              d={scorePath}
              fill="none"
              stroke="#a855f7"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1 }}
            />

            {/* Data Points */}
            {trendPoints.map((pt, i) => (
              <g key={i} className="cursor-pointer" onMouseEnter={() => setHoveredPoint(pt)}>
                <circle
                  cx={getX(i)}
                  cy={getY(pt.score)}
                  r={hoveredPoint?.label === pt.label ? '6' : '4.5'}
                  className="fill-purple-400 stroke-[#10121e] stroke-2 transition-all duration-200"
                />
                <text
                  x={getX(i)}
                  y={height - 8}
                  fill={hoveredPoint?.label === pt.label ? '#f8fafc' : '#94a3b8'}
                  fontSize="10"
                  textAnchor="middle"
                  className="font-sans font-semibold transition-colors"
                >
                  {pt.label}
                </text>
              </g>
            ))}
          </svg>

          {/* Hover Tooltip */}
          {hoveredPoint && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-2 right-2 p-2.5 rounded-xl bg-[#141627]/95 border border-purple-500/30 text-xs shadow-2xl backdrop-blur-md space-y-1 pointer-events-none z-20"
            >
              <span className="font-bold text-white block tracking-tight">{hoveredPoint.label} Performance</span>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="text-purple-300 font-mono font-bold">Score: {hoveredPoint.score}%</span>
                <span className="text-emerald-400 font-mono font-bold">Target: {hoveredPoint.targetScore}%</span>
              </div>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
export default PerformanceTrendChart
