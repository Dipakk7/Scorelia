import React from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useScoreliaReducedMotion, getCardVariants } from '@/lib/motion'

/**
 * Elevated
 * -----------
 * Default surface.
 * Solid background.
 * Subtle shadow.
 * Subtle border.
 * Used for all content-heavy cards.
 * 
 * Glass
 * -----------
 * Floating only.
 * Backdrop blur.
 * Translucent.
 * Soft border.
 * Never used inside dense data workspaces.
 * 
 * Never Mix
 * -----------
 * A page should not randomly mix glass and elevated cards unless there is 
 * a clear visual hierarchy reason (hero, modal, dialog, etc.).
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'glass'
  hoverLift?: boolean
  motion?: boolean
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'elevated', hoverLift = false, motion: isMotion = false, ...props }, ref) => {
    const shouldReduceMotion = useScoreliaReducedMotion()
    const cardVariants = getCardVariants(shouldReduceMotion)

    const resolvedClasses = cn(
      'rounded-[var(--radius-card)] border text-[var(--body)] transition-all duration-300 ease-in-out',
      variant === 'elevated' && 'border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]',
      variant === 'glass' && 'border-[var(--border)] bg-[var(--surface-glass)] backdrop-blur-glass shadow-[var(--shadow-md)]',
      (!isMotion && (hoverLift || className?.includes('cursor-pointer') || className?.includes('hover:border-[var(--primary)]/40'))) && 'hover-lift',
      className
    )

    if (isMotion && !shouldReduceMotion) {
      return (
        <motion.div
          ref={ref as any}
          className={resolvedClasses}
          variants={cardVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          {...(props as any)}
        />
      )
    }

    return (
      <div
        ref={ref}
        className={resolvedClasses}
        {...props}
      />
    )
  }
)
Card.displayName = 'Card'

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('card-header flex flex-col space-y-1.5 p-6', className)}
      {...props}
    />
  )
)
CardHeader.displayName = 'CardHeader'

export const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-h3 text-[var(--heading)]', className)}
      {...props}
    />
  )
)
CardTitle.displayName = 'CardTitle'

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-caption text-[var(--muted)]', className)}
      {...props}
    />
  )
)
CardDescription.displayName = 'CardDescription'

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('card-content p-6', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('card-footer flex items-center p-6 pt-4 border-t border-[var(--divider)] justify-between', className)}
      {...props}
    />
  )
)
CardFooter.displayName = 'CardFooter'
