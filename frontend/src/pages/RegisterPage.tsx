import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Mail, User as UserIcon } from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'
import type { ApiErrorResponse } from '@/api/api'
import { AuthCardLayout } from '@/components/layout/AuthCardLayout'
import { AuthInput } from '@/components/common/AuthInput'
import { PasswordInput } from '@/components/common/PasswordInput'
import { PrimaryAuthButton } from '@/components/common/PrimaryAuthButton'
import { SocialAuthButtons } from '@/components/common/SocialAuthButtons'

// Define the Registration Zod Schema matching FastAPI backend constraints
const registerSchema = zod
  .object({
    fullName: zod
      .string()
      .min(1, 'Full name is required')
      .max(100, 'Full name must be less than 100 characters'),
    email: zod
      .string()
      .min(1, 'Email is required')
      .email('Invalid email address'),
    password: zod
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter (A-Z)')
      .regex(/[a-z]/, 'Must contain at least one lowercase letter (a-z)')
      .regex(/[0-9]/, 'Must contain at least one digit (0-9)')
      .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character (!@#$%^&*...)'),
    confirmPassword: zod.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type RegisterFormInputs = zod.infer<typeof registerSchema>

export default function RegisterPage() {
  const { register: registerUser, login } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      // Step 1: Call registration API
      await registerUser(data.email, data.password, data.fullName)
      toast.success('Registration successful! Logging you in...')

      // Step 2: Auto-login
      await login(data.email, data.password)
      toast.success('Welcome to Scorelia!')
      navigate('/dashboard', { replace: true })
    } catch (err: any) {
      const apiErr = err as ApiErrorResponse
      const message = apiErr?.message || 'Registration failed. Please try again.'
      toast.error(message)
    }
  }

  return (
    <AuthCardLayout
      activeTab="signup"
      title="Create an account ✨"
      subtitle="Sign up to start your AI career journey"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5 text-left">
        {/* Full Name Field */}
        <AuthInput
          {...register('fullName')}
          type="text"
          placeholder="Full name"
          autoComplete="name"
          leftIcon={<UserIcon size={18} />}
          error={errors.fullName?.message}
        />

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
          autoComplete="new-password"
          error={errors.password?.message}
        />

        {/* Confirm Password Field */}
        <PasswordInput
          {...register('confirmPassword')}
          placeholder="Confirm password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
        />

        {/* Primary Action Button */}
        <PrimaryAuthButton isLoading={isSubmitting} className="mt-3">
          Sign Up
        </PrimaryAuthButton>
      </form>

      {/* Social OAuth Buttons */}
      <SocialAuthButtons />
    </AuthCardLayout>
  )
}
