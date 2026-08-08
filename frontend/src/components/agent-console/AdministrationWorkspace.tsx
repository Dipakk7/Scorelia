import React from 'react'
import { AdministrationHeader } from './AdministrationHeader'
import { AdministrationPanel } from './AdministrationPanel'
import { AdministrationSkeleton } from './AdministrationSkeleton'
import { cn } from '@/lib/utils'

export interface AdministrationWorkspaceProps {
  isLoading?: boolean
  className?: string
}

export function AdministrationWorkspace({
  isLoading = false,
  className,
}: AdministrationWorkspaceProps) {
  if (isLoading) {
    return <AdministrationSkeleton className={className} />
  }

  return (
    <section
      aria-label="System Administration Workspace"
      className={cn('space-y-4 sm:space-y-5 text-left font-sans w-full max-w-full min-w-0', className)}
    >
      {/* 1. Administration Header */}
      <AdministrationHeader />

      {/* 2. System Administration Control Panel */}
      <AdministrationPanel />
    </section>
  )
}

export default AdministrationWorkspace
