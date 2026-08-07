import React from 'react'
import { CareerAssistant } from './assistant/CareerAssistant'
import { ExportPanel } from './reports/ExportPanel'
import { cn } from '@/lib/utils'

export interface CareerRoadmapSidebarProps {
  className?: string
  mode?: 'full' | 'chat-only'
  showExport?: boolean
}

export function CareerRoadmapSidebar({ className, mode = 'full', showExport = false }: CareerRoadmapSidebarProps) {
  return (
    <aside aria-label="Career Roadmap Sidebar" className={cn('space-y-4 sm:space-y-5 text-left', className)}>
      <CareerAssistant mode={mode} />
      {showExport && <ExportPanel />}
    </aside>
  )
}
export default CareerRoadmapSidebar
