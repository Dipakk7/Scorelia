import React, { createContext, useContext, useState } from 'react'
import { cn } from '@/lib/utils'

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
        'py-3.5 px-1 border-b-2 font-bold font-display text-xs flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all border-transparent text-muted-foreground hover:text-foreground -mb-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 focus-visible:ring-offset-2',
        isActive && 'border-brand-500 text-brand-600 dark:text-brand-400 font-extrabold',
        className
      )}
      {...props}
    >
      {children}
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
