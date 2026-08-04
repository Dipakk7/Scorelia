import {
  Search,
  Layout,
  BookOpen,
  CheckCircle2,
  Award,
  Briefcase,
  Layers,
  type LucideIcon,
} from 'lucide-react'
import { MetricCard } from './MetricCard'
import { mockQuickMetrics } from '@/lib/ats-mock-data'

const ICON_MAP: Record<string, LucideIcon> = {
  'keyword-match': Search,
  formatting: Layout,
  readability: BookOpen,
  'section-completeness': CheckCircle2,
  'skills-match': Award,
  'experience-quality': Briefcase,
}

interface MetricsGridProps {
  onMetricSelect?: (metricId: string) => void
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ onMetricSelect }) => {
  return (
    <section aria-label="Quick Performance Metrics" className="w-full space-y-3.5">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-0.5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-400/30 text-purple-300 shadow-sm shrink-0 flex items-center justify-center">
            <Layers className="w-4.5 h-4.5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>Quick Performance Metrics</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed mt-0.5">
              Real-time evaluation across 6 key ATS screening criteria.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-slate-200 bg-slate-900/90 border border-slate-700/80 px-3 py-1.5 rounded-xl shadow-sm self-start sm:self-auto shrink-0">
          6 Criteria Evaluated
        </span>
      </div>

      {/* Responsive Grid: Desktop 3 cols x 2 rows, Tablet 2 cols, Mobile 1 col */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 items-stretch">
        {mockQuickMetrics.map((item) => {
          const IconComponent = ICON_MAP[item.id] || Layers
          return (
            <MetricCard
              key={item.id}
              title={item.title}
              icon={IconComponent}
              score={item.score}
              status={item.status}
              statusType={item.statusType}
              trend={item.trend}
              description={item.description}
              onClick={() => onMetricSelect && onMetricSelect(item.id)}
            />
          )
        })}
      </div>
    </section>
  )
}
