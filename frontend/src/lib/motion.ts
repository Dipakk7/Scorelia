import { useRef } from 'react'
import { useReducedMotion as useFramerReducedMotion, useInView as useFramerInView } from 'framer-motion'
import type { UseInViewOptions } from 'framer-motion'

// Task 2: Centralized Motion Tokens
export const MOTION_DURATIONS = {
  instant: 0,
  quick: 0.12,        // 120ms
  standard: 0.18,     // 180ms
  comfortable: 0.24,  // 240ms
  large: 0.30,        // 300ms
} as const

export const MOTION_EASINGS = {
  primary: [0.25, 0.1, 0.25, 1], // easeOut
  secondary: [0.42, 0, 0.58, 1], // easeInOut
  entrance: [0.22, 1, 0.36, 1],
  exit: [0.42, 0, 1, 1], // easeIn
} as const

export const MOTION_DELAYS = {
  stagger: 0.05,
  section: 0.08,
} as const

export const MOTION_SCALES = {
  hover: 1.01,
  press: 0.98,
  active: 1.0,
} as const

export const MOTION_DISTANCES = {
  y: 8,
  yLarge: 12,
} as const

export const MOTION_BLURS = {
  default: '4px',
  glass: '12px',
} as const

export const MOTION_ROTATIONS = {
  none: 0,
} as const

// Task 2 Refinement: Expose a centralized reduced-motion helper / hook
export function useScoreliaReducedMotion(): boolean {
  return useFramerReducedMotion() ?? false
}

// Expose a centralized in-view DOM observer hook
export function useScoreliaInView(options: UseInViewOptions = { once: true, amount: 0.1 }) {
  const ref = useRef<any>(null)
  const isInView = useFramerInView(ref, options)
  return [ref, isInView] as const
}

// Task 1: Reusable global motion variants that dynamically adapt to reduced motion

// Task 3: Page transitions
export const getPageVariants = (reduced: boolean) => ({
  initial: {
    opacity: 0,
    y: reduced ? 0 : MOTION_DISTANCES.y,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: reduced ? MOTION_DURATIONS.instant : MOTION_DURATIONS.comfortable, // 240ms
      ease: MOTION_EASINGS.entrance,
    },
  },
  exit: {
    opacity: 0,
    y: reduced ? 0 : -MOTION_DISTANCES.y,
    transition: {
      duration: reduced ? MOTION_DURATIONS.instant : MOTION_DURATIONS.standard, // 180ms
      ease: MOTION_EASINGS.exit,
    },
  },
})

// Task 4: Section Reveals
export const getSectionVariants = (reduced: boolean) => ({
  initial: {
    opacity: 0,
    y: reduced ? 0 : MOTION_DISTANCES.y,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: reduced ? MOTION_DURATIONS.instant : MOTION_DURATIONS.standard, // 180ms
      ease: MOTION_EASINGS.entrance,
    },
  },
})

// Staggered Container
export const getContainerVariants = (reduced: boolean) => ({
  initial: {},
  animate: {
    transition: {
      staggerChildren: reduced ? 0 : MOTION_DELAYS.stagger,
    },
  },
})

// List Items / Grid Items
export const getListItemVariants = (reduced: boolean) => ({
  initial: {
    opacity: 0,
    y: reduced ? 0 : MOTION_DISTANCES.y,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: reduced ? MOTION_DURATIONS.instant : MOTION_DURATIONS.standard,
      ease: MOTION_EASINGS.primary,
    },
  },
})

// Task 5: Cards
export const getCardVariants = (reduced: boolean) => ({
  initial: { scale: 1 },
  hover: reduced ? {} : {
    scale: MOTION_SCALES.hover, // 1.01
    boxShadow: 'var(--shadow-md), 0 0 16px rgba(99, 102, 241, 0.12)',
    borderColor: 'rgba(99, 102, 241, 0.25)',
    transition: {
      duration: MOTION_DURATIONS.quick, // 120ms
      ease: MOTION_EASINGS.primary,
    },
  },
  tap: reduced ? {} : {
    scale: MOTION_SCALES.press, // 0.98
    transition: {
      duration: MOTION_DURATIONS.instant,
    },
  },
})

