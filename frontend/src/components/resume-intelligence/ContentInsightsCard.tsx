import React from 'react'
import { Card } from '@/components/ui/Card'
import { ArrowRight, Type, Gauge, Layers, FileText, Briefcase, Code, FolderGit2, Hash } from 'lucide-react'

export interface ResumeStatsData {
  wordCount: number
  charCount: number
  readingTimeMinutes: number
  pageCount: number
  sectionCount: number
  skillsCount: number
  experienceCount: number
  projectCount: number
}

interface ContentInsightsCardProps {
  stats?: ResumeStatsData
  onViewContentAnalysis?: () => void
}

const defaultStats: ResumeStatsData = {
  wordCount: 1248,
  charCount: 7420,
  readingTimeMinutes: 4.5,
  pageCount: 1.6,
  sectionCount: 9,
  skillsCount: 28,
  experienceCount: 4,
  projectCount: 5,
}

export const ContentInsightsCard: React.FC<ContentInsightsCardProps> = ({
  stats = defaultStats,
  onViewContentAnalysis,
}) => {
  const currentStats = { ...defaultStats, ...(stats || {}) }

  const metricsList = [
    { label: 'Word Count', value: (currentStats.wordCount ?? 1248).toLocaleString(), status: 'Good', icon: Type },
    { label: 'Character Count', value: (currentStats.charCount ?? 7420).toLocaleString(), status: 'Optimal', icon: Hash },
    { label: 'Reading Time', value: `${currentStats.readingTimeMinutes ?? 4.5} min`, status: 'Good', icon: Gauge },
    { label: 'Pages', value: (currentStats.pageCount ?? 1.6).toString(), status: 'Optimal', icon: FileText },
    { label: 'Sections', value: (currentStats.sectionCount ?? 9).toString(), status: 'Good', icon: Layers },
    { label: 'Skills Count', value: (currentStats.skillsCount ?? 28).toString(), status: 'High', icon: Code },
    { label: 'Work Experience', value: `${currentStats.experienceCount ?? 4} roles`, status: 'Solid', icon: Briefcase },
    { label: 'Projects', value: `${currentStats.projectCount ?? 5} items`, status: 'Verified', icon: FolderGit2 },
  ]

  return (
    <Card className="bg-[#0b0c14]/90 border-slate-800/80 p-5 rounded-2xl flex flex-col justify-between backdrop-blur-md h-full shadow-lg">
      <h3 className="text-sm font-semibold text-slate-200 tracking-tight mb-3">
        Content Insights
      </h3>

      <div className="grid grid-cols-2 gap-2 flex-1 items-center">
        {metricsList.map((item, idx) => {
          const Icon = item.icon
          return (
            <div
              key={idx}
              className="flex flex-col justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/50 hover:border-slate-700/80 transition-all"
            >
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5 truncate">
                  <Icon className="w-3 h-3 text-purple-400 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-1">
                <span className="font-mono font-bold text-slate-100 text-xs">{item.value}</span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {item.status}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer Link */}
      <div className="pt-3 mt-3 border-t border-slate-800/60 flex justify-center">
        <button
          onClick={onViewContentAnalysis}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors cursor-pointer focus:outline-none"
        >
          <span>View Content Analysis</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </Card>
  )
}

export default ContentInsightsCard
