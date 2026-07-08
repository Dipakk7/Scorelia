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
  iconColor = 'text-brand-650 dark:text-brand-400',
  bgColor = 'bg-brand-500/10',
  className,
}: QuickActionCardProps) {
  return (
    <Link
      to={to}
      className={cn(
        'flex items-center justify-between p-4 rounded-2xl border border-slate-200/60 dark:border-slate-850 bg-white/45 dark:bg-slate-900/30 backdrop-blur-md hover:border-brand-500/30 dark:hover:border-brand-500/20 hover:bg-white/80 dark:hover:bg-slate-900/60 hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] dark:hover:shadow-none transition-all duration-200 group cursor-pointer text-left',
        className
      )}
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className={cn('p-2.5 rounded-xl shrink-0 border border-slate-100 dark:border-slate-800 shadow-xs group-hover:scale-105 transition-transform duration-200', bgColor, iconColor)}>
          <Icon size={18} className="stroke-[1.75]" />
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-bold font-display text-slate-900 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            {title}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-sans truncate mt-0.5 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      <ArrowRight size={14} className="text-slate-400 dark:text-slate-500 group-hover:translate-x-1 transition-transform duration-200 shrink-0 ml-2" />
    </Link>
  )
}
