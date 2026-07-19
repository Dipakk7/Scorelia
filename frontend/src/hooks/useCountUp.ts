import { useState, useEffect } from 'react'

export function useCountUp(target: number, duration: number = 800) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    // Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(target)
      return
    }

    const start = 0
    const end = target
    if (start === end) {
      setCount(end)
      return
    }

    const startTime = performance.now()

    const updateCount = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Cubic easing out: fast start, restrained finish (easeOutCubic)
      const easeProgress = 1 - Math.pow(1 - progress, 3)
      
      setCount(Math.round(start + easeProgress * (end - start)))

      if (progress < 1) {
        requestAnimationFrame(updateCount)
      }
    }

    requestAnimationFrame(updateCount)
  }, [target, duration])

  return count
}
