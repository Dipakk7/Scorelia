import React from 'react'
import { cn } from '@/lib/utils'

export interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  min?: number
  max?: number
  value?: number
  containerClassName?: string
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, label, min = 0, max = 100, value = 0, onChange, containerClassName, id, ...props }, ref) => {
    const sliderId = id || `slider-${Math.random().toString(36).substr(2, 9)}`
    const percentage = ((value - min) / (max - min)) * 100

    return (
      <div className={cn('w-full flex flex-col gap-2 text-left select-none', containerClassName)}>
        <div className="flex justify-between items-center text-xs font-semibold font-display uppercase tracking-wider text-[var(--muted)]">
          {label && <label htmlFor={sliderId}>{label}</label>}
          <span className="font-mono text-body-sm text-[var(--heading)] font-extrabold">{value}</span>
        </div>
        <div className="relative flex items-center h-5">
          <input
            id={sliderId}
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={onChange}
            className={cn(
              'w-full h-1.5 rounded-full appearance-none cursor-pointer focus:outline-none transition-all',
              className
            )}
            style={{
              background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${percentage}%, var(--divider) ${percentage}%, var(--divider) 100%)`
            }}
            ref={ref}
            {...props}
          />
          <style>{`
            #${sliderId}::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 16px;
              height: 16px;
              border-radius: 50%;
              background: var(--surface);
              border: 2px solid var(--primary);
              box-shadow: var(--shadow-sm);
              cursor: pointer;
              transition: transform 0.1s ease, border-color 0.1s ease;
            }
            #${sliderId}::-webkit-slider-thumb:hover {
              transform: scale(1.15);
              border-color: var(--primary-hover);
            }
            #${sliderId}::-webkit-slider-thumb:active {
              transform: scale(0.95);
            }
            #${sliderId}::-moz-range-thumb {
              width: 16px;
              height: 16px;
              border-radius: 50%;
              background: var(--surface);
              border: 2px solid var(--primary);
              box-shadow: var(--shadow-sm);
              cursor: pointer;
              transition: transform 0.1s ease, border-color 0.1s ease;
            }
            #${sliderId}::-moz-range-thumb:hover {
              transform: scale(1.15);
              border-color: var(--primary-hover);
            }
            #${sliderId}::-moz-range-thumb:active {
              transform: scale(0.95);
            }
          `}</style>
        </div>
      </div>
    )
  }
)

Slider.displayName = 'Slider'
export default Slider
