import React, { useState, useMemo } from 'react'
import { Card } from '@/components/ui/Card'
import { ArrowRight, ChevronDown, Users } from 'lucide-react'

export interface RoleBenchmarkData {
  role: string
  userPercentile: number
  userScore: number
  averageScore: number
  totalCandidates: number
}

interface CompetitorBenchmarkCardProps {
  selectedRole?: string
  roleDataMap?: Record<string, RoleBenchmarkData>
  onViewBenchmarkReport?: () => void
}

const defaultRoleData: Record<string, RoleBenchmarkData> = {
  'AI/ML Engineer': {
    role: 'AI/ML Engineer',
    userPercentile: 82,
    userScore: 92,
    averageScore: 74,
    totalCandidates: 14200,
  },
  'Full Stack Developer': {
    role: 'Full Stack Developer',
    userPercentile: 88,
    userScore: 92,
    averageScore: 71,
    totalCandidates: 32500,
  },
  'Data Scientist': {
    role: 'Data Scientist',
    userPercentile: 85,
    userScore: 92,
    averageScore: 73,
    totalCandidates: 18900,
  },
  'DevOps Specialist': {
    role: 'DevOps Specialist',
    userPercentile: 79,
    userScore: 92,
    averageScore: 76,
    totalCandidates: 11400,
  },
  'Product Manager': {
    role: 'Product Manager',
    userPercentile: 75,
    userScore: 92,
    averageScore: 78,
    totalCandidates: 9800,
  },
}

export const CompetitorBenchmarkCard: React.FC<CompetitorBenchmarkCardProps> = ({
  selectedRole = 'AI/ML Engineer',
  roleDataMap = defaultRoleData,
  onViewBenchmarkReport,
}) => {
  const [role, setRole] = useState(selectedRole)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const mapData = roleDataMap && Object.keys(roleDataMap).length > 0 ? roleDataMap : defaultRoleData
  const activeData = mapData[role] || mapData['AI/ML Engineer'] || defaultRoleData['AI/ML Engineer']
  const topPercentile = 100 - (activeData.userPercentile || 80)

  const pinX = useMemo(() => {
    const minX = 20
    const maxX = 220
    return minX + ((activeData.userPercentile || 80) / 100) * (maxX - minX)
  }, [activeData.userPercentile])

  const avgX = useMemo(() => {
    const minX = 20
    const maxX = 220
    return minX + ((activeData.averageScore || 74) / 100) * (maxX - minX)
  }, [activeData.averageScore])

  return (
    <Card className="bg-[#0b0c14]/90 border-slate-800/80 p-5 rounded-2xl flex flex-col justify-between backdrop-blur-md h-full shadow-lg relative">
      {/* Screen Reader Text Description for Chart */}
      <div className="sr-only">
        Competitor benchmark analysis for role {role}. Your candidate score is {activeData.userScore} points, placing you in the top {topPercentile}% compared to {activeData.totalCandidates} candidates with an average score of {activeData.averageScore}.
      </div>

      {/* Header & Role Dropdown */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-200 tracking-tight">
            Competitor Benchmark
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Ranked <span className="text-purple-300 font-bold">Top {topPercentile}%</span> among{' '}
            <span className="text-slate-300 font-semibold">{(activeData.totalCandidates || 14200).toLocaleString()}</span> candidates.
          </p>
        </div>

        {/* Role Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
            aria-haspopup="listbox"
            aria-expanded={isDropdownOpen}
            aria-label={`Select Role Benchmark. Current role: ${role}`}
          >
            <Users className="w-3.5 h-3.5 text-purple-400" />
            <span>{role}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isDropdownOpen && (
            <div
              role="listbox"
              aria-label="Target Role Benchmarks"
              className="absolute right-0 top-full mt-1 w-48 bg-[#0f111a] border border-slate-800 rounded-xl shadow-2xl z-50 p-1 flex flex-col gap-0.5"
            >
              {Object.keys(mapData).map((r) => (
                <button
                  key={r}
                  role="option"
                  aria-selected={role === r}
                  onClick={() => {
                    setRole(r)
                    setIsDropdownOpen(false)
                  }}
                  className={`text-left px-2.5 py-2 min-h-[44px] rounded-lg text-xs transition-colors flex items-center ${
                    role === r
                      ? 'bg-purple-600/20 text-purple-300 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SVG Bell Curve Chart */}
      <div className="flex-1 flex flex-col justify-center py-2 relative">
        <svg viewBox="0 0 240 85" className="w-full h-auto overflow-visible" role="img" aria-label="Normal Distribution Bell Curve Chart">
          <defs>
            <linearGradient id="bellCurveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          <path
            d="M 10,75 Q 60,75 90,50 T 120,20 T 150,50 Q 180,75 230,75"
            fill="url(#bellCurveGradient)"
            stroke="#6366f1"
            strokeWidth="2"
          />

          <line x1="10" y1="75" x2="230" y2="75" stroke="#1e293b" strokeWidth="1.5" />

          <line
            x1={avgX}
            y1="75"
            x2={avgX}
            y2="30"
            stroke="#64748b"
            strokeWidth="1"
            strokeDasharray="2 2"
          />
          <text
            x={avgX}
            y="24"
            textAnchor="middle"
            className="fill-slate-400 text-[8px] font-medium"
          >
            Avg ({activeData.averageScore})
          </text>

          <line
            x1={pinX}
            y1="75"
            x2={pinX}
            y2="38"
            stroke="#38bdf8"
            strokeWidth="1.5"
            strokeDasharray="2 2"
            className="transition-all duration-700 ease-out"
          />
          <circle
            cx={pinX}
            cy="38"
            r="4"
            fill="#38bdf8"
            stroke="#0b0c14"
            strokeWidth="2"
            className="transition-all duration-700 ease-out"
          />

          <g className="transition-all duration-700 ease-out" transform={`translate(${pinX - 25}, 12)`}>
            <rect x="0" y="0" width="50" height="18" rx="9" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
            <text x="25" y="12" textAnchor="middle" className="fill-sky-300 text-[9px] font-extrabold font-mono">
              Top {topPercentile}%
            </text>
          </g>
        </svg>

        <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium px-1 mt-1">
          <span>Bottom 10%</span>
          <span className="text-slate-300 font-semibold">Average ({activeData.averageScore})</span>
          <span>Top 10%</span>
        </div>
      </div>

      {/* Footer Link */}
      <div className="pt-3 mt-3 border-t border-slate-800/60 flex justify-center">
        <button
          onClick={onViewBenchmarkReport}
          className="inline-flex items-center gap-1.5 min-h-[44px] text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          aria-label="View Detailed Benchmark Report"
        >
          <span>View Benchmark Report</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </Card>
  )
}

export default CompetitorBenchmarkCard
