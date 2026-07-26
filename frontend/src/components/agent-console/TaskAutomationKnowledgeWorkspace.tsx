import React, { useState } from 'react'
import { WorkspaceSectionTabs, type SectionTabId } from './WorkspaceSectionTabs'
import { TasksWorkspace } from './TasksWorkspace'
import { AutomationsWorkspace } from './AutomationsWorkspace'
import { KnowledgeWorkspace } from './KnowledgeWorkspace'
import { TaskAutomationKnowledgeSkeleton } from './TaskAutomationKnowledgeSkeleton'
import { cn } from '@/lib/utils'

export interface TaskAutomationKnowledgeWorkspaceProps {
  initialSection?: SectionTabId
  isLoading?: boolean
  className?: string
}

export function TaskAutomationKnowledgeWorkspace({
  initialSection = 'tasks',
  isLoading = false,
  className,
}: TaskAutomationKnowledgeWorkspaceProps) {
  const [activeSection, setActiveSection] = useState<SectionTabId>(initialSection)

  if (isLoading) {
    return <TaskAutomationKnowledgeSkeleton className={className} />
  }

  return (
    <div className={cn('space-y-6 text-left', className)}>
      {/* Workspace Section Navigation Tabs */}
      <WorkspaceSectionTabs
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Render Active Section Panel */}
      <div
        id={`section-tabpanel-${activeSection}`}
        role="tabpanel"
        aria-labelledby={`section-tab-${activeSection}`}
      >
        {activeSection === 'tasks' && <TasksWorkspace />}
        {activeSection === 'automations' && <AutomationsWorkspace />}
        {activeSection === 'knowledge' && <KnowledgeWorkspace />}
      </div>
    </div>
  )
}

export default TaskAutomationKnowledgeWorkspace
