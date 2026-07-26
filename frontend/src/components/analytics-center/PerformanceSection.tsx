import React from 'react'
import { PerformanceDashboard } from './PerformanceDashboard'

interface PerformanceSectionProps {
  onViewDetails?: () => void
  onViewReport?: () => void
  className?: string
}

export function PerformanceSection({
  onViewDetails,
  onViewReport,
  className = '',
}: PerformanceSectionProps) {
  return (
    <div className={`w-full ${className}`}>
      <PerformanceDashboard onViewDetails={onViewDetails} onViewReport={onViewReport} />
    </div>
  )
}

export default PerformanceSection
