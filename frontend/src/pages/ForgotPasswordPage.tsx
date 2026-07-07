import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { Mail, CheckCircle2, ArrowLeft, Compass } from 'lucide-react'
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
    <div className="min-h-screen w-screen flex flex-col items-center justify-center p-4 bg-radial from-brand-50 via-slate-50 to-slate-100 dark:from-slate-900 dark:via-dark-bg dark:to-dark-bg transition-colors relative overflow-hidden">
      {/* Background gradients for WOW factor */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Brand Logo header */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 bg-brand-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-brand-500/25 mb-3">
            <Compass size={26} className="animate-float" />
          </div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-slate-900 dark:text-white m-0">
            Scorelia <span className="text-brand-500">AI</span>
          </h1>
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
              <Card className="glass-card shadow-xl border-slate-200/50 dark:border-slate-800/40">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl font-semibold">Reset Password</CardTitle>
                  <CardDescription>
                    We will send you a recovery link to restore your account access
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
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
                      className="w-full mt-2 font-display text-sm font-semibold"
                      isLoading={isSubmitting}
                    >
                      Send Reset Instructions
                    </Button>
                  </form>
                </CardContent>
                <CardFooter className="justify-center border-t border-slate-100 dark:border-slate-800/40 py-4">
                  <Link
                    to="/login"
                    className="flex items-center text-sm font-semibold text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors gap-2"
                  >
                    <ArrowLeft size={16} />
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
              <Card className="glass-card shadow-xl border-slate-200/50 dark:border-slate-800/40">
                <CardContent className="pt-8 text-center flex flex-col items-center">
                  <CheckCircle2 size={56} className="text-emerald-500 mb-4 animate-bounce" />
                  <CardTitle className="text-xl font-semibold mb-2">Check Your Email</CardTitle>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed font-sans">
                    We have simulated sending password reset instructions to{' '}
                    <strong className="text-slate-800 dark:text-slate-200">{submittedEmail}</strong>.
                  </p>
                  
                  {/* Developers debug simulator helper details */}
                  <div className="w-full p-3.5 bg-brand-500/10 border border-brand-500/20 text-brand-700 dark:text-brand-300 rounded-lg text-xs text-left mb-6 font-sans">
                    <strong className="block font-semibold mb-1">Development Mode Simulation:</strong>
                    Because the API endpoints do not currently define a password reset mailer, the email dispatch was simulated. In a live production system, SMTP integration sends a JWT validation link here.
                  </div>

                  <Link to="/login" className="w-full">
                    <Button variant="outline" className="w-full">
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
