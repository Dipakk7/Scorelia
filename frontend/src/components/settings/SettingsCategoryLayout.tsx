import React from 'react'
import { motion } from 'framer-motion'
import { useScoreliaReducedMotion, getSectionVariants } from '@/lib/motion'
import { SettingsCategoryHeader } from './SettingsCategoryHeader'
import { cn } from '@/lib/utils'

export interface SettingsCategoryLayoutProps {
  icon?: React.ReactNode
  title: string
  subtitle: string
  badge?: string
  badgeVariant?: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'outline'
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export const SettingsCategoryLayout: React.FC<SettingsCategoryLayoutProps> = ({
  icon,
  title,
  subtitle,
  badge,
  badgeVariant,
  actions,
  children,
  className,
}) => {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const sectionVariants = getSectionVariants(shouldReduceMotion)

  return (
    <motion.div
      variants={sectionVariants}
      initial="initial"
      animate="animate"
      className={cn('space-y-6 font-sans text-left', className)}
    >
      <SettingsCategoryHeader
        icon={icon}
        title={title}
        subtitle={subtitle}
        badge={badge}
        badgeVariant={badgeVariant}
        actions={actions}
      />
      <div className="space-y-6">{children}</div>
    </motion.div>
  )
}

export default SettingsCategoryLayout
