import React from 'react'

export interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  leftIcon?: React.ReactNode
}

export const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
  ({ className = '', error, leftIcon, type = 'text', id, ...props }, ref) => {
    const inputId = id || `auth-input-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className="w-full space-y-1 text-left">
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            type={type}
            className={`w-full h-11 ${
              leftIcon ? 'pl-11' : 'pl-4'
            } pr-4 bg-[#0D1122] border ${
              error
                ? 'border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                : 'border-[#1E2640] focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] hover:border-[#2E3A5F]'
            } rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-all duration-200 font-sans shadow-sm ${className}`}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
        </div>
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-rose-400 font-medium pl-1 mt-1 animate-fade-in">
            {error}
          </p>
        )}
      </div>
    )
  }
)

AuthInput.displayName = 'AuthInput'
