import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Mail, Lock } from 'lucide-react'
import { Logo } from '@/components/common/Logo'
import { useAuth } from '@/providers/AuthProvider'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import type { ApiErrorResponse } from '@/api/api'
import { BackgroundMesh } from '@/components/ui/BackgroundMesh'
import { SectionReveal } from '@/components/ui/SectionReveal'


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
                  motion={true}
                >
                  Sign In
                </Button>
              </form>
            </CardContent>
            <CardFooter className="justify-center border-t border-border py-5 bg-transparent">
              <p className="text-xs text-secondary font-medium m-0">
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
          </SectionReveal>
        </div>
      </div>
    </div>
  )
}
