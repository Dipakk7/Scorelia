import React, { memo } from 'react'
import type { ResumeTemplateId, SampleResumeData } from './types'
import { DEMO_RESUME_DATA } from './types'
import { ModernTemplate } from './ModernTemplate'
import { ProfessionalTemplate } from './ProfessionalTemplate'
import { ExecutiveTemplate } from './ExecutiveTemplate'
import { MinimalTemplate } from './MinimalTemplate'
import { CreativeTemplate } from './CreativeTemplate'

interface ResumePreviewRendererProps {
  templateId: ResumeTemplateId
  data?: SampleResumeData
}

export const ResumePreviewRenderer: React.FC<ResumePreviewRendererProps> = memo(({
  templateId,
  data = DEMO_RESUME_DATA,
}) => {
  switch (templateId) {
    case 'modern':
      return <ModernTemplate data={data} />
    case 'executive':
      return <ExecutiveTemplate data={data} />
    case 'minimal':
      return <MinimalTemplate data={data} />
    case 'creative':
      return <CreativeTemplate data={data} />
    case 'professional':
    default:
      return <ProfessionalTemplate data={data} />
  }
})

ResumePreviewRenderer.displayName = 'ResumePreviewRenderer'
