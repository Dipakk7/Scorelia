import { TrendingUp, Award, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { ResponsiveContainer, AreaChart, Area, XAxis } from 'recharts'
import { cn } from '@/lib/utils'
import { useTheme } from '@/providers/ThemeProvider'
import { useState, useEffect } from 'react'
import { CountUpText } from '@/components/ui/CountUpText'

interface QualityScoreCardProps {
  qualityScore: number
  readinessScore: number
  improvementScore: number
  history?: { date: string; score: number }[]
  onAnalyze?: () => void
  isAnalyzing?: boolean
}

export function QualityScoreCard({
  qualityScore = 0,
  readinessScore = 0,
  improvementScore = 0,
  history = [],
  onAnalyze,
  isAnalyzing = false,
}: QualityScoreCardProps) {
  const { theme } = useTheme()
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    checkDark()
    const observer = new MutationObserver(checkDark)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
    return () => observer.disconnect()
  }, [])

  const themeColors = {
    primary: 'var(--primary)',      // Resume Score -> Blue
    primaryDark: 'var(--primary-hover)',
    success: 'var(--success)',      // ATS -> Green
    successDark: 'var(--success)',
    warning: 'var(--accent)',       // Interview -> Orange
    warningDark: 'var(--accent-hover)',
    purple: 'var(--analytics)',     // Career -> Purple
    purpleDark: 'var(--analytics)',
    grid: 'var(--divider)',
    text: 'var(--heading)',
    mutedText: 'var(--muted)',
  }

  const isZeroState = qualityScore === 0 && readinessScore === 0 && improvementScore === 0

  // Circular progress helper
  const renderCircularGauge = (
    value: number,
    label: string,
    gradientId: string,
    fromColor: string,
    toColor: string,
    subtext: string
  ) => {
    const radius = 38
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (value / 100) * circumference

    return (
      <div className="flex flex-col items-center text-center p-5 bg-card/30 dark:bg-slate-900/20 backdrop-blur-md rounded-2xl border border-border/80 shadow-xs relative overflow-hidden group hover:scale-[1.01] hover:border-brand-500/20 dark:hover:border-brand-500/10 transition-all duration-300">
        <svg className="w-24 h-24 transform -rotate-90">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={fromColor} />
              <stop offset="100%" stopColor={toColor} />
            </linearGradient>
          </defs>
          {/* Outer circle track */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            className="stroke-slate-100 dark:stroke-slate-850"
            strokeWidth="7"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke={`url(#${gradientId})`}
            strokeWidth="7"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Value Label inside circle */}
        <div className="absolute top-[40px] flex flex-col items-center">
          <span className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            <CountUpText value={value} />
            <span className="text-[10px] text-slate-400 font-normal">%</span>
          </span>
        </div>

        <div className="mt-4">
          <h4 className="text-xs font-black text-muted-foreground tracking-wide uppercase">
            {label}
          </h4>
          <p className="text-[10px] text-muted-foreground mt-1 leading-tight font-medium">{subtext}</p>
        </div>
      </div>
    )
  }

  // Calculate rating tier
  const getScoreTier = (score: number) => {
    if (score >= 85) return { label: 'Excellent', color: 'bg-success/10 text-success border-success/20' }
    if (score >= 70) return { label: 'Good', color: 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/20' }
    if (score >= 50) return { label: 'Fair', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' }
    return { label: 'Needs Focus', color: 'bg-destructive/10 text-destructive border-destructive/20' }
  }

  const tier = getScoreTier(qualityScore)

  return (
    <Card className="border border-border/60 bg-card/70 backdrop-blur-md shadow-sm overflow-hidden font-sans rounded-2xl hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300">
      <div className="p-6 pb-4 flex justify-between items-center border-b border-border/60 bg-transparent">
        <div className="text-left">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/15">
              <Award size={15} />
            </span>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 m-0">
              AI Scoring Center
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            Real-time quality grading, career suitability index, and optimization history metrics.
          </p>
        </div>
        {!isZeroState && (
          <span className={`px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${tier.color}`}>
            {tier.label}
          </span>
        )}
      </div>

      <CardContent className="pt-6 space-y-6 bg-transparent">
        {isZeroState ? (
          <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-200/80 dark:border-slate-800 rounded-2xl bg-slate-50/20 dark:bg-slate-900/10 min-h-[220px]">
            <div className="p-3 bg-brand-500/10 border border-brand-500/20 rounded-2xl mb-3.5 text-brand-500 shadow-xs">
              <Sparkles size={22} className="stroke-[1.75]" />
            </div>
            <h4 className="text-sm font-extrabold text-foreground m-0">
              No AI analysis available
            </h4>
            <p className="text-xs text-slate-555 dark:text-slate-450 mt-1 max-w-xs leading-relaxed">
              Analyze your active resume selection to unlock intelligent ratings and ATS diagnostic scores.
            </p>
            {onAnalyze && (
              <Button
                variant="primary"
                size="sm"
                onClick={onAnalyze}
                disabled={isAnalyzing}
                className="mt-4 font-bold flex items-center gap-1.5 rounded-xl shadow-xs"
              >
                {isAnalyzing ? <Spinner size="sm" className="text-white" /> : <Sparkles size={12} />}
                <span>Analyze Resume</span>
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Metric Gauges Grid */}
            <div className="grid grid-cols-3 gap-4 bg-transparent">
              {renderCircularGauge(
                qualityScore,
                'Quality Score',
                'gradQuality',
                themeColors.primary,
                themeColors.primaryDark,
                'Weighted evaluation'
              )}
              {renderCircularGauge(
                readinessScore,
                'Career Readiness',
                'gradReady',
                themeColors.purple,
                themeColors.purpleDark,
                'Industry suitability'
              )}
              {renderCircularGauge(
                improvementScore,
                'ATS Grade',
                'gradImprove',
                themeColors.success,
                themeColors.successDark,
                'Keyword compliance'
              )}
            </div>

            {/* Small trend graph inside */}
            {history && history.length > 1 && (
              <div className="p-4 bg-[var(--surface-hover)]/30 border border-[var(--border)] rounded-2xl space-y-3 text-left">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5 text-[var(--muted)] font-medium">
                    <TrendingUp size={14} className="text-[var(--primary)]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Quality Score Trend
                    </span>
                  </div>
                  <span className="text-[10px] text-[var(--muted)] font-semibold uppercase tracking-wider">
                    Last {history.length} scans
                  </span>
                </div>
                <div className="h-16 w-full opacity-95 bg-transparent">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={history} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <defs>
                        <linearGradient id="scoreSpark" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={themeColors.primary} stopOpacity={0.25} />
                          <stop offset="95%" stopColor={themeColors.primary} stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="score"
                        stroke={themeColors.primary}
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#scoreSpark)"
                      />
                      <XAxis dataKey="date" hide />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default QualityScoreCard
