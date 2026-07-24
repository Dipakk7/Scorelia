import React from 'react'
import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
} from 'recharts'

export interface SkillPoint {
  skill: string
  score: number
}

const DEFAULT_SKILL_DATA: SkillPoint[] = [
  { skill: 'Python', score: 90 },
  { skill: 'SQL', score: 85 },
  { skill: 'ML', score: 88 },
  { skill: 'LLMs', score: 92 },
  { skill: 'Deep Learning', score: 82 },
  { skill: 'FastAPI', score: 86 },
  { skill: 'Data Analysis', score: 78 },
  { skill: 'GitHub', score: 80 },
]

interface SkillRadarWidgetProps {
  data?: SkillPoint[]
}

function CustomRadarTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-[#121320] p-2 shadow-xl text-xs font-mono font-bold text-purple-300">
        <span>{payload[0].payload.skill}: {payload[0].value}%</span>
      </div>
    )
  }
  return null
}

export const SkillRadarWidget: React.FC<SkillRadarWidgetProps> = React.memo(({
  data = DEFAULT_SKILL_DATA,
}) => {
  const radarData = React.useMemo(() => {
    if (!data || data.length === 0) return DEFAULT_SKILL_DATA
    return data
  }, [data])

  return (
    <div className="p-5 rounded-2xl bg-[#0f101d]/90 border border-white/10 backdrop-blur-md space-y-4 shadow-xl select-none">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-white tracking-tight">Skill Intelligence (Radar)</h3>
        <span className="text-[10px] font-mono text-slate-400">{radarData.length} Categories</span>
      </div>

      <div className="h-44 w-full flex items-center justify-center pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
            <PolarGrid stroke="rgba(168, 85, 247, 0.25)" />
            <PolarAngleAxis
              dataKey="skill"
              stroke="#94a3b8"
              fontSize={9}
              tickLine={false}
            />
            <PolarRadiusAxis domain={[0, 100]} axisLine={false} tick={false} />
            <Radar
              name="Proficiency"
              dataKey="score"
              stroke="#c084fc"
              strokeWidth={2}
              fill="#a855f7"
              fillOpacity={0.35}
            />
            <Tooltip content={<CustomRadarTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
})
export default SkillRadarWidget
