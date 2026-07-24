import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Mail } from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'
import type { ApiErrorResponse } from '@/api/api'
import { AuthCardLayout } from '@/components/layout/AuthCardLayout'
import { AuthInput } from '@/components/common/AuthInput'
import { PasswordInput } from '@/components/common/PasswordInput'
import { PrimaryAuthButton } from '@/components/common/PrimaryAuthButton'
import { SocialAuthButtons } from '@/components/common/SocialAuthButtons'

// Define the Login Zod Schema
const loginSchema = zod.object({
  email: zod
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: zod
    .string()
    .min(8, 'Password must be at least 8 characters'),
})

type LoginFormInputs = zod.infer<typeof loginSchema>

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [rememberMe, setRememberMe] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // Resolve where the user should be redirected after logging in
  const from = (location.state as any)?.from?.pathname || '/dashboard'

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      await login(data.email, data.password)
      toast.success('Welcome back to Scorelia!')
      navigate(from, { replace: true })
    } catch (err: any) {
      const apiErr = err as ApiErrorResponse
      const message = apiErr?.message || 'Login failed. Please verify credentials.'
      toast.error(message)
    }
  }

  return (
    <AuthCardLayout
      activeTab="login"
      title="Welcome back! 👋"
      subtitle="Login to continue your career journey"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
        {/* Email Address Field */}
        <AuthInput
          {...register('email')}
          type="email"
          placeholder="Email address"
          autoComplete="email"
          leftIcon={<Mail size={18} />}
          error={errors.email?.message}
        />

        {/* Password Field */}
        <PasswordInput
          {...register('password')}
          placeholder="Password"
          autoComplete="current-password"
          error={errors.password?.message}
        />

        {/* Remember me & Forgot password link */}
        <div className="flex items-center justify-between pt-1 pb-1">
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-400 hover:text-slate-300 transition-colors">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-[#1E2640] bg-[#0D1122] text-[#A855F7] focus:ring-0 focus:ring-offset-0 accent-[#A855F7] cursor-pointer"
            />
            <span>Remember me</span>
          </label>

          <Link
            to="/forgot-password"
            className="text-xs font-medium text-[#C084FC] hover:text-[#D8B4FE] transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Primary Action Button */}
        <PrimaryAuthButton isLoading={isSubmitting}>
          Login
        </PrimaryAuthButton>
      </form>

      {/* Social OAuth Buttons */}
      <SocialAuthButtons />
    </AuthCardLayout>
  )
}
