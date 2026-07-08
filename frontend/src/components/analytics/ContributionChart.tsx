import { HeatMap } from '@/components/analytics/HeatMap'
import { cn } from '@/lib/utils'

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
    <div className="space-y-4 text-left font-sans text-xs select-none">
      <div className="flex items-center justify-between text-left select-none">
        <h5 className="text-xs font-black uppercase tracking-wider text-slate-805 dark:text-white leading-none text-left">
          {title}
        </h5>
        {/* Legend */}
        <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-slate-455 select-none leading-none">
          <span>Less</span>
          <span className="w-2.5 h-2.5 rounded-md bg-slate-55/35 dark:bg-slate-900 border border-slate-205 dark:border-slate-855" />
          <span className={cn('w-2.5 h-2.5 rounded-md border border-transparent', colorScheme === 'emerald' ? 'bg-emerald-500/20 border-emerald-500/20' : colorScheme === 'blue' ? 'bg-blue-500/20 border-blue-500/20' : colorScheme === 'purple' ? 'bg-purple-500/20 border-purple-500/20' : 'bg-amber-500/20 border-amber-500/20')} />
          <span className={cn('w-2.5 h-2.5 rounded-md border border-transparent', colorScheme === 'emerald' ? 'bg-emerald-500/40 border-emerald-500/25' : colorScheme === 'blue' ? 'bg-blue-500/40 border-blue-500/25' : colorScheme === 'purple' ? 'bg-purple-500/40 border-purple-500/25' : 'bg-amber-500/40 border-amber-500/25')} />
          <span className={cn('w-2.5 h-2.5 rounded-md border border-transparent', colorScheme === 'emerald' ? 'bg-emerald-500/70 border-emerald-500/30' : colorScheme === 'blue' ? 'bg-blue-500/70 border-blue-500/30' : colorScheme === 'purple' ? 'bg-purple-500/70 border-purple-500/30' : 'bg-amber-500/70 border-amber-500/30')} />
          <span className={cn('w-2.5 h-2.5 rounded-md border border-transparent', colorScheme === 'emerald' ? 'bg-emerald-500 border-emerald-600' : colorScheme === 'blue' ? 'bg-blue-500 border-blue-600' : colorScheme === 'purple' ? 'bg-purple-500 border-purple-600' : 'bg-amber-500 border-amber-600')} />
          <span>More</span>
        </div>
      </div>
      
      {/* Calendar Grid HeatMap */}
      <HeatMap data={data} colorScheme={colorScheme} />
    </div>
  )
}
export default ContributionChart
