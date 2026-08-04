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
    <section aria-label="Quick Performance Metrics" className="w-full">
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-sm font-bold text-slate-100 tracking-tight flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-400" />
          Quick Performance Metrics
        </h3>
        <span className="text-xs text-slate-400 font-mono">6 Criteria Evaluated</span>
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
