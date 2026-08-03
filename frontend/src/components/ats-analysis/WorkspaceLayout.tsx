import React from 'react'

interface WorkspaceLayoutProps {
  leftContent: React.ReactNode
  rightSidebar: React.ReactNode
  bottomContent?: React.ReactNode
}

export const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({
  leftContent,
  rightSidebar,
  bottomContent,
}) => {
  return (
    <main aria-label="ATS Analysis Main Workspace" className="space-y-6">
      {/* Main Grid: Left Content (70%) vs Right Sidebar (30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (70%) */}
        <section aria-label="Main Analysis Cards" className="lg:col-span-8 space-y-6">
          {leftContent}
        </section>

        {/* Right Sidebar (30%) */}
        <div className="lg:col-span-4">
          {rightSidebar}
        </div>
      </div>

      {/* Bottom Full Width Content Area (e.g. AI Recommendation Banner) */}
      {bottomContent && (
        <section aria-label="Bottom Analysis Actions">
          {bottomContent}
        </section>
      )}
    </main>
  )
}
