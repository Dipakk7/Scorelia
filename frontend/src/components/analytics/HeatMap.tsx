import { useMemo } from 'react'
import { cn } from '@/lib/utils'

interface HeatMapProps {
  data?: { date: string; value: number }[]
  colorScheme?: 'emerald' | 'blue' | 'purple' | 'amber'
  className?: string
}

export function HeatMap({
  data,
  colorScheme = 'emerald',
  className,
}: HeatMapProps) {
  // Generate mock dates for 1 year if data is empty or short
  const calendarData = useMemo(() => {
    const today = new Date()
    const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const startDate = new Date(endDate)
    startDate.setDate(endDate.getDate() - 364) // 52 weeks * 7 days = 364 days ago

    // Map existing data by date string
    const dataMap = new Map<string, number>()
    if (data) {
      data.forEach((item) => {
        const dateStr = new Date(item.date).toISOString().split('T')[0]
        dataMap.set(dateStr, item.value)
      })
    }

    const result: { date: Date; value: number }[] = []
    const currentDate = new Date(startDate)

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0]
      let val = dataMap.get(dateStr) || 0

      // If no data, populate mock low frequency details to make the heatmap look populated and gorgeous
      if (!data || data.length === 0) {
        // Pseudo-random but consistent values for design aesthetic
        const day = currentDate.getDate()
        const month = currentDate.getMonth()
        if ((day + month) % 7 === 0) val = Math.floor((day % 4) + 1)
        else if ((day + month) % 13 === 0) val = Math.floor((day % 5) + 3)
      }

      result.push({
        date: new Date(currentDate),
        value: val,
      })
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return result
  }, [data])

  const schemes = {
    emerald: {
      0: 'bg-slate-55/35 dark:bg-slate-900/40 text-slate-400 dark:text-slate-600 border border-slate-200/20 dark:border-slate-850/20',
      1: 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/20',
      2: 'bg-emerald-500/40 text-emerald-400 border border-emerald-500/25',
      3: 'bg-emerald-500/70 text-emerald-300 border border-emerald-500/30',
      4: 'bg-emerald-500 text-white border border-emerald-600',
    },
    blue: {
      0: 'bg-slate-55/35 dark:bg-slate-900/40 text-slate-400 dark:text-slate-600 border border-slate-200/20 dark:border-slate-855/20',
      1: 'bg-blue-500/20 text-blue-500 border border-blue-500/20',
      2: 'bg-blue-500/40 text-blue-400 border border-blue-500/25',
      3: 'bg-blue-500/70 text-blue-300 border border-blue-500/30',
      4: 'bg-blue-500 text-white border border-blue-600',
    },
    purple: {
      0: 'bg-slate-55/35 dark:bg-slate-900/40 text-slate-400 dark:text-slate-600 border border-slate-200/20 dark:border-slate-855/20',
      1: 'bg-purple-500/20 text-purple-500 border border-purple-500/20',
      2: 'bg-purple-500/40 text-purple-400 border border-purple-500/25',
      3: 'bg-purple-500/70 text-purple-300 border border-purple-500/30',
      4: 'bg-purple-500 text-white border border-purple-600',
    },
    amber: {
      0: 'bg-slate-55/35 dark:bg-slate-900/40 text-slate-400 dark:text-slate-600 border border-slate-200/20 dark:border-slate-855/20',
      1: 'bg-amber-500/20 text-amber-500 border border-amber-500/20',
      2: 'bg-amber-500/40 text-amber-400 border border-amber-500/25',
      3: 'bg-amber-500/70 text-amber-300 border border-amber-500/30',
      4: 'bg-amber-500 text-white border border-amber-600',
    },
  }

  const activeScheme = schemes[colorScheme]

  const getIntensityClass = (value: number) => {
    if (value === 0) return activeScheme[0]
    if (value <= 2) return activeScheme[1]
    if (value <= 5) return activeScheme[2]
    if (value <= 8) return activeScheme[3]
    return activeScheme[4]
  }

  // Group columns (weeks)
  const weeks = useMemo(() => {
    const cols: { date: Date; value: number }[][] = []
    let currentWeek: { date: Date; value: number }[] = []

    calendarData.forEach((day, idx) => {
      currentWeek.push(day)
      if (currentWeek.length === 7 || idx === calendarData.length - 1) {
        cols.push(currentWeek)
        currentWeek = []
      }
    })

    return cols
  }, [calendarData])

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  return (
    <div className={cn('flex flex-col gap-2.5 p-1 overflow-x-auto w-full select-none scrollbar-thin text-left font-sans text-xs', className)}>
      <div className="flex gap-1.5 min-w-[720px] text-left">
        {/* Days labels */}
        <div className="flex flex-col justify-between text-[9px] font-black uppercase font-mono tracking-widest text-slate-455 dark:text-slate-500 w-7 h-28 pr-1.5 py-1 leading-none select-none">
          <span>Mon</span>
          <span>Wed</span>
          <span>Fri</span>
        </div>

        {/* Columns grid */}
        <div className="flex-1 flex gap-1 text-left">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1 text-left">
              {week.map((day, dIdx) => {
                const dateString = day.date.toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
                return (
                  <div
                    key={dIdx}
                    className={cn(
                      'w-3.5 h-3.5 rounded-[4px] border border-transparent transition-all duration-300 cursor-pointer hover:ring-2 hover:ring-brand-500/50 hover:scale-105',
                      getIntensityClass(day.value)
                    )}
                    title={`${day.value} activities on ${dateString}`}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Months Legend Footer */}
      <div className="flex text-[9px] font-black uppercase font-mono tracking-widest text-slate-455 dark:text-slate-500 pl-8.5 justify-between min-w-[720px] max-w-full select-none leading-none">
        {months.map((m) => (
          <span key={m} className="w-12 text-left">
            {m}
          </span>
        ))}
      </div>
    </div>
  )
}
export default HeatMap
