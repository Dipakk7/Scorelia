import React, { useState } from 'react'
import { cn } from '@/lib/utils'

export interface TooltipProps {
  content: React.ReactNode
  children: React.ReactElement
  className?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export function Tooltip({ content, children, className, position = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 -mt-1 border-t-[var(--sidebar-background)] border-x-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 -mb-1 border-b-[var(--sidebar-background)] border-x-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 -ml-1 border-l-[var(--sidebar-background)] border-y-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 -mr-1 border-r-[var(--sidebar-background)] border-y-transparent border-l-transparent',
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && content && (
        <div
          className={cn(
            'absolute z-[var(--z-index-tooltip)] pointer-events-none px-2.5 py-1.5 text-caption font-semibold rounded-md shadow-[var(--shadow-md)] bg-[var(--sidebar-background)] text-[var(--sidebar-active-foreground)] border border-[var(--sidebar-border)] whitespace-nowrap animate-fade-in font-sans',
            positionClasses[position],
            className
          )}
        >
          <span className="relative z-10">{content}</span>
          <div className={cn('absolute w-0 h-0 border-4', arrowClasses[position])} />
        </div>
      )}
    </div>
  )
}
export default Tooltip
