import React from 'react'
import { CareerAssistant } from './assistant/CareerAssistant'
import { ExportPanel } from './reports/ExportPanel'
import { cn } from '@/lib/utils'

export interface CareerRoadmapSidebarProps {
  className?: string
}

export function CareerRoadmapSidebar({ className }: CareerRoadmapSidebarProps) {
  return (
    <aside aria-label="Career Roadmap Sidebar" className={cn('space-y-4 sm:space-y-5 text-left', className)}>
      <CareerAssistant />
      <ExportPanel />
    </aside>
  )
}
export default CareerRoadmapSidebar
