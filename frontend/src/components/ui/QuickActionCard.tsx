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
        'flex items-center justify-between p-4 rounded-2xl border border-border bg-surface hover:border-primary/40 hover:bg-surface-hover hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 group cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none',
        className
      )}
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className={cn('p-2.5 rounded-xl shrink-0 border border-border/50 shadow-xs group-hover:scale-105 transition-transform duration-200 motion-reduce:transition-none', bgColor, iconColor)}>
          <Icon size={18} className="stroke-[1.75]" />
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-bold font-display text-heading group-hover:text-primary transition-colors">
            {title}
          </h4>
          <p className="text-xs text-body font-sans truncate mt-0.5 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      <ArrowRight size={14} className="text-muted group-hover:translate-x-1 transition-transform duration-200 motion-reduce:transition-none shrink-0 ml-2" />
    </Link>
  )
}
