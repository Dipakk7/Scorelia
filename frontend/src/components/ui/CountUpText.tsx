import { useCountUp } from '@/hooks/useCountUp'

interface CountUpTextProps {
  value: number
  suffix?: string
  duration?: number
}

export function CountUpText({ value, suffix = '', duration = 800 }: CountUpTextProps) {
  const count = useCountUp(value, duration)
  return <>{count}{suffix}</>
}

export default CountUpText
