import React from 'react'
import { motion } from 'framer-motion'
import { useScoreliaReducedMotion, getSectionVariants } from '@/lib/motion'

export interface SectionRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  delay?: number
}

export function SectionReveal({ children, className, delay, ...props }: SectionRevealProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const baseVariants = getSectionVariants(shouldReduceMotion)

  // Custom variants memoization to handle conditional delay smoothly
  const variants = React.useMemo(() => {
    if (delay === undefined || shouldReduceMotion) return baseVariants
    return {
      ...baseVariants,
      animate: {
        ...baseVariants.animate,
        transition: {
          ...baseVariants.animate.transition,
          delay,
        },
      },
    }
  }, [baseVariants, delay, shouldReduceMotion])

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      className={className}
      {...(props as any)}
    >
      {children}
    </motion.div>
  )
}

export default SectionReveal
