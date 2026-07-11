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
    <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-center p-6 bg-[var(--surface-hover)]/30 rounded-[var(--radius-md)] border border-dashed border-[var(--border)] transition-colors duration-200">
      <div className="p-3 bg-[var(--divider)] text-[var(--muted)] rounded-2xl mb-3 shadow-[var(--shadow-sm)] border border-[var(--border)]/40">
        <LineChart size={24} className="stroke-[1.5]" />
      </div>
      <p className="text-xs text-[var(--muted)] max-w-xs font-sans leading-relaxed mb-4">
        {message}
      </p>
      {ctaText && (
        ctaOnClick ? (
          <Button size="sm" variant="outline" onClick={ctaOnClick} className="text-xs flex items-center gap-1.5 hover:border-[var(--primary)]/30 hover:bg-[var(--primary)]/5 group">
            <Sparkles size={12} className="text-[var(--primary)] group-hover:scale-110 transition-transform" />
            <span>{ctaText}</span>
          </Button>
        ) : (
          <Link to={ctaTo || '#'} className="inline-block">
            <Button size="sm" variant="outline" className="text-xs flex items-center gap-1.5 hover:border-[var(--primary)]/30 hover:bg-[var(--primary)]/5 group">
              <Sparkles size={12} className="text-[var(--primary)] group-hover:scale-110 transition-transform" />
              <span>{ctaText}</span>
            </Button>
          </Link>
        )
      )}
    </div>
  )
}
