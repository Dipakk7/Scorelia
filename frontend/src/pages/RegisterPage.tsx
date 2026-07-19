import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Mail, Lock, User as UserIcon } from 'lucide-react'
import { Logo } from '@/components/common/Logo'
import { useAuth } from '@/providers/AuthProvider'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import type { ApiErrorResponse } from '@/api/api'
import { BackgroundMesh } from '@/components/ui/BackgroundMesh'
import { SectionReveal } from '@/components/ui/SectionReveal'


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
    <div className="min-h-screen w-screen grid grid-cols-1 md:grid-cols-2 bg-page transition-colors relative overflow-hidden text-left">
      <BackgroundMesh />
      
      {/* Left Half: Premium AI Obsidian Art Backdrop */}
      <div className="hidden md:flex flex-col justify-between p-12 relative overflow-hidden border-r border-border bg-card/40 backdrop-blur-md">
        {/* Glowing gradient mesh blob animations */}
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[var(--primary)]/10 blur-[100px] bg-mesh-blob-1" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[var(--secondary)]/10 blur-[100px] bg-mesh-blob-2" />
        
        {/* Header Logo */}
        <div className="flex items-center gap-2.5 z-10">
          <Logo iconOnly={true} className="h-9 w-9 text-brand" />
          <span className="text-lg font-black font-display tracking-tight text-heading">Scorelia</span>
        </div>

        {/* Core Value Proposition & Testimonial/Metrics */}
        <div className="space-y-6 my-auto max-w-md z-10 text-left">
          <h2 className="text-4xl font-extrabold font-display tracking-tight text-heading leading-tight m-0">
            The Intelligent Career Copilot.
          </h2>
          <p className="text-sm text-muted-foreground font-sans leading-relaxed m-0">
            Map out custom career pivots, audit missing skill gaps, practice real-time speech mock interviews, and track local AI progress.
          </p>
          <div className="mt-8 p-6 rounded-2xl border border-border/80 bg-surface/50 backdrop-blur-md">
            <p className="text-xs italic text-foreground font-medium leading-relaxed m-0">
              "100% Secure. Files are parsed locally on your device."
            </p>
            <div className="mt-3 flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-[var(--success)] uppercase tracking-wider font-mono">Local Privacy Guaranteed</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-[10px] text-muted-foreground font-sans z-10 m-0">
          &copy; {new Date().getFullYear()} Scorelia Inc. All rights reserved.
        </div>
      </div>

      {/* Right Half: Obsidian Form Canvas */}
      <div className="flex items-center justify-center p-6 md:p-12 overflow-y-auto">
        <div className="w-full max-w-md z-10">
          {/* Mobile-only logo header */}
          <div className="flex flex-col items-center mb-6 text-center md:hidden">
            <Logo iconOnly={true} className="h-10 w-10 text-brand mb-2" />
            <h1 className="text-2xl font-extrabold font-display tracking-tight text-heading m-0">Scorelia</h1>
          </div>

          <SectionReveal>
            <Card variant="glass" className="overflow-hidden">
            <CardHeader className="text-center pt-8 pb-3 px-6 md:px-8">
              <CardTitle className="text-2xl font-bold font-display text-foreground">Create Account</CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-1">
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
                  className="w-full mt-6 font-display text-sm font-bold tracking-wide"
                  isLoading={isSubmitting}
                  size="lg"
                  motion={true}
                >
                  Sign Up
                </Button>
              </form>
            </CardContent>
            <CardFooter className="justify-center border-t border-border py-5 bg-transparent">
              <p className="text-xs text-secondary font-medium m-0">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-bold text-brand hover:text-brand-hover hover:underline transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </CardFooter>
            </Card>
          </SectionReveal>
        </div>
      </div>
    </div>
  )
}
