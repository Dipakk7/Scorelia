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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-0.5">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-400 shadow-sm shrink-0 flex items-center justify-center">
            <Layers className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-100 tracking-tight leading-snug">
              Quick Performance Metrics
            </h3>
            <p className="text-xs text-slate-400 font-normal leading-normal mt-0.5">
              Real-time evaluation across 6 key ATS screening criteria.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-medium text-slate-300 bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded-lg shadow-sm self-start sm:self-auto shrink-0">
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
