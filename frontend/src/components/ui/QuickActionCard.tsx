import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuickActionCardProps {
  title: string
  description: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  to: string
  iconColor?: string
  bgColor?: string
  className?: string
}

export function QuickActionCard({
  title,
  description,
  icon: Icon,
  to,
  iconColor = 'text-primary',
  bgColor = 'bg-primary/10',
  className,
}: QuickActionCardProps) {
  return (
    <Link
      to={to}
      className={cn(
        'flex items-center justify-between p-4 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)]/40 hover:bg-[var(--surface-hover)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)] transition-all duration-200 group cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] motion-reduce:transition-none',
        className
      )}
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className={cn('p-2.5 rounded-[var(--radius-md)] shrink-0 border border-[var(--border)]/50 shadow-[var(--shadow-sm)] group-hover:scale-105 transition-transform duration-200 motion-reduce:transition-none', bgColor, iconColor)}>
          <Icon size={18} className="stroke-[1.75]" />
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-bold font-display text-[var(--heading)] group-hover:text-[var(--primary)] transition-colors">
            {title}
          </h4>
          <p className="text-xs text-[var(--body)] font-sans truncate mt-0.5 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      <ArrowRight size={14} className="text-[var(--muted)] group-hover:translate-x-1 transition-transform duration-200 motion-reduce:transition-none shrink-0 ml-2" />
    </Link>
  )
}
