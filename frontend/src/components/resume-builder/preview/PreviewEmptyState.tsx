import React from 'react'

interface PreviewEmptyStateProps {
  sectionTitle: string
  message?: string
}

export const PreviewEmptyState: React.FC<PreviewEmptyStateProps> = () => {
  // Hide empty section placeholders completely to maintain clean typeset resume document
  return null
}
