
import { CountUpText } from '@/components/ui/CountUpText'

interface ATSGaugeProps {
  score: number
  maxScore?: number
  size?: number
  strokeWidth?: number
  label?: string
  grade?: string
}

export function ATSGauge({
  score,
  maxScore = 100,
  size = 200,
  strokeWidth = 14,
  label = 'ATS Score',
  grade,
}: ATSGaugeProps) {
  const percentage = Math.min(Math.max((score / maxScore) * 100, 0), 100)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  // Color gradient based on score
  const getColor = (val: number) => {
    if (val >= 80) return 'text-emerald-500 stroke-emerald-500'
    if (val >= 60) return 'text-amber-500 stroke-amber-500'
    return 'text-red-500 stroke-red-500'
  }

  const getBgColor = (val: number) => {
    if (val >= 80) return 'stroke-emerald-100 dark:stroke-emerald-950/40'
    if (val >= 60) return 'stroke-amber-100 dark:stroke-amber-950/40'
    return 'stroke-red-100 dark:stroke-red-950/40'
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90 w-full h-full">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className={`fill-transparent ${getBgColor(score)} transition-colors duration-500`}
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className={`fill-transparent ${getColor(score)} transition-all duration-1000 ease-out`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        {/* Centered Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center font-sans">
          <span className="text-4xl font-black text-slate-900 dark:text-slate-50 tracking-tight transition-colors">
            <CountUpText value={score} />
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-extrabold mt-0.5">
            {label}
          </span>
          {grade && (
            <div className="mt-2.5 px-3 py-0.5 bg-slate-50/60 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 rounded-full text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-350 shadow-2xs">
              Grade: {grade}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default ATSGauge
