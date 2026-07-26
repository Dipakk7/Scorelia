import React from 'react'
import { cn } from '@/lib/utils'

export interface WorkspaceLayoutProps {
  leftContent: React.ReactNode
  rightSidebar: React.ReactNode
  bottomContent?: React.ReactNode
  className?: string
}

export const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({
  leftContent,
  rightSidebar,
  bottomContent,
  className,
}) => {
  return (
    <main
      aria-label="Cover Letter Generator Workspace"
      className={cn('space-y-6 w-full max-w-full overflow-x-hidden', className)}
    >
      {/* Responsive Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Workspace (Left 70% on Desktop, Full width on Tablet/Mobile) */}
        <section
          aria-label="Cover Letter Builder Workspace"
          className="lg:col-span-8 space-y-6 w-full min-w-0"
        >
          {leftContent}
        </section>

        {/* Right Sidebar (30% on Desktop, Full width stacked on Tablet/Mobile) */}
        <aside
          aria-label="Cover Letter Analysis and Tools Sidebar"
          className="lg:col-span-4 space-y-6 w-full min-w-0"
        >
          {rightSidebar}
        </aside>
      </div>

      {/* Optional Bottom Full-Width Container */}
      {bottomContent && (
        <section aria-label="Additional Tools and Actions" className="w-full min-w-0">
          {bottomContent}
        </section>
      )}
    </main>
  )
}

export default WorkspaceLayout
