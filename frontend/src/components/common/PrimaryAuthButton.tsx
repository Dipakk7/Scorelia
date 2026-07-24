import React from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'

export interface PrimaryAuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
  children: React.ReactNode
}

export const PrimaryAuthButton: React.FC<PrimaryAuthButtonProps> = ({
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <button
      type="submit"
      disabled={disabled || isLoading}
      className={`w-full h-12 mt-2 bg-gradient-to-r from-[#4F46E5] via-[#9333EA] to-[#EC4899] text-white font-semibold rounded-xl text-sm flex items-center justify-center relative hover:opacity-95 active:scale-[0.99] transition-all duration-200 shadow-lg shadow-purple-900/30 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-white" />
          <span>Please wait...</span>
        </div>
      ) : (
        <>
          <span>{children}</span>
          <ArrowRight className="absolute right-4 w-4 h-4 text-white" />
        </>
      )}
    </button>
  )
}
