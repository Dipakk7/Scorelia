import React, { useState } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'

export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className = '', error, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const inputId = id || `auth-password-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className="w-full space-y-1 text-left">
        <div className="relative flex items-center">
          <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center justify-center">
            <Lock size={18} />
          </div>
          <input
            id={inputId}
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            className={`w-full h-11 pl-11 pr-11 bg-[#0D1122] border ${
              error
                ? 'border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                : 'border-[#1E2640] focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] hover:border-[#2E3A5F]'
            } rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-all duration-200 font-sans shadow-sm ${className}`}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3.5 text-slate-400 hover:text-slate-200 transition-colors focus:outline-none cursor-pointer flex items-center justify-center p-1 rounded-md"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
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

PasswordInput.displayName = 'PasswordInput'
