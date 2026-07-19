import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Mail, Lock } from 'lucide-react'
import { Logo } from '@/components/common/Logo'
import { useAuth } from '@/providers/AuthProvider'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import type { ApiErrorResponse } from '@/api/api'
import { BackgroundMesh } from '@/components/ui/BackgroundMesh'


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
    <div className="min-h-screen w-screen flex flex-col items-center justify-center p-4 md:p-6 bg-page transition-colors relative overflow-hidden">
      <BackgroundMesh />
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md z-10"
      >
        {/* Brand Logo header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="flex items-center justify-center mb-3">
            <Logo iconOnly={true} className="h-11 w-11 text-brand" />
          </div>
          <h1 className="text-3xl font-extrabold font-display tracking-tight text-heading m-0">
            Welcome to Scorelia
          </h1>
          <p className="text-label text-secondary mt-2 font-display">
            AI-powered Career Intelligence Platform
          </p>
        </div>

        {/* Login Card */}
        <Card variant="glass" className="overflow-hidden">
          <CardHeader className="text-center pt-8 pb-3 px-6 md:px-8">
            <CardTitle className="text-2xl font-bold font-display text-foreground">Sign In</CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-1">
              Enter your credentials to access your account dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 md:px-8 pb-6 pt-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                {...register('email')}
                type="email"
                label="Email Address"
                placeholder="you@example.com"
                error={errors.email?.message}
                leftIcon={<Mail size={16} />}
                autoComplete="email"
              />

              <div className="space-y-1">
                <Input
                  {...register('password')}
                  type="password"
                  label="Password"
                  placeholder="Enter your password"
                  error={errors.password?.message}
                  leftIcon={<Lock size={16} />}
                  autoComplete="current-password"
                />
                <div className="text-right mt-1.5">
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-brand hover:text-brand-hover hover:underline transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full mt-6 font-display text-sm font-bold tracking-wide"
                isLoading={isSubmitting}
                size="lg"
              >
                Sign In
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center border-t border-border py-5 bg-transparent">
            <p className="text-xs text-secondary font-medium">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-bold text-brand hover:text-brand-hover hover:underline transition-colors"
              >
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
