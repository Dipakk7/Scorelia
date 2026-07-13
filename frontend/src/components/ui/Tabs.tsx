import React, { createContext, useContext, useState } from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface TabsContextProps {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = createContext<TabsContextProps | null>(null)

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue: string
  value?: string
  onValueChange?: (value: string) => void
}

export function Tabs({ defaultValue, value, onValueChange, className, children, ...props }: TabsProps) {
  const [localValue, setLocalValue] = useState(defaultValue)
  const isControlled = value !== undefined
  const activeValue = isControlled ? value : localValue

  const handleValueChange = (val: string) => {
    if (!isControlled) {
      setLocalValue(val)
    }
    if (onValueChange) {
      onValueChange(val)
    }
  }

  return (
    <TabsContext.Provider value={{ value: activeValue, onValueChange: handleValueChange }}>
      <div className={cn('w-full', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

export function TabsList({ className, children, ...props }: TabsListProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center justify-start border-b border-border/80 w-full overflow-x-auto scrollbar-none gap-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

export function TabsTrigger({ value, className, children, ...props }: TabsTriggerProps) {
  const context = useContext(TabsContext)
  if (!context) throw new Error('TabsTrigger must be used within Tabs')

  const isActive = context.value === value

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => context.onValueChange(value)}
      className={cn(
        'relative py-3.5 px-1 font-bold font-display text-xs flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all text-[var(--muted)] hover:text-[var(--heading)] -mb-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/30 focus-visible:ring-offset-2',
        isActive && 'text-[var(--primary)] font-extrabold',
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {isActive && (
        <motion.div
          layoutId="activeTabUnderline"
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--primary)] rounded-full z-0"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
    </button>
  )
}

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

export function TabsContent({ value, className, children, ...props }: TabsContentProps) {
  const context = useContext(TabsContext)
  if (!context) throw new Error('TabsContent must be used within Tabs')

  if (context.value !== value) return null

  return (
    <div
      role="tabpanel"
      className={cn(
        'mt-4 focus-visible:outline-none animate-fade-in',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
