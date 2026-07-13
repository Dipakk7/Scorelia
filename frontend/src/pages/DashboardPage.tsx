import { useQuery } from '@tanstack/react-query'
import {
  FileText,
  Scan,
  MessageSquareCode,
  Map as MapIcon,
  Upload,
  Sparkles,
  Award,
  Layers,
  ArrowRight,
  Activity
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  ResponsiveContainer,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
  ComposedChart
} from 'recharts'

import api from '@/api/api'
import { useAuth } from '@/providers/AuthProvider'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table'
import { ErrorState } from '@/components/ui/ErrorState'
import { DashboardSkeleton } from '@/components/ui/Skeletons'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import type { ResumeResponse } from '@/types/resume'

interface DashboardStatsData {
  total_users: number
  total_resumes: number
  parsed_resumes: number
  total_job_matches: number
  average_ats_score: number
  average_match_score: number
  latest_resume: ResumeResponse | null
  latest_job_match: {
    resume_id: string
    timestamp: string
    overall_score: number
    grade: string
    job_title: string
    company: string
  } | null
  skill_gap_count: number
  interview_sessions: number
  career_progress: number
  cover_letters_generated: number
  ai_usage: number
}

interface ChartPoint {
  label: string
  value: number
}

// Recharts Custom premium Vercel/Stripe-style Tooltip
interface CustomTooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-border/80 bg-surface p-3.5 shadow-lg text-left font-sans select-none focus-visible:outline-none min-w-[170px] space-y-2.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted font-mono leading-none">{label}</p>
        <div className="space-y-2">
          {payload.map((pld: any, index: number) => {
            const dataKey = pld.dataKey
            const itemPayload = pld.payload
            
            // Format metric values: percentages vs integers
            const isPercentage = dataKey !== 'value'
            const displayVal = isPercentage ? `${Math.round(pld.value)}%` : pld.value
            
            // Safe derivation of difference
            let diff: number | undefined = undefined
            if (itemPayload) {
              diff = itemPayload[`${dataKey}Diff`]
            }
            
            return (
              <div key={index} className="flex items-center justify-between gap-5">
                <div className="flex items-center gap-1.5 text-xs font-semibold leading-none">
                  <span 
                    className="h-1.5 w-1.5 rounded-full shrink-0" 
                    style={{ backgroundColor: pld.color || pld.stroke }} 
                  />
                  <span className="text-muted font-medium leading-none">{pld.name}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold leading-none font-mono">
                  <span className="text-heading leading-none">{displayVal}</span>
                  {diff !== undefined && diff !== null && diff !== 0 && (
                    <span className={cn(
                      "text-[9px] font-bold px-1.5 py-0.5 rounded leading-none shrink-0",
                      diff > 0 ? "text-success bg-success/10" : "text-danger bg-danger/10"
                    )}>
                      {diff > 0 ? `+${Math.round(diff)}` : Math.round(diff)}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
  return null
}

// Custom Premium Legend
function CustomLegend({ payload }: any) {
  if (!payload) return null
  return (
    <div className="flex flex-wrap items-center justify-end gap-5 mb-2 text-[11px] font-semibold text-muted select-none">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-1.5 hover:text-heading cursor-default transition-colors duration-200 font-sans">
          <span 
            className="h-1.5 w-1.5 rounded-full shrink-0" 
            style={{ backgroundColor: entry.color }} 
          />
          <span className="leading-none">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

// Helper to merge trend data defensively without assuming index alignment
function mergeDefensively(
  trend1: ChartPoint[] | undefined,
  trend2: ChartPoint[] | undefined,
  key1: string,
  key2: string
) {
  const map = new Map<string, any>()
  const labelsOrder: string[] = []

  if (trend1) {
    trend1.forEach((pt) => {
      if (!map.has(pt.label)) {
        labelsOrder.push(pt.label)
      }
      map.set(pt.label, {
        label: pt.label,
        [key1]: pt.value,
      })
    })
  }

  if (trend2) {
    trend2.forEach((pt) => {
      if (!map.has(pt.label)) {
        labelsOrder.push(pt.label)
      }
      const existing = map.get(pt.label) || { label: pt.label }
      existing[key2] = pt.value
      map.set(pt.label, existing)
    })
  }

  const merged = labelsOrder.map((label) => map.get(label))

  // Dynamically compute difference from previous point for tooltips
  merged.forEach((item, index) => {
    if (index > 0) {
      const prevItem = merged[index - 1]
      if (item[key1] !== undefined && prevItem[key1] !== undefined) {
        item[`${key1}Diff`] = item[key1] - prevItem[key1]
      }
      if (item[key2] !== undefined && prevItem[key2] !== undefined) {
        item[`${key2}Diff`] = item[key2] - prevItem[key2]
      }
    }
  })

  return merged
}

// Layout-preserving Local Empty State Placeholder
interface LocalEmptyStateProps {
  icon: React.ComponentType<{ size?: number; className?: string }>
  title: string
  description: string
  ctaText?: string
  ctaTo?: string
}

function LocalEmptyState({ icon: Icon, title, description, ctaText, ctaTo }: LocalEmptyStateProps) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center text-center p-6 bg-surface-hover/30 rounded-[var(--radius-card)] border border-dashed border-border select-none animate-fade-in motion-reduce:animation-none">
      <div className="p-2 bg-primary/10 text-primary border border-primary/20 rounded-xl mb-3 shrink-0">
        <Icon size={16} className="stroke-[1.75]" />
      </div>
      <h4 className="text-xs font-bold text-heading font-sans mb-1 leading-none">{title}</h4>
      <p className="text-[11px] text-muted leading-relaxed font-sans max-w-[240px] mb-3">{description}</p>
      {ctaText && ctaTo && (
        <Button size="sm" variant="primary" asChild>
          <Link to={ctaTo}>
            {ctaText}
          </Link>
        </Button>
      )}
    </div>
  )
}

// Simple layout-preserving loading skeleton
const ChartSkeleton = () => (
  <div className="h-full w-full flex flex-col justify-between p-1 space-y-4 animate-pulse">
    <div className="flex-1 bg-divider/40 rounded-xl border border-dashed border-border flex items-center justify-center">
      <span className="text-xs text-muted font-mono">Loading chart records...</span>
    </div>
  </div>
)

// Local wrapper to standardize analytics card presentation
interface PremiumChartCardProps {
  title: string
  description: string
  badgeText?: string
  badgeVariant?: 'success' | 'info' | 'warning'
  timePeriod?: string
  children: React.ReactNode
}

function PremiumChartCard({
  title,
  description,
  badgeText,
  badgeVariant = 'info',
  timePeriod = 'Last 30 days',
  children,
}: PremiumChartCardProps) {
  const badgeClasses = {
    success: 'bg-success/10 text-success border-success/20',
    info: 'bg-primary/10 text-primary border-primary/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
  }

  return (
    <div className="border border-border/80 bg-surface shadow-sm rounded-[var(--radius-card)] p-6 text-left flex flex-col justify-between min-h-[385px] select-none hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 motion-reduce:transition-none motion-reduce:hover:transform-none animate-fade-in motion-reduce:animation-none">
      <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
        <div className="space-y-1.5 text-left min-w-[200px] flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold font-sans text-heading tracking-tight leading-none">
              {title}
            </h3>
            {badgeText && (
              <span className={cn('text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border leading-none font-mono select-none', badgeClasses[badgeVariant])}>
                {badgeText}
              </span>
            )}
          </div>
          <p className="text-xs text-muted leading-relaxed font-sans max-w-md">
            {description}
          </p>
        </div>
        <div className="shrink-0 flex items-center">
          <span className="text-[9px] font-bold uppercase tracking-wider text-muted bg-divider border border-border/60 px-2 py-0.5 rounded-md font-mono select-none">
            {timePeriod}
          </span>
        </div>
      </div>
      <div className="flex-1 w-full h-72 relative min-h-0">
        {children}
      </div>
    </div>
  )
}


interface DashboardKPICardProps {
  title: string
  value: string | number
  icon: React.ComponentType<{ size?: number; className?: string }>
  themeColor: 'primary' | 'success' | 'warning' | 'analytics' | 'github' | 'danger'
  statusBadge?: string
  supportingText?: string
  progressValue?: number
  isEmpty?: boolean
  emptyText?: string
  emptyCta?: {
    text: string
    to: string
  }
}

// Redesigned premium information card
function DashboardKPICard({
  title,
  value,
  icon: Icon,
  themeColor,
  statusBadge,
  supportingText,
  progressValue,
  isEmpty = false,
  emptyText,
  emptyCta,
}: DashboardKPICardProps) {
  const colorStyles = {
    primary: {
      border: 'hover:border-primary/30',
      text: 'text-primary',
      iconBg: 'bg-primary/10 dark:bg-primary/20 text-primary border-primary/20',
      barBg: 'bg-primary',
      badgeBg: 'bg-primary/10 text-primary border-primary/20',
    },
    success: {
      border: 'hover:border-success/30',
      text: 'text-success',
      iconBg: 'bg-success/10 dark:bg-success/20 text-success border-success/20',
      barBg: 'bg-success',
      badgeBg: 'bg-success/10 text-success border-success/20',
    },
    warning: {
      border: 'hover:border-warning/30',
      text: 'text-warning',
      iconBg: 'bg-warning/10 dark:bg-warning/20 text-warning border-warning/20',
      barBg: 'bg-warning',
      badgeBg: 'bg-warning/10 text-warning border-warning/20',
    },
    analytics: {
      border: 'hover:border-analytics/30',
      text: 'text-analytics',
      iconBg: 'bg-analytics/10 dark:bg-analytics/20 text-analytics border-analytics/20',
      barBg: 'bg-analytics',
      badgeBg: 'bg-analytics/10 text-analytics border-analytics/20',
    },
    github: {
      border: 'hover:border-github/30',
      text: 'text-github',
      iconBg: 'bg-github/10 dark:bg-github/20 text-github border-github/20',
      barBg: 'bg-github',
      badgeBg: 'bg-github/10 text-github border-github/20',
    },
    danger: {
      border: 'hover:border-danger/30',
      text: 'text-danger',
      iconBg: 'bg-danger/10 dark:bg-danger/20 text-danger border-danger/20',
      barBg: 'bg-danger',
      badgeBg: 'bg-danger/10 text-danger border-danger/20',
    },
  }

  const styles = colorStyles[themeColor]

  if (isEmpty) {
    return (
      <div
        className={cn(
          'relative overflow-hidden border border-dashed border-border/80 bg-surface/30 hover:bg-surface-hover/50 hover:border-border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md rounded-[var(--radius-card)] p-6 flex flex-col justify-between h-full min-h-[150px] select-none group motion-reduce:transition-none text-left'
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted font-mono leading-none block mb-1">
              {title}
            </span>
            <p className="text-xs text-muted font-sans leading-relaxed">
              {emptyText}
            </p>
          </div>
          <div className="p-2.5 bg-divider text-muted rounded-xl border border-border/30 shrink-0 group-hover:scale-105 transition-transform duration-200 motion-reduce:transition-none shadow-xs">
            <Icon size={18} className="stroke-[1.5]" />
          </div>
        </div>

        {emptyCta && (
          <div className="mt-4">
            <Link
              to={emptyCta.to}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-primary hover:text-primary-hover transition-colors font-sans hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            >
              <span>{emptyCta.text}</span>
              <ArrowRight size={12} className="group-hover/cta:translate-x-0.5 transition-transform duration-200 motion-reduce:transition-none" />
            </Link>
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden border border-border/80 bg-surface hover:bg-surface-hover transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md rounded-[var(--radius-card)] p-6 flex flex-col justify-between h-full min-h-[150px] select-none group motion-reduce:transition-none text-left',
        styles.border
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 flex-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted font-mono leading-none block mb-1.5">
            {title}
          </span>
          <div className="flex items-center gap-2 flex-wrap mt-1">
            <h3 className="text-3xl font-extrabold tracking-tight text-heading font-sans leading-none">
              {value}
            </h3>
            {statusBadge && (
              <span className={cn('text-[9px] font-bold px-2 py-0.5 rounded-full border leading-none font-mono select-none', styles.badgeBg)}>
                {statusBadge}
              </span>
            )}
          </div>
        </div>
        <div className={cn('p-2.5 rounded-xl border transition-all duration-200 group-hover:scale-105 shrink-0 motion-reduce:transition-none shadow-xs', styles.iconBg)}>
          <Icon size={18} className="stroke-[1.5]" />
        </div>
      </div>

      {progressValue !== undefined && (
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-wider text-muted font-mono">
            <span>Completion Progress</span>
            <span>{Math.round(progressValue)}%</span>
          </div>
          <div className="w-full bg-divider rounded-full h-1 overflow-hidden">
            <div
              className={cn('h-full rounded-full transition-all duration-500 ease-out', styles.barBg)}
              style={{ width: `${Math.min(100, Math.max(0, progressValue))}%` }}
            />
          </div>
        </div>
      )}

      {progressValue === undefined && supportingText && (
        <div className="mt-4 text-xs font-semibold text-muted/80 leading-normal font-sans">
          {supportingText}
        </div>
      )}
    </div>
  )
}

// Workspace Shortcut component for Quick Navigation
interface WorkspaceShortcutCardProps {
  title: string
  description: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  to: string
  themeColor: 'primary' | 'success' | 'analytics'
}

function WorkspaceShortcutCard({ title, description, icon: Icon, to, themeColor }: WorkspaceShortcutCardProps) {
  const colors = {
    primary: 'bg-primary/10 text-primary border-primary/20 hover:border-primary/40',
    success: 'bg-success/10 text-success border-success/20 hover:border-success/40',
    analytics: 'bg-analytics/10 text-analytics border-analytics/20 hover:border-analytics/40',
  }
  
  return (
    <Link 
      to={to} 
      className="group block h-full select-none rounded-[var(--radius-card)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <div className="flex items-center justify-between p-4 rounded-[var(--radius-card)] border border-border/80 bg-surface hover:bg-surface-hover/80 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 h-full motion-reduce:transition-none motion-reduce:hover:transform-none">
        <div className="flex items-center gap-3 text-left min-w-0">
          <div className={cn("p-2 rounded-xl border shrink-0 transition-transform duration-200 group-hover:scale-105 motion-reduce:transition-none shadow-xs", colors[themeColor])}>
            <Icon size={16} className="stroke-[1.5]" />
          </div>
          <div className="space-y-0.5 min-w-0">
            <h4 className="text-xs font-bold text-heading font-sans group-hover:text-primary transition-colors leading-none truncate">
              {title}
            </h4>
            <p className="text-[11px] text-muted font-sans leading-normal truncate max-w-[200px] md:max-w-xs">
              {description}
            </p>
          </div>
        </div>
        <div className="text-muted group-hover:text-primary transition-colors duration-200 pl-2 shrink-0">
          <ArrowRight size={14} className="stroke-[1.5] transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none" />
        </div>
      </div>
    </Link>
  )
}

// Redesigned premium vertical timeline (keeps existing logs order)
interface RecentActivityTimelineProps {
  items: {
    id: string
    title: string
    description: string
    timestamp: string
    icon: any
    badgeText?: string
    badgeVariant?: string
  }[]
}

function RecentActivityTimeline({ items }: RecentActivityTimelineProps) {
  return (
    <Card className="border-border/80 bg-surface rounded-[var(--radius-card)] shadow-sm text-left flex flex-col h-full select-none">
      <CardHeader className="pb-3.5 p-6">
        <CardTitle className="text-sm font-bold text-heading font-sans">
          Recent Activity
        </CardTitle>
        <CardDescription className="text-xs text-muted leading-relaxed font-sans">
          Operational transaction timeline logs.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between p-6 pt-0">
        {items.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted font-sans border border-dashed border-border/80 rounded-xl">
            No recent activities logged in workspace.
          </div>
        ) : (
          <div className="relative pl-6 py-0.5">
            {/* Timeline vertical connector line */}
            <div className="absolute left-[7px] top-2.5 bottom-2.5 w-0.5 bg-border/40" />

            <div className="space-y-5">
              {items.map((act) => {
                const Icon = act.icon
                const dateVal = new Date(act.timestamp)
                const formattedDate = dateVal.toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })
                
                const typeColors = act.badgeVariant === 'success' 
                  ? 'bg-success/10 text-success border-success/20' 
                  : 'bg-primary/10 text-primary border-primary/20'

                return (
                  <div key={act.id} className="flex gap-3 relative items-start group">
                    {/* Timeline dot */}
                    <div className={cn(
                      "absolute left-0 top-1 z-10 w-3.5 h-3.5 rounded-full border-2 border-surface flex items-center justify-center shrink-0 shadow-xs transition-transform duration-200 group-hover:scale-110",
                      act.badgeVariant === 'success' ? 'bg-success' : 'bg-primary'
                    )}>
                      <div className="w-1 h-1 rounded-full bg-surface" />
                    </div>

                    {/* Event Content */}
                    <div className="flex-1 space-y-1 pl-5">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-heading font-sans leading-none">{act.title}</span>
                          <span className={cn("p-0.5 rounded border shrink-0 text-xs", typeColors)}>
                            <Icon size={10} className="stroke-[1.5]" />
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-muted">{formattedDate}</span>
                      </div>
                      <p className="text-[11px] text-body/80 leading-relaxed font-sans">{act.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Compact Premium Table for Resume Workspace History
interface ResumeWorkspaceTableProps {
  resumes: ResumeResponse[]
}

function ResumeWorkspaceTable({ resumes }: ResumeWorkspaceTableProps) {
  return (
    <Card className="border-border/80 bg-surface rounded-[var(--radius-card)] shadow-sm text-left flex flex-col h-full select-none">
      <CardHeader className="pb-3.5 p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-sm font-bold text-heading font-sans">
              Resumes List
            </CardTitle>
            <CardDescription className="text-xs text-muted leading-relaxed font-sans">
              Chronological record of uploaded credentials in the workspace.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between p-6 pt-0">
        {resumes.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted font-sans border border-dashed border-border/80 rounded-xl">
            No credentials stored. Select "Improve Resume" in the command center to initialize upload.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="font-bold text-[10px] uppercase tracking-wider text-muted font-mono py-2 px-3 text-left">File Name</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-wider text-muted font-mono py-2 px-3 text-left">Uploaded</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-wider text-muted font-mono py-2 px-3 text-left">ATS Score</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-wider text-muted font-mono py-2 px-3 text-left">Status</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-wider text-muted font-mono py-2 px-3 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resumes.slice(0, 5).map((resume) => {
                  const hasAts = resume.ats_score !== null
                  const ats = resume.ats_score ?? 0
                  const atsStatus = ats >= 80 ? 'Excellent' : ats >= 70 ? 'Good' : ats >= 50 ? 'Passing' : 'Needs Work'
                  
                  return (
                    <TableRow key={resume.id} className="hover:bg-surface-hover/40 transition-colors border-border/60 group">
                      {/* File Name with Resume Icon */}
                      <TableCell className="py-2 px-3 text-left">
                        <div className="flex items-center gap-2 max-w-[180px] sm:max-w-xs md:max-w-md">
                          <div className="p-1 rounded bg-primary/10 text-primary border border-primary/20 shrink-0">
                            <FileText size={14} className="stroke-[1.5]" />
                          </div>
                          <span className="font-semibold text-heading truncate text-xs leading-none group-hover:text-primary transition-colors duration-200">
                            {resume.original_filename}
                          </span>
                        </div>
                      </TableCell>
                      
                      {/* Uploaded date formatting */}
                      <TableCell className="py-2 px-3 text-left">
                        <span className="text-xs text-body/90 font-medium font-sans">
                          {new Date(resume.uploaded_at).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </TableCell>
                      
                      {/* ATS score / badge */}
                      <TableCell className="py-2 px-3 text-left">
                        {hasAts ? (
                          <div className="flex items-center gap-1.5 font-mono">
                            <span className={cn(
                              "text-xs font-bold leading-none",
                              ats >= 80 ? "text-success" : ats >= 70 ? "text-warning" : "text-danger"
                            )}>
                              {ats}%
                            </span>
                            <span className={cn(
                              "text-[9px] font-bold px-1.5 py-0.5 rounded border select-none shrink-0",
                              ats >= 80 ? "bg-success/10 text-success border-success/20" : 
                              ats >= 70 ? "bg-warning/10 text-warning border-warning/20" : 
                              "bg-danger/10 text-danger border-danger/20"
                            )}>
                              {atsStatus}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted text-xs font-semibold">N/A</span>
                        )}
                      </TableCell>
                      
                      {/* Status */}
                      <TableCell className="py-2 px-3 text-left">
                        <Badge
                          variant={
                            resume.status.toLowerCase() === 'completed' || resume.status.toLowerCase() === 'parsed'
                              ? 'success'
                              : resume.status.toLowerCase() === 'failed'
                              ? 'error'
                              : 'warning'
                          }
                          className="text-[9px] font-bold font-mono px-2 py-0.5 tracking-normal border"
                        >
                          {resume.status}
                        </Badge>
                      </TableCell>
                      
                      {/* Compact Action */}
                      <TableCell className="py-2 px-3 text-right">
                        <Button size="sm" variant="outline" className="h-7 text-xs px-3 rounded-[var(--radius-button)] font-semibold bg-surface hover:bg-surface-hover transition-colors border border-border/80" asChild>
                          <Link to="/resumes">
                            Manage
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Priority-ranked AI Intelligence Center
interface RecommendationItem {
  category: string
  title: string
  explanation: string
  recommendation: string
  expectedImpact: string
  severity: string
  severityVariant: 'danger' | 'warning' | 'success' | 'info'
  actionText: string
  actionLink: string
  icon: any
  priority: number // 1: High, 2: Medium, 3: Low
}

interface AIIntelligenceCenterProps {
  resumesCount: number
  atsScore: number
  skillGaps: number
  interviewSessions: number
  jobMatches: number
  _coverLetters: number
}

function AIIntelligenceCenter({
  resumesCount,
  atsScore,
  skillGaps,
  interviewSessions,
  jobMatches,
  _coverLetters
}: AIIntelligenceCenterProps) {
  const recommendations: RecommendationItem[] = []

  // ATS Optimization Recommendations
  if (resumesCount === 0) {
    recommendations.push({
      category: 'ATS Optimization',
      title: 'ATS Engine Offline',
      explanation: 'No resume credentials detected in active workspace.',
      recommendation: 'Upload a resume to start keyword analysis and career compatibility mapping.',
      expectedImpact: 'Unlock ATS scoring',
      severity: 'Action Required',
      severityVariant: 'danger',
      actionText: 'Upload Resume',
      actionLink: '/resumes',
      icon: Upload,
      priority: 1
    })
  } else if (atsScore < 70) {
    recommendations.push({
      category: 'ATS Optimization',
      title: 'Keyword Gap Detected',
      explanation: `Average ATS score of ${atsScore}% is below standard (70%).`,
      recommendation: 'Integrate target role keywords to clear automated ATS screening filters.',
      expectedImpact: '+15% ATS score',
      severity: 'Needs Attention',
      severityVariant: 'danger',
      actionText: 'Improve Resume',
      actionLink: '/resumes',
      icon: Sparkles,
      priority: 1
    })
  } else if (atsScore < 85) {
    recommendations.push({
      category: 'ATS Optimization',
      title: 'Formatting Audit Recommended',
      explanation: `ATS score is strong (${atsScore}%), but minor keyword coverage can be improved.`,
      recommendation: 'Incorporate secondary technical keywords to maximize search ranking.',
      expectedImpact: '+8% ATS score',
      severity: 'Warning',
      severityVariant: 'warning',
      actionText: 'Refine ATS',
      actionLink: '/ats',
      icon: Scan,
      priority: 2
    })
  } else {
    recommendations.push({
      category: 'ATS Optimization',
      title: 'Optimized Vocabulary',
      explanation: `ATS vocabulary is highly optimized (${atsScore}%) across your resumes.`,
      recommendation: 'Monitor search criteria and customize details for target positions.',
      expectedImpact: 'Maintain top rank',
      severity: 'Optimized',
      severityVariant: 'success',
      actionText: 'Analyze ATS',
      actionLink: '/ats',
      icon: Award,
      priority: 3
    })
  }

  // Skill Gap Audit Recommendations
  if (resumesCount > 0) {
    if (skillGaps > 0) {
      recommendations.push({
        category: 'Skill Gap Audit',
        title: 'Core Deficits Flagged',
        explanation: `${skillGaps} skill discrepancies detected relative to matched target vacancies.`,
        recommendation: 'Add missing skills and certifications to your active career roadmap.',
        expectedImpact: `-${skillGaps} Skill Gaps`,
        severity: 'Warning',
        severityVariant: 'warning',
        actionText: 'View Roadmap',
        actionLink: '/roadmap',
        icon: MapIcon,
        priority: 2
      })
    } else {
      recommendations.push({
        category: 'Skill Gap Audit',
        title: 'Full Competency Aligned',
        explanation: 'All core competencies aligned with active vacancy targets.',
        recommendation: 'Maintain skills currency and explore advanced credentials.',
        expectedImpact: '100% Aligned',
        severity: 'Optimized',
        severityVariant: 'success',
        actionText: 'Check Roadmap',
        actionLink: '/roadmap',
        icon: FileText,
        priority: 3
      })
    }
  }

  // Interview Loop Preparedness Recommendations
  if (resumesCount > 0) {
    if (interviewSessions === 0) {
      recommendations.push({
        category: 'Interview Loop',
        title: 'Practice Pending',
        explanation: 'No mock interview loops have been logged in the active workspace.',
        recommendation: 'Complete your first AI mock session to audit verbal keyword fluency.',
        expectedImpact: '+20% Readiness',
        severity: 'Practice Needed',
        severityVariant: 'danger',
        actionText: 'Start Mock Prep',
        actionLink: '/interview',
        icon: MessageSquareCode,
        priority: 1
      })
    } else if (interviewSessions < 5) {
      recommendations.push({
        category: 'Interview Loop',
        title: 'Active Training Phase',
        explanation: `Completed ${interviewSessions} technical mock sessions. Target pace is solid.`,
        recommendation: 'Conduct targeted mock rounds addressing complex technical topics.',
        expectedImpact: '+10% Confidence',
        severity: 'In Training',
        severityVariant: 'warning',
        actionText: 'Practice Loops',
        actionLink: '/interview',
        icon: MessageSquareCode,
        priority: 2
      })
    } else {
      recommendations.push({
        category: 'Interview Loop',
        title: 'Peak Performance Level',
        explanation: `Completed ${interviewSessions} mock interview preparation loops.`,
        recommendation: 'Utilize specialized tracks to lock in critical verbal delivery.',
        expectedImpact: 'Ready',
        severity: 'Optimized',
        severityVariant: 'success',
        actionText: 'Launch Session',
        actionLink: '/interview',
        icon: Award,
        priority: 3
      })
    }
  }

  // Job Matches Recommendations
  if (resumesCount > 0) {
    if (jobMatches === 0) {
      recommendations.push({
        category: 'Job Alignment',
        title: 'Matches Unranked',
        explanation: 'No active job vacancies matched in catalog database.',
        recommendation: 'Scan your resume against active job listings to populate recommendations.',
        expectedImpact: 'Discover vacancies',
        severity: 'Action Required',
        severityVariant: 'danger',
        actionText: 'Scan Vacancies',
        actionLink: '/ats',
        icon: Layers,
        priority: 1
      })
    }
  }

  // Sort recommendations by Priority (lower priority value means higher ranking)
  const sortedRecs = [...recommendations].sort((a, b) => a.priority - b.priority)

  const severityBadgeClasses = {
    danger: 'bg-danger/10 text-danger border-danger/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    success: 'bg-success/10 text-success border-success/20',
    info: 'bg-primary/10 text-primary border-primary/20',
  }

    return (
    <div className="space-y-5 text-left select-none animate-fade-in motion-reduce:animation-none">
      <div className="flex items-center justify-between pb-1 flex-wrap gap-2">
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-heading tracking-tight font-sans">AI Intelligence Center</h2>
          <p className="text-xs text-muted leading-relaxed font-sans">Priority-ranked actionable recommendations derived from your active workspace metrics.</p>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-primary/10 border border-primary/20 text-primary font-mono shrink-0">
          Copilot Calibrated
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {sortedRecs.map((rec, index) => {
          const RecIcon = rec.icon
          const isHighPriority = rec.priority === 1
          
          return (
            <div 
              key={index} 
              className={cn(
                "flex flex-col h-full justify-between p-6 rounded-[var(--radius-card)] border bg-surface hover:bg-surface-hover/80 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group motion-reduce:transition-none motion-reduce:hover:transform-none",
                isHighPriority ? "border-primary/30 ring-1 ring-primary/5" : "border-border"
              )}
            >
              <div className="space-y-4">
                {/* Header: Icon + Category + Severity Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0 group-hover:scale-105 transition-transform duration-200 motion-reduce:transition-none">
                      <RecIcon size={16} className="stroke-[1.5]" />
                    </div>
                    <span className="text-xs font-bold text-heading font-sans tracking-tight truncate">
                      {rec.category}
                    </span>
                  </div>
                  <span className={cn("px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border font-mono select-none shrink-0", severityBadgeClasses[rec.severityVariant])}>
                    {rec.severity}
                  </span>
                </div>
                
                {/* Title & Explanation */}
                <div className="space-y-1.5">
                  <h4 className="text-sm font-bold text-heading font-sans leading-snug">
                    {rec.title}
                  </h4>
                  <p className="text-xs text-body/80 leading-relaxed font-sans font-medium">
                    {rec.explanation}
                  </p>
                </div>
                
                {/* Recommendation Box */}
                <div className="p-3 bg-surface-hover/50 rounded-xl border border-border/40 text-left space-y-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-muted font-mono block leading-none">Recommendation</span>
                  <p className="text-[11px] text-body/90 font-sans leading-relaxed">
                    {rec.recommendation}
                  </p>
                </div>
                
                {/* Expected Impact */}
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="text-muted text-[9px] uppercase font-bold tracking-widest font-mono">Expected Impact:</span>
                  <span className="text-success font-bold font-mono bg-success/10 px-2 py-0.5 rounded-md border border-success/20 leading-none text-[10px]">
                    {rec.expectedImpact}
                  </span>
                </div>
              </div>
              
              {/* Action Button */}
              <div className="mt-5">
                <Button size="sm" variant="primary" className="w-full h-8.5 rounded-[var(--radius-button)]" asChild>
                  <Link to={rec.actionLink}>
                    {rec.actionText}
                  </Link>
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const userDisplayName = user?.full_name || user?.email.split('@')[0] || 'User'
  
  const currentDate = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }
  const greeting = getGreeting()

  // Queries
  const {
    data: analytics,
    isLoading: analyticsLoading,
    error: analyticsError,
    refetch: refetchAnalytics,
  } = useQuery<DashboardStatsData>({
    queryKey: ['dashboardAnalytics'],
    queryFn: async () => {
      const res = await api.get('/analytics/dashboard')
      return res.data.data
    },
  })

  const {
    data: resumesData,
    isLoading: resumesLoading,
    error: resumesError,
    refetch: refetchResumes,
  } = useQuery<{ resumes: ResumeResponse[]; total: number }>({
    queryKey: ['dashboardResumes'],
    queryFn: async () => {
      const res = await api.get('/resumes')
      return res.data
    },
  })

  const { data: scoreTrend, isLoading: scoreLoading } = useQuery<ChartPoint[]>({
    queryKey: ['chart', 'resume-score-trend'],
    queryFn: async () => {
      const res = await api.get('/analytics/charts/resume-score-trend')
      return res.data.data.data
    },
  })

  const { data: atsTrend, isLoading: atsLoading } = useQuery<ChartPoint[]>({
    queryKey: ['chart', 'ats-trend'],
    queryFn: async () => {
      const res = await api.get('/analytics/charts/ats-trend')
      return res.data.data.data
    },
  })

  const { data: matchTrend, isLoading: matchLoading } = useQuery<ChartPoint[]>({
    queryKey: ['chart', 'job-match-trend'],
    queryFn: async () => {
      const res = await api.get('/analytics/charts/job-match-trend')
      return res.data.data.data
    },
  })

  const { data: interviewTrend, isLoading: interviewLoading } = useQuery<ChartPoint[]>({
    queryKey: ['chart', 'interview-performance'],
    queryFn: async () => {
      const res = await api.get('/analytics/charts/interview-performance')
      return res.data.data.data
    },
  })

  const { data: weeklyTrend, isLoading: weeklyLoading } = useQuery<ChartPoint[]>({
    queryKey: ['chart', 'weekly-activity'],
    queryFn: async () => {
      const res = await api.get('/analytics/charts/weekly-activity')
      return res.data.data.data
    },
  })

  const { data: monthlyTrend, isLoading: monthlyLoading } = useQuery<ChartPoint[]>({
    queryKey: ['chart', 'monthly-activity'],
    queryFn: async () => {
      const res = await api.get('/analytics/charts/monthly-activity')
      return res.data.data.data
    },
  })

  const handleRetry = () => {
    refetchAnalytics()
    refetchResumes()
  }

  const isLoading = analyticsLoading || resumesLoading
  const isError = !!analyticsError || !!resumesError

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (isError) {
    return (
      <ErrorState
        title="Dashboard Sync Failed"
        message="Failed to load dashboard metrics from FastAPI. Please check backend connection."
        onRetry={handleRetry}
      />
    )
  }

  const resumes = resumesData?.resumes ?? []

  const recentActivities: any[] = []
  if (analytics?.latest_resume) {
    recentActivities.push({
      id: 'latest-resume',
      title: 'Resume Uploaded',
      description: `Resume "${analytics.latest_resume.original_filename}" parsed successfully.`,
      timestamp: analytics.latest_resume.uploaded_at,
      icon: Upload,
      badgeText: analytics.latest_resume.ats_score ? `Score: ${analytics.latest_resume.ats_score}` : undefined,
      badgeVariant: 'success',
    })
  }

  if (analytics?.latest_job_match) {
    recentActivities.push({
      id: 'latest-match',
      title: 'Job Match Completed',
      description: `Matched against "${analytics.latest_job_match.job_title}" at ${analytics.latest_job_match.company}.`,
      timestamp: analytics.latest_job_match.timestamp,
      icon: Scan,
      badgeText: `Match: ${analytics.latest_job_match.overall_score}%`,
      badgeVariant: 'info',
    })
  }

  const hasWeeklyActivity = weeklyTrend && weeklyTrend.length > 0 && weeklyTrend.some(p => p.value > 0)
  const hasMonthlyActivity = monthlyTrend && monthlyTrend.length > 0 && monthlyTrend.some(p => p.value > 0)

  // Defensive merged datasets for Premium charts
  const combinedChart1Data = mergeDefensively(scoreTrend, atsTrend, 'resumeScore', 'atsScore')
  const combinedChart2Data = mergeDefensively(matchTrend, interviewTrend, 'matchScore', 'interviewReadiness')

  // AI Career Brief Dynamic Calculations & Fallbacks
  const atsScore = analytics?.average_ats_score ?? 0
  const latestResumeScore = analytics?.latest_resume?.ats_score ?? atsScore
  const skillGaps = analytics?.skill_gap_count ?? 0
  const totalJobMatches = analytics?.total_job_matches ?? 0
  const interviewSessions = analytics?.interview_sessions ?? 0

  // Dynamic Confidence Score Calculation based on parsed resume data confidence
  const getConfidencePercentage = () => {
    if (resumes.length === 0) return 0
    const parsedData = analytics?.latest_resume?.parsed_data?.data
    if (!parsedData) {
      return atsScore > 0 ? Math.round(atsScore) : 75
    }
    
    const confidences = [
      parsedData.name?.confidence,
      parsedData.email?.confidence,
      parsedData.phone?.confidence,
      parsedData.skills?.confidence,
      parsedData.education?.confidence,
      parsedData.experience?.confidence,
      parsedData.projects?.confidence,
      parsedData.certifications?.confidence,
    ].filter((c): c is number => typeof c === 'number' && c > 0)

    if (confidences.length === 0) {
      return atsScore > 0 ? Math.round(atsScore) : 75
    }

    const avg = confidences.reduce((a, b) => a + b, 0) / confidences.length
    const pct = avg <= 1 ? avg * 100 : avg
    return Math.round(pct)
  }

  const confidencePct = getConfidencePercentage()

  const getConfidenceBadge = (pct: number) => {
    if (resumes.length === 0) {
      return { label: 'Needs Attention', colorClass: 'text-danger bg-danger/10 border-danger/20' }
    }
    if (pct >= 85) {
      return { label: `High (${pct}%)`, colorClass: 'text-success bg-success/10 border-success/20' }
    }
    if (pct >= 70) {
      return { label: `Good (${pct}%)`, colorClass: 'text-primary bg-primary/10 border-primary/20' }
    }
    if (pct >= 50) {
      return { label: `Moderate (${pct}%)`, colorClass: 'text-warning bg-warning/10 border-warning/20' }
    }
    return { label: `Needs Attention (${pct}%)`, colorClass: 'text-danger bg-danger/10 border-danger/20' }
  }

  const confidenceBadge = getConfidenceBadge(confidencePct)

  // AI Career Recommendation calculation
  const getRecommendation = () => {
    if (resumes.length === 0) {
      return {
        title: "PRIMARY AI RECOMMENDATION",
        recommendation: "Upload your initial resume",
        details: "Activate the ATS alignment analyzer, skill gaps evaluator, and matching intelligence systems to start optimizing your profile.",
        icon: Upload,
        accentBorder: "border-l-danger",
      }
    }
    
    if (atsScore < 70) {
      const isVeryLow = atsScore < 50
      return {
        title: "PRIMARY AI RECOMMENDATION",
        recommendation: "Improve ATS keyword coverage",
        details: `Your ATS score is currently ${atsScore}%. Improving missing keywords could significantly increase your matching opportunities.`,
        icon: Sparkles,
        accentBorder: isVeryLow ? "border-l-danger" : "border-l-warning",
      }
    }
    
    if (skillGaps > 0) {
      return {
        title: "PRIMARY AI RECOMMENDATION",
        recommendation: "Address core skill gaps",
        details: `Resolve the ${skillGaps} missing skill gaps highlighted in your profile to expand compatibility scores against matched roles.`,
        icon: Scan,
        accentBorder: "border-l-primary",
      }
    }
    
    const readiness = interviewSessions ? Math.min(100, Math.max(50, 50 + interviewSessions * 7)) : 0
    if (readiness < 80) {
      return {
        title: "PRIMARY AI RECOMMENDATION",
        recommendation: "Run mock interview session",
        details: "Your resume matches well with target expectations. Run a specialized mock interview session to evaluate tech readiness.",
        icon: MessageSquareCode,
        accentBorder: "border-l-primary",
      }
    }
    
    return {
      title: "PRIMARY AI RECOMMENDATION",
      recommendation: "Maintain active monitoring",
      details: "Resume calibration levels are excellent. Keep auditing matched roles, sending AI cover letters, and tracking roadmap progress.",
      icon: Activity,
      accentBorder: "border-l-success",
    }
  }

  const rec = getRecommendation()

  return (
    <div className="space-y-12 text-left animate-fade-in motion-reduce:animation-none pb-8 select-none">
      
      {/* 1. HERO - AI Career Command Center */}
      <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300 select-none motion-reduce:transition-none">
        {/* Subtle decorative vector line indicator */}
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Left Column: Command Summary & Primary AI Recommendation */}
          <div className="lg:col-span-8 flex flex-col justify-between space-y-5">
            
            {/* Header info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted font-mono bg-divider px-2.5 py-0.5 rounded">
                  {currentDate}
                </span>
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mt-3">
                {greeting} 👋
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-heading tracking-tight mt-1 font-sans leading-none">
                {userDisplayName}
              </h1>
              <p className="text-xs md:text-sm text-body/80 font-sans leading-relaxed max-w-xl mt-3">
                Continue improving your career with AI-powered resume intelligence, interview preparation, and job matching.
              </p>
            </div>

            {/* Subtle Divider */}
            <hr className="border-t border-border/40 my-1" />

            {/* AI Actionable Next Recommendation Card */}
            <div className={cn("relative bg-surface-hover/30 border border-border/50 rounded-xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 select-none", rec.accentBorder, "border-l-[3px]")}>
              
              {/* Confidence Badge placed in Top-Right */}
              <div className="absolute top-4 right-4">
                <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold border font-mono select-none tracking-tight", confidenceBadge.colorClass)}>
                  {confidenceBadge.label}
                </span>
              </div>

              {/* Card Layout: Icon -> Title -> Recommendation -> Details */}
              <div className="flex flex-col items-start text-left">
                <div className="p-2 rounded-xl border border-border bg-surface text-primary mb-3.5">
                  <rec.icon size={16} className="stroke-[1.5]" />
                </div>
                
                <span className="text-[9px] font-black uppercase tracking-wider text-muted font-mono mb-1 leading-none">
                  {rec.title}
                </span>
                
                <h3 className="text-sm font-bold text-heading font-sans mb-1 leading-snug">
                  {rec.recommendation}
                </h3>
                
                <p className="text-xs text-body/90 font-sans leading-relaxed max-w-lg">
                  {rec.details}
                </p>
              </div>
            </div>

            {/* Command Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button variant="primary" size="sm" asChild>
                <Link to="/resumes" className="gap-2 select-none">
                  <Sparkles size={14} className="stroke-[1.5]" />
                  <span>Improve Resume</span>
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/ats" className="gap-2 select-none">
                  <Scan size={14} className="stroke-[1.5]" />
                  <span>Analyze ATS</span>
                </Link>
              </Button>
            </div>

          </div>

          {/* Right Column: Career Health Panel */}
          <div className="lg:col-span-4 flex flex-col pt-4 lg:pt-0">
            <div className="border border-border/50 bg-surface-hover/20 rounded-xl p-6 flex flex-col justify-between h-full select-none">
              <div className="space-y-5">
                <div className="flex items-center gap-2 text-[10px] font-black text-muted uppercase tracking-wider font-mono">
                  <Activity size={12} className="text-primary stroke-[1.5]" />
                  <span>Career Health</span>
                </div>
                
                <div className="space-y-4">
                  {/* Row 1: Resume Score - Blue */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-body flex items-center gap-1.5 select-none font-sans">
                        <FileText size={14} className="text-primary stroke-[1.5]" />
                        <span>Resume Score</span>
                      </span>
                      <span className="text-heading font-bold font-mono">{resumes.length > 0 ? `${latestResumeScore}%` : '0%'}</span>
                    </div>
                    <div className="w-full bg-divider rounded-full h-1 overflow-hidden">
                      <div 
                        className="bg-primary h-full rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${resumes.length > 0 ? latestResumeScore : 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Row 2: ATS - Green */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-body flex items-center gap-1.5 select-none font-sans">
                        <Award size={14} className="text-career stroke-[1.5]" />
                        <span>ATS Score</span>
                      </span>
                      <span className="text-heading font-bold font-mono">{resumes.length > 0 ? `${atsScore}%` : '0%'}</span>
                    </div>
                    <div className="w-full bg-divider rounded-full h-1 overflow-hidden">
                      <div 
                        className="bg-career h-full rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${resumes.length > 0 ? atsScore : 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Row 3: Job Matches - Purple */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold py-0.5 border-b border-divider/40 pb-1">
                      <span className="text-body flex items-center gap-1.5 select-none font-sans">
                        <Layers size={14} className="text-analytics stroke-[1.5]" />
                        <span>Job Matches</span>
                      </span>
                      <span className="text-heading font-bold font-mono">
                        {totalJobMatches} {totalJobMatches === 1 ? 'Match' : 'Matches'}
                      </span>
                    </div>
                  </div>

                  {/* Row 4: Interview Readiness - Amber */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold py-0.5 border-b border-divider/40 pb-1">
                      <span className="text-body flex items-center gap-1.5 select-none font-sans">
                        <MessageSquareCode size={14} className="text-warning stroke-[1.5]" />
                        <span>Interview Readiness</span>
                      </span>
                      <span className="text-heading font-bold text-xs font-sans">
                        {resumes.length === 0 ? 'Not Started' : interviewSessions === 0 ? 'Needs Practice' : 'Active Practice'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {resumes.length === 0 && (
                <div className="text-[10px] text-muted italic font-medium pt-4 text-center font-sans border-t border-border/30 mt-5 select-none leading-relaxed">
                  Upload initial resume to calibrate and map career health metrics.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. AI INTELLIGENCE CENTER */}
      <AIIntelligenceCenter
        resumesCount={resumes.length}
        atsScore={atsScore}
        skillGaps={skillGaps}
        interviewSessions={interviewSessions}
        jobMatches={totalJobMatches}
        _coverLetters={analytics?.cover_letters_generated ?? 0}
      />

      {/* 3. UNIQUE KPI METRICS (Avoiding duplication with Hero) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Career Roadmap Progress */}
        <DashboardKPICard
          title="Career Progress"
          value={`${analytics?.career_progress ?? 0}%`}
          icon={MapIcon}
          themeColor="analytics"
          statusBadge={
            (analytics?.career_progress ?? 0) >= 75 ? 'Advanced' :
            (analytics?.career_progress ?? 0) >= 40 ? 'Intermediate' :
            (analytics?.career_progress ?? 0) > 0 ? 'Started' : 'Inactive'
          }
          supportingText="Milestones mapped and completed on roadmap"
          progressValue={analytics?.career_progress ?? 0}
          isEmpty={!analytics || (analytics.career_progress ?? 0) === 0}
          emptyText="No milestones completed yet. Map your career path to activate progress tracking."
          emptyCta={{ text: 'Start Roadmap →', to: '/roadmap' }}
        />

        {/* KPI 2: Skill Gaps */}
        <DashboardKPICard
          title="Skill Gaps"
          value={analytics?.skill_gap_count ?? 0}
          icon={Scan}
          themeColor="primary"
          statusBadge={
            resumes.length === 0 ? 'Pending' :
            (analytics?.skill_gap_count ?? 0) === 0 ? 'Aligned' : 'Action Required'
          }
          supportingText={
            (analytics?.skill_gap_count ?? 0) > 0 
              ? `${analytics?.skill_gap_count} gaps identified relative to matches` 
              : 'All core skills aligned with matches'
          }
          isEmpty={resumes.length === 0}
          emptyText="No credentials audited. Scan resumes against job specs to calibrate skill alignments."
          emptyCta={{ text: 'Audit Skill Gaps →', to: '/roadmap' }}
        />

        {/* KPI 3: Cover Letters */}
        <DashboardKPICard
          title="Cover Letters"
          value={analytics?.cover_letters_generated ?? 0}
          icon={Sparkles}
          themeColor="github"
          statusBadge={
            (analytics?.cover_letters_generated ?? 0) > 0 ? 'Active' : 'Offline'
          }
          supportingText={
            (analytics?.cover_letters_generated ?? 0) > 0
              ? `${analytics?.cover_letters_generated} customized applications drafted`
              : 'Draft tailored pitch assets using AI'
          }
          isEmpty={!analytics || (analytics.cover_letters_generated ?? 0) === 0}
          emptyText="No cover letters drafted yet. Generate tailored, role-specific letters using AI."
          emptyCta={{ text: 'Generate Draft →', to: '/cover-letter' }}
        />

        {/* KPI 4: Total Resumes */}
        <DashboardKPICard
          title="Workspace Credentials"
          value={resumes.length}
          icon={FileText}
          themeColor="success"
          statusBadge={
            resumes.length >= 3 ? 'Multi-Role' :
            resumes.length > 0 ? 'Calibrated' : 'None'
          }
          supportingText={
            resumes.length > 0
              ? `${resumes.length} parsed credentials stored in workspace`
              : 'Store and manage resumes'
          }
          isEmpty={resumes.length === 0}
          emptyText="No resume credentials stored. Upload your resume to start tracking performance."
          emptyCta={{ text: 'Upload Resume →', to: '/resumes' }}
        />
      </div>

      {/* 4. PREMIUM TREND CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Resume Score & ATS Trend */}
        <PremiumChartCard
          title="Resume Score & ATS Trend"
          description="Timeline progress of resume keyword matches and automated ATS evaluations."
          badgeText={resumes.length > 0 ? "Calibrated" : "Uncalibrated"}
          badgeVariant={resumes.length > 0 ? "success" : "warning"}
        >
                    {scoreLoading || atsLoading ? (
            <ChartSkeleton />
          ) :  combinedChart1Data.length === 0 ? (
            <LocalEmptyState
              icon={FileText}
              title="Trend Calibration Offline"
              description="Upload additional resumes to unlock trend analytics."
              ctaText="Upload Resume"
              ctaTo="/resumes"
            />
          ) : (
            <div className="h-full w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={combinedChart1Data}>
                  <defs>
                    <linearGradient id="atsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--success)" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="var(--success)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" strokeOpacity={0.15} />
                  <XAxis dataKey="label" stroke="var(--muted)" fontSize={10} tickLine={false} axisLine={false} dy={8} className="font-mono opacity-80" />
                  <YAxis stroke="var(--muted)" fontSize={10} tickLine={false} axisLine={false} dx={-6} domain={[0, 100]} className="font-mono opacity-80" />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border)', strokeWidth: 1 }} />
                  <Legend content={<CustomLegend />} />
                  <Area 
                    type="monotone" 
                    dataKey="atsScore" 
                    stroke="var(--success)" 
                    fillOpacity={1} 
                    fill="url(#atsGradient)" 
                    name="ATS Progress" 
                    strokeWidth={2} 
                    animationDuration={500}
                    dot={{ r: 3, stroke: 'var(--success)', strokeWidth: 1.5, fill: 'var(--surface)' }}
                    activeDot={{ r: 5, stroke: 'var(--success)', strokeWidth: 2, fill: 'var(--surface)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="resumeScore" 
                    stroke="var(--primary)" 
                    name="Resume Score" 
                    strokeWidth={2} 
                    animationDuration={700}
                    dot={{ r: 3, stroke: 'var(--primary)', strokeWidth: 1.5, fill: 'var(--surface)' }}
                    activeDot={{ r: 5, stroke: 'var(--primary)', strokeWidth: 2, fill: 'var(--surface)' }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
              {combinedChart1Data.length === 1 && (
                <div className="absolute bottom-10 left-0 right-0 text-center pointer-events-none z-10">
                  <span className="text-[9px] font-bold text-muted bg-surface border border-border/80 px-2 py-0.5 rounded shadow-sm font-mono uppercase tracking-wider">
                    Trend line unlocks after your second analysis
                  </span>
                </div>
              )}
            </div>
          )}
        </PremiumChartCard>

        {/* Chart 2: Job Match & Interview Performance */}
        <PremiumChartCard
          title="Job Match & Interview Performance"
          description="Evaluations mapping vacancy relevance against completed tech mock sessions."
          badgeText={interviewSessions > 0 ? "Active" : "Inactive"}
          badgeVariant={interviewSessions > 0 ? "success" : "info"}
        >
                    {matchLoading || interviewLoading ? (
            <ChartSkeleton />
          ) :  combinedChart2Data.length === 0 ? (
            <LocalEmptyState
              icon={MessageSquareCode}
              title="Performance Insights Offline"
              description="Complete another interview session to generate performance insights."
              ctaText="Start Prep Run"
              ctaTo="/interview"
            />
          ) : (
            <div className="h-full w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={combinedChart2Data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" strokeOpacity={0.15} />
                  <XAxis dataKey="label" stroke="var(--muted)" fontSize={10} tickLine={false} axisLine={false} dy={8} className="font-mono opacity-80" />
                  <YAxis stroke="var(--muted)" fontSize={10} tickLine={false} axisLine={false} dx={-6} domain={[0, 100]} className="font-mono opacity-80" />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border)', strokeWidth: 1 }} />
                  <Legend content={<CustomLegend />} />
                  <Line 
                    type="monotone" 
                    dataKey="matchScore" 
                    stroke="var(--primary)" 
                    name="Match Score" 
                    strokeWidth={2} 
                    animationDuration={700}
                    dot={{ r: 3, stroke: 'var(--primary)', strokeWidth: 1.5, fill: 'var(--surface)' }}
                    activeDot={{ r: 5, stroke: 'var(--primary)', strokeWidth: 2, fill: 'var(--surface)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="interviewReadiness" 
                    stroke="var(--success)" 
                    name="Interview Readiness" 
                    strokeWidth={2} 
                    animationDuration={700}
                    dot={{ r: 3, stroke: 'var(--success)', strokeWidth: 1.5, fill: 'var(--surface)' }}
                    activeDot={{ r: 5, stroke: 'var(--success)', strokeWidth: 2, fill: 'var(--surface)' }}
                  />
                </LineChart>
              </ResponsiveContainer>
              {combinedChart2Data.length === 1 && (
                <div className="absolute bottom-10 left-0 right-0 text-center pointer-events-none z-10">
                  <span className="text-[9px] font-bold text-muted bg-surface border border-border/80 px-2 py-0.5 rounded shadow-sm font-mono uppercase tracking-wider">
                    Trend line unlocks after your second analysis
                  </span>
                </div>
              )}
            </div>
          )}
        </PremiumChartCard>

        {/* Chart 3: Weekly Activity */}
        <PremiumChartCard
          title="Weekly Activity Distribution"
          description="Workspace event transactions and AI prompts processed over the past 7 days."
          badgeText="7 Days"
          badgeVariant="info"
        >
                    {weeklyLoading ? (
            <ChartSkeleton />
          ) :  !hasWeeklyActivity ? (
            <LocalEmptyState
              icon={Activity}
              title="No Actions Recorded"
              description="Complete operations to compile weekly activity statistics."
              ctaText="Upload Credentials"
              ctaTo="/resumes"
            />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyTrend || []}>
                <defs>
                  <linearGradient id="weeklyBarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.15} />
                  </linearGradient>
                  <linearGradient id="weeklyBarActiveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary-hover)" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" strokeOpacity={0.15} />
                <XAxis dataKey="label" stroke="var(--muted)" fontSize={10} tickLine={false} axisLine={false} dy={8} className="font-mono opacity-80" />
                <YAxis stroke="var(--muted)" fontSize={10} tickLine={false} axisLine={false} dx={-6} allowDecimals={false} className="font-mono opacity-80" />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--surface-hover)', opacity: 0.15 }} />
                <Bar 
                  dataKey="value" 
                  fill="url(#weeklyBarGradient)" 
                  radius={[4, 4, 0, 0]} 
                  name="Actions" 
                  maxBarSize={24} 
                  animationDuration={500} 
                  activeBar={{ fill: 'url(#weeklyBarActiveGradient)' }}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </PremiumChartCard>

        {/* Chart 4: Monthly Activity */}
        <PremiumChartCard
          title="Monthly Activity Distribution"
          description="Aggregated chronologies of workspace transactions processed during this year."
          badgeText="12 Months"
          badgeVariant="info"
        >
                    {monthlyLoading ? (
            <ChartSkeleton />
          ) :  !hasMonthlyActivity ? (
            <LocalEmptyState
              icon={Activity}
              title="No Monthly Activity"
              description="Initiate scans and mock sessions to build historical evaluations."
              ctaText="Upload Credentials"
              ctaTo="/resumes"
            />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrend || []}>
                <defs>
                  <linearGradient id="monthlyBarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.15} />
                  </linearGradient>
                  <linearGradient id="monthlyBarActiveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary-hover)" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" strokeOpacity={0.15} />
                <XAxis dataKey="label" stroke="var(--muted)" fontSize={10} tickLine={false} axisLine={false} dy={8} className="font-mono opacity-80" />
                <YAxis stroke="var(--muted)" fontSize={10} tickLine={false} axisLine={false} dx={-6} allowDecimals={false} className="font-mono opacity-80" />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--surface-hover)', opacity: 0.15 }} />
                <Bar 
                  dataKey="value" 
                  fill="url(#monthlyBarGradient)" 
                  radius={[4, 4, 0, 0]} 
                  name="Actions" 
                  maxBarSize={24} 
                  animationDuration={500} 
                  activeBar={{ fill: 'url(#monthlyBarActiveGradient)' }}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </PremiumChartCard>
      </div>

      {/* 5. WORKSPACE TOOLS, RECENT ACTIVITY & RESUMES LIST TABLE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left Column: Shortcuts and Timeline (span 4 on desktop) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="space-y-3.5 text-left">
            <h3 className="text-base font-bold text-heading leading-none font-sans">Workspace Shortcuts</h3>
            <div className="grid grid-cols-1 gap-3 h-full">
              <WorkspaceShortcutCard
                title="ATS Scanner"
                description="Audit keyword coverage and relevance matches"
                icon={Scan}
                to="/ats"
                themeColor="primary"
              />
              <WorkspaceShortcutCard
                title="AI Mock Interview"
                description="Initiate active preparation loops and answers"
                icon={MessageSquareCode}
                to="/interview"
                themeColor="success"
              />
              <WorkspaceShortcutCard
                title="Career Roadmap"
                description="Track custom steps and review milestones"
                icon={MapIcon}
                to="/roadmap"
                themeColor="analytics"
              />
            </div>
          </div>
          
          <RecentActivityTimeline items={recentActivities} />
        </div>

        {/* Right Column: Resumes Table (span 8 on desktop) */}
        <div className="lg:col-span-8 flex flex-col h-full">
          <ResumeWorkspaceTable resumes={resumes} />
        </div>
      </div>

    </div>
  )
}