// Task 6: Buttons
export const getButtonVariants = (reduced: boolean) => ({
  initial: { scale: 1 },
  hover: reduced ? {} : {
    filter: 'brightness(1.06)',
    boxShadow: 'var(--shadow-md), 0 0 12px rgba(99, 102, 241, 0.25)',
    transition: {
      duration: MOTION_DURATIONS.quick, // 120ms
      ease: MOTION_EASINGS.primary,
    },
  },
  tap: reduced ? {} : {
    scale: MOTION_SCALES.press, // 0.98
    transition: {
      duration: MOTION_DURATIONS.instant,
    },
  },
})

// Tooltips
export const getTooltipVariants = (reduced: boolean) => ({
  initial: {
    opacity: 0,
    scale: reduced ? 1 : 0.95,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: reduced ? MOTION_DURATIONS.instant : MOTION_DURATIONS.quick, // 120ms
      ease: MOTION_EASINGS.primary,
    },
  },
  exit: {
    opacity: 0,
    scale: reduced ? 1 : 0.95,
    transition: {
      duration: reduced ? MOTION_DURATIONS.instant : MOTION_DURATIONS.quick, // 120ms
      ease: MOTION_EASINGS.exit,
    },
  },
})

// Popovers / Dropdowns
export const getDropdownVariants = (reduced: boolean) => ({
  initial: {
    opacity: 0,
    scale: reduced ? 1 : 0.95,
    y: reduced ? 0 : -4,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: reduced ? MOTION_DURATIONS.instant : MOTION_DURATIONS.quick, // 120ms
      ease: MOTION_EASINGS.entrance,
    },
  },
  exit: {
    opacity: 0,
    scale: reduced ? 1 : 0.95,
    y: reduced ? 0 : -4,
    transition: {
      duration: reduced ? MOTION_DURATIONS.instant : MOTION_DURATIONS.quick, // 120ms
      ease: MOTION_EASINGS.exit,
    },
  },
})

// Accordions
export const getAccordionVariants = (reduced: boolean) => ({
  initial: {
    height: 0,
    opacity: 0,
  },
  animate: {
    height: 'auto',
    opacity: 1,
    transition: {
      duration: reduced ? MOTION_DURATIONS.instant : MOTION_DURATIONS.standard, // 180ms
      ease: MOTION_EASINGS.secondary,
    },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: {
      duration: reduced ? MOTION_DURATIONS.instant : MOTION_DURATIONS.standard, // 180ms
      ease: MOTION_EASINGS.secondary,
    },
  },
})

// ScoreRing Progress transitions
export const getScoreRingCircleTransition = (reduced: boolean) => ({
  duration: reduced ? MOTION_DURATIONS.instant : MOTION_DURATIONS.large, // 300ms
  ease: MOTION_EASINGS.entrance,
})

// Recharts Chart configurations
export const getChartAnimationProps = (reduced: boolean, isInitialRender: boolean) => ({
  isAnimationActive: isInitialRender && !reduced,
  animationDuration: reduced ? 0 : 300, // 300ms standard grow duration
  animationEasing: 'ease-out' as const,
})

// Skeleton Loaders
export const getSkeletonVariants = (reduced: boolean) => ({
  initial: { opacity: 0.6 },
  animate: {
    opacity: reduced ? 0.6 : [0.6, 1, 0.6],
    transition: {
      duration: reduced ? 0 : 1.5,
      repeat: reduced ? 0 : Infinity,
      ease: 'easeInOut' as const,
    },
  },
})

// Navigation (Part 2 preparation)
export const getNavigationVariants = (reduced: boolean) => ({
  initial: { opacity: 0, y: reduced ? 0 : 4 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: reduced ? MOTION_DURATIONS.instant : MOTION_DURATIONS.quick,
      ease: MOTION_EASINGS.entrance,
    },
  },
  exit: {
    opacity: 0,
    y: reduced ? 0 : -4,
    transition: {
      duration: reduced ? MOTION_DURATIONS.instant : MOTION_DURATIONS.quick,
      ease: MOTION_EASINGS.exit,
    },
  },
})
