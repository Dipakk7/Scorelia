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

  // Exact Gaussian height math to keep marker glued to the distribution curve
  const pinY = useMemo(() => {
    const p = (activeData.userPercentile || 80) / 100
    const t = (p - 0.5) * 2.2
    const heightFactor = Math.exp(-2.8 * t * t)
    return 75 - heightFactor * 57
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
        <svg viewBox="0 0 240 85" className="w-full h-auto overflow-visible transition-all duration-300" role="img" aria-label="Normal Distribution Bell Curve Chart">
          <defs>
            {/* SVG Glow Filter for luminous curve highlight */}
            <filter id="chartGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Layered Vertical Area Fill Gradient */}
            <linearGradient id="bellCurveFillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.32" />
              <stop offset="45%" stopColor="#6366f1" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#07080e" stopOpacity="0.0" />
            </linearGradient>

            {/* Crisp Curve Multi-Stop Stroke Gradient */}
            <linearGradient id="bellCurveStrokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="45%" stopColor="#a855f7" />
              <stop offset="80%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>

            {/* Baseline Axis Gradient */}
            <linearGradient id="axisGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.2" />
              <stop offset="30%" stopColor="#475569" stopOpacity="0.7" />
              <stop offset="70%" stopColor="#475569" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#1e293b" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Background Reference Grid Lines (Depth Layer) */}
          <line x1="10" y1="35" x2="230" y2="35" stroke="#1e293b" strokeWidth="0.75" strokeDasharray="2 4" strokeOpacity="0.35" />
          <line x1="10" y1="55" x2="230" y2="55" stroke="#1e293b" strokeWidth="0.75" strokeDasharray="2 4" strokeOpacity="0.35" />

          {/* Layer 1: Glowing Ambient Curve Aura */}
          <path
            d="M 10,75 C 65,75 85,18 120,18 C 155,18 175,75 230,75"
            fill="none"
            stroke="url(#bellCurveStrokeGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.3"
            filter="url(#chartGlow)"
          />

          {/* Layer 2: Layered Gradient Area Fill */}
          <path
            d="M 10,75 C 65,75 85,18 120,18 C 155,18 175,75 230,75 L 230,75 L 10,75 Z"
            fill="url(#bellCurveFillGradient)"
          />

          {/* Layer 3: Precision Symmetrical Gaussian Curve Stroke */}
          <path
            d="M 10,75 C 65,75 85,18 120,18 C 155,18 175,75 230,75"
            fill="none"
            stroke="url(#bellCurveStrokeGradient)"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Baseline Axis */}
          <line x1="10" y1="75" x2="230" y2="75" stroke="url(#axisGradient)" strokeWidth="1.25" strokeLinecap="round" />

          {/* Average Score Indicator Line & Reference Pill */}
          <line
            x1={avgX}
            y1="75"
            x2={avgX}
            y2="28"
            stroke="#64748b"
            strokeWidth="1"
            strokeDasharray="2 3"
            strokeOpacity="0.5"
          />
          <g transform={`translate(${avgX - 20}, 9)`}>
            <rect width="40" height="15" rx="7.5" fill="#0f172a" fillOpacity="0.85" stroke="#475569" strokeWidth="0.8" />
            <text x="20" y="10.5" textAnchor="middle" className="fill-slate-400 text-[8px] font-bold font-mono select-none">
              Avg {activeData.averageScore}
            </text>
          </g>

          {/* Candidate Position Vertical Guide Line */}
          <line
            x1={pinX}
            y1="75"
            x2={pinX}
            y2={pinY}
            stroke="#38bdf8"
            strokeWidth="1"
            strokeDasharray="2 2"
            strokeOpacity="0.75"
            className="transition-all duration-700 ease-out"
          />

          {/* Candidate Marker Live Animated Pulse Ring */}
          <circle
            cx={pinX}
            cy={pinY}
            r="10"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1"
            className="animate-ping opacity-35 transition-all duration-700 ease-out"
          />

          {/* Candidate Marker Outer Ring */}
          <circle
            cx={pinX}
            cy={pinY}
            r="6"
            fill="#38bdf8"
            fillOpacity="0.15"
            stroke="#38bdf8"
            strokeWidth="1"
            strokeOpacity="0.6"
            className="transition-all duration-700 ease-out"
          />

          {/* Candidate Marker Inner Bright Core */}
          <circle
            cx={pinX}
            cy={pinY}
            r="3"
            fill="#38bdf8"
            stroke="#07080e"
            strokeWidth="1.5"
            className="transition-all duration-700 ease-out filter drop-shadow-[0_0_6px_rgba(56,189,248,0.9)]"
          />

          {/* Floating Glass Percentile Pill Overlay */}
          <g className="transition-all duration-700 ease-out" transform={`translate(${pinX - 24}, ${pinY - 25})`}>
            <rect x="0" y="0" width="48" height="17" rx="8.5" fill="#090a14" fillOpacity="0.92" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.8" className="shadow-lg shadow-sky-950/50" />
            <text x="24" y="11.5" textAnchor="middle" className="fill-sky-300 text-[8.5px] font-extrabold font-mono tracking-tight">
              Top {topPercentile}%
            </text>
          </g>
        </svg>

        <div className="flex justify-between items-center text-[11px] font-semibold text-slate-400 px-2 mt-2.5 select-none font-mono">
          <span>Bottom 10%</span>
          <span className="text-slate-200 font-bold">Average ({activeData.averageScore})</span>
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
