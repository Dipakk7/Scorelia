import { HeatMap } from '@/components/analytics/HeatMap'

interface ContributionItem {
  date: string
  value: number
}

interface ContributionChartProps {
  data?: ContributionItem[]
  colorScheme?: 'emerald' | 'blue' | 'purple' | 'amber'
  title?: string
}

export function ContributionChart({
  data,
  colorScheme = 'emerald',
  title = 'Contribution Activity',
}: ContributionChartProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h5 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-display">
          {title}
        </h5>
        {/* Legend */}
        <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400">
          <span>Less</span>
          <span className="w-2.5 h-2.5 rounded-sm bg-slate-100 dark:bg-slate-800/40" />
          <span className={`w-2.5 h-2.5 rounded-sm ${colorScheme === 'emerald' ? 'bg-emerald-500/20' : colorScheme === 'blue' ? 'bg-blue-500/20' : colorScheme === 'purple' ? 'bg-purple-500/20' : 'bg-amber-500/20'}`} />
          <span className={`w-2.5 h-2.5 rounded-sm ${colorScheme === 'emerald' ? 'bg-emerald-500/40' : colorScheme === 'blue' ? 'bg-blue-500/40' : colorScheme === 'purple' ? 'bg-purple-500/40' : 'bg-amber-500/40'}`} />
          <span className={`w-2.5 h-2.5 rounded-sm ${colorScheme === 'emerald' ? 'bg-emerald-500/70' : colorScheme === 'blue' ? 'bg-blue-500/70' : colorScheme === 'purple' ? 'bg-purple-500/70' : 'bg-amber-500/70'}`} />
          <span className={`w-2.5 h-2.5 rounded-sm ${colorScheme === 'emerald' ? 'bg-emerald-500' : colorScheme === 'blue' ? 'bg-blue-500' : colorScheme === 'purple' ? 'bg-purple-500' : 'bg-amber-500'}`} />
          <span>More</span>
        </div>
      </div>
      
      {/* Calendar Grid HeatMap */}
      <HeatMap data={data} colorScheme={colorScheme} />
    </div>
  )
}
