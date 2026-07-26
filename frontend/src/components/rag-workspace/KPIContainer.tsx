import React from 'react'
import { KPIGrid } from './KPIGrid'

export interface KPIContainerProps {
  className?: string
}

export function KPIContainer({ className }: KPIContainerProps) {
  return <KPIGrid className={className} />
}

export default KPIContainer
