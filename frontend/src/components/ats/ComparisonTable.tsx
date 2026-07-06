import { useMemo } from 'react'
import { CheckCircle2, Star } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import type { ComparisonDataPoint } from './ComparisonChart'

interface ComparisonTableProps {
  items: ComparisonDataPoint[]
}

export function ComparisonTable({ items }: ComparisonTableProps) {
  // Sort items to determine ranking
  const rankedItems = useMemo(() => {
    return [...items].sort((a, b) => b.overall - a.overall)
  }, [items])

  if (!items || items.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
        No comparison data available.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto border border-slate-200/60 dark:border-slate-800/40 rounded-xl text-left font-sans text-xs">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800/60">
        <thead className="bg-slate-50/50 dark:bg-slate-900/60 font-semibold text-slate-700 dark:text-slate-350">
          <tr>
            <th className="px-6 py-3.5">Rank</th>
            <th className="px-6 py-3.5">Resume / Job Name</th>
            <th className="px-6 py-3.5">Overall Match</th>
            <th className="px-6 py-3.5">Skills Match</th>
            <th className="px-6 py-3.5">Experience</th>
            <th className="px-6 py-3.5">Education</th>
            <th className="px-6 py-3.5">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-850/60 bg-white dark:bg-slate-900/10">
          {rankedItems.map((item, idx) => {
            const isBestMatch = idx === 0 && rankedItems.length > 1
            return (
              <tr
                key={item.name}
                className={`transition-colors ${
                  isBestMatch
                    ? 'bg-brand-500/5 hover:bg-brand-500/10 dark:bg-brand-500/5 dark:hover:bg-brand-500/10'
                    : 'hover:bg-slate-50/40 dark:hover:bg-slate-850/20'
                }`}
              >
                <td className="px-6 py-4 font-mono font-bold text-slate-500">
                  #{idx + 1}
                </td>
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{item.name}</span>
                  {isBestMatch && (
                    <Badge variant="default" className="flex items-center gap-0.5 text-[9px] px-1.5 py-0">
                      <Star size={8} className="fill-current" />
                      <span>Best Match</span>
                    </Badge>
                  )}
                </td>
                <td className="px-6 py-4 font-mono font-bold text-brand-600 dark:text-brand-400">
                  {item.overall}%
                </td>
                <td className="px-6 py-4 font-mono text-slate-700 dark:text-slate-400">
                  {item.skills}%
                </td>
                <td className="px-6 py-4 font-mono text-slate-700 dark:text-slate-400">
                  {item.experience}%
                </td>
                <td className="px-6 py-4 font-mono text-slate-700 dark:text-slate-400">
                  {item.education}%
                </td>
                <td className="px-6 py-4">
                  {item.overall >= 80 ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      <span>Ready</span>
                    </span>
                  ) : item.overall >= 50 ? (
                    <span className="text-amber-600 dark:text-amber-400 font-semibold">
                      Needs Optimization
                    </span>
                  ) : (
                    <span className="text-red-600 dark:text-red-400 font-semibold">
                      Weak Fit
                    </span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default ComparisonTable
