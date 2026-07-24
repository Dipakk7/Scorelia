import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Logo } from '@/components/common/Logo'

interface AuthCardLayoutProps {
  activeTab: 'login' | 'signup'
  children: React.ReactNode
  title: string
  subtitle: string
}

export const AuthCardLayout: React.FC<AuthCardLayoutProps> = ({
  activeTab,
  children,
  title,
  subtitle,
}) => {
  return (
    <div className="min-h-screen w-full bg-[#050611] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans selection:bg-purple-500/30">
      {/* Background Cosmic Glow Effects */}
      {/* Right Purple Nebula Glow */}
      <div className="absolute top-1/4 -right-20 w-[550px] h-[550px] bg-gradient-to-l from-[#7C3AED]/20 via-[#A855F7]/10 to-transparent rounded-full blur-[120px] pointer-events-none" />
      
      {/* Bottom Left Blue/Indigo Glow */}
      <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-gradient-to-tr from-[#3B82F6]/15 via-[#6366F1]/10 to-transparent rounded-full blur-[120px] pointer-events-none" />
      
      {/* Top Center Soft Purple Ambient Light */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-radial from-[#9333EA]/15 to-transparent blur-[100px] pointer-events-none" />

      {/* Subtle Star Particle Overlay */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 15% 25%, rgba(255,255,255,0.15) 1px, transparent 1px),
                            radial-gradient(circle at 85% 15%, rgba(255,255,255,0.2) 1px, transparent 1px),
                            radial-gradient(circle at 75% 75%, rgba(255,255,255,0.12) 1px, transparent 1px),
                            radial-gradient(circle at 25% 80%, rgba(255,255,255,0.18) 1px, transparent 1px),
                            radial-gradient(circle at 50% 40%, rgba(255,255,255,0.08) 1px, transparent 1px)`,
          backgroundSize: '240px 240px'
        }}
      />

      {/* Main Centered Content Container */}
      <div className="w-full max-w-[450px] z-10 flex flex-col items-center">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center text-center mb-8">
          {/* Official Scorelia Logo Icon */}
          <div className="flex items-center justify-center mb-3">
            <Logo
              iconOnly={true}
              className="w-10 h-10 text-[#C084FC] drop-shadow-[0_0_18px_rgba(192,132,252,0.6)]"
            />
          </div>
          {/* Brand Title */}
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-display">
            Scorelia
          </h1>
          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1.5 tracking-wide">
            Your AI Copilot for Career Success
          </p>
        </div>

        {/* Authentication Card */}
        <div className="w-full bg-[#0A0D1A]/85 backdrop-blur-2xl border border-[#1E2640]/80 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-6 sm:p-8 relative overflow-hidden">
          
          {/* Segmented Login / Sign Up Tabs */}
          <div className="relative border-b border-[#1E2640] mb-6">
            <div className="grid grid-cols-2 text-center text-sm font-semibold">
              <Link
                to="/login"
                className={`pb-3 transition-colors duration-200 relative ${
                  activeTab === 'login'
                    ? 'text-[#C084FC] font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Login
                {activeTab === 'login' && (
                  <motion.div
                    layoutId="authTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C084FC] shadow-[0_0_10px_#C084FC]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>

              <Link
                to="/register"
                className={`pb-3 transition-colors duration-200 relative ${
                  activeTab === 'signup'
                    ? 'text-[#C084FC] font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign Up
                {activeTab === 'signup' && (
                  <motion.div
                    layoutId="authTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C084FC] shadow-[0_0_10px_#C084FC]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            </div>
          </div>

          {/* Header Title & Subtitle */}
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-normal">
              {subtitle}
            </p>
          </div>

          {/* Form Content Slot */}
          {children}
        </div>

      </div>
    </div>
  )
}
