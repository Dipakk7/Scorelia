import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

export interface PopoverProps {
  content: React.ReactNode
  children: React.ReactElement<any>
  className?: string
  align?: 'start' | 'center' | 'end'
}

export function Popover({ content, children, className, align = 'center' }: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const alignClasses = {
    start: 'left-0 mt-2 origin-top-left',
    center: 'left-1/2 -translate-x-1/2 mt-2 origin-top',
    end: 'right-0 mt-2 origin-top-right',
  }

  // Clone children to attach toggle click event
  const trigger = React.cloneElement(children, {
    onClick: (e: React.MouseEvent) => {
      if (children.props.onClick) children.props.onClick(e)
      setIsOpen(!isOpen)
    },
    className: cn(children.props.className, 'cursor-pointer')
  })

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      {trigger}
      {isOpen && (
        <div
          className={cn(
            'absolute z-[var(--z-index-popover)] w-72 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-lg)] backdrop-blur-md animate-fade-in font-sans text-xs',
            alignClasses[align],
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  )
}
export default Popover
