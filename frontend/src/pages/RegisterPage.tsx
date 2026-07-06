import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Mail, Lock, User as UserIcon, Compass } from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import type { ApiErrorResponse } from '@/api/api'


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
      toast.success('Welcome to CareerPilot AI!')
      navigate('/dashboard', { replace: true })
    } catch (err: any) {
      const apiErr = err as ApiErrorResponse
      const message = apiErr?.message || 'Registration failed. Please try again.'
      toast.error(message)
    }
  }

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center p-4 bg-radial from-brand-50 via-slate-50 to-slate-100 dark:from-slate-900 dark:via-dark-bg dark:to-dark-bg transition-colors relative overflow-hidden">
      {/* Background gradients for WOW factor */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md z-10"
      >
        {/* Brand Logo header */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 bg-brand-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-brand-500/25 mb-3">
            <Compass size={26} className="animate-float" />
          </div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-slate-900 dark:text-white m-0">
            CareerPilot <span className="text-brand-500">AI</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Navigate your professional journey with precision
          </p>
        </div>

        {/* Register Card */}
        <Card className="glass-card shadow-xl border-slate-200/50 dark:border-slate-800/40">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-semibold">Create Account</CardTitle>
            <CardDescription>
              Sign up today and optimize your career trajectory
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                {...register('fullName')}
                type="text"
                label="Full Name"
                placeholder="John Doe"
                error={errors.fullName?.message}
                leftIcon={<UserIcon size={16} />}
                autoComplete="name"
              />

              <Input
                {...register('email')}
                type="email"
                label="Email Address"
                placeholder="you@example.com"
                error={errors.email?.message}
                leftIcon={<Mail size={16} />}
                autoComplete="email"
              />

              <Input
                {...register('password')}
                type="password"
                label="Password"
                placeholder="Choose a strong password"
                error={errors.password?.message}
                leftIcon={<Lock size={16} />}
                autoComplete="new-password"
              />

              <Input
                {...register('confirmPassword')}
                type="password"
                label="Confirm Password"
                placeholder="Retype password"
                error={errors.confirmPassword?.message}
                leftIcon={<Lock size={16} />}
                autoComplete="new-password"
              />

              <Button
                type="submit"
                className="w-full mt-2 font-display text-sm font-semibold"
                isLoading={isSubmitting}
              >
                Sign Up
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center border-t border-slate-100 dark:border-slate-800/40 py-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-350 transition-colors"
              >
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
