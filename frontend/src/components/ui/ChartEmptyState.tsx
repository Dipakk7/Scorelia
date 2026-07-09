import { LineChart, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

/**
 * @component ChartEmptyState
 * @description Renders a premium, minimalist empty/zero-data state placeholder inside a chart container.
 * 
 * @why-it-is-a-separate-component
 * Standardizing empty states across different charts prevents visual clutter and code duplication. 
 * Reusable layout guarantees pixel-perfect styling, colors, borders, and margins across all trends.
 * 
 * @props
 * - message: string — Explains why the chart is currently empty and what action is required.
 * - ctaText: string — The text displayed inside the call-to-action button.
 * - ctaTo: string — The application URL path the CTA button redirects to.
 * 
 * @reuse-scope
 * Located in `components/ui` as a general UI element. While initially built for the Dashboard trends,
 * it has broader reuse potential for any page rendering analytics dashboards (e.g. AnalyticsPage, Career Coach).
 */

interface ChartEmptyStateProps {
  message: string
  ctaText?: string
  ctaTo?: string
  ctaOnClick?: () => void
}

export function ChartEmptyState({ message, ctaText, ctaTo, ctaOnClick }: ChartEmptyStateProps) {
  return (
    <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-center p-6 bg-slate-50/30 dark:bg-slate-900/10 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-2xl mb-3 shadow-xs border border-slate-200/40 dark:border-slate-705/45">
        <LineChart size={24} className="stroke-[1.5]" />
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs font-sans leading-relaxed mb-4">
        {message}
      </p>
      {ctaText && (
        ctaOnClick ? (
          <Button size="sm" variant="outline" onClick={ctaOnClick} className="text-xs flex items-center gap-1.5 hover:border-brand-500/30 hover:bg-brand-500/5 group">
            <Sparkles size={12} className="text-brand-500 group-hover:scale-110 transition-transform" />
            <span>{ctaText}</span>
          </Button>
        ) : (
          <Link to={ctaTo || '#'} className="inline-block">
            <Button size="sm" variant="outline" className="text-xs flex items-center gap-1.5 hover:border-brand-500/30 hover:bg-brand-500/5 group">
              <Sparkles size={12} className="text-brand-500 group-hover:scale-110 transition-transform" />
              <span>{ctaText}</span>
            </Button>
          </Link>
        )
      )}
    </div>
  )
}
