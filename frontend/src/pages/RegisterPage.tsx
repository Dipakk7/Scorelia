import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Mail, Lock, User as UserIcon } from 'lucide-react'
import { Logo } from '@/components/common/Logo'
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
      toast.success('Welcome to Scorelia!')
      navigate('/dashboard', { replace: true })
    } catch (err: any) {
      const apiErr = err as ApiErrorResponse
      const message = apiErr?.message || 'Registration failed. Please try again.'
      toast.error(message)
    }
  }

  return (
    <div
      className="min-h-screen w-screen flex flex-col items-center justify-center p-4 md:p-6 bg-slate-50 dark:bg-dark-bg transition-colors relative overflow-hidden"
      style={{
        backgroundImage: 'radial-gradient(rgba(15, 157, 154, 0.07) 1.5px, transparent 1.5px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* Background gradients for WOW factor */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-brand-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-accent-blue/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md z-10"
      >
        {/* Brand Logo header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="h-16 w-16 bg-white/70 dark:bg-slate-900/50 rounded-2xl flex items-center justify-center border border-slate-200/50 dark:border-slate-800/60 shadow-lg shadow-slate-200/10 dark:shadow-none mb-4 animate-float">
            <Logo iconOnly={true} className="h-10 w-10 text-brand-600 dark:text-brand-400" />
          </div>
          <h1 className="text-3xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white m-0">
            Welcome to Scorelia
          </h1>
          <p className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-450 mt-2 font-display">
            AI-powered Career Intelligence Platform
          </p>
        </div>

        {/* Register Card */}
        <Card className="glass-card shadow-2xl border-slate-200/50 dark:border-slate-800/30 rounded-2xl overflow-hidden">
          <CardHeader className="text-center pt-8 pb-3 px-6 md:px-8">
            <CardTitle className="text-2xl font-bold font-display text-slate-900 dark:text-white">Create Account</CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Sign up today and optimize your career trajectory
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 md:px-8 pb-6 pt-4">
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
                className="w-full mt-4 font-display text-sm font-bold tracking-wide"
                isLoading={isSubmitting}
                size="lg"
              >
                Sign Up
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center border-t border-slate-100 dark:border-slate-800/40 py-5 bg-slate-50/50 dark:bg-slate-950/20">
            <p className="text-xs text-slate-500 dark:text-slate-450 font-medium">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-350 transition-colors"
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
