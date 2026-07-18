import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { Mail, CheckCircle2, ArrowLeft } from 'lucide-react'
import { Logo } from '@/components/common/Logo'
import { useAuth } from '@/providers/AuthProvider'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'

const forgotSchema = zod.object({
  email: zod
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
})

type ForgotFormInputs = zod.infer<typeof forgotSchema>

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth()
  const [isSent, setIsSent] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFormInputs>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: ForgotFormInputs) => {
    try {
      setSubmittedEmail(data.email)
      await forgotPassword(data.email)
      setIsSent(true)
      toast.success('Simulation: Password reset instructions sent.')
    } catch {
      toast.error('An error occurred. Please try again.')
    }

  }

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center p-4 md:p-6 bg-page transition-colors relative overflow-hidden">
      <div className="w-full max-w-md z-10">
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

        <AnimatePresence mode="wait">
          {!isSent ? (
            <motion.div
              key="request-form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Card variant="glass" className="overflow-hidden">
                <CardHeader className="text-center pt-8 pb-3 px-6 md:px-8">
                  <CardTitle className="text-2xl font-bold font-display text-foreground">Reset Password</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground mt-1">
                    We will send you a recovery link to restore your account access
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

                    <Button
                      type="submit"
                      className="w-full mt-6 font-display text-sm font-bold tracking-wide"
                      isLoading={isSubmitting}
                      size="lg"
                    >
                      Send Reset Instructions
                    </Button>
                  </form>
                </CardContent>
                <CardFooter className="justify-center border-t border-border py-5 bg-transparent">
                  <Link
                    to="/login"
                    className="flex items-center text-xs font-bold text-secondary hover:text-brand-hover hover:underline transition-colors gap-2"
                  >
                    <ArrowLeft size={14} />
                    <span>Back to Sign In</span>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="success-message"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card variant="glass" className="overflow-hidden">
                <CardContent className="pt-8 px-6 md:px-8 pb-6 text-center flex flex-col items-center">
                  <CheckCircle2 size={56} className="text-brand mb-4 animate-bounce" />
                  <CardTitle className="text-xl font-bold mb-2">Check Your Email</CardTitle>
                  <p className="text-xs text-muted-foreground max-w-sm mb-6 leading-relaxed font-sans">
                    We have simulated sending password reset instructions to{' '}
                    <strong className="text-foreground">{submittedEmail}</strong>.
                  </p>
                  
                  {/* Developers debug simulator helper details */}
                  <div className="w-full p-4 bg-brand-500/5 border border-brand-500/15 text-brand-700 dark:text-brand-300 rounded-lg text-[11px] leading-relaxed text-left mb-6 font-sans">
                    <strong className="block font-semibold mb-1">Development Mode Simulation:</strong>
                    Because the API endpoints do not currently define a password reset mailer, the email dispatch was simulated. In a live production system, SMTP integration sends a JWT validation link here.
                  </div>

                  <Link to="/login" className="w-full">
                    <Button variant="outline" className="w-full" size="lg">
                      Return to Sign In
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
