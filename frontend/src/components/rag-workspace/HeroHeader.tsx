import React from 'react'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface HeroHeaderProps {
  title?: string
  subtitle?: string
  className?: string
}

export function HeroHeader({
  title = 'RAG Workspace',
  subtitle = 'Retrieve, augment, and generate with your knowledge base.',
  className
}: HeroHeaderProps) {
  return (
    <div className={cn('space-y-1.5 text-left', className)}>
      <div className="flex items-center gap-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans flex items-center gap-2 m-0 drop-shadow-xs">
          <span>{title}</span>
          <Sparkles className="w-5 h-5 text-purple-400 fill-purple-400/20 inline-block animate-pulse shrink-0" aria-hidden="true" />
        </h1>
      </div>
      <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed m-0 max-w-xl">
        {subtitle}
      </p>
    </div>
  )
}

export default HeroHeader

