import React, { useState, useMemo } from 'react'
import { Card } from '@/components/ui/Card'
import { Maximize2, Info } from 'lucide-react'

export interface RadarDataPoint {
  label: string
  userScore: number // 0 - 100
  benchmarkScore: number // 0 - 100
  description?: string
  suggestion?: string
}

interface QualityRadarCardProps {
  data?: RadarDataPoint[]
  onExpand?: () => void
}

const defaultRadarData: RadarDataPoint[] = [
  {
    label: 'Content Quality',
    userScore: 88,
    benchmarkScore: 96,
    description: 'Depth and clarity of achievements.',
    suggestion: 'Quantify 2 additional key metrics with percentages or dollar values.',
  },
  {
    label: 'ATS Optimization',
    userScore: 98,
    benchmarkScore: 95,
    description: 'Parseability for ATS scanners.',
    suggestion: 'Exceeds benchmark standards. Keep current single-column hierarchy.',
  },
  {
    label: 'Structure & Formatting',
    userScore: 93,
    benchmarkScore: 94,
    description: 'Visual layout symmetry and spacing.',
    suggestion: 'Consolidate 1 long bullet into 2 succinct impact statements.',
  },
  {
    label: 'Skills & Keywords',
    userScore: 90,
    benchmarkScore: 98,
    description: 'Role-specific tech stack density.',
    suggestion: 'Add ML Ops, Kubernetes, and Model Deployment keywords.',
  },
  {
    label: 'Achievements Impact',
    userScore: 91,
    benchmarkScore: 95,
    description: 'Action-verb starting power.',
    suggestion: 'Use stronger leadership verbs like Architected, Spearheaded.',
  },
  {
    label: 'Readability',
    userScore: 89,
    benchmarkScore: 92,
    description: 'Sentence length and clarity score.',
    suggestion: 'Slightly reduce technical jargon density in summary section.',
  },
]

