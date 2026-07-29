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
      <div className="rounded-xl border border-[var(--border)] bg-[var(--elevated)] p-2.5 shadow-[var(--shadow-md)] text-xs font-mono font-bold text-purple-400">
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
    <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] backdrop-blur-md space-y-4 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all select-none">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-[var(--heading)] tracking-tight">Skill Intelligence (Radar)</h3>
        <span className="text-[11px] font-mono font-semibold text-[var(--muted-color)]">{radarData.length} Categories</span>
      </div>

      <div className="h-44 w-full flex items-center justify-center pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
            <PolarGrid stroke="var(--border)" opacity={0.6} />
            <PolarAngleAxis
              dataKey="skill"
              stroke="var(--muted-color)"
              fontSize={12}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
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
