import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useScoreliaReducedMotion, getSkeletonVariants } from '@/lib/motion'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  motion?: boolean
}

export function Skeleton({ className, motion: isMotion = false, ...props }: SkeletonProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()

  if (isMotion && !shouldReduceMotion) {
    return (
      <motion.div
        variants={getSkeletonVariants(shouldReduceMotion)}
        initial="initial"
        animate="animate"
        className={cn(
          'rounded bg-[var(--divider)]',
          className
        )}
        {...(props as any)}
      />
    )
  }

  return (
    <div
      className={cn(
        'shimmer rounded bg-[var(--divider)]',
        className
      )}
      {...props}
    />
  )
}
