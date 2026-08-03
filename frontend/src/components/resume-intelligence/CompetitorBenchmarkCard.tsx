import React, { useState, useMemo } from 'react'
import { Card } from '@/components/ui/Card'
import { ArrowRight, ChevronDown, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

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
    <Card className="bg-[#0b0c14]/95 border border-slate-800/90 p-5 md:p-6 rounded-2xl flex flex-col justify-between backdrop-blur-md h-full shadow-xl relative select-none">
      {/* Screen Reader Text Description for Chart */}
      <div className="sr-only">
        Competitor benchmark analysis for role {role}. Your candidate score is {activeData.userScore} points, placing you in the top {topPercentile}% compared to {activeData.totalCandidates} candidates with an average score of {activeData.averageScore}.
      </div>

      {/* Header & Role Dropdown */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div>
          <h3 className="text-base font-extrabold text-white tracking-tight">
            Competitor Benchmark
          </h3>
          <p className="text-xs font-medium text-slate-400 mt-0.5">
            Ranked <span className="text-purple-300 font-extrabold">Top {topPercentile}%</span> among{' '}
            <span className="text-slate-200 font-bold">{(activeData.totalCandidates || 14200).toLocaleString()}</span> candidates.
          </p>
        </div>

        {/* Role Selector Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2.5 px-3.5 py-2 min-h-[40px] rounded-xl bg-[#141628] border border-slate-700/80 shadow-md text-xs font-bold text-white transition-all cursor-pointer hover:bg-[#1c1f36] hover:border-purple-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
            aria-haspopup="listbox"
            aria-expanded={isDropdownOpen}
            aria-label={`Select Role Benchmark. Current role: ${role}`}
          >
            <Users className="w-3.5 h-3.5 text-purple-300 shrink-0" />
            <span className="truncate max-w-[140px] sm:max-w-[180px]">{role}</span>
            <ChevronDown className={cn('w-4 h-4 text-slate-300 shrink-0 transition-transform duration-200', isDropdownOpen && 'rotate-180 text-purple-300')} />
          </button>

          {isDropdownOpen && (
            <div
              role="listbox"
              aria-label="Target Role Benchmarks"
              className="absolute right-0 top-full mt-2 w-56 bg-[#101222] border border-slate-700/90 rounded-2xl shadow-2xl backdrop-blur-xl z-50 p-1.5 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-150"
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
                  className={cn(
                    'text-left px-3.5 py-2.5 rounded-xl text-xs transition-all flex items-center justify-between gap-2 cursor-pointer border',
                    role === r
                      ? 'bg-purple-600/30 text-white font-extrabold border-purple-500/50 shadow-xs'
                      : 'text-slate-300 hover:bg-slate-900/80 hover:text-white hover:border-slate-700/60 font-semibold border-transparent'
                  )}
                >
                  <span className="truncate">{r}</span>
                  {role === r && <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SVG Bell Curve Chart */}
      <div className="flex-1 flex flex-col justify-center py-3 relative">
        <svg viewBox="0 0 240 85" className="w-full h-auto overflow-visible" role="img" aria-label="Normal Distribution Bell Curve Chart">
          <defs>
            <linearGradient id="bellCurveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.08" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.35" />
            </linearGradient>
          </defs>

          <path
            d="M 10,75 Q 60,75 90,50 T 120,20 T 150,50 Q 180,75 230,75"
            fill="url(#bellCurveGradient)"
            stroke="#a855f7"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          <line x1="10" y1="75" x2="230" y2="75" stroke="#334155" strokeWidth="1.5" />

          {/* Average Indicator Line */}
          <line
            x1={avgX}
            y1="75"
            x2={avgX}
            y2="30"
            stroke="#64748b"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
          <text
            x={avgX}
            y="24"
            textAnchor="middle"
            className="fill-slate-400 text-[8px] font-bold font-mono"
          >
            Avg ({activeData.averageScore})
          </text>

          {/* User Score Pin Line */}
          <line
            x1={pinX}
            y1="75"
            x2={pinX}
            y2="38"
            stroke="#38bdf8"
            strokeWidth="1.5"
            strokeDasharray="3 3"
            className="transition-all duration-700 ease-out"
          />
          <circle
            cx={pinX}
            cy="38"
            r="5"
            fill="#38bdf8"
            stroke="#07080e"
            strokeWidth="2.5"
            className="transition-all duration-700 ease-out filter drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]"
          />

          {/* User Top Percentile Badge Overlay */}
          <g className="transition-all duration-700 ease-out" transform={`translate(${pinX - 28}, 10)`}>
            <rect x="0" y="0" width="56" height="20" rx="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.2" className="shadow-md" />
            <text x="28" y="13" textAnchor="middle" className="fill-sky-300 text-[9.5px] font-extrabold font-mono">
              Top {topPercentile}%
            </text>
          </g>
        </svg>

        <div className="flex justify-between items-center text-xs text-slate-400 font-semibold px-2 mt-2">
          <span>Bottom 10%</span>
          <span className="text-slate-200 font-bold font-mono">Average ({activeData.averageScore})</span>
          <span>Top 10%</span>
        </div>
      </div>

      {/* Footer Link */}
      <div className="pt-3 mt-3 border-t border-slate-800/80 flex justify-center">
        <button
          type="button"
          onClick={onViewBenchmarkReport}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          aria-label="View Detailed Benchmark Report"
        >
          <span>View Benchmark Report</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </Card>
  )
}

export default CompetitorBenchmarkCard
