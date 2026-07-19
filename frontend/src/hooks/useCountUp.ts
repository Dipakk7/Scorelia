import { useState, useEffect, useRef } from 'react'

export function useCountUp(
  target: number,
  trigger: boolean = true,
  duration: number = 800,
  decimals: number = 0
) {
  const [count, setCount] = useState(0)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!trigger) return

    // If reduced motion or already animated, set directly
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || hasAnimated.current) {
      setCount(target)
      hasAnimated.current = true
      return
    }

    const start = 0
    const end = target
    if (start === end) {
      setCount(end)
      hasAnimated.current = true
      return
    }

    const startTime = performance.now()

    const updateCount = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Cubic easeOut: 1 - (1 - x)^3
      const easeProgress = 1 - Math.pow(1 - progress, 3)
      const currentVal = start + easeProgress * (end - start)
      
      // Handle decimals safely
      const factor = Math.pow(10, decimals)
      const roundedVal = Math.round(currentVal * factor) / factor
      setCount(roundedVal)

      if (progress < 1) {
        requestAnimationFrame(updateCount)
      } else {
        setCount(end)
        hasAnimated.current = true
      }
    }

    requestAnimationFrame(updateCount)
  }, [target, trigger, duration, decimals])

  return count
}

