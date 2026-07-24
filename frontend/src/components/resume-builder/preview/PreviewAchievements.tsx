import React from 'react'
import type { SampleResumeData } from '../templates/types'

interface PreviewAchievementsProps {
  achievements: SampleResumeData['achievements']
  accentColor?: string
}

export const PreviewAchievements: React.FC<PreviewAchievementsProps> = ({ achievements, accentColor = '#1e40af' }) => {
  if (!achievements || achievements.length === 0) return null

  return (
    <div className="space-y-1.5 text-[11px] text-slate-700">
      <h2
        className="text-xs font-bold tracking-wider font-display uppercase border-b pb-0.5 m-0"
        style={{ color: accentColor, borderColor: `${accentColor}33` }}
      >
        KEY ACHIEVEMENTS
      </h2>
      <div className="space-y-1">
        {achievements.map((item) => (
          <div key={item.id} className="space-y-0.5">
            <div className="flex items-baseline justify-between font-bold text-slate-900">
              <span>{item.title}</span>
              {item.impactMetric && <span className="text-[10px] text-emerald-700 font-mono">{item.impactMetric}</span>}
            </div>
            <p className="m-0 leading-snug">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