export const QualityRadarCard: React.FC<QualityRadarCardProps> = ({
  data = defaultRadarData,
  onExpand,
}) => {
  const [activeHoverIndex, setActiveHoverIndex] = useState<number | null>(null)

  const radarPoints = Array.isArray(data) && data.length > 0 ? data : defaultRadarData

  const size = 300
  const center = size / 2
  const maxRadius = 90
  const numAxes = radarPoints.length

  // Memoized polar coordinate generator
  const getCoordinates = useMemo(() => {
    return (index: number, valueRatio: number) => {
      const angle = (Math.PI * 2 / numAxes) * index - Math.PI / 2
      const r = maxRadius * valueRatio
      const x = center + r * Math.cos(angle)
      const y = center + r * Math.sin(angle)
      return { x, y }
    }
  }, [numAxes, center, maxRadius])

  // Memoized Polygon paths
  const userPath = useMemo(() => {
    return (
      radarPoints
        .map((point, index) => {
          const { x, y } = getCoordinates(index, (point.userScore ?? 80) / 100)
          return `${index === 0 ? 'M' : 'L'} ${x},${y}`
        })
        .join(' ') + ' Z'
    )
  }, [radarPoints, getCoordinates])

  const benchmarkPath = useMemo(() => {
    return (
      radarPoints
        .map((point, index) => {
          const { x, y } = getCoordinates(index, (point.benchmarkScore ?? 90) / 100)
          return `${index === 0 ? 'M' : 'L'} ${x},${y}`
        })
        .join(' ') + ' Z'
    )
  }, [radarPoints, getCoordinates])

  const activePoint = activeHoverIndex !== null ? radarPoints[activeHoverIndex] : null

  return (
    <Card className="bg-[#0b0c14]/90 border-slate-800/80 p-5 md:p-6 rounded-2xl flex flex-col justify-between backdrop-blur-md h-full shadow-lg relative">
      {/* Accessible Table for Screen Readers */}
      <table className="sr-only">
        <caption>Resume Quality Radar Comparison</caption>
        <thead>
          <tr>
            <th scope="col">Dimension</th>
            <th scope="col">Your Score</th>
            <th scope="col">Top 10% Benchmark</th>
          </tr>
        </thead>
        <tbody>
          {radarPoints.map((row, i) => (
            <tr key={i}>
              <th scope="row">{row.label}</th>
              <td>{row.userScore}/100</td>
              <td>{row.benchmarkScore}/100</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Header & Legend */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <h3 className="text-sm font-semibold text-slate-200 tracking-tight">
          Resume Quality Radar
        </h3>

        <div className="flex items-center gap-3">
          {/* Legend Items */}
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span className="text-slate-300 font-medium">Your Resume</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
            <span className="text-slate-400 font-medium">Top 10% Candidate</span>
          </div>

          <button
            onClick={onExpand}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Expand Radar Chart"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SVG Spider Radar Chart Display */}
      <div className="relative flex items-center justify-center my-auto py-2">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full max-w-[260px] h-auto overflow-visible select-none"
          role="img"
          aria-label="Resume Quality Radar Chart"
        >
          {/* Concentric Grid Circles (20%, 40%, 60%, 80%, 100%) */}
          {[0.2, 0.4, 0.6, 0.8, 1.0].map((level, levelIdx) => (
            <circle
              key={levelIdx}
              cx={center}
              cy={center}
              r={maxRadius * level}
              fill="none"
              stroke="#1e293b"
              strokeWidth="1"
              strokeDasharray={levelIdx === 4 ? 'none' : '2 2'}
            />
          ))}

          {/* Spokes / Axis Lines */}
          {radarPoints.map((_, i) => {
            const { x, y } = getCoordinates(i, 1.0)
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="#1e293b"
                strokeWidth="1.5"
              />
            )
          })}

          {/* Benchmark Target Polygon (Grey Filled) */}
          <polygon
            points={radarPoints
              .map((p, i) => {
                const { x, y } = getCoordinates(i, (p.benchmarkScore ?? 90) / 100)
                return `${x},${y}`
              })
              .join(' ')}
            fill="#475569"
            fillOpacity="0.15"
            stroke="#64748b"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />

          {/* User Score Polygon (Purple Glowing Area) */}
          <polygon
            points={radarPoints
              .map((p, i) => {
                const { x, y } = getCoordinates(i, (p.userScore ?? 80) / 100)
                return `${x},${y}`
              })
              .join(' ')}
            fill="#a855f7"
            fillOpacity="0.3"
            stroke="#a855f7"
            strokeWidth="2.5"
            className="transition-all duration-700 ease-out"
          />

          {/* Interactive Vertex Dots */}
          {radarPoints.map((p, i) => {
            const { x, y } = getCoordinates(i, (p.userScore ?? 80) / 100)
            const isHovered = activeHoverIndex === i
            return (
              <g key={i} className="cursor-pointer" onMouseEnter={() => setActiveHoverIndex(i)}>
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 6 : 4}
                  fill="#c084fc"
                  stroke="#0b0c14"
                  strokeWidth="2"
                  className="transition-all duration-200"
                />
              </g>
            )
          })}

          {/* Axis Labels & Values */}
          {radarPoints.map((p, i) => {
            const { x, y } = getCoordinates(i, 1.25)
            const isHovered = activeHoverIndex === i
            return (
              <text
                key={i}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                onMouseEnter={() => setActiveHoverIndex(i)}
                className={`text-[10px] font-sans transition-all cursor-pointer ${
                  isHovered ? 'fill-purple-300 font-extrabold text-xs' : 'fill-slate-400 font-medium'
                }`}
              >
                {p.label} ({p.userScore})
              </text>
            )
          })}
        </svg>
      </div>

      {/* Dynamic Hover Tooltip / Recommendation Footnote */}
      <div className="mt-2 min-h-[48px] p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-2 text-xs">
        <Info className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-slate-200">
            {activePoint ? activePoint.label : 'Hover over any axis to inspect AI analysis'}
          </span>
          <span className="text-[11px] text-slate-400 leading-snug">
            {activePoint
              ? activePoint.suggestion || activePoint.description
              : 'Radar compares your resume against top 10% hired candidates.'}
          </span>
        </div>
      </div>
    </Card>
  )
}

export default QualityRadarCard
