import { useCountUp } from '@/hooks/useCountUp'

export interface CountUpTextProps {
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  duration?: number
  easing?: string
  formatter?: (value: number) => string
  trigger?: boolean
}

export function CountUpText({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 800,
  formatter,
  trigger = true,
}: CountUpTextProps) {
  const count = useCountUp(value, trigger, duration, decimals)
  const formattedCount = formatter ? formatter(count) : count.toFixed(decimals)

  return (
    <>
      {prefix}
      {formattedCount}
      {suffix}
    </>
  )
}

export default CountUpText
